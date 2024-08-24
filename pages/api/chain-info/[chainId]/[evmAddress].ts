import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const ALCHEMY_API_KEY = z.string().parse(process.env.ALCHEMY_API_KEY);
console.log('WalletConnect Project ID:', process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);


type ChainName =
  | 'eth-mainnet'
  | 'matic-mainnet'
  | 'optimism-mainnet'
  | 'arbitrum-mainnet'
  | 'bsc-mainnet'
  | 'gnosis-mainnet';

function selectChainName(chainId: number): ChainName {
  switch (chainId) {
    case 1:
      return 'eth-mainnet';
    case 10:
      return 'optimism-mainnet';
    case 56:
      return 'bsc-mainnet';
    case 100:
      return 'gnosis-mainnet';
    case 137:
      return 'matic-mainnet';
    case 42161:
      return 'arbitrum-mainnet';
    default:
      const errorMessage = `chainId "${chainId}" not supported`;
      alert(errorMessage);
      throw new Error(errorMessage);
  }
}

const fetchTokenMetadata = async (contractAddress: string, chainName: ChainName) => {
  const response = await fetch(
    `https://eth-${chainName}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenMetadata',
        params: [contractAddress],
        id: 1,
      }),
    },
  );

  const data = await response.json();
  return data.result;
};

const fetchTokens = async (chainId: number, evmAddress: string) => {
  const chainName = selectChainName(chainId);
  const response = await fetch(
    `https://eth-${chainName}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [evmAddress],
        id: 1,
      }),
    },
  );

  const data = await response.json();
  const tokenBalances = data.result.tokenBalances;

  // Create a list of contract addresses
  const contractAddresses = tokenBalances.map((token: any) => token.contractAddress);

  // Prepare arrays to store ERC20 and NFT metadata
  const erc20s = [];
  const nfts = [];

  for (const contractAddress of contractAddresses) {
    const metadata = await fetchTokenMetadata(contractAddress, chainName);

    if (metadata.tokenType === 'ERC20') {
      erc20s.push({
        contract_decimals: metadata.decimals,
        contract_name: metadata.name,
        contract_ticker_symbol: metadata.symbol,
        contract_address: contractAddress,
        logo_url: metadata.logo,
        balance: tokenBalances.find((token: any) => token.contractAddress === contractAddress).tokenBalance,
        quote_rate: metadata.quote_rate, // Assuming quote_rate is obtained from metadata or another source
      });
    } else if (metadata.tokenType === 'ERC721') {
      nfts.push({
        contract_decimals: metadata.decimals,
        contract_name: metadata.name,
        contract_ticker_symbol: metadata.symbol,
        contract_address: contractAddress,
        logo_url: metadata.logo,
        balance: tokenBalances.find((token: any) => token.contractAddress === contractAddress).tokenBalance,
      });
    }
  }

  return { erc20s, nfts };
};

const positiveIntFromString = (value: string): number => {
  const intValue = parseInt(value, 10);

  if (isNaN(intValue) || intValue <= 0) {
    throw new Error('Value must be a positive integer');
  }

  return intValue;
};

const requestQuerySchema = z.object({
  chainId: z.string().transform(positiveIntFromString),
  evmAddress: z.string(),
});

// Define the API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { chainId, evmAddress } = requestQuerySchema.parse(req.query);

    const response = await fetchTokens(chainId, evmAddress);

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
