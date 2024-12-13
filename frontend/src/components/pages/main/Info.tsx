import { CardContent } from "@/components/ui/card"
import { formatUnits } from "viem";

type InfoProps = {
  isWhiteListed: boolean;
  lastClaimed: bigint;
  totalClaimed: bigint;
}

function Info({ isWhiteListed, lastClaimed, totalClaimed}: InfoProps) {
  const lastClaimedDate = new Date(Number(lastClaimed) * 1000)
  return (
    <CardContent>
      <p>Última reclamación: { isWhiteListed ? lastClaimedDate.toLocaleDateString("es-CO") : "N/A"}</p>
      <p>Total reclamado: { isWhiteListed ?  new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(Number(formatUnits(totalClaimed, 18))) : "$ 0" } cCop</p>
    </CardContent>
  )
}

export default Info
