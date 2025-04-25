import { Table,  TableBody,  TableCell,  TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBuiltGraphSDK } from '@/../.graphclient';
import { useQuery } from '@tanstack/react-query';
import { formatUnits, slice } from 'viem';

const sdk = getBuiltGraphSDK();

function Dashboard() {
  const result = useQuery({ queryKey: ['Beneficiaries'], queryFn: () => sdk.Beneficiaries() });

  const { data } = result;
  console.log(data);

  return (
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
        {data?.beneficiaries.map((beneficiary) => (
          <TableRow key={beneficiary.id}>
            <TableCell className='cursor-pointer' onClick={() => navigator.clipboard.writeText(beneficiary.id)}>
              {slice(beneficiary.id, 0, 2)}...
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
  );
}

export default Dashboard;
