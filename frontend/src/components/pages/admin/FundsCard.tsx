import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { erc20Abi, parseUnits } from 'viem';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

function FundsCard() {
  const { toast } = useToast();
  const { address } = useAccount();
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

  const handleWithdrawSubmit = async (
    evt: React.FormEvent<HTMLFormElement>
  ) => {
    evt.preventDefault();
    try {
      await writeContractAsync({
        abi: UBI_CONTRACT_ABI,
        address: UBI_CONTRACT_ADDRESS,
        functionName: 'withdrawFunds',
      });

      toast({
        title: 'Transacción enviada',
        description: 'Fondos retirados correctamente.',
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
    <Tabs defaultValue='add' className='w-full md:w-[350px] h-full flex-1'>
      <TabsList className='grid w-full grid-cols-2 p-2 gap-x-1 tabline'>
        <TabsTrigger value='add' className='tab-button'>
          Fondear
        </TabsTrigger>
        <TabsTrigger value='delete' className='tab-button'>
          Retirar
        </TabsTrigger>
      </TabsList>
      <TabsContent value='add'>
        <Card className='w-full md:w-[350px] my-2'>
          <form onSubmit={handleAddSubmit}>
            <CardHeader>
              <CardTitle>Añadir fondos</CardTitle>
            </CardHeader>
            <CardContent className='text-left'>
              <Label>Cantidad</Label>
              <Input name='amount' placeholder='$cCop' />
            </CardContent>
            <CardFooter>
              <Button loading={isPending || isLoading} className='w-full'>
                Añadir
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value='delete'>
        <form onSubmit={handleWithdrawSubmit}>
          <Card className='w-full md:w-[350px] my-2'>
            <CardHeader>
              <CardTitle>Retirar fondos</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button className='w-full'>Retirar</Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
    </Tabs>
  );
}

export default FundsCard;
