import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { WagmiProvider } from 'wagmi';
import { wagmiAdapter } from '@/config/index.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/index.css';
import { NavBar } from '@/components/layout/navbar.tsx';
import App from '@/App.tsx';
import AdminPanel from '@/pages/Admin.tsx';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <main className='w-full min-h-screen flex flex-col'>
            <NavBar />
            <div className='flex-1 flex items-center justify-center'>
              <Routes>
                <Route index element={<App />} />
                <Route path='/admin' element={<AdminPanel />} />
              </Routes>
            </div>
          </main>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
