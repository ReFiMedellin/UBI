import { secondsToDays } from "@/utils"

type HeaderProps = {
  isWhiteListed: boolean;
  isAbleToClaim: boolean;
  lastClaimed: bigint;
  claimInterval: bigint;
  valueToClaim: bigint;
}

function Header({ isWhiteListed, isAbleToClaim, lastClaimed, claimInterval, valueToClaim }: HeaderProps) {
  const getHeaderMessage = () => {
    if (!isWhiteListed) {
      return "Lo sentimos, aún no eres beneficiario"
    } else if (isAbleToClaim) {
      return `Monto disponible para reclamar: $${valueToClaim} cCop`
    } else {
      const secondsSinceLastClaimed = (Date.now() / 1000) - Number(lastClaimed)
      const daysLeft = secondsToDays(Number(claimInterval) - secondsSinceLastClaimed)
      return `Puedes reclamar tu subsidio dentro de ${daysLeft} días`
    }
  }

  return (
    <h2 className="text-xl font-semibold">{ getHeaderMessage() }</h2>
  )
}

export default Header
