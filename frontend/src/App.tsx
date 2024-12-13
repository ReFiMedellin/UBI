import './App.css';
import { useAppKitAccount } from '@reown/appkit/react';

import { Card, CardFooter } from '@/components/ui/card';
import Header from '@/components/pages/main/Header';
import { Button } from '@/components/ui/button';
import Description from './components/pages/main/Description';
import Info from './components/pages/main/Info';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { UBI_CONTRACT_ADDRESS, UBI_CONTRACT_ABI } from './constants';
import useUBIContract from './hooks/useUBIContract';
import { useToast } from './hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useEffect } from 'react';

function App() {
  const { toast } = useToast();
  const { address } = useAppKitAccount();
  const { data: hash, writeContract, isPending } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.error(error);
        toast({
          title: 'Error al reclamar el subsidio',
          description: error.message,
          variant: 'destructive',
          action: (
            <ToastAction onClick={handleClaim} altText='Try again'>
              Try again
            </ToastAction>
          ),
        });
      },
    },
  });

  const handleClaim = () => {
    writeContract({
      abi: UBI_CONTRACT_ABI,
      address: UBI_CONTRACT_ADDRESS,
      functionName: 'claimSubsidy',
    });
  };

  const {
    isAbleToClaim,
    claimInterval,
    lastClaimed,
    isWhiteListed,
    totalClaimed,
    valueToClaim,
  } = useUBIContract(address);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transacción exitosa.",
        description: "El subsidio fue reclamado correctamente.",
      })
    }
  }, [isConfirmed])

  return (
    <div className='flex flex-col items-center justify-center h-full max-w-[90vw] overflow-hidden'>
      <div>
        <div className='m-4 lg:w-[350px]'>
          <Header
            isWhiteListed={isWhiteListed}
            isAbleToClaim={isAbleToClaim}
            lastClaimed={lastClaimed}
            claimInterval={claimInterval}
            valueToClaim={valueToClaim}
          />
        </div>
        <Card className='lg:w-[350px] m-auto'>
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
              onClick={handleClaim}
              loading={isPending || isConfirming}
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
