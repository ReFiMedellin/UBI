import { createAppKit } from '@reown/appkit/react'
import { projectId, metadata, networks, wagmiAdapter } from '@/config'

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

export function NavBar() {

  return (
    <div className="p-0 m-0 h-[15vh]">
      <nav className="border-b p-4 w-full">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
              <span className="font-bold">Refi-Med</span>
          </div>
            <appkit-button />
        </div>
      </nav>
    </div>
  )
}
