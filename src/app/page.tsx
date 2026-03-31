import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-medium mb-8">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Powered by Kaia Network
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-gradient">Empowering</span> the Next<br />
            Generation of <span className="text-gradient">DAOs</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed font-sans">
            Build, vote, and grow your community on the fastest blockchain. 
            Create your own tokens, mint NFTs, and participate in prediction markets 
            with a premium Web3 experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground rounded-full font-bold shadow-2xl shadow-purple-500/40 hover:scale-105 transition-transform">
              Launch App
            </button>
            <button className="w-full sm:w-auto px-8 py-4 glass rounded-full font-bold hover:bg-white/10 transition-colors">
              Read Governance
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Decentralized Voting",
                desc: "Secure on-chain governance for your community members.",
                icon: "🗳️"
              },
              {
                title: "Custom Token Minting",
                desc: "Issue your own community tokens in seconds on Kaia.",
                icon: "🪙"
              },
              {
                title: "NFT Gallery",
                desc: "Transform your posts and images into unique digital assets.",
                icon: "🖼️"
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 glass rounded-3xl hover:-translate-y-2 transition-transform cursor-pointer">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 opacity-50">
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center font-bold text-background text-[10px]">
              D
            </div>
            <span className="font-bold tracking-tight">KAIA DAO</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Kaia DAO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

