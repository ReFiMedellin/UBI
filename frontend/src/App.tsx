import './App.css'
import { useAppKitAccount } from '@reown/appkit/react'

import { Card, CardFooter } from '@/components/ui/card'
import Header from '@/components/pages/main/Header'
import { Button } from '@/components/ui/button'
import Description from './components/pages/main/Description'
import Info from './components/pages/main/Info'

import { subsidyProgramAbi } from './generated'

import { useReadContracts, useWriteContract } from 'wagmi'

function App() {
  const { address, isConnected } = useAppKitAccount()
  // Seguramente sea mejor ponerlo en un .env
  const contractAddress = "0x1A6FBc7b51E55C6D4F15c8D5CE7e97daEA699ecf"
  const { writeContract } = useWriteContract()

  const { data }  = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: subsidyProgramAbi,
        functionName: "isBeneficiary",
        args: [address as `0x${string}`],
      },
      {
        address: contractAddress,
        abi: subsidyProgramAbi,
        functionName: "addressToUser",
        args: [address as `0x${string}`],
      },
      {
        address: contractAddress,
        abi: subsidyProgramAbi,
        functionName: "subsidyClaimInterval",
      },
      {
        address: contractAddress,
        abi: subsidyProgramAbi,
        functionName: "subsidyClaimableAmount",
      },
    ],
  })

  if (!isConnected || !address) {
    return (
      <h1 className='p-12'>Por favor, conecte su wallet</h1>
    )
  }

  const isWhiteListed = data?.[0].result ?? false
  const [lastClaimed, totalClaimed] = data?.[1].result ?? [0n, 0n]
  const claimInterval = data?.[2].result ?? 0n
  const valueToClaim = data?.[3].result ?? 0n
  const isAbleToClaim = (Date.now() / 1000) - Number(lastClaimed) >= claimInterval

  return (
    <div className='flex flex-col items-center justify-center h-[75vh] overflow-hidden'>
     <div>
       <div className='m-4 w-[350px]'>
         <Header isWhiteListed={ isWhiteListed } isAbleToClaim={ isAbleToClaim } lastClaimed={ lastClaimed } claimInterval={ claimInterval } valueToClaim={ valueToClaim }/>
       </div>
      <Card className='w-[350px] m-auto'>
        <Description isWhiteListed={ isWhiteListed } isAbleToClaim={ isAbleToClaim } valueToClaim={ valueToClaim } claimInterval={ claimInterval }/>
        <Info isWhiteListed={ isWhiteListed } lastClaimed={ lastClaimed } totalClaimed={ totalClaimed }/>
        <CardFooter>
          <Button 
            disabled={ !isWhiteListed || !isAbleToClaim } 
            className='w-full'
            onClick={() => {
                writeContract({
                  abi: subsidyProgramAbi,
                  address: contractAddress,
                  functionName: "claimSubsidy",
                })
              }
            }
          >
            Reclamar
          </Button>
        </CardFooter>
      </Card>
      </div>
    </div>
  )
}

export default App
