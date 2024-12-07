import { createAppKit, useAppKitAccount } from '@reown/appkit/react'
import { projectId, metadata, networks, wagmiAdapter } from '@/config'
import { useReadContract } from 'wagmi'
import { subsidyProgramAbi } from '@/generated'
import { Button } from '../ui/button'
import { Link, useLocation } from 'react-router'

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
  const contractAddress = "0x1A6FBc7b51E55C6D4F15c8D5CE7e97daEA699ecf"

  const { isConnected, address } = useAppKitAccount()
  const { data } = useReadContract({
    address: contractAddress,
    abi: subsidyProgramAbi,
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
