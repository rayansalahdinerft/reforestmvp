// ReforestWallet Fee Splitter Contract Configuration
// Deployed on all supported EVM chains

// Contract addresses (same on all chains when deployed)
// TODO: Replace with actual deployed addresses
export const REFOREST_FEE_SPLITTER_ADDRESSES: Record<number, `0x${string}`> = {
  1: '0x4c725299078FbbaC405625FF5a9d0328b3e23Cce' as `0x${string}`,      // Ethereum Mainnet
  137: '0x0000000000000000000000000000000000000000' as `0x${string}`,    // Polygon
  42161: '0x0000000000000000000000000000000000000000' as `0x${string}`,  // Arbitrum
  10: '0x0000000000000000000000000000000000000000' as `0x${string}`,     // Optimism
  8453: '0x0000000000000000000000000000000000000000' as `0x${string}`,   // Base
  43114: '0x0000000000000000000000000000000000000000' as `0x${string}`,  // Avalanche
  56: '0x0000000000000000000000000000000000000000' as `0x${string}`,     // BNB Chain
};

// 1inch Aggregation Router V6 (same address on all chains)
export const ONEINCH_ROUTER_V6 = '0x111111125421cA6dc452d289314280a0f8842A65' as const;

// Native token address used by 1inch
export const NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as const;

// Impact address (receives 1% of all swaps)
export const FEE_RECIPIENT = '0x0B9CEd290B0B48dAC1fA3DA88d219adFe6a998B2' as const;

// Fee in basis points (100 = 1%)
export const FEE_BPS = 100;

// ABI for the ReforestFeeSplitter contract
// Main function: swap() - takes 1% fee, forwards rest to 0x router with swap calldata
export const REFOREST_FEE_SPLITTER_ABI = [
  {
    inputs: [
      { name: 'srcToken', type: 'address' },
      { name: 'dstToken', type: 'address' },
      { name: 'srcAmount', type: 'uint256' },
      { name: 'minDstAmount', type: 'uint256' },
      { name: 'swapData', type: 'bytes' }
    ],
    name: 'swap',
    outputs: [{ name: 'dstAmount', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ name: 'to', type: 'address' }],
    name: 'takeFeeAndForward',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'feeRecipient',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'feeBps',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'srcToken', type: 'address' },
      { indexed: true, name: 'dstToken', type: 'address' },
      { indexed: false, name: 'srcAmount', type: 'uint256' },
      { indexed: false, name: 'feeAmount', type: 'uint256' },
      { indexed: false, name: 'dstAmount', type: 'uint256' }
    ],
    name: 'Swap',
    type: 'event'
  }
] as const;

// ERC20 Approval ABI
export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export const isContractDeployed = (chainId: number): boolean => {
  const address = REFOREST_FEE_SPLITTER_ADDRESSES[chainId];
  return address !== undefined && address !== '0x0000000000000000000000000000000000000000';
};

export const getContractAddress = (chainId: number): `0x${string}` | null => {
  const address = REFOREST_FEE_SPLITTER_ADDRESSES[chainId];
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    return null;
  }
  return address;
};
