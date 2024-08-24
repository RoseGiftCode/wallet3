import { useCallback, useEffect, useState } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';

import { Loading, Toggle } from '@geist-ui/core';
import { tinyBig } from 'essential-eth';
import { useAtom } from 'jotai';
import { checkedTokensAtom } from '../../src/atoms/checked-tokens-atom';
import { globalTokensAtom } from '../../src/atoms/global-tokens-atom';
import { httpFetchTokens, Tokens } from '../../src/fetch-tokens';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const TokenRow: React.FunctionComponent<{ token: Tokens[number] }> = ({
  token,
}) => {
  const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);
  const { chain } = useAccount();  // Use chain from useAccount
  const pendingTxn =
    checkedRecords[token.contract_address as `0x${string}`]?.pendingTxn;
  const setTokenChecked = (tokenAddress: string, isChecked: boolean) => {
    setCheckedRecords((old) => ({
      ...old,
      [tokenAddress]: { isChecked: isChecked },
    }));
  };
  const { address } = useAccount();
  const { balance, contract_address, contract_ticker_symbol } = token;
  const unroundedBalance = tinyBig(token.quote).div(token.quote_rate);
  const roundedBalance = unroundedBalance.lt(0.001)
    ? unroundedBalance.round(10)
    : unroundedBalance.gt(1000)
    ? unroundedBalance.round(2)
    : unroundedBalance.round(5);
  const { isLoading } = useWaitForTransactionReceipt({
    hash: pendingTxn?.blockHash || undefined,
  });
  return (
    <div key={contract_address}>
      {isLoading && <Loading />}
      <Toggle
        checked={checkedRecords[contract_address as `0x${string}`]?.isChecked}
        onChange={(e) => {
          setTokenChecked(contract_address, e.target.checked);
        }}
        style={{ marginRight: '18px' }}
        disabled={Boolean(pendingTxn)}
      />
      <span style={{ fontFamily: 'monospace' }}>
        {roundedBalance.toString()}{' '}
      </span>
      <a
        href={`${chain?.blockExplorers?.default.url}/token/${token.contract_address}?a=${address}`}
        target="_blank"
        rel="noreferrer"
      >
        {contract_ticker_symbol}
      </a>{' '}
      (worth{' '}
      <span style={{ fontFamily: 'monospace' }}>
        {usdFormatter.format(token.quote)}
      </span>
      )
    </div>
  );
};

export const GetTokens = () => {
  const [tokens, setTokens] = useAtom(globalTokensAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);

  const { address, isConnected, chain } = useAccount(); // Get chain from useAccount

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError('');
      const newTokens = await httpFetchTokens(
        chain?.id as number, // Use chain ID from useAccount
        address as string,
      );
      setTokens((newTokens as any).data.erc20s);
    } catch (error) {
      setError(`Chain ${chain?.id} not supported. Coming soon!`);
    }
    setLoading(false);
  }, [address, chain?.id, setTokens]); // Correct dependencies

  useEffect(() => {
    if (address) {
      fetchData();
      setCheckedRecords({});
    }
  }, [address, chain?.id, fetchData, setCheckedRecords]); // Correct dependencies

  useEffect(() => {
    if (!isConnected) {
      setTokens([]);
      setCheckedRecords({});
    }
  }, [isConnected, setTokens, setCheckedRecords]); // Correct dependencies

  if (loading) {
    return <Loading>Loading</Loading>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ margin: '20px' }}>
      {isConnected && tokens?.length === 0 && `No tokens on ${chain?.name}`} {/* Use chain name */}
      {tokens.map((token) => (
        <TokenRow token={token} key={token.contract_address} />
      ))}
      {/* {isConnected && (
        <Button style={{ marginLeft: '20px' }} onClick={() => fetchData()}>
          Refetch
        </Button>
      )} */}
    </div>
  );
};
