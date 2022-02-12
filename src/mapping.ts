import { BigInt, crypto, ByteArray, ethereum, log, Address } from "@graphprotocol/graph-ts"


import {
  DepositTransferred as DepositTransferredEvent,
  IncentiveCreated as IncentiveCreatedEvent,
  IncentiveEnded as IncentiveEndedEvent,
  RewardClaimed as RewardClaimedEvent,
  TokenStaked as TokenStakedEvent,
  TokenUnstaked as TokenUnstakedEvent
} from "../generated/Contract/Contract"


import {

  
  Incentive,
  TokenStakedInfo,
  
  IncentivePosition
 
  
} from "../generated/schema"

export function handleIncentiveCreated(event: IncentiveCreatedEvent): void {
  let encoded1 = ethereum.encode(ethereum.Value.fromAddress(event.params.rewardToken))!
  let encoded2 = ethereum.encode(ethereum.Value.fromAddress(event.params.pool))!
  let encoded3 = ethereum.encode(ethereum.Value.fromUnsignedBigInt(event.params.startTime))!
  let encoded4 = ethereum.encode(ethereum.Value.fromUnsignedBigInt(event.params.endTime))!
  let encoded5 = ethereum.encode(ethereum.Value.fromAddress(event.params.refundee))!

  let encoded = ByteArray.fromHexString(`${encoded1.toHexString()}${encoded2.toHexString().slice(2)}${encoded3.toHexString().slice(2)}${encoded4.toHexString().slice(2)}${encoded5.toHexString().slice(2)}`)

  let id = crypto.keccak256(encoded)

  let entity = Incentive.load(id.toHexString());
  if(entity == null){
    entity = new Incentive(id.toHexString());
  }
  entity.rewardToken = event.params.rewardToken
  entity.pool = event.params.pool
  entity.startTime = event.params.startTime
  entity.endTime = event.params.endTime
  entity.refundee = event.params.refundee
  entity.reward = event.params.reward
  entity.active = true;
  
  entity.save()
}

export function handleIncentiveEnded(event: IncentiveEndedEvent): void {
  let entity = Incentive.load(event.params.incentiveId.toHexString())
  
  
  if (entity != null) {
    entity.active = false;
    
    entity.save();
  }
  
}




export function handleTokenStaked(event: TokenStakedEvent): void {
  
  let incentiveCreated = Incentive.load(event.params.incentiveId.toHex())
  if (!incentiveCreated){
    incentiveCreated = new Incentive (event.params.incentiveId.toHex())
  }
  incentiveCreated.save()
  //If incentiveId isn't unique, you may need to concat with event.logIndex.toString()
 
  
  let TokenStakedInfoentity = TokenStakedInfo.load(event.params.tokenId.toHex());
  if(TokenStakedInfoentity != null){
    TokenStakedInfoentity.isStaked= true;
    TokenStakedInfoentity.save();
  }

let tokenstakedinfoentity2 = TokenStakedInfo.load(event.params.tokenId.toHex());
if(!tokenstakedinfoentity2){
  tokenstakedinfoentity2 = new TokenStakedInfo (event.params.tokenId.toHex())
}
tokenstakedinfoentity2.save()


  let incentivePosition = IncentivePosition.load(event.params.incentiveId.toHex() + event.params.tokenId.toHex())
  if (incentivePosition == null) {
    incentivePosition = new IncentivePosition(event.params.incentiveId.toHex() + event.params.tokenId.toHex());
  }
  incentivePosition.incentive = incentiveCreated.id;
  incentivePosition.tokenstakedinfo = tokenstakedinfoentity2.id;
  
  incentivePosition.save();
}

export function handleTokenUnstaked(event: TokenUnstakedEvent): void {
  

  let TokenStakedInfoentity = TokenStakedInfo.load(event.params.tokenId.toHex());
  if(TokenStakedInfoentity != null){
    TokenStakedInfoentity.isStaked= false;
    TokenStakedInfoentity.save();
  }
}

export function handleDepositTransferred(event: DepositTransferredEvent): void {
  

  let TokenStakedInfoentity = TokenStakedInfo.load(event.params.tokenId.toHex());
  
    if (TokenStakedInfoentity == null) {
        TokenStakedInfoentity = new TokenStakedInfo(event.params.tokenId.toHex());
  
        TokenStakedInfoentity.owner = event.params.newOwner;
        TokenStakedInfoentity.tokenId = event.params.tokenId;
        TokenStakedInfoentity.isStaked = false;
        
    }
  
    TokenStakedInfoentity.save();
}


export function handleRewardClaimed(event: RewardClaimedEvent): void {
  
}