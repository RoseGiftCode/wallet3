import { type Chain } from 'viem';

// Define a function to standardize chain definitions
function defineChain(chain: Chain): Chain {
  return {
    formatters: undefined,
    fees: undefined,
    serializers: undefined,
    ...chain,
  };
}

// Chain configurations

// Avalanche
const avalanche = defineChain({
  id: 43114,
  name: 'Avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: {
      name: 'SnowTrace',
      url: 'https://snowtrace.io',
      apiUrl: 'https://api.snowtrace.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11907934,
    },
  },
});

// Arbitrum
const arbitrum = defineChain({
  id: 42161,
  name: 'Arbitrum One',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://arb1.arbitrum.io/rpc'] },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
      apiUrl: 'https://api.arbiscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7654707,
    },
  },
});

// BNB Smart Chain (BSC)
const bsc = defineChain({
  id: 56,
  name: 'BNB Smart Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { http: ['https://rpc.ankr.com/bsc'] },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://bscscan.com',
      apiUrl: 'https://api.bscscan.com/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 15921452,
    },
  },
});

// Base
const base = defineChain({
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Basescan',
      url: 'https://basescan.org',
      apiUrl: 'https://api.basescan.org/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 5022,
    },
    l2OutputOracle: {
      address: '0x56315b90c40730925ec5485cf004d835058518A0',
    },
    portal: {
      address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
    },
    l1StandardBridge: {
      address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
    },
  },
});

// Polygon
const polygon = defineChain({
  id: 137,
  name: 'Polygon',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://polygon-rpc.com'] },
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: 'https://polygonscan.com',
      apiUrl: 'https://api.polygonscan.com/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 25770160,
    },
  },
});

// ZKsync Era
const zksync = defineChain({
  id: 324,
  name: 'ZKsync Era',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.era.zksync.io'],
      webSocket: ['wss://mainnet.era.zksync.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://era.zksync.network/',
      apiUrl: 'https://api-era.zksync.network/api',
    },
    native: {
      name: 'ZKsync Explorer',
      url: 'https://explorer.zksync.io/',
      apiUrl: 'https://block-explorer-api.mainnet.zksync.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    },
  },
});

// Nexilix Smart Chain
const nexilix = defineChain({
  id: 240,
  name: 'Nexilix Smart Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Nexilix',
    symbol: 'NEXILIX',
  },
  rpcUrls: {
    default: { http: ['https://rpcurl.pos.nexilix.com'] },
  },
  blockExplorers: {
    default: {
      name: 'NexilixScan',
      url: 'https://scan.nexilix.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0x58381c8e2BF9d0C2C4259cA14BdA9Afe02831244',
      blockCreated: 74448,
    },
  },
});

// Gnosis
const gnosis = defineChain({
  id: 100,
  name: 'Gnosis',
  nativeCurrency: {
    decimals: 18,
    name: 'Gnosis',
    symbol: 'xDAI',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.gnosischain.com'],
      webSocket: ['wss://rpc.gnosischain.com/wss'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Gnosisscan',
      url: 'https://gnosisscan.io',
      apiUrl: 'https://api.gnosisscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 21022491,
    },
  },
});

// Ethereum Classic
const classic = defineChain({
  id: 61,
  name: 'Ethereum Classic',
  nativeCurrency: {
    decimals: 18,
    name: 'ETC',
    symbol: 'ETC',
  },
  rpcUrls: {
    default: { http: ['https://etc.rivet.link'] },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout.com/etc/mainnet',
    },
  },
});

// Ethereum Mainnet
const mainnet = defineChain({
  id: 1,
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://cloudflare-eth.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
      apiUrl: 'https://api.etherscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
});

// Optimism
const optimism = defineChain({
  id: 10,
  name: 'Optimism',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://mainnet.optimism.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Optimistic Explorer',
      url: 'https://optimistic.etherscan.io',
      apiUrl: 'https://api.optimistic.etherscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 21542477,
    },
  },
});

// Define the tuple of all chains
export const chains: readonly [
  typeof avalanche,
  typeof arbitrum,
  typeof bsc,
  typeof base,
  typeof polygon,
  typeof zksync,
  typeof nexilix,
  typeof gnosis,
  typeof classic,
  typeof mainnet,
  typeof optimism
] = [
  avalanche,
  arbitrum,
  bsc,
  base,
  polygon,
  zksync,
  nexilix,
  gnosis,
  classic,
  mainnet,
  optimism,
] as const;
