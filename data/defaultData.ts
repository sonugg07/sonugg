import { PortfolioData } from '@/types/portfolio';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: "Sonugg",
    headline: "Web3 Content Creator & Developer",
    avatar: "/images/sonugg-avatar.png",
    status: "Available for Web3 Collabs & Dev",
    shortBio: "Building the decentralized future through code, research, and high-impact Web3 content. Years of experience navigating EVM, DeFi, and developer tooling.",
    about: "I'm Sonugg, a Web3 content creator and developer with years of experience in the Web3 ecosystem. I enjoy building projects, exploring new technologies, and creating content around Web3 and blockchain. My work focuses on learning by building, sharing what I discover, and contributing to the communities and ecosystems I'm part of.",
    email: "sonugg07@gmail.com",
    location: "Global / Decentralized"
  },
  pillars: [
    {
      title: "Web3 & Blockchain Dev",
      description: "Building smart contracts, decentralized apps, and dev tooling with focus on EVM security, modular architecture, and seamless UX."
    },
    {
      title: "Content Creation",
      description: "Distilling complex protocol mechanics, zero-knowledge proofs, and decentralized tech into actionable media and educational guides."
    },
    {
      title: "Building in Public",
      description: "Documenting engineering workflows, experimenting with bleeding-edge protocols, and sharing open-source code with the community."
    },
    {
      title: "Ecosystem & Community",
      description: "Active contributor across builder communities, hackathons, and protocol governance to push Web3 adoption forward."
    }
  ],
  skills: [
    {
      id: "s1",
      name: "Web3",
      category: "Ecosystem",
      description: "DeFi, DAOs, dApps architecture & on-chain integration"
    },
    {
      id: "s2",
      name: "Blockchain",
      category: "Core",
      description: "EVM, Consensus mechanisms, Layer 2s & smart contract standards"
    },
    {
      id: "s3",
      name: "Development",
      category: "Engineering",
      description: "Solidity, TypeScript, Next.js, Wagmi, Viem, React & Node.js"
    },
    {
      id: "s4",
      name: "Content Creation",
      category: "Media",
      description: "Deep-dives, video breakdowns, technical X threads & visual guides"
    },
    {
      id: "s5",
      name: "Developer Tools",
      category: "Engineering",
      description: "Foundry, Hardhat, Ethers.js, IPFS, The Graph & RPC infrastructure"
    },
    {
      id: "s6",
      name: "Technical Writing",
      category: "Media",
      description: "Protocol documentation, architectural reviews, tutorials & research"
    }
  ],
  "socials": [
    {
      id: "x",
      platform: "X (Twitter)",
      handle: "@Sonugg_7",
      url: "https://x.com/Sonugg_7",
      icon: "Twitter",
      description: "Web3 insights, build threads, and ecosystem alpha",
      featured: true
    },
    {
      id: "github",
      platform: "GitHub",
      handle: "sonugg07",
      url: "https://github.com/sonugg07",
      icon: "Github",
      description: "Open-source Web3 repositories, smart contracts, and tools",
      featured: true
    },
    {
      id: "linkedin",
      platform: "LinkedIn",
      handle: "sonugg",
      url: "https://www.linkedin.com/in/sonugg/",
      icon: "Linkedin",
      description: "Professional network, builder collaborations, and engineering updates",
      featured: true
    }
  ],
  projects: [
    {
      id: "evm-chain-pulse",
      title: "EVM Chain Pulse & Liquidity Sentinel",
      description: "Real-time on-chain analytics dashboard tracking gas spikes, whale migrations, and decentralized liquidity pools across EVM chains.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
      category: "Web3 & dApps",
      technologies: ["Solidity", "Next.js", "Viem", "Tailwind CSS", "The Graph"],
      demoUrl: "https://pulse.sonugg.dev",
      githubUrl: "https://github.com/sonugg07/evm-chain-pulse",
      status: "Live on Mainnet",
      featured: true
    },
    {
      id: "web3-foundry-toolkit",
      title: "Web3 Builder Foundry Toolkit",
      description: "A developer-first suite of reusable Solidity template contracts, gas optimization benchmarks, and deployment automation scripts.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      category: "Developer Tools",
      technologies: ["Foundry", "Solidity", "TypeScript", "Ethers.js"],
      demoUrl: "https://foundry-toolkit.sonugg.dev",
      githubUrl: "https://github.com/sonugg07/web3-foundry-toolkit",
      status: "Open Source",
      featured: true
    },
    {
      id: "web3-protocol-vault",
      title: "Web3 Knowledge & Protocol Vault",
      description: "Curated technical research repository and visual guides dissecting rollup architectures, ERC standards, and zero-knowledge primitives.",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200&auto=format&fit=crop",
      category: "Content & Research",
      technologies: ["Markdown", "Next.js", "Contentlayer", "Mermaid.js"],
      demoUrl: "https://vault.sonugg.dev",
      githubUrl: "https://github.com/sonugg07/web3-protocol-vault",
      status: "Live",
      featured: true
    },
    {
      id: "aurafi-yield-aggregator",
      title: "AuraFi Multi-Vault Yield Aggregator",
      description: "Non-custodial smart contract vault system optimizing decentralized yields across leading lending protocols with slippage protection.",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop",
      category: "Web3 & dApps",
      technologies: ["Solidity", "Hardhat", "Wagmi", "React"],
      demoUrl: "https://aurafi.sonugg.dev",
      githubUrl: "https://github.com/sonugg07/aurafi-yield-aggregator",
      status: "Beta",
      featured: false
    }
  ]
};
