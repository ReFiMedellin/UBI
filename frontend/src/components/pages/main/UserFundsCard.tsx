import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CCOP_CONTRACT_ADDRESS,
  UBI_CONTRACT_ABI,
  UBI_CONTRACT_ADDRESS,
} from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { erc20Abi, parseUnits } from 'viem';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

function UserFundsCard() {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const client = usePublicClient();
  const {
    writeContractAsync,
    isPending,
    data: hash,
  } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.error(error);
        toast({
          title: 'Error en la transacción',
          description: error.message,
          variant: 'destructive',
        });
      },
    },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: CCOP_CONTRACT_ADDRESS,
    functionName: 'allowance',
    args: [address!, UBI_CONTRACT_ADDRESS],
  });

  const { isLoading } = useWaitForTransactionReceipt({ hash });

  const handleAddSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    try {
      refetchAllowance();

      const formData = new FormData(evt.currentTarget);
      const amount = parseUnits(formData.get('amount') as string, 18);
      console.debug('GM', allowance);
      if (typeof allowance !== 'bigint') return;
      if (allowance < amount) {
        const approveTx = await writeContractAsync({
          abi: erc20Abi,
          address: CCOP_CONTRACT_ADDRESS,
          functionName: 'approve',
          args: [UBI_CONTRACT_ADDRESS, amount],
        });

        toast({
          title: 'Transacción enviada',
          description: 'Aprobación enviada, esperando confirmación.',
        });

        await refetchAllowance();

        const receipt = await client!.waitForTransactionReceipt({
          hash: approveTx,
          confirmations: 1,
          pollingInterval: 1000,
          timeout: 60000,
        });
        if (receipt.status === 'reverted') {
          toast({
            title: 'Error en la transacción',
            description: 'La transacción de aprobación falló.',
            variant: 'destructive',
          });
          return;
        }
      }
      await writeContractAsync({
        abi: UBI_CONTRACT_ABI,
        address: UBI_CONTRACT_ADDRESS,
        functionName: 'addFunds',
        args: [amount],
      });

      toast({
        title: 'Transacción enviada',
        description: 'Fondos añadidos correctamente.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error en la transacción',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className='lg:w-[350px] mx-auto'>
      <form onSubmit={handleAddSubmit}>
      <CardTitle className='text-gray-800 text-lg font-semibold py-4'>Donar fondos</CardTitle>
        <CardContent className='text-left p-0 m-4'>
          <Label className='text-gray-700 m-2'>Cantidad</Label>
          <Input name='amount' placeholder='$cCop' className='mt-1' />
        </CardContent>
        <CardFooter className='px-4'>
          <Button disabled={isPending || isLoading || !isConnected} className='w-full text-white rounded-lg'>
            {(isPending || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Donar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default UserFundsCard; 
