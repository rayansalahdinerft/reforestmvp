// ReforestWallet Fee Splitter Contract Configuration
// Deployed on all supported EVM chains

// Contract addresses (same on all chains when deployed)
// TODO: Replace with actual deployed addresses
export const REFOREST_FEE_SPLITTER_ADDRESSES: Record<number, `0x${string}`> = {
  1: '0xd9145CCE52D386f254917e481eB44e9943F39138' as `0x${string}`,      // Ethereum Mainnet
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
export const FEE_RECIPIENT = '0x09a7d589709A4487e5C0cB3c74dEc41f8B219a0F' as const;

// Fee in basis points (100 = 1%)
export const FEE_BPS = 100;

// ABI for the ReforestFeeSplitter contract
// Function: takeFeeAndForward(address to) - takes 1% fee, forwards rest to `to`
export const REFOREST_FEE_SPLITTER_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' }
    ],
    name: 'takeFeeAndForward',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'impactAddress',
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
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'totalAmount', type: 'uint256' },
      { indexed: false, name: 'feeAmount', type: 'uint256' },
      { indexed: false, name: 'forwardedAmount', type: 'uint256' }
    ],
    name: 'FeeCollected',
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
