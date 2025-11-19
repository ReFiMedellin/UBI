import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  BeneficiaryAdded as BeneficiaryAddedEvent,
  BeneficiaryRemoved as BeneficiaryRemovedEvent,
  SubsidyClaimed as SubsidyClaimedEvent,
  FundsAdded as FundsAddedEvent,
  FundsWithdrawn as FundsWithdrawnEvent,
  TokenSwapped as TokenSwappedEvent,
  TokenAdded as TokenAddedEvent,
} from "../generated/SubsidyProgram/SubsidyProgram"
import {
  Beneficiary,
  Funds,
  DailyClaim,
  TokenBalance,
} from "../generated/schema"

const BASE_TOKEN = Bytes.fromHexString("0x8A567e2aE79CA692Bd748aB832081C45de4041eA")

// Helper function to get or create DailyClaim entity
function getOrCreateDailyClaim(timestamp: BigInt): DailyClaim {
  let day = timestamp.toI32() / 86400 // Convert to days
  let id = day.toString()
  let dailyClaim = DailyClaim.load(id)
  
  if (!dailyClaim) {
    dailyClaim = new DailyClaim(id)
    dailyClaim.date = timestamp
    dailyClaim.totalClaims = BigInt.zero()
    dailyClaim.totalAmount = BigInt.zero()
    dailyClaim.beneficiaries = []
  }
  
  return dailyClaim
}

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

function getOrCreateTokenBalance(funds: Funds, token: Bytes): TokenBalance {
  let tb = TokenBalance.load(token)
  if (!tb) {
    tb = new TokenBalance(token)
    tb.token = token
    tb.balance = BigInt.zero()
    tb.totalSwapped = BigInt.zero()
    tb.totalWithdrawn = BigInt.zero()
    tb.funds = funds.id
  }
  return tb
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
  
  // Update daily claims
  let dailyClaim = getOrCreateDailyClaim(event.block.timestamp)
  dailyClaim.totalClaims = dailyClaim.totalClaims.plus(BigInt.fromI32(1))
  dailyClaim.totalAmount = dailyClaim.totalAmount.plus(event.params.amount)
  
  // Add beneficiary to the list if not already present
  let beneficiaries = dailyClaim.beneficiaries
  if (!beneficiaries.includes(event.params.beneficiaryAddress)) {
    beneficiaries.push(event.params.beneficiaryAddress)
    dailyClaim.beneficiaries = beneficiaries
  }
  
  dailyClaim.save()
}

export function handleFundsAdded(event: FundsAddedEvent): void {
  let funds = getOrCreateFunds(event.address)

  if (event.params.tokenAddress == BASE_TOKEN) {
    funds.totalSupplied = funds.totalSupplied.plus(event.params.amount)
    funds.contractBalance = event.params.tokenBalance
  } else {
    let tb = getOrCreateTokenBalance(funds, event.params.tokenAddress)
    tb.balance = event.params.tokenBalance
    tb.save()
  }

  funds.save()
}

export function handleFundsWithdrawn(event: FundsWithdrawnEvent): void {
  let funds = getOrCreateFunds(event.address)

  if (event.params.tokenAddress == BASE_TOKEN) {
    funds.totalWithdrawn = funds.totalWithdrawn.plus(event.params.amountWithdrawed)
    funds.contractBalance = funds.contractBalance.minus(event.params.amountWithdrawed)
  } else {
    let tb = getOrCreateTokenBalance(funds, event.params.tokenAddress)
    tb.totalWithdrawn = tb.totalWithdrawn.plus(event.params.amountWithdrawed)
    tb.balance = tb.balance.minus(event.params.amountWithdrawed)
    tb.save()
  }

  funds.save()
}

export function handleTokenAdded(event: TokenAddedEvent): void {
  let funds = getOrCreateFunds(event.address)
  let tb = getOrCreateTokenBalance(funds, event.params.tokenAddress)
  tb.save()
}

export function handleTokenSwapped(event: TokenSwappedEvent): void {
  let funds = getOrCreateFunds(event.address)
  let tb = getOrCreateTokenBalance(funds, event.params.tokenAddress)

  tb.totalSwapped = tb.totalSwapped.plus(event.params.amountIn)
  tb.balance = tb.balance.minus(event.params.amountIn)
  funds.contractBalance = funds.contractBalance.plus(event.params.amountOut)

  tb.save()
  funds.save()
}
