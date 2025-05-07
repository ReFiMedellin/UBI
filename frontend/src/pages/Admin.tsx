import BeneficiariesCard from '@/components/pages/admin/BeneficiariesCard';
import FundsCard from '@/components/pages/admin/FundsCard';
import Dashboard from '@/components/pages/admin/Dashboard';


function AdminPanel() {
  return (
    <div className='grid grid-cols-3 h-full gap-10'>
      <div className='flex flex-col h-full w-full col-start-1  gap-10 col-span-1'>
        <BeneficiariesCard />
        <FundsCard />
      </div>
      <div className='flex justify-center col-start-2 col-span-2 max-h-[75vh] w-full'>
        <Dashboard />
      </div>
    </div>
  );
}

export default AdminPanel;
