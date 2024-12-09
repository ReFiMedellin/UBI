import './App.css';
import { useAppKitAccount } from '@reown/appkit/react';

import { Card, CardFooter } from '@/components/ui/card';
import Header from '@/components/pages/main/Header';
import { Button } from '@/components/ui/button';
import Description from './components/pages/main/Description';
import Info from './components/pages/main/Info';
import { useWriteContract } from 'wagmi';
import { UBI_CONTRACT_ADDRESS, UBI_CONTRACT_ABI } from './constants';
import useUBIContract from './hooks/useUBIContract';

function App() {
  const { address } = useAppKitAccount();
  const { writeContract } = useWriteContract();
  const {
    isAbleToClaim,
    claimInterval,
    lastClaimed,
    isWhiteListed,
    totalClaimed,
    valueToClaim,
  } = useUBIContract(address);

  return (
    <div className='flex flex-col items-center justify-center h-[75vh] overflow-hidden'>
      <div>
        <div className='m-4 w-[350px]'>
          <Header
            isWhiteListed={isWhiteListed}
            isAbleToClaim={isAbleToClaim}
            lastClaimed={lastClaimed}
            claimInterval={claimInterval}
            valueToClaim={valueToClaim}
          />
        </div>
        <Card className='w-[350px] m-auto'>
          <Description
            isWhiteListed={isWhiteListed}
            isAbleToClaim={isAbleToClaim}
            valueToClaim={valueToClaim}
            claimInterval={claimInterval}
          />
          <Info
            isWhiteListed={isWhiteListed}
            lastClaimed={lastClaimed}
            totalClaimed={totalClaimed}
          />
          <CardFooter>
            <Button
              disabled={!isWhiteListed || !isAbleToClaim}
              className='w-full'
              onClick={() => {
                writeContract({
                  abi: UBI_CONTRACT_ABI,
                  address: UBI_CONTRACT_ADDRESS,
                  functionName: 'claimSubsidy',
                });
              }}
            >
              Reclamar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
