import { BigInt } from "@graphprotocol/graph-ts"
import {
  BeneficiaryAdded as BeneficiaryAddedEvent,
  BeneficiaryRemoved as BeneficiaryRemovedEvent,
  SubsidyClaimed as SubsidyClaimedEvent,
} from "../generated/SubsidyProgram/SubsidyProgram"
import {
  Beneficiary
} from "../generated/schema"

export function handleBeneficiaryAdded(event: BeneficiaryAddedEvent): void {
  let entity = new Beneficiary(
    event.params.beneficiaryAddress
  )

  entity.totalClaimed = new BigInt(0)
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
  
  if (!entity) return

  entity.totalClaimed = entity.totalClaimed.plus(event.params.amount)

  entity.save()
}
