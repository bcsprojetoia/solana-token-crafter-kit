
import React, { ReactNode, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import the styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: React.FC<SolanaProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  // The network is explicitly set to 'devnet'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  // Check if required global objects are available
  useEffect(() => {
    const checkDependencies = () => {
      try {
        if (window.Buffer && window.crypto) {
          console.log("Solana provider: dependências disponíveis");
          setIsReady(true);
        } else {
          console.error("Solana provider: dependências faltando");
          setTimeout(checkDependencies, 100);  // Try again after a short delay
        }
      } catch (e) {
        console.error("Erro ao verificar dependências Solana:", e);
        setTimeout(checkDependencies, 100);
      }
    };
    
    checkDependencies();
  }, []);

  if (!isReady) {
    return <div className="text-center p-4">Carregando provedores Solana...</div>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaProvider;
