import { Table,  TableBody,  TableCell,  TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBuiltGraphSDK } from '@/../.graphclient';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import DailyClaimsCard from './DailyClaimsCard';

const sdk = getBuiltGraphSDK();

function Dashboard() {
  type beneficiary_fields = 'id' | 'dateAdded' | 'dateRemoved' | 'isActive' | 'totalClaimed';
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{key: beneficiary_fields; direction: 'asc' | 'desc' } | null>(null);

  const result_beneficiaries = useQuery({ queryKey: ['Beneficiaries'], queryFn: () => sdk.Beneficiaries() });
  const { data: data_beneficiaries } = result_beneficiaries;

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

  const SortIcon = () => {
    return <ArrowUpDown className='inline ml-1 w-4 h-4 relative top-[0.5px]'/>;
  };

  return (
    <Tabs defaultValue="claims" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2 p-2 gap-x-1 tabline">
        <TabsTrigger value="claims" className="tab-button">Fondos</TabsTrigger>
        <TabsTrigger value="beneficiaries" className="tab-button">Beneficiarios</TabsTrigger>
      </TabsList>
      <TabsContent value="beneficiaries" className="max-h-[92%]">
        <Card className='w-full h-full flex flex-col mt-2'>
          <div className='flex-1 overflow-auto p-[5px]'>
            <Table>
              <TableHeader className='sticky top-0 bg-background'>
                <TableRow>
                  <TableHead className='font-bold min-w-[100px]'>Dirección</TableHead>
                  <TableHead onClick={() => requestSort('isActive')} className='font-bold cursor-pointer min-w-[80px]'>
                    Activo { SortIcon() }
                  </TableHead>
                  <TableHead onClick={() => requestSort('dateAdded')} className='font-bold cursor-pointer min-w-[120px]'>
                    Fecha añadido { SortIcon() }
                  </TableHead>
                  <TableHead onClick={() => requestSort('dateRemoved')} className='font-bold cursor-pointer min-w-[120px]'>
                    Fecha eliminado { SortIcon() }
                  </TableHead>
                  <TableHead onClick={() => requestSort('totalClaimed')} className='text-right font-bold cursor-pointer min-w-[150px]'>
                    Total Reclamado { SortIcon() }
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='text-left'>
                {sortedBeneficiaries.map((beneficiary) => (
                  <TableRow key={beneficiary.id}>
                    <TableCell className='cursor-pointer whitespace-nowrap' onClick={() => {
                      navigator.clipboard.writeText(beneficiary.id);
                      toast({ title: 'Dirección copiada al portapapeles'})
                    }}>
                      {String(beneficiary.id).slice(0, 7)}...{String(beneficiary.id).slice(-5)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap'>{beneficiary.isActive ? "Sí" : "No"}</TableCell>
                    <TableCell className='whitespace-nowrap'>{(new Date(beneficiary.dateAdded * 1000)).toLocaleDateString()}</TableCell>
                    <TableCell className='whitespace-nowrap'>{beneficiary.dateRemoved ? 
                      (new Date(beneficiary.dateRemoved*1000)).toLocaleDateString()
                    : "-"}</TableCell>
                    <TableCell className='text-right whitespace-nowrap'>{new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(Number(formatUnits(beneficiary.totalClaimed, 18)))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t text-sm">
            <div className="p-4 border rounded-md shadow-sm">
              <p className="text-muted-foreground">Beneficiarios activos</p>
              <p className="font-bold text-lg">
                {sortedBeneficiaries.filter(b => b.isActive).length}
              </p>
            </div>
            <div className="p-4 border rounded-md shadow-sm">
              <p className="text-muted-foreground">Promedio reclamado por beneficiario</p>
              <p className="font-bold text-lg">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                  sortedBeneficiaries.length > 0
                    ? sortedBeneficiaries.reduce((acc, b) => acc + Number(formatUnits(b.totalClaimed, 18)), 0) / sortedBeneficiaries.length
                    : 0
                )}
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="claims" className="flex-1">
        <DailyClaimsCard />
      </TabsContent>
    </Tabs>
  );
}

export default Dashboard;
