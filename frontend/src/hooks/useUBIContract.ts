import { UBI_CONTRACT_ABI, UBI_CONTRACT_ADDRESS } from '@/constants'
import { useReadContracts } from 'wagmi'

function useUBIContract(address?: string) {

    const { data } = useReadContracts({
        contracts: [
            {
                address: UBI_CONTRACT_ADDRESS,
                abi: UBI_CONTRACT_ABI,
                functionName: "isBeneficiary",
                args: [address as `0x${string}`],
            },
            {
                address: UBI_CONTRACT_ADDRESS,
                abi: UBI_CONTRACT_ABI,
                functionName: "addressToUser",
                args: [address as `0x${string}`],
            },
            {
                address: UBI_CONTRACT_ADDRESS,
                abi: UBI_CONTRACT_ABI,
                functionName: "subsidyClaimInterval",
            },
            {
                address: UBI_CONTRACT_ADDRESS,
                abi: UBI_CONTRACT_ABI,
                functionName: "subsidyClaimableAmount",
            },
        ],
    })
    const isWhiteListed = data?.[0].result ?? false
    const [lastClaimed, totalClaimed] = data?.[1].result ?? [0n, 0n]
    const claimInterval = data?.[2].result ?? 0n
    const valueToClaim = data?.[3].result ?? 0n
    const isAbleToClaim = (Date.now() / 1000) - Number(lastClaimed) >= claimInterval

    return { isWhiteListed, lastClaimed, totalClaimed, claimInterval, valueToClaim, isAbleToClaim }



}

export default useUBIContract