import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/SubsidyProgram/SubsidyProgram"

export function createBeneficiaryAddedEvent(
  beneficiaryAddress: Address
): BeneficiaryAdded {
  let beneficiaryAddedEvent = changetype<BeneficiaryAdded>(newMockEvent())

  beneficiaryAddedEvent.parameters = new Array()

  beneficiaryAddedEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiaryAddress",
      ethereum.Value.fromAddress(beneficiaryAddress)
    )
  )

  return beneficiaryAddedEvent
}

export function createBeneficiaryRemovedEvent(
  beneficiaryAddress: Address
): BeneficiaryRemoved {
  let beneficiaryRemovedEvent = changetype<BeneficiaryRemoved>(newMockEvent())

  beneficiaryRemovedEvent.parameters = new Array()

  beneficiaryRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiaryAddress",
      ethereum.Value.fromAddress(beneficiaryAddress)
    )
  )

  return beneficiaryRemovedEvent
}

export function createClaimIntervalSetEvent(
  interval: BigInt
): ClaimIntervalSet {
  let claimIntervalSetEvent = changetype<ClaimIntervalSet>(newMockEvent())

  claimIntervalSetEvent.parameters = new Array()

  claimIntervalSetEvent.parameters.push(
    new ethereum.EventParam(
      "interval",
      ethereum.Value.fromUnsignedBigInt(interval)
    )
  )

  return claimIntervalSetEvent
}

export function createClaimableAmountSetEvent(
  amount: BigInt
): ClaimableAmountSet {
  let claimableAmountSetEvent = changetype<ClaimableAmountSet>(newMockEvent())

  claimableAmountSetEvent.parameters = new Array()

  claimableAmountSetEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return claimableAmountSetEvent
}

export function createFundsAddedEvent(
  amount: BigInt,
  contractBalance: BigInt
): FundsAdded {
  let fundsAddedEvent = changetype<FundsAdded>(newMockEvent())

  fundsAddedEvent.parameters = new Array()

  fundsAddedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  fundsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "contractBalance",
      ethereum.Value.fromUnsignedBigInt(contractBalance)
    )
  )

  return fundsAddedEvent
}

export function createFundsWithdrawedEvent(
  amountWithdrawed: BigInt
): FundsWithdrawed {
  let fundsWithdrawedEvent = changetype<FundsWithdrawed>(newMockEvent())

  fundsWithdrawedEvent.parameters = new Array()

  fundsWithdrawedEvent.parameters.push(
    new ethereum.EventParam(
      "amountWithdrawed",
      ethereum.Value.fromUnsignedBigInt(amountWithdrawed)
    )
  )

  return fundsWithdrawedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSubsidyClaimedEvent(
  beneficiaryAddress: Address,
  amount: BigInt,
  contractBalance: BigInt
): SubsidyClaimed {
  let subsidyClaimedEvent = changetype<SubsidyClaimed>(newMockEvent())

  subsidyClaimedEvent.parameters = new Array()

  subsidyClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiaryAddress",
      ethereum.Value.fromAddress(beneficiaryAddress)
    )
  )
  subsidyClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  subsidyClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "contractBalance",
      ethereum.Value.fromUnsignedBigInt(contractBalance)
    )
  )

  return subsidyClaimedEvent
}

export function createTokenAddressSetEvent(
  tokenAddress: Address
): TokenAddressSet {
  let tokenAddressSetEvent = changetype<TokenAddressSet>(newMockEvent())

  tokenAddressSetEvent.parameters = new Array()

  tokenAddressSetEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )

  return tokenAddressSetEvent
}
