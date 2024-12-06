import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"
import { WagmiProvider } from 'wagmi'
import { wagmiAdapter } from './config/index.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { NavBar } from '@/components/layout/navbar.tsx'
import App from './App.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <WagmiProvider config={wagmiAdapter.wagmiConfig}>
    <QueryClientProvider client={queryClient}>
  <NavBar/>
    <BrowserRouter>
      <Routes>
      <Route index element={ <App/> }/>
      <Route path="/holiwi" element={ "Holiii" }/>
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  </ WagmiProvider>
  </StrictMode>,
)
