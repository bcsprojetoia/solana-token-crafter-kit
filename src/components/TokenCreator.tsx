
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const TokenCreator = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, sendTransaction } = wallet;
  const { toast } = useToast();

  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [decimals, setDecimals] = useState('9');
  const [initialSupply, setInitialSupply] = useState('1000000');
  const [isLoading, setIsLoading] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const createToken = async () => {
    if (!publicKey || !wallet.signTransaction) {
      toast({
        title: "Carteira não conectada",
        description: "Por favor, conecte sua carteira para criar um token.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create a new token mint
      const lamports = await connection.getMinimumBalanceForRentExemption(82);
      
      const mint = await createMint(
        connection,
        {
          publicKey,
          // Use the wallet's signTransaction method directly
          signTransaction: async (tx) => {
            return await wallet.signTransaction(tx);
          },
          signAllTransactions: async (txs) => {
            if (!wallet.signAllTransactions) {
              throw new Error("Wallet does not support signing all transactions");
            }
            return await wallet.signAllTransactions(txs);
          },
          // For transactions that don't need to be signed
          sendTransaction: async (tx, connection, options = {}) => {
            return await sendTransaction(tx, connection, options);
          },
        },
        publicKey,
        publicKey,
        Number(decimals)
      );

      console.log("Token mint created:", mint.toString());

      // Get the token account of the wallet address, create it if it doesn't exist
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        {
          publicKey,
          signTransaction: async (tx) => {
            return await wallet.signTransaction(tx);
          },
          signAllTransactions: async (txs) => {
            if (!wallet.signAllTransactions) {
              throw new Error("Wallet does not support signing all transactions");
            }
            return await wallet.signAllTransactions(txs);
          },
          sendTransaction: async (tx, connection, options = {}) => {
            return await sendTransaction(tx, connection, options);
          },
        },
        mint,
        publicKey
      );

      console.log("Token account created:", tokenAccount.address.toString());

      // Mint the new tokens
      await mintTo(
        connection,
        {
          publicKey,
          signTransaction: async (tx) => {
            return await wallet.signTransaction(tx);
          },
          signAllTransactions: async (txs) => {
            if (!wallet.signAllTransactions) {
              throw new Error("Wallet does not support signing all transactions");
            }
            return await wallet.signAllTransactions(txs);
          },
          sendTransaction: async (tx, connection, options = {}) => {
            return await sendTransaction(tx, connection, options);
          },
        },
        mint,
        tokenAccount.address,
        publicKey,
        Number(initialSupply) * Math.pow(10, Number(decimals))
      );

      // Show success message and save the token mint address
      setCreatedToken(mint.toString());
      toast({
        title: "Token criado com sucesso!",
        description: `Endereço do token: ${mint.toString()}`,
      });

    } catch (error) {
      console.error('Erro ao criar token:', error);
      toast({
        title: "Erro ao criar token",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-b from-blue-950 to-purple-950 text-white border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Criador de Token Solana</CardTitle>
        <CardDescription className="text-gray-300">Crie seu próprio token na rede Solana (Devnet)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          <WalletMultiButton className="!bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition duration-300 rounded-lg" />
        </div>
        
        {publicKey && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokenName" className="text-gray-300">Nome do Token</Label>
              <Input
                id="tokenName"
                placeholder="Ex: Meu Token"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokenSymbol" className="text-gray-300">Símbolo do Token</Label>
              <Input
                id="tokenSymbol"
                placeholder="Ex: MTK"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decimals" className="text-gray-300">Casas Decimais</Label>
              <Input
                id="decimals"
                type="number"
                placeholder="9"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supply" className="text-gray-300">Fornecimento Inicial</Label>
              <Input
                id="supply"
                type="number"
                placeholder="1000000"
                value={initialSupply}
                onChange={(e) => setInitialSupply(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white"
              />
            </div>
          </div>
        )}

        {createdToken && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg break-all">
            <p className="text-sm text-gray-300">Token criado:</p>
            <p className="font-mono text-green-400">{createdToken}</p>
            <p className="text-xs text-gray-400 mt-2">
              Para visualizar na Solflare, use o botão "Add Token" na sua carteira e cole este endereço.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={createToken}
          disabled={!publicKey || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        >
          {isLoading ? "Processando..." : "Criar Token"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TokenCreator;
