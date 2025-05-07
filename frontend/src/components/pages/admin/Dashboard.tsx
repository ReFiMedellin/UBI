import { Table,  TableBody,  TableCell,  TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBuiltGraphSDK } from '@/../.graphclient';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { Card } from '@/components/ui/card';

const sdk = getBuiltGraphSDK();

function Dashboard() {
  const result_beneficiaries = useQuery({ queryKey: ['Beneficiaries'], queryFn: () => sdk.Beneficiaries() });
  const result_funds = useQuery({ queryKey: ['Funds'], queryFn: () => sdk.Funds() });

  const { data: data_beneficiaries } = result_beneficiaries;
  const { data: data_funds } = result_funds;
  const funds = data_funds?.funds_collection[0]

  return (
    <Card className='w-full p-[5px]'>
    <div className='overflow-auto max-h-[80%]'>
    <Table>
      <TableHeader className='sticky top-0 bg-background'>
        <TableRow>
          <TableHead className='font-bold'>Dirección</TableHead>
          <TableHead className='font-bold'>Activo</TableHead>
          <TableHead className='font-bold'>Fecha añadido</TableHead>
          <TableHead className='font-bold'>Fecha eliminado</TableHead>
          <TableHead className='text-right font-bold'>Total Reclamado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='text-left'>
        {data_beneficiaries?.beneficiaries.map((beneficiary) => (
          <TableRow key={beneficiary.id}>
            <TableCell className='cursor-pointer' onClick={() => navigator.clipboard.writeText(beneficiary.id)}>
              {String(beneficiary.id).slice(0, 7)}...{String(beneficiary.id).slice(-5)}
            </TableCell>
            <TableCell>{beneficiary.isActive ? "Sí" : "No"}</TableCell>
            <TableCell>{(new Date(beneficiary.dateAdded * 1000)).toLocaleDateString()}</TableCell>
            <TableCell>{beneficiary.dateRemoved ? 
              (new Date(beneficiary.dateRemoved*1000)).toLocaleDateString()
            : "-"}</TableCell>
            <TableCell className='text-right'>{new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(Number(formatUnits(beneficiary.totalClaimed, 18)))}</TableCell>
          </TableRow>
        ))

        }
      </TableBody>
    </Table>
    </div>
    {/* Recuento de fondos */}
  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
    </Card>
  );
}

export default Dashboard;
