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
        <div className="text-center space-y-3">
          <div className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-purple-700 p-4 rounded-lg">
            Lo sentimos, aún no eres beneficiario
          </div>
          <Button variant='link' asChild className="text-base">
            <a target='_blank' href='https://tinyurl.com/ReFiMedUBIRequest'>
              Registrate aquí
            </a>
          </Button>
        </div>
      );
    else if (isAbleToClaim)
      return (
        <span className="text-gray-200 text-center block">
          Puedes reclamar tu subsidio cada {claimIntervalInDays} días.
        </span>
      );
    else
      return (
        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            Ya reclamaste el subsidio de esta semana.
          </div>
          <div className="text-sm text-gray-300 mt-1">
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
