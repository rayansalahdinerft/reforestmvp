// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ReforestWallet Fee Splitter
 * @notice Wraps DEX aggregator calls and takes a 1% fee for reforestation
 * @dev Deploy this contract and use it as a proxy for 1inch/other DEX swaps
 * 
 * HOW IT WORKS:
 * 1. User approves this contract for their tokens
 * 2. User calls swap() with the DEX calldata
 * 3. Contract takes 1% fee, sends to feeRecipient
 * 4. Contract executes the swap with remaining 99%
 * 5. User receives swapped tokens
 */
contract ReforestFeeSplitter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Fee recipient address (receives 1% of all swaps)
    address public feeRecipient;
    
    // Fee percentage in basis points (100 = 1%)
    uint256 public feeBps = 100;
    
    // 1inch Aggregation Router addresses per chain
    // Ethereum: 0x1111111254EEB25477B68fb85Ed929f73A960582
    // Polygon: 0x1111111254EEB25477B68fb85Ed929f73A960582
    // Arbitrum: 0x1111111254EEB25477B68fb85Ed929f73A960582
    // Base: 0x1111111254EEB25477B68fb85Ed929f73A960582
    // BSC: 0x1111111254EEB25477B68fb85Ed929f73A960582
    address public aggregatorRouter;

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
    event AggregatorRouterUpdated(address indexed oldRouter, address indexed newRouter);

    constructor(
        address _feeRecipient,
        address _aggregatorRouter
    ) Ownable(msg.sender) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        require(_aggregatorRouter != address(0), "Invalid router");
        
        feeRecipient = _feeRecipient;
        aggregatorRouter = _aggregatorRouter;
    }

    /**
     * @notice Execute a swap through 1inch with fee deduction
     * @param srcToken Source token address (use NATIVE_TOKEN for ETH/native)
     * @param srcAmount Total amount of source tokens
     * @param minDstAmount Minimum destination tokens expected
     * @param swapData Encoded 1inch swap calldata
     */
    function swap(
        address srcToken,
        uint256 srcAmount,
        uint256 minDstAmount,
        bytes calldata swapData
    ) external payable nonReentrant returns (uint256 dstAmount) {
        require(srcAmount > 0, "Amount must be > 0");
        
        // Calculate fee (1%)
        uint256 feeAmount = (srcAmount * feeBps) / 10000;
        uint256 swapAmount = srcAmount - feeAmount;

        if (srcToken == NATIVE_TOKEN) {
            require(msg.value >= srcAmount, "Insufficient ETH");
            
            // Transfer fee to recipient
            (bool feeSuccess, ) = feeRecipient.call{value: feeAmount}("");
            require(feeSuccess, "Fee transfer failed");
            
            // Execute swap with remaining amount
            (bool swapSuccess, bytes memory result) = aggregatorRouter.call{value: swapAmount}(swapData);
            require(swapSuccess, "Swap failed");
            
            dstAmount = abi.decode(result, (uint256));
        } else {
            // Transfer tokens from user
            IERC20(srcToken).safeTransferFrom(msg.sender, address(this), srcAmount);
            
            // Transfer fee to recipient
            IERC20(srcToken).safeTransfer(feeRecipient, feeAmount);
            
            // Approve router for swap amount
            IERC20(srcToken).safeApprove(aggregatorRouter, swapAmount);
            
            // Execute swap
            (bool swapSuccess, bytes memory result) = aggregatorRouter.call(swapData);
            require(swapSuccess, "Swap failed");
            
            dstAmount = abi.decode(result, (uint256));
            
            // Reset approval
            IERC20(srcToken).safeApprove(aggregatorRouter, 0);
        }

        require(dstAmount >= minDstAmount, "Slippage too high");
        
        emit Swap(msg.sender, srcToken, address(0), srcAmount, feeAmount, dstAmount);
        
        return dstAmount;
    }

    /**
     * @notice Update fee recipient address
     * @param _newRecipient New fee recipient address
     */
    function setFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid address");
        address oldRecipient = feeRecipient;
        feeRecipient = _newRecipient;
        emit FeeRecipientUpdated(oldRecipient, _newRecipient);
    }

    /**
     * @notice Update fee percentage
     * @param _newFeeBps New fee in basis points (max 500 = 5%)
     */
    function setFeeBps(uint256 _newFeeBps) external onlyOwner {
        require(_newFeeBps <= 500, "Fee too high");
        uint256 oldFeeBps = feeBps;
        feeBps = _newFeeBps;
        emit FeeBpsUpdated(oldFeeBps, _newFeeBps);
    }

    /**
     * @notice Update aggregator router address
     * @param _newRouter New router address
     */
    function setAggregatorRouter(address _newRouter) external onlyOwner {
        require(_newRouter != address(0), "Invalid address");
        address oldRouter = aggregatorRouter;
        aggregatorRouter = _newRouter;
        emit AggregatorRouterUpdated(oldRouter, _newRouter);
    }

    /**
     * @notice Rescue stuck tokens (emergency only)
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        if (token == NATIVE_TOKEN) {
            (bool success, ) = owner().call{value: amount}("");
            require(success, "ETH rescue failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }

    receive() external payable {}
}
