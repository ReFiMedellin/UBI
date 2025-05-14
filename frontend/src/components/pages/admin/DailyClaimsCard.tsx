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
    <div className="flex flex-col h-full gap-4 overflow-auto py-2">
      <Card className="w-full h-full flex flex-col mt">
        <CardHeader>
          <CardTitle>Análisis</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full p-6 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
            <div>
              <h3 className="text-lg font-semibold mb-4">Reclamos Diarios</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={chartData}>
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      tickMargin={10}
                    />
                    <YAxis
                      tickLine={false}
                      tickMargin={10}
                      tickFormatter={(value: number) => `${value}`}
                      domain={[0, Math.ceil(maxClaims * 1.1)]}
                    />
                    <Tooltip labelFormatter={(label) => {
                      const dataPoint = chartData.find(d => d.date === label);
                      return dataPoint?.fullDate || label;
                    }}/>
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
            {/* Space reserved for future chart */}
            <div className='flex justify-center items-center col-start-2 col-span-2 border-2 border-dashed rounded-[12px] border-[#a1a1aa] h-full w-full'>
                <p className='text-2xl font-bold'>Se integrara pronto!</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4">
            <div className="p-4 border rounded-md shadow-sm">
              <p className="text-muted-foreground">Total aportado</p>
              <p className="font-bold">
                {new Intl.NumberFormat(
                  "es-CO", { style: "currency", currency: "COP" }
                ).format(Number(formatUnits(funds ? funds.totalSupplied : 0, 18)))}
              </p>
            </div>
            <div className="p-4 border rounded-md shadow-sm">
              <p className="text-muted-foreground">Total retirado</p>
              <p className="font-bold">
                {new Intl.NumberFormat(
                  "es-CO", { style: "currency", currency: "COP" }
                ).format(Number(formatUnits(funds ? funds.totalWithdrawn : 0, 18)))}
              </p>
            </div>
            <div className="p-4 border rounded-md shadow-sm">
              <p className="text-muted-foreground">Total reclamado</p>
              <p className="font-bold">
                {new Intl.NumberFormat(
                  "es-CO", { style: "currency", currency: "COP" }
                ).format(Number(formatUnits(funds ? funds.totalClaimed : 0, 18)))}
              </p>
            </div>
            <div className="p-4 border rounded-md shadow-sm">
              <p className="text-muted-foreground">Balance actual</p>
              <p className="font-bold">
                {new Intl.NumberFormat(
                  "es-CO", { style: "currency", currency: "COP" }
                ).format(Number(formatUnits(funds ? funds.contractBalance : 0, 18)))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DailyClaimsCard 