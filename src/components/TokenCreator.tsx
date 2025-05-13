
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import * as token from '@solana/spl-token';
import { 
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';
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

    if (!tokenName || !tokenSymbol) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha o nome e o símbolo do token.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a new mint account
      const mintAccount = Keypair.generate();
      console.log("Mint public key:", mintAccount.publicKey.toString());
      
      // Calculate rent exemption for the mint
      const mintRent = await connection.getMinimumBalanceForRentExemption(token.MINT_SIZE);
      
      // Create transaction for token creation
      const createMintTransaction = new Transaction().add(
        // Create account for the mint
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintAccount.publicKey,
          space: token.MINT_SIZE,
          lamports: mintRent,
          programId: token.TOKEN_PROGRAM_ID
        }),
        // Initialize the mint
        token.createInitializeMintInstruction(
          mintAccount.publicKey,
          Number(decimals),
          publicKey,
          publicKey,
          token.TOKEN_PROGRAM_ID
        )
      );
      
      // Sign transaction with wallet
      const createMintTxSig = await sendTransaction(createMintTransaction, connection, {
        signers: [mintAccount]
      });
      
      console.log("Create mint transaction signature:", createMintTxSig);
      
      // Wait for confirmation to ensure mint account is ready for metadata
      await connection.confirmTransaction(createMintTxSig);
      
      // Get or create associated token account for the user
      const tokenAccountAddress = await token.getAssociatedTokenAddress(
        mintAccount.publicKey,
        publicKey,
        false,
        token.TOKEN_PROGRAM_ID,
        token.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      
      // Create transaction to create the token account and mint tokens
      const tokenTransaction = new Transaction();
      
      // Create the associated token account if it doesn't exist
      tokenTransaction.add(
        token.createAssociatedTokenAccountInstruction(
          publicKey,
          tokenAccountAddress,
          publicKey,
          mintAccount.publicKey,
          token.TOKEN_PROGRAM_ID,
          token.ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
      
      // Mint tokens to the user's account
      tokenTransaction.add(
        token.createMintToInstruction(
          mintAccount.publicKey,
          tokenAccountAddress,
          publicKey,
          BigInt(Number(initialSupply) * Math.pow(10, Number(decimals))),
          [],
          token.TOKEN_PROGRAM_ID
        )
      );
      
      // Send the token transaction
      const tokenTxSig = await sendTransaction(tokenTransaction, connection);
      console.log("Mint token transaction signature:", tokenTxSig);
      
      // Wait for confirmation to ensure token is minted
      await connection.confirmTransaction(tokenTxSig);
      
      // Now, create token metadata
      // Calculate PDA for metadata account
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mintAccount.publicKey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );
      
      // Create transaction for metadata
      const metadataTransaction = new Transaction();
      
      // Add the instruction to create metadata
      metadataTransaction.add(
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataPDA,
            mint: mintAccount.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: tokenName,
                symbol: tokenSymbol,
                uri: "",
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null,
              },
              isMutable: true,
              collectionDetails: null,
            },
          }
        )
      );

      // Send the metadata transaction
      const metadataTxSig = await sendTransaction(metadataTransaction, connection);
      console.log("Create metadata transaction signature:", metadataTxSig);
      
      // Wait for confirmation
      await connection.confirmTransaction(metadataTxSig);
      
      // Show success message and save the token mint address
      setCreatedToken(mintAccount.publicKey.toString());
      toast({
        title: "Token criado com sucesso!",
        description: `Token "${tokenName}" (${tokenSymbol}) criado. Endereço: ${mintAccount.publicKey.toString()}`,
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
                required
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
                required
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
              O token agora deve aparecer com nome {tokenName} ({tokenSymbol}).
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
