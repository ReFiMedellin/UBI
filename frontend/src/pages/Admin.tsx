import BeneficiariesCard from '@/components/pages/admin/BeneficiariesCard';
import FundsCard from '@/components/pages/admin/FundsCard';

function AdminPanel() {
  return (
    <div className='grid grid-cols-3 h-[80vh]'>
      <div className='flex flex-col h-full w-full col-start-1 col-span-1'>
        <BeneficiariesCard />
        <FundsCard />
      </div>
      <div className='flex justify-center items-center col-start-2 col-span-2 border-2 border-dashed rounded-[12px] border-[#a1a1aa] h-full w-full'>
        <p className='text-4xl font-bold'>Se integrara pronto!</p>
      </div>
    </div>
  );
}

export default AdminPanel;
