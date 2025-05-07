import { Table,  TableBody,  TableCell,  TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBuiltGraphSDK } from '@/../.graphclient';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

const sdk = getBuiltGraphSDK();

function Dashboard() {
  type beneficiary_fields = 'id' | 'dateAdded' | 'dateRemoved' | 'isActive' | 'totalClaimed';
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{key: beneficiary_fields; direction: 'asc' | 'desc' } | null>(null);


  const result_beneficiaries = useQuery({ queryKey: ['Beneficiaries'], queryFn: () => sdk.Beneficiaries() });
  const result_funds = useQuery({ queryKey: ['Funds'], queryFn: () => sdk.Funds() });

  const { data: data_beneficiaries } = result_beneficiaries;
  const { data: data_funds } = result_funds;
  const funds = data_funds?.funds_collection[0];

  const sortedBeneficiaries = useMemo(() => {
    if (!data_beneficiaries?.beneficiaries) return [];
    const sorted = [...data_beneficiaries.beneficiaries];
    if (sortConfig !== null) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'totalClaimed') {
          aVal = BigInt(aVal || 0);
          bVal = BigInt(bVal || 0);
        }
        if (aVal === bVal) return 0;
        if (sortConfig.direction === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
    return sorted;
  }, [data_beneficiaries?.beneficiaries, sortConfig]);

  const requestSort = (key: beneficiary_fields) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig?.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  }

  console.log(data_beneficiaries?.beneficiaries[0])

  const SortIcon = () => {
    return <ArrowUpDown className='inline ml-1 w-4 h-4 relative top-[0.5px]'/>;
  };

  return (
    <Card className='w-full p-[5px]'>
    <div className='overflow-auto max-h-[80%]'>
    <Table>
      <TableHeader className='sticky top-0 bg-background'>
        <TableRow>
          <TableHead className='font-bold'>Dirección</TableHead>
          <TableHead onClick={() => requestSort('isActive')} className='font-bold cursor-pointer'>
            Activo { SortIcon() }
          </TableHead>
          <TableHead onClick={() => requestSort('dateAdded')} className='font-bold cursor-pointer'>
            Fecha añadido { SortIcon() }
          </TableHead>
          <TableHead onClick={() => requestSort('dateRemoved')} className='font-bold cursor-pointer'>
            Fecha eliminado { SortIcon() }
          </TableHead>
          <TableHead onClick={() => requestSort('totalClaimed')} className='text-right font-bold cursor-pointer'>
            Total Reclamado { SortIcon() }
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='text-left'>
        {sortedBeneficiaries.map((beneficiary) => (
          <TableRow key={beneficiary.id}>
            <TableCell className='cursor-pointer' onClick={() => {
              navigator.clipboard.writeText(beneficiary.id);
              toast({ title: 'Dirección copiada al portapapeles'})
            }}>
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
