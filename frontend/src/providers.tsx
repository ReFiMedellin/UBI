import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { projectId, metadata, networks, wagmiAdapter } from '@/config';
import { createAppKit } from '@reown/appkit';

const queryClient = new QueryClient();

const generalConfig = {
  projectId,
  metadata,
  networks,
};

createAppKit({
  adapters: [wagmiAdapter],
  features: {
    analytics: true,
  },
  ...generalConfig,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
