
import React from "react";
import TokenCreator from "@/components/TokenCreator";
import SolanaTokenInfo from "@/components/SolanaTokenInfo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Solana Token Creator
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Crie facilmente seu próprio token na blockchain Solana e visualize na carteira Solflare.
          </p>
        </header>
        
        <TokenCreator />
        <SolanaTokenInfo />
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Este aplicativo interage com a rede de teste (Devnet) da Solana.</p>
          <p className="mt-2">
            Não utilize tokens criados aqui para fins financeiros reais.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
