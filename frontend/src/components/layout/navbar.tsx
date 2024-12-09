import { createAppKit, useAppKitAccount } from '@reown/appkit/react'
import { projectId, metadata, networks, wagmiAdapter } from '@/config'
import { useReadContract } from 'wagmi'
import { Button } from '../ui/button'
import { Link, useLocation } from 'react-router'
import { UBI_CONTRACT_ADDRESS, UBI_CONTRACT_ABI } from '@/constants'

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

  const { isConnected, address } = useAppKitAccount()
  const { data } = useReadContract({
    address: UBI_CONTRACT_ADDRESS,
    abi: UBI_CONTRACT_ABI,
    functionName: "owner",
  })

  const isAdmin = isConnected && data && address && data === address

  const location = useLocation()

  return (
    <div className="p-0 m-0 h-[15vh]">
      <nav className="border-b p-4 w-full">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
              <span className="font-bold">ReFi Med</span>
              { isAdmin && 
                ( location.pathname == "/admin" ? (
                  <Link to="/" >
                  <Button>User Panel</Button>
                  </Link>
                ) : (
                  <Link to="/admin" >
                  <Button>Admin Panel</Button>
                  </Link>
                )
              )}
          </div>
          <appkit-button />
        </div>
      </nav>
    </div>
  )
}
