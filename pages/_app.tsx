import { useEffect, useState } from 'react';
import { CssBaseline, GeistProvider } from '@geist-ui/core';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import GithubCorner from 'react-github-corner';
import '../styles/globals.css';

// Imports
import { createConfig } from '@wagmi/core';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { chains } from '../chain'; // Importing from your custom chains file
import { useIsMounted } from '../hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createClient, http } from 'viem';

// Import wallet connectors
import {
  coinbaseWallet,
  trustWallet,
  rainbowWallet,
  metaMaskWallet,
  walletConnectWallet,
  binanceWallet,
  bybitWallet,
  okxWallet,
  uniswapWallet,
} from '@rainbow-me/rainbowkit/wallets';

// Define WalletConnect projectId
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default_project_id_placeholder';

// Define connectors
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      coinbaseWallet(),
      trustWallet({ projectId }),
      rainbowWallet(),
      metaMaskWallet(),
      walletConnectWallet({ projectId }),
    ],
  },
  {
    groupName: 'More',
    wallets: [
      binanceWallet(),
      bybitWallet(),
      okxWallet(),
      uniswapWallet(),
    ],
  },
]);

// Configure wagmi
const wagmiConfig = createConfig({
  client({ chain }) {
    const transportURLs: { [key: number]: string } = {
      1: 'https://cloudflare-eth.com', // Ethereum Mainnet
      137: 'https://polygon-rpc.com', // Polygon
      10: 'https://mainnet.optimism.io', // Optimism
      42161: 'https://arb1.arbitrum.io/rpc', // Arbitrum
      56: 'https://rpc.ankr.com/bsc', // Binance Smart Chain
      100: 'https://rpc.gnosischain.com', // Gnosis Chain
      240: 'https://rpcurl.pos.nexilix.com', // Nexilix
      324: 'https://mainnet.era.zksync.io', // zkSync Era
      61: 'https://etc.rivet.link', // Ethereum Classic
      8453: 'https://mainnet.base.org', // Base
    };

    return createClient({
      transport: http(transportURLs[chain.id] || 'https://default-rpc-url.com'), // Use a fallback URL
    });
  },
  chains,
});

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  const [web3wallet, setWeb3Wallet] = useState<InstanceType<typeof Web3Wallet> | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    const initializeWalletConnect = async () => {
      try {
        const core = new Core({
          projectId: projectId,
        });

        const metadata = {
          name: 'Test App',
          description: 'AppKit Example',
          url: 'https://web3modal.com',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        };

        const wallet = await Web3Wallet.init({
          core,
          metadata,
        });

        setWeb3Wallet(wallet);
        console.log('WalletConnect initialized successfully');
      } catch (error) {
        console.error('Error initializing WalletConnect:', error);
      }
    };

    if (isMounted) {
      initializeWalletConnect();
    }
  }, [isMounted]);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider chains={chains} connectors={connectors}>
          <NextHead>
            <title>Drain</title>
            <meta name="description" content="Send all tokens from one wallet to another" />
            <link rel="icon" href="/favicon.ico" />
          </NextHead>
          <GeistProvider>
            <CssBaseline />
            <GithubCorner href="https://github.com/dawsbot/drain" size="140" bannerColor="#e056fd" />
            {/* Conditionally render the main component based on wallet initialization */}
            {isMounted && web3wallet ? <Component {...pageProps} /> : null}
          </GeistProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default App;
