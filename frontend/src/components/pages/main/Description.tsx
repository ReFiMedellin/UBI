import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { secondsToDays } from '@/utils';
import { formatUnits } from 'viem';

type DescriptionProps = {
  isWhiteListed: boolean;
  isAbleToClaim: boolean;
  claimInterval: bigint;
  valueToClaim: bigint;
};

function Description({
  isWhiteListed,
  isAbleToClaim,
  claimInterval,
  valueToClaim,
}: DescriptionProps) {
  const getClaimMessage = () => {
    if (!isWhiteListed)
      return (
        <Button variant='link' asChild>
          <a target='_blank' href='#'>
            Registrate aquí
          </a>
        </Button>
      );
    else if (isAbleToClaim)
      return `Puedes reclamar tu subsidio cada ${claimIntervalInDays} días.`;
    else
      return `Monto a reclamar:  ${new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(Number(formatUnits(valueToClaim, 18)))} cCop`;
  };

  const claimIntervalInDays = secondsToDays(Number(claimInterval));
  const message = getClaimMessage();

  return (
    <CardHeader>
      <CardTitle>{message}</CardTitle>
    </CardHeader>
  );
}

export default Description;
