import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBuiltGraphSDK } from '@/../.graphclient';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const sdk = getBuiltGraphSDK();

function DailyClaimsCard() {
  const { data: data_claims } = useQuery({ 
    queryKey: ['DailyClaims'], 
    queryFn: () => sdk.DailyClaims() 
  });

  const { data: data_funds } = useQuery({ 
    queryKey: ['Funds'], 
    queryFn: () => sdk.Funds() 
  });

  const funds = data_funds?.funds_collection[0];

  const chartData = data_claims?.dailyClaims.map(claim => ({
    date: new Date(Number(claim.date) * 1000).toLocaleDateString('es-CO', { month: 'numeric', day: 'numeric' }),
    fullDate: new Date(Number(claim.date) * 1000).toLocaleDateString(),
    claims: Number(claim.totalClaims),
    amount: Number(formatUnits(claim.totalAmount, 18))
  })).reverse() || [];

  const maxClaims = Math.max(...chartData.map(d => d.claims));

  return (
    <div className="w-full flex flex-col h-full gap-4 overflow-auto py-2">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle>Análisis</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-shrink-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reclamos Diarios</h3>
              <div className="h-[200px] md:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      tickMargin={10}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      tickMargin={10}
                      tickFormatter={(value: number) => `${value}`}
                      domain={[0, Math.ceil(maxClaims * 1.1)]}
                      fontSize={12}
                    />
                    <Tooltip 
                      labelFormatter={(label) => {
                        const dataPoint = chartData.find(d => d.date === label);
                        return dataPoint?.fullDate || label;
                      }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="claims"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      name="Reclamos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center justify-center min-h-[200px] md:min-h-[250px] border-2 border-dashed rounded-lg">
              <p className="text-lg md:text-2xl font-semibold text-muted-foreground text-center">¡Se integrará pronto!</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Card className="p-4 border shadow-sm">
              <p className="text-muted-foreground text-sm">Total aportado</p>
              <p className="font-bold text-base md:text-lg mt-1">
                {new Intl.NumberFormat(
                  "es-CO", { style: "currency", currency: "COP" }
                ).format(Number(formatUnits(funds ? funds.totalSupplied : 0, 18)))}
              </p>
            </Card>
            <Card className="p-4 border shadow-sm">
              <p className="text-muted-foreground text-sm">Total retirado</p>
              <p className="font-bold text-base md:text-lg mt-1">
                {new Intl.NumberFormat(
                  "es-CO", { style: "currency", currency: "COP" }
                ).format(Number(formatUnits(funds ? funds.totalWithdrawn : 0, 18)))}
              </p>
            </Card>
            <Card className="p-4 border shadow-sm">
              <p className="text-muted-foreground text-sm">Total reclamado</p>
              <p className="font-bold text-base md:text-lg mt-1">
                {new Intl.NumberFormat(
                  "es-CO", { style: "currency", currency: "COP" }
                ).format(Number(formatUnits(funds ? funds.totalClaimed : 0, 18)))}
              </p>
            </Card>
            <Card className="p-4 border shadow-sm">
              <p className="text-muted-foreground text-sm">Balance actual</p>
              <p className="font-bold text-base md:text-lg mt-1">
                {new Intl.NumberFormat(
                  "es-CO", { style: "currency", currency: "COP" }
                ).format(Number(formatUnits(funds ? funds.contractBalance : 0, 18)))}
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DailyClaimsCard 