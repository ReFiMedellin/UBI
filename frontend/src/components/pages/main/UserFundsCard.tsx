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
  SUBSIDY_CONTRACT_ABI,
  SUBSIDY_CONTRACT_ADDRESS,
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
  
  // Función para generar enlace de Celoscan
  const getCeloscanUrl = (hash: string) => {
    return `https://celoscan.io/tx/${hash}`;
  };
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
    args: [address!, SUBSIDY_CONTRACT_ADDRESS],
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
          args: [SUBSIDY_CONTRACT_ADDRESS, amount],
        });

        toast({
          title: '⏳ Aprobación enviada',
          description: (
            <div className="space-y-2">
              <p>Esperando confirmación de la aprobación...</p>
                          <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Hash:</span>
              <a 
                href={getCeloscanUrl(approveTx)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 hover:text-blue-800 hover:bg-gray-200 transition-colors"
              >
                {approveTx.slice(0, 10)}...{approveTx.slice(-8)}
              </a>
            </div>
            </div>
          ),
          duration: 5000,
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
            title: '❌ Error en la aprobación',
            description: (
              <div className="space-y-2">
                <p>La transacción de aprobación falló.</p>
                <p className="text-xs text-gray-500">
                  Verifica que tengas suficiente gas y que tu wallet esté conectada.
                </p>
              </div>
            ),
            variant: 'destructive',
            duration: 10000,
          });
          return;
        }
      }
      const addFundsTx = await writeContractAsync({
        abi: SUBSIDY_CONTRACT_ABI,
        address: SUBSIDY_CONTRACT_ADDRESS,
        functionName: 'addFunds',
        args: [amount],
      });

      toast({
        title: '🎉 ¡Fondos donados exitosamente!',
        description: (
          <div className="space-y-2">
            <p>Tu donación ha sido procesada correctamente.</p>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Hash:</span>
              <a 
                href={getCeloscanUrl(addFundsTx)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 hover:text-blue-800 hover:bg-gray-200 transition-colors"
              >
                {addFundsTx.slice(0, 10)}...{addFundsTx.slice(-8)}
              </a>
            </div>
          </div>
        ),
        duration: 8000,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: '❌ Error al donar fondos',
        description: (
          <div className="space-y-2">
            <p className="text-sm">{error.message}</p>
            <p className="text-xs text-gray-500">
              Verifica que tengas suficiente gas y tokens para donar.
            </p>
          </div>
        ),
        variant: 'destructive',
        duration: 10000,
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
