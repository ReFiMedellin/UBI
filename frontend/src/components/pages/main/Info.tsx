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
    <CardContent className="space-y-3 text-center">
      <p className="text-gray-200">
        <span className="font-medium">Última reclamación:</span> { isWhiteListed ? lastClaimedDate.toLocaleDateString("es-CO") : "N/A"}
      </p>
      <p className="text-gray-200">
        <span className="font-medium">Total reclamado:</span> { isWhiteListed ?  new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(Number(formatUnits(totalClaimed, 18))) : "$ 0" } cCop
      </p>
    </CardContent>
  )
}

export default Info
