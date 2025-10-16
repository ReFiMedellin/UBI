import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { secondsToDays } from '@/utils';

type DescriptionProps = {
  isWhiteListed: boolean;
  isAbleToClaim: boolean;
  lastClaimed: bigint;
  claimInterval: bigint;
};

function Description({
  isWhiteListed,
  isAbleToClaim,
  lastClaimed,
  claimInterval,
}: DescriptionProps) {
  const secondsSinceLastClaimed = Date.now() / 1000 - Number(lastClaimed);
  const daysLeft = secondsToDays(
    Number(claimInterval) - secondsSinceLastClaimed
  );
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
      return (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            Ya reclamaste el subsidio de esta semana.
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Regresa en {daysLeft} días para reclamar de nuevo.
          </div>
        </div>
      );
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
