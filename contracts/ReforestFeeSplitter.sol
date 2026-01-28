// SPDX-License-Identifier: MIT
// ReforestWallet Fee Splitter Contract
// Fee Recipient (ETH/EVM): 0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669
// Fee Recipient (Solana): A2P2damYLutEW74sBVZgcrpoJ1hYAMkfFKJEATa6PpWa
// Fee: 1% (100 basis points)
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ReforestWallet Fee Splitter
 * @notice Wraps 1inch Aggregation Router V6 calls and takes a 1% fee for reforestation
 * @dev Supports ALL tokens on ALL chains supported by 1inch
 * 
 * 1inch Aggregation Router V6 Address (SAME on all chains):
 * 0x111111125421cA6dc452d289314280a0f8842A65
 * 
 * SUPPORTED CHAINS:
 * - Ethereum (1)
 * - Polygon (137)  
 * - Arbitrum One (42161)
 * - Optimism (10)
 * - Base (8453)
 * - Avalanche C-Chain (43114)
 * - BNB Chain (56)
 * - Fantom (250)
 * - Gnosis (100)
 * - zkSync Era (324)
 * - Linea (59144)
 * - Scroll (534352)
 * - Mantle (5000)
 * - Blast (81457)
 * - Aurora (1313161554)
 * - Klaytn (8217)
 * 
 * SUPPORTS ALL TOKENS: 1inch aggregates liquidity from 400+ DEXs
 * Get quotes: https://api.1inch.dev/swap/v6.0/{chainId}/quote
 * Get swap data: https://api.1inch.dev/swap/v6.0/{chainId}/swap
 */
contract ReforestFeeSplitter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // 1inch Aggregation Router V6 - SAME ADDRESS ON ALL SUPPORTED CHAINS
    address public constant ONEINCH_ROUTER = 0x111111125421cA6dc452d289314280a0f8842A65;

    // Fee recipient address (receives 1% of all swaps)
    address public feeRecipient;
    
    // Fee percentage in basis points (100 = 1%)
    uint256 public feeBps = 100;

    // Native token address used by 1inch
    address constant NATIVE_TOKEN = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    event Swap(
        address indexed user,
        address indexed srcToken,
        address indexed dstToken,
        uint256 srcAmount,
        uint256 feeAmount,
        uint256 dstAmount
    );

    event FeeRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);
    event FeeBpsUpdated(uint256 oldFeeBps, uint256 newFeeBps);

    constructor(address _feeRecipient) Ownable(msg.sender) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
    }

    /**
     * @notice Execute a swap through 1inch with 1% fee deduction
     * @dev Works with ANY token pair on ANY 1inch-supported chain
     * @param srcToken Source token address (use NATIVE_TOKEN for ETH/MATIC/AVAX/BNB/etc)
     * @param dstToken Destination token address
     * @param srcAmount Total amount of source tokens (fee will be deducted)
     * @param minDstAmount Minimum destination tokens expected (slippage protection)
     * @param swapData Encoded 1inch swap calldata from API
     */
    function swap(
        address srcToken,
        address dstToken,
        uint256 srcAmount,
        uint256 minDstAmount,
        bytes calldata swapData
    ) external payable nonReentrant returns (uint256 dstAmount) {
        require(srcAmount > 0, "Amount must be > 0");
        
        // Calculate 1% fee
        uint256 feeAmount = (srcAmount * feeBps) / 10000;
        uint256 swapAmount = srcAmount - feeAmount;

        // Track balance before swap
        uint256 balanceBefore;
        if (dstToken == NATIVE_TOKEN) {
            balanceBefore = address(this).balance;
        } else {
            balanceBefore = IERC20(dstToken).balanceOf(address(this));
        }

        if (srcToken == NATIVE_TOKEN) {
            require(msg.value >= srcAmount, "Insufficient native token");
            
            // Transfer 1% fee to recipient
            (bool feeSuccess, ) = feeRecipient.call{value: feeAmount}("");
            require(feeSuccess, "Fee transfer failed");
            
            // Execute swap with 99% via 1inch
            (bool swapSuccess, ) = ONEINCH_ROUTER.call{value: swapAmount}(swapData);
            require(swapSuccess, "1inch swap failed");
            
            // Refund excess if any
            if (msg.value > srcAmount) {
                (bool refundSuccess, ) = msg.sender.call{value: msg.value - srcAmount}("");
                require(refundSuccess, "Refund failed");
            }
        } else {
            // Transfer tokens from user
            IERC20(srcToken).safeTransferFrom(msg.sender, address(this), srcAmount);
            
            // Transfer 1% fee to recipient
            IERC20(srcToken).safeTransfer(feeRecipient, feeAmount);
            
            // Approve 1inch router for swap amount
            IERC20(srcToken).forceApprove(ONEINCH_ROUTER, swapAmount);
            
            // Execute swap via 1inch
            (bool swapSuccess, ) = ONEINCH_ROUTER.call(swapData);
            require(swapSuccess, "1inch swap failed");
        }

        // Calculate received amount
        if (dstToken == NATIVE_TOKEN) {
            dstAmount = address(this).balance - balanceBefore;
            // Send to user
            (bool success, ) = msg.sender.call{value: dstAmount}("");
            require(success, "Native transfer failed");
        } else {
            dstAmount = IERC20(dstToken).balanceOf(address(this)) - balanceBefore;
            // Send to user
            IERC20(dstToken).safeTransfer(msg.sender, dstAmount);
        }

        require(dstAmount >= minDstAmount, "Slippage too high");
        
        emit Swap(msg.sender, srcToken, dstToken, srcAmount, feeAmount, dstAmount);
        
        return dstAmount;
    }

    /**
     * @notice Update fee recipient address
     */
    function setFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid address");
        address oldRecipient = feeRecipient;
        feeRecipient = _newRecipient;
        emit FeeRecipientUpdated(oldRecipient, _newRecipient);
    }

    /**
     * @notice Update fee percentage (max 5%)
     */
    function setFeeBps(uint256 _newFeeBps) external onlyOwner {
        require(_newFeeBps <= 500, "Fee too high");
        uint256 oldFeeBps = feeBps;
        feeBps = _newFeeBps;
        emit FeeBpsUpdated(oldFeeBps, _newFeeBps);
    }

    /**
     * @notice Rescue stuck tokens (emergency only)
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        if (token == NATIVE_TOKEN) {
            (bool success, ) = owner().call{value: amount}("");
            require(success, "Native rescue failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }

    receive() external payable {}
}
