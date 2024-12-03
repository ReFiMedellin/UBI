import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

export const projectId = import.meta.env.VITE_PROJECT_ID
// export const projectId = process.env.VITE_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const metadata = {
  name: 'AppKit Example',
  description: 'AppKit Example',
  url: 'https://reown.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const networks = [mainnet, arbitrum] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  projectId,
  networks,
  ssr: true,
})

export const config = wagmiAdapter.wagmiConfig
