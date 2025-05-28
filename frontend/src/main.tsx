import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import '@/index.css';
import { NavBar } from '@/components/layout/navbar.tsx';
import App from '@/App.tsx';
import AdminPanel from '@/pages/Admin.tsx';
import { Toaster } from './components/ui/toaster';
import { Providers } from './providers';
import DonatePage from './pages/Donate';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <main className='w-full min-h-screen flex flex-col'>
          <NavBar />
          <div className='flex-1 flex items-center justify-center'>
            <Routes>
              <Route index element={<App />} />
              <Route path='/admin' element={<AdminPanel />} />
              <Route path='/donate' element={<DonatePage />} />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
      <Toaster />
    </Providers>
  </StrictMode>
);
