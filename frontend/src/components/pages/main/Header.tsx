import { secondsToDays } from '@/utils';
import { formatUnits } from 'viem';

type HeaderProps = {
  isWhiteListed: boolean;
  isAbleToClaim: boolean;
  lastClaimed: bigint;
  claimInterval: bigint;
  valueToClaim: bigint;
};

function Header({
  isWhiteListed,
  isAbleToClaim,
  lastClaimed,
  claimInterval,
  valueToClaim,
}: HeaderProps) {
  const getHeaderMessage = () => {
    if (!isWhiteListed) {
      return (
        <div className="text-center space-y-3">
          <div className="text-base text-gray-700 leading-relaxed">
            <p className="mb-2">
              El Programa de Subsidios ReFi Colombia es una iniciativa que proporciona subsidios periódicos en cCOP 
              (Celo Colombian Peso) a beneficiarios elegibles en la red Celo.
            </p>
            <p>
              Los beneficiarios pueden reclamar su subsidio cada cierto intervalo de tiempo, contribuyendo así 
              a la inclusión financiera y el acceso a servicios descentralizados.
            </p>
          </div>
          <div className="text-lg font-semibold text-gray-900 mt-4">
            Lo sentimos, aún no eres beneficiario
          </div>
        </div>
      );
    } else if (isAbleToClaim) {
      return `Monto disponible para reclamar: ${new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(Number(formatUnits(valueToClaim, 18)))} cCop`;
    } else {
      const secondsSinceLastClaimed = Date.now() / 1000 - Number(lastClaimed);
      const daysLeft = secondsToDays(
        Number(claimInterval) - secondsSinceLastClaimed
      );
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
    }
  };

  return <h2 className='text-xl font-semibold'>{getHeaderMessage()}</h2>;
}

export default Header;
