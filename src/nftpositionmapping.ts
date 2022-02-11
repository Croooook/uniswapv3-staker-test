import { BigInt, crypto, ByteArray, ethereum, log, Address } from "@graphprotocol/graph-ts"

import {
    Transfer ,
    Approval as ApprovalEvent,
    ApprovalForAll as ApprovalForAllEvent,
    Collect as CollectEvent,
    DecreaseLiquidity as DecreaseLiquidityEvent,
    IncreaseLiquidity as IncreaseLiquidityEvent,
  } from "../generated/NFTPositionsManager/NFTPositionsManager";
  
  import {
      TokenStakedInfo
  }from "../generated/schema"

  export function handlePositionCreate(event: Transfer): void {
    let TokenStakedInfoentity = TokenStakedInfo.load(event.params.tokenId.toHex());
  
    if (TokenStakedInfoentity == null) {
        TokenStakedInfoentity = new TokenStakedInfo(event.params.tokenId.toHex());
  
        TokenStakedInfoentity.owner = event.params.to;
        
        TokenStakedInfoentity.isStaked = false;
        
    }
  
    TokenStakedInfoentity.save();
  }


  export function handleCollect(event: CollectEvent): void {
}

export function handleIncreaseLiquidity(event: IncreaseLiquidityEvent): void {
  
}

export function handleDecreaseLiquidity(event: DecreaseLiquidityEvent): void {
  
}
export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  
}
export function handleApproval(event: ApprovalEvent): void {
}