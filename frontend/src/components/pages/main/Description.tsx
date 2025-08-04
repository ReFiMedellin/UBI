import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { secondsToDays } from '@/utils';

type DescriptionProps = {
  isWhiteListed: boolean;
  isAbleToClaim: boolean;
  claimInterval: bigint;
};

function Description({
  isWhiteListed,
  isAbleToClaim,
  claimInterval,
}: DescriptionProps) {
  const getClaimMessage = () => {
    if (!isWhiteListed)
      return (
        <Button variant='link' asChild>
          <a target='_blank' href='https://tinyurl.com/ReFiMedUBIRequest'>
            Registrate aquí
          </a>
        </Button>
      );
    else if (isAbleToClaim)
      return `Puedes reclamar tu subsidio cada ${claimIntervalInDays} días.`;
    else
      return `Ya has reclamado tu subsidio. Regresa en ${claimIntervalInDays} días para reclamar de nuevo.`;
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
