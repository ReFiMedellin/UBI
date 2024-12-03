// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { projectId, metadata, networks, wagmiAdapter } from './config'

const queryClient = new QueryClient()

const generalConfig = {
  projectId,
  metadata,
  networks,
}

createAppKit({
  adapters: [wagmiAdapter],
  features: {
    analytics: true,
    email: true,
    socials: ["google", "x", "github"],
  },
  ...generalConfig,
})

function App() {
  return (
    <>
      <h1>Trying Reown + Wagmi</h1>
      <div className="card">
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <appkit-button />
          </QueryClientProvider>
        </ WagmiProvider>
      </div>
    </>
  )
}

export default App
