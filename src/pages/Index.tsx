
import React, { useState, useEffect } from "react";
import TokenCreator from "@/components/TokenCreator";
import SolanaTokenInfo from "@/components/SolanaTokenInfo";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the application loads properly
    try {
      // Simple validation that our dependencies are loaded properly
      if (window.Buffer && window.crypto) {
        console.log("Dependências carregadas com sucesso");
        setIsLoading(false);
      } else {
        console.error("Dependências não carregadas corretamente");
        setLoadError("Algumas dependências não foram carregadas corretamente");
      }
    } catch (error) {
      console.error("Erro ao verificar dependências:", error);
      setLoadError("Erro ao carregar dependências");
    }
    
    // Set a timeout to stop showing loading state after 3 seconds
    // even if there are issues, to avoid a completely blank screen
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 flex flex-col items-center justify-center">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Carregando...</h2>
          <div className="h-2 w-32 bg-blue-500 rounded"></div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
        <div className="max-w-3xl mx-auto bg-red-900/30 border border-red-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Erro ao carregar a aplicação</h2>
          <p className="text-gray-300">{loadError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

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
        
        <div className="space-y-8">
          <TokenCreator />
          <SolanaTokenInfo />
        </div>
        
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
