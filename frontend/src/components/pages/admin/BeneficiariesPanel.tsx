import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBuiltGraphSDK } from '@/../.graphclient';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMemo, useState } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

function BeneficiariesPanel() {
  type beneficiary_fields = 'id' | 'dateAdded' | 'dateRemoved' | 'isActive' | 'totalClaimed';
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{key: beneficiary_fields; direction: 'asc' | 'desc' } | null>(null);
  const [activeTab, setActiveTab] = useState<'resumen' | 'tabla'>('resumen');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [dateRange, setDateRange] = useState<{from: Date | undefined; to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  // Nuevo filtro de umbral
  const [amountThreshold, setAmountThreshold] = useState<string>('');
  const [amountComparison, setAmountComparison] = useState<'gt' | 'lt'>('gt');

  const sdk = getBuiltGraphSDK();
  const result_beneficiaries = useQuery({ queryKey: ['Beneficiaries'], queryFn: () => sdk.Beneficiaries() });
  const { data: data_beneficiaries } = result_beneficiaries;

  // Fetch all DailyClaims (up to 1000 for safety)
  const result_dailyClaims = useQuery({ queryKey: ['AllDailyClaims'], queryFn: () => sdk.DailyClaims() });
  const { data: data_dailyClaims } = result_dailyClaims;

  // Calculate most common claim interval in days
  const mostCommonInterval = useMemo(() => {
    if (!data_dailyClaims?.dailyClaims) return null;
    const beneficiaryClaims: Record<string, number[]> = {};
    for (const dailyClaim of data_dailyClaims.dailyClaims) {
      if (!dailyClaim.beneficiaries) continue;
      for (const beneficiary of dailyClaim.beneficiaries) {
        if (!beneficiaryClaims[beneficiary]) beneficiaryClaims[beneficiary] = [];
        beneficiaryClaims[beneficiary].push(Number(dailyClaim.date));
      }
    }
    const intervals: number[] = [];
    for (const dates of Object.values(beneficiaryClaims)) {
      if (dates.length < 2) continue;
      dates.sort((a, b) => a - b);
      const interval = Math.round((dates[dates.length - 1] - dates[0]) / (dates.length - 1) / 86400);
      if (interval > 0) intervals.push(interval);
    }
    if (intervals.length === 0) return null;
    const freq: Record<number, number> = {};
    for (const interval of intervals) {
      freq[interval] = (freq[interval] || 0) + 1;
    }
    return Number(Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]);
  }, [data_dailyClaims?.dailyClaims]);

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

  const filteredBeneficiaries = useMemo(() => {
    if (!sortedBeneficiaries) return [];
    
    return sortedBeneficiaries.filter(beneficiary => {
      // Search filter
      if (searchQuery && !beneficiary.id.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        const isActive = beneficiary.isActive;
        if (statusFilter === 'active' && !isActive) return false;
        if (statusFilter === 'inactive' && isActive) return false;
      }
      
      // Date range filter
      if (dateRange.from || dateRange.to) {
        const addedDate = new Date(beneficiary.dateAdded * 1000);
        if (dateRange.from && addedDate < dateRange.from) return false;
        if (dateRange.to && addedDate > dateRange.to) return false;
      }
      
      // Filtro de umbral de monto reclamado
      if (amountThreshold !== '') {
        const claimed = Number(formatUnits(beneficiary.totalClaimed, 18));
        const threshold = Number(amountThreshold);
        if (amountComparison === 'gt' && !(claimed > threshold)) return false;
        if (amountComparison === 'lt' && !(claimed < threshold)) return false;
      }
      
      return true;
    });
  }, [sortedBeneficiaries, searchQuery, statusFilter, dateRange, amountThreshold, amountComparison]);

  const requestSort = (key: beneficiary_fields) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig?.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  }

  const SortIcon = () => {
    return <ArrowUpDown className='inline ml-1 w-4 h-4 relative top-[0.5px]'/>
  };

  return (
    <div className='flex flex-col items-center justify-center max-w-[90vw] overflow-auto'>
      <Card className="w-full bg-white shadow-md rounded-xl border border-gray-200 p-0">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b p-6 mb-4">
          <div>
            <CardTitle className="text-lg md:text-xl font-bold text-gray-800">Beneficiarios</CardTitle>
            <CardDescription className="text-sm text-gray-500">Consulta el listado de beneficiarios, su estado y estadísticas de participación.</CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'resumen' | 'tabla')}>
            <TabsList className="bg-gray-100 rounded-xl p-1">
              <TabsTrigger value="resumen" className="tab-button data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 rounded-lg transition-colors px-4">Resumen</TabsTrigger>
              <TabsTrigger value="tabla" className="tab-button data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 rounded-lg transition-colors px-4">Tabla</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="md:min-w-[650px] w-full">
            {activeTab === 'resumen' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-0 w-full mb-4 py-6">
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 h-full flex flex-col justify-center items-center">
                    <p className="text-gray-500">Beneficiarios activos</p>
                    <p className="font-bold text-lg text-gray-800">
                      {sortedBeneficiaries.filter(b => b.isActive).length}
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 h-full flex flex-col justify-center items-center">
                    <p className="text-gray-500">Promedio reclamado por beneficiario</p>
                    <p className="font-bold text-lg text-gray-800">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                        sortedBeneficiaries.length > 0
                          ? sortedBeneficiaries.reduce((acc, b) => acc + Number(formatUnits(b.totalClaimed, 18)), 0) / sortedBeneficiaries.length
                          : 0
                      )}
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 h-full flex flex-col justify-center items-center">
                    <p className="text-gray-500 mb-1 font-medium">Intervalo de reclamo más común</p>
                    <p className="font-bold text-lg text-gray-800">
                      {mostCommonInterval !== null ? `${mostCommonInterval} días` : 'Cargando...'}
                    </p>
                  </div>
                </div>
                {/* Leaderboard */}
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 w-full">
                  <p className="text-gray-500 mb-2 font-medium">Top 5 beneficiarios por monto reclamado</p>
                  <ol className="space-y-1">
                    {sortedBeneficiaries
                      .slice()
                      .sort((a, b) => Number(BigInt(b.totalClaimed) - BigInt(a.totalClaimed)))
                      .slice(0, 5)
                      .map((b, _) => (
                        <li key={b.id} className="flex justify-between items-center text-gray-800">
                          <span
                            className="font-mono text-sm cursor-pointer hover:underline"
                            onClick={() => {
                              navigator.clipboard.writeText(b.id);
                              toast({ title: 'Dirección copiada al portapapeles' });
                            }}
                          >
                            {String(b.id).slice(0, 7)}...{String(b.id).slice(-5)}
                          </span>
                          <span className="font-bold text-sm">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(formatUnits(b.totalClaimed, 18)))}</span>
                        </li>
                      ))}
                  </ol>
                </div>
              </>
            )}
            {activeTab === 'tabla' && (
              <div className="w-full">
                <div className="flex flex-col md:flex-row gap-2 mb-4 w-full">
                  <div className="relative w-full md:w-[240px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar por dirección..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="w-full md:w-[120px]">
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Activos</SelectItem>
                        <SelectItem value="inactive">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-auto">
                    <DatePicker
                      date={dateRange.from}
                      onSelect={(date: Date | undefined) => setDateRange(prev => ({ ...prev, from: date }))}
                      placeholder="Desde"
                      disabled={{ after: new Date() }}
                      className="w-full"
                    />
                  </div>
                  <div className="w-full md:w-auto">
                    <DatePicker
                      date={dateRange.to}
                      onSelect={(date: Date | undefined) => setDateRange(prev => ({ ...prev, to: date }))}
                      placeholder="Hasta"
                      disabled={{ after: new Date() }}
                      className="w-full"
                    />
                  </div>
                  {/* Filtro de umbral de monto reclamado */}
                  <div className="flex w-full md:w-auto gap-2 items-center">
                    <Select value={amountComparison} onValueChange={v => setAmountComparison(v as 'gt' | 'lt')}>
                      <SelectTrigger className="w-full md:w-[110px]">
                        <SelectValue>{amountComparison === 'gt' ? 'Más de' : 'Menos de'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gt">Más de</SelectItem>
                        <SelectItem value="lt">Menos de</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative w-full md:w-[140px]">
                      <Input
                        type="number"
                        min="0"
                        step="10000"
                        placeholder="Monto en COP"
                        value={amountThreshold}
                        onChange={e => setAmountThreshold(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 w-full overflow-x-auto overflow-y-auto max-h-[65vh]">
                  <Table className="w-full min-w-[700px]">
                    <TableHeader className='sticky top-0 bg-white rounded-t-xl'>
                      <TableRow>
                        <TableHead onClick={() => requestSort('id')} className='font-bold cursor-pointer min-w-[100px]'>
                          Dirección { SortIcon() }
                        </TableHead>
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
                      {filteredBeneficiaries.map((beneficiary) => (
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BeneficiariesPanel; 