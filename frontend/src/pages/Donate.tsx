import UserFundsCard from '@/components/pages/main/UserFundsCard';

function DonatePage() {
    return (
        <div className='flex flex-col items-center justify-center overflow-auto'>
            <UserFundsCard />
            <p className='text-md font-semibold text-black-600 mt-4'>Recuerda que esta donación es voluntaria y no se puede retirar.</p>
        </div>
    );
}

export default DonatePage;