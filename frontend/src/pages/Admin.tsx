import BeneficiariesCard from '@/components/pages/admin/BeneficiariesCard';
import FundsCard from '@/components/pages/admin/FundsCard';
import Dashboard from '@/components/pages/admin/Dashboard';


function AdminPanel() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 h-full gap-4 md:gap-10 p-4 md:p-0'>
      <div className='flex flex-col h-full w-full col-start-1 gap-4 md:gap-10 col-span-1'>
        <BeneficiariesCard />
        <FundsCard />
      </div>
      <div className='flex justify-center col-span-1 md:col-start-2 md:col-span-2 h-[75vh] w-full'>
        <Dashboard />
      </div>
    </div>
  );
}

export default AdminPanel;
