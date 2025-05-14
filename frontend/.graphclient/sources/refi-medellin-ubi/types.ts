// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace RefiMedellinUbiTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type Beneficiary = {
  id: Scalars['Bytes']['output'];
  totalClaimed: Scalars['BigInt']['output'];
  dateAdded: Scalars['BigInt']['output'];
  dateRemoved?: Maybe<Scalars['BigInt']['output']>;
  isActive: Scalars['Boolean']['output'];
};

export type Beneficiary_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  totalClaimed?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dateAdded?: InputMaybe<Scalars['BigInt']['input']>;
  dateAdded_not?: InputMaybe<Scalars['BigInt']['input']>;
  dateAdded_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dateAdded_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dateAdded_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dateAdded_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dateAdded_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dateAdded_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dateRemoved?: InputMaybe<Scalars['BigInt']['input']>;
  dateRemoved_not?: InputMaybe<Scalars['BigInt']['input']>;
  dateRemoved_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dateRemoved_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dateRemoved_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dateRemoved_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dateRemoved_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dateRemoved_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  isActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Beneficiary_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Beneficiary_filter>>>;
};

export type Beneficiary_orderBy =
  | 'id'
  | 'totalClaimed'
  | 'dateAdded'
  | 'dateRemoved'
  | 'isActive';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type DailyClaim = {
  id: Scalars['ID']['output'];
  date: Scalars['BigInt']['output'];
  totalClaims: Scalars['BigInt']['output'];
  totalAmount: Scalars['BigInt']['output'];
  beneficiaries: Array<Scalars['Bytes']['output']>;
};

export type DailyClaim_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalClaims?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalClaims_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalAmount?: InputMaybe<Scalars['BigInt']['input']>;
  totalAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beneficiaries?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiaries_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiaries_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiaries_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiaries_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beneficiaries_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DailyClaim_filter>>>;
  or?: InputMaybe<Array<InputMaybe<DailyClaim_filter>>>;
};

export type DailyClaim_orderBy =
  | 'id'
  | 'date'
  | 'totalClaims'
  | 'totalAmount'
  | 'beneficiaries';

export type Funds = {
  id: Scalars['Bytes']['output'];
  totalSupplied: Scalars['BigInt']['output'];
  totalWithdrawn: Scalars['BigInt']['output'];
  totalClaimed: Scalars['BigInt']['output'];
  contractBalance: Scalars['BigInt']['output'];
};

export type Funds_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  totalSupplied?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplied_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplied_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplied_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplied_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplied_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupplied_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupplied_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalWithdrawn?: InputMaybe<Scalars['BigInt']['input']>;
  totalWithdrawn_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalWithdrawn_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalWithdrawn_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalWithdrawn_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalWithdrawn_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalWithdrawn_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalWithdrawn_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalClaimed?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaimed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contractBalance?: InputMaybe<Scalars['BigInt']['input']>;
  contractBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  contractBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  contractBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  contractBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  contractBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  contractBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contractBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Funds_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Funds_filter>>>;
};

export type Funds_orderBy =
  | 'id'
  | 'totalSupplied'
  | 'totalWithdrawn'
  | 'totalClaimed'
  | 'contractBalance';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  beneficiary?: Maybe<Beneficiary>;
  beneficiaries: Array<Beneficiary>;
  funds?: Maybe<Funds>;
  funds_collection: Array<Funds>;
  dailyClaim?: Maybe<DailyClaim>;
  dailyClaims: Array<DailyClaim>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerybeneficiaryArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybeneficiariesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Beneficiary_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Beneficiary_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfundsArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryfunds_collectionArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Funds_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Funds_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydailyClaimArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydailyClaimsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DailyClaim_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DailyClaim_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  beneficiary: InContextSdkMethod<Query['beneficiary'], QuerybeneficiaryArgs, MeshContext>,
  /** null **/
  beneficiaries: InContextSdkMethod<Query['beneficiaries'], QuerybeneficiariesArgs, MeshContext>,
  /** null **/
  funds: InContextSdkMethod<Query['funds'], QueryfundsArgs, MeshContext>,
  /** null **/
  funds_collection: InContextSdkMethod<Query['funds_collection'], Queryfunds_collectionArgs, MeshContext>,
  /** null **/
  dailyClaim: InContextSdkMethod<Query['dailyClaim'], QuerydailyClaimArgs, MeshContext>,
  /** null **/
  dailyClaims: InContextSdkMethod<Query['dailyClaims'], QuerydailyClaimsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["refi-medellin-ubi"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
