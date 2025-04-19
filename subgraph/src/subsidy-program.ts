import {
  BeneficiaryAdded as BeneficiaryAddedEvent,
  BeneficiaryRemoved as BeneficiaryRemovedEvent,
  ClaimIntervalSet as ClaimIntervalSetEvent,
  ClaimableAmountSet as ClaimableAmountSetEvent,
  FundsAdded as FundsAddedEvent,
  FundsWithdrawed as FundsWithdrawedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SubsidyClaimed as SubsidyClaimedEvent,
  TokenAddressSet as TokenAddressSetEvent
} from "../generated/SubsidyProgram/SubsidyProgram"
import {
  BeneficiaryAdded,
  BeneficiaryRemoved,
  ClaimIntervalSet,
  ClaimableAmountSet,
  FundsAdded,
  FundsWithdrawed,
  OwnershipTransferred,
  SubsidyClaimed,
  TokenAddressSet
} from "../generated/schema"

export function handleBeneficiaryAdded(event: BeneficiaryAddedEvent): void {
  let entity = new BeneficiaryAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beneficiaryAddress = event.params.beneficiaryAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBeneficiaryRemoved(event: BeneficiaryRemovedEvent): void {
  let entity = new BeneficiaryRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beneficiaryAddress = event.params.beneficiaryAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClaimIntervalSet(event: ClaimIntervalSetEvent): void {
  let entity = new ClaimIntervalSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.interval = event.params.interval

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClaimableAmountSet(event: ClaimableAmountSetEvent): void {
  let entity = new ClaimableAmountSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsAdded(event: FundsAddedEvent): void {
  let entity = new FundsAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount
  entity.contractBalance = event.params.contractBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsWithdrawed(event: FundsWithdrawedEvent): void {
  let entity = new FundsWithdrawed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amountWithdrawed = event.params.amountWithdrawed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubsidyClaimed(event: SubsidyClaimedEvent): void {
  let entity = new SubsidyClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beneficiaryAddress = event.params.beneficiaryAddress
  entity.amount = event.params.amount
  entity.contractBalance = event.params.contractBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenAddressSet(event: TokenAddressSetEvent): void {
  let entity = new TokenAddressSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenAddress = event.params.tokenAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
