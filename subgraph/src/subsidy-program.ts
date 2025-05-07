import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BeneficiaryAdded as BeneficiaryAddedEvent,
  BeneficiaryRemoved as BeneficiaryRemovedEvent,
  SubsidyClaimed as SubsidyClaimedEvent,
  FundsAdded as FundsAddedEvent,
  FundsWithdrawed as FundsWithdrawedEvent,
} from "../generated/SubsidyProgram/SubsidyProgram"
import {
  Beneficiary,
  Funds,
} from "../generated/schema"

function getOrCreateFunds(address: Address): Funds {
  let funds = Funds.load(address)
  if (!funds) {
    funds = new Funds(address)
    funds.totalSupplied = BigInt.zero()
    funds.totalWithdrawn = BigInt.zero()
    funds.totalClaimed = BigInt.zero()
  }
  return funds
}

export function handleBeneficiaryAdded(event: BeneficiaryAddedEvent): void {
  let entity = new Beneficiary(
    event.params.beneficiaryAddress
  )

  entity.totalClaimed = BigInt.zero()
  entity.dateAdded = event.block.timestamp
  entity.dateRemoved = null
  entity.isActive = true

  entity.save()
}

export function handleBeneficiaryRemoved(event: BeneficiaryRemovedEvent): void {
  let entity = Beneficiary.load(event.params.beneficiaryAddress)

  if (!entity) return

  entity.isActive = false
  entity.dateRemoved = event.block.timestamp

  entity.save()
}

export function handleSubsidyClaimed(event: SubsidyClaimedEvent): void {
  let entity = Beneficiary.load(event.params.beneficiaryAddress)
  let funds = getOrCreateFunds(event.address)
  
  if (!entity) return

  entity.totalClaimed = entity.totalClaimed.plus(event.params.amount)
  funds.totalClaimed = funds.totalClaimed.plus(event.params.amount)
  funds.contractBalance = event.params.contractBalance

  entity.save()
  funds.save()
}

export function handleFundsAdded(event: FundsAddedEvent): void {
  let funds = getOrCreateFunds(event.address)

  funds.totalSupplied = funds.totalSupplied.plus(event.params.amount)
  funds.contractBalance = event.params.contractBalance

  funds.save()
}

export function handleFundsWithdrawed(event: FundsWithdrawedEvent): void {
  let funds = getOrCreateFunds(event.address)

  funds.totalWithdrawn = funds.totalWithdrawn.plus(event.params.amountWithdrawed)
  funds.contractBalance = funds.contractBalance.minus(event.params.amountWithdrawed)

  funds.save()
}
