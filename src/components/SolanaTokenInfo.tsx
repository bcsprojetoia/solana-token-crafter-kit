
import React from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SolanaTokenInfo = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return (
    <Card className="w-full max-w-md mx-auto mt-4 bg-gray-900 text-white border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Instruções Solflare Wallet</CardTitle>
        <CardDescription className="text-gray-300">Como visualizar seu token na Solflare</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Abra sua carteira Solflare</li>
          <li>Clique em "Tokens"</li>
          <li>Clique em "+ Add Token"</li>
          <li>Cole o endereço do token gerado</li>
          <li>Clique em "Add Token"</li>
        </ol>
        <p className="text-sm text-gray-400 mt-4">
          Nota: Este token é criado na rede Devnet da Solana. Certifique-se de que sua carteira
          esteja configurada para a rede Devnet para visualizar o token.
        </p>
      </CardContent>
    </Card>
  );
};

export default SolanaTokenInfo;
