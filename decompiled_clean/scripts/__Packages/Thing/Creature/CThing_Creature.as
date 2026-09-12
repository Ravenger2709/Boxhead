class Thing.Creature.CThing_Creature extends Thing.CThing
{
   var Process;
   var State_RemoveObject;
   var fState;
   var mAffectors;
   var mAlpha;
   var mAngle;
   var mAngleDelta;
   var mAnimSpeed;
   var mBaseStateID;
   var mCurrentCell;
   var mDelta;
   var mDirectionCell;
   var mFlags;
   var mHeight;
   var mHitAngle;
   var mInvincible;
   var mLife;
   var mMap;
   var mMapwho;
   var mMass;
   var mMaxLife;
   var mNewCell;
   var mNewCell_Flags;
   var mPosition;
   var mReturnStateID;
   var mReturn_Angle;
   var mSound;
   var mSpeed;
   var mStateCount;
   var mStateID;
   var mTarget_Angle;
   var mTarget_Direction;
   var mThing_Collection;
   var mWorld;
   var mXSI_Animation;
   var _CLASSID_ = "CThing_Creature";
   var _BASECLASSID_ = "CThing_Creature";
   static var mAnimationSpeed = 1;
   static var mDamageActive = true;
   function CThing_Creature(tPosition, tAngle, tParent)
   {
      super(tPosition,tAngle,tParent);
      this.mFlags = Thing.CThing.mFlag_Collidable;
      this.mAlpha = 100;
      this.mMass = 1;
      this.mTarget_Angle = new Thing.Math.CThing_Angle(0);
      this.Process = this.Process_Init;
   }
   function toString()
   {
      return this._CLASSID_;
   }
   function Dispose()
   {
      super.Dispose();
   }
   function Process_Init()
   {
      this.SetRadius(0.45);
      this.mHeight = 1.5;
      this.Move(this.mPosition.mCellCentre);
      this.mMapwho = this.mWorld.mMap.mMapwho;
      this.mMap = this.mWorld.mMap;
      this.Process = this.Process_Normal;
      this.mMaxLife = this.mLife = 100;
      this.Process();
   }
   function Process_Normal()
   {
      if(this.mAffectors.length)
      {
         this.ProcessAffects();
      }
      this.fState();
   }
   function Draw()
   {
      Thing.CThing.pDraw.x = this.mPosition.mX * World.Map.CMap_Cell.mSize.x - this.mWorld.mDrawPosition.x;
      Thing.CThing.pDraw.y = (this.mPosition.mY + this.mPosition.mZ * Thing.Math.CThing_Position.mPFactor) * World.Map.CMap_Cell.mSize.y - this.mWorld.mDrawPosition.y;
      this.mXSI_Animation.Render(Thing.CThing.pDraw,this.mAngle,this.mAlpha);
   }
   function SetState_WithDirection(nState, cDirection, tDirection)
   {
      if(tDirection == cDirection)
      {
         this.SetState(nState);
         return undefined;
      }
      this.mTarget_Angle.mDirection = tDirection;
      this.SetState("State_Turn");
      return undefined;
   }
   function SetState_WithDirection_Wait(nState, cDirection, tDirection)
   {
      if(tDirection == cDirection)
      {
         this.SetState(nState);
         return undefined;
      }
      if(this.mReturnStateID == "State_Turn")
      {
         this.SetState("State_Sleep");
         this.mStateCount = CMain.mFPS / 3;
         return undefined;
      }
      this.mTarget_Angle.mDirection = tDirection;
      this.SetState("State_Turn");
      return undefined;
   }
   function SetState(nState)
   {
      if(this[nState] != undefined)
      {
         this.mReturnStateID = this.mStateID;
         this.mStateID = nState;
         this.mStateCount = 0;
         this.fState = this[nState];
         this[nState + "_Init"]();
      }
   }
   function State_GotoPosition_Init()
   {
      this.mBaseStateID = this.mStateID;
   }
   function State_GotoPosition()
   {
      var _loc2_ = random(8);
      if(_loc2_ != this.mAngle.mDirection)
      {
         this.mTarget_Angle.mDirection = _loc2_;
         this.SetState("State_Turn");
         return undefined;
      }
      this.SetState("State_CellToCell");
   }
   function State_Wander_Init()
   {
      this.mBaseStateID = this.mStateID;
   }
   function State_Wander()
   {
      var _loc2_ = random(8);
      if(_loc2_ != this.mAngle.mDirection)
      {
         this.mTarget_Angle.mDirection = _loc2_;
         this.SetState("State_Turn");
         return undefined;
      }
      this.SetState("State_CellToCell");
   }
   function State_EnterMap_Init()
   {
      this.SetCollideDirection(this.mPosition,World.Map.CMap_Cell.mCollide_Creature);
      this.mFlags &= ~Thing.CThing.mFlag_Collidable;
      this.mBaseStateID = this.mStateID;
      this.mCurrentCell = this.mNewCell;
      var _loc2_ = 0;
      var _loc3_;
      while(_loc2_ < 8)
      {
         _loc3_ = this.mCurrentCell.mAdjacentCells[_loc2_];
         if(!(_loc3_ == undefined || _loc3_.mCollide & World.Map.CMap_Cell.mCollide_StaticImpassable))
         {
            this.mAngle.mDirection = _loc2_;
            this.mDirectionCell = _loc3_;
            return undefined;
         }
         _loc2_ += 2;
      }
   }
   function State_EnterMap()
   {
      if(this.mDirectionCell.mCollide & World.Map.CMap_Cell.mCollide_Creature)
      {
         this.SetState("State_Wait");
         return undefined;
      }
      this.Affect_Setup(Thing.Affect.CThing_Affect.mAffect_Bullet | Thing.Affect.CThing_Affect.mAffect_Explosion | Thing.Affect.CThing_Affect.mAffect_FireBall);
      this.mFlags |= Thing.CThing.mFlag_Collidable;
      this.mBaseStateID = "State_GotoPlayer";
      this.SetState(this.State_RemoveObject != undefined ? "State_RemoveObject" : "State_CellToCell");
   }
   function State_CellToCell_Init()
   {
      this.mDelta = this.mAngle.mDirectionDelta.Clone();
      this.SetCollideDirection(this.mPosition.Add(this.mDelta),World.Map.CMap_Cell.mCollide_Creature);
      this.mStateCount = !(this.mDelta.mX == 0 || this.mDelta.mY == 0) ? 1.4142135623730951 / this.mSpeed : 1 / this.mSpeed;
      this.mDelta = this.mDelta.Add(this.mPosition.mCellCentre.Subtract(this.mPosition)).ScaleN(1 / this.mStateCount);
      this.mXSI_Animation.SetAnimation("walk");
      this.mAnimSpeed = 0.34 * Thing.Creature.CThing_Creature.mAnimationSpeed;
   }
   function State_CellToCell()
   {
      if(--this.mStateCount <= 0)
      {
         this.mPosition.CellCentre();
         this.mMapwho.MoveThing(this);
         this.SetState(this.mBaseStateID);
         return undefined;
      }
      this.mXSI_Animation.QAnimate(this.mAnimSpeed);
      this.mPosition.mX += this.mDelta.mX;
      this.mPosition.mY += this.mDelta.mY;
      !this.mMapwho.MoveThing(this);
   }
   function State_Turn_Init()
   {
      this.mAngleDelta = this.mSpeed * 10 * this.mAngle.TurnAngle(this.mTarget_Angle);
      this.mStateCount = Math.abs(this.mAngle.AngleDifference(this.mTarget_Angle) / this.mAngleDelta);
      this.mXSI_Animation.SetAnimation("stand",0);
   }
   function State_Turn()
   {
      if(--this.mStateCount <= 0)
      {
         this.mAngle.mAngle = this.mTarget_Angle.mAngle;
         this.SetState(this.mBaseStateID);
         return undefined;
      }
      this.mAngle.Add(this.mAngleDelta);
   }
   function State_TurnAndMove_Init()
   {
      this.State_Turn_Init();
   }
   function State_TurnAndMove()
   {
      var _loc2_;
      if(--this.mStateCount <= 0)
      {
         this.mAngle.mAngle = this.mTarget_Angle.mAngle;
         _loc2_ = this.mMap.mCells[this.mPosition.mY & 0xFFFFFF][this.mPosition.mX & 0xFFFFFF].CollideFlagsInDirection(this.mAngle.mDirection);
         this.SetState(!(_loc2_ & World.Map.CMap_Cell.mCollide_NonMovable) ? "State_CellToCell" : this.mBaseStateID);
         return undefined;
      }
      this.mAngle.Add(this.mAngleDelta);
   }
   function State_Stand()
   {
   }
   function State_Sleep_Init()
   {
      this.mXSI_Animation.SetAnimation("stand",0);
   }
   function State_Sleep()
   {
      if(--this.mStateCount <= 0)
      {
         this.SetState(this.mReturnStateID);
      }
   }
   function State_Wait_Init()
   {
      this.mStateCount = CMain.mFPS;
      this.mXSI_Animation.SetAnimation("stand",0);
   }
   function State_Wait()
   {
      if(--this.mStateCount <= 0)
      {
         this.SetState(this.mBaseStateID);
      }
   }
   function State_WaitToMove_Init()
   {
      this.mStateCount = CMain.mFPS;
      this.mXSI_Animation.SetAnimation("stand",0);
   }
   function State_WaitToMove()
   {
      var _loc2_;
      if(--this.mStateCount <= 0 || !(this.mCurrentCell.CollideFlagsInDirection(this.mTarget_Direction) & World.Map.CMap_Cell.mCollide_Creature))
      {
         _loc2_ = this.mMap.mCells[this.mPosition.mY & 0xFFFFFF][this.mPosition.mX & 0xFFFFFF].CollideFlagsInDirection(this.mAngle.mDirection);
         this.SetState(!(_loc2_ & World.Map.CMap_Cell.mCollide_NonMovable) ? "State_CellToCell" : this.mBaseStateID);
         return undefined;
      }
   }
   function State_ZombieHit_Init()
   {
      this.State_BulletHit_Init();
   }
   function State_ZombieHit()
   {
      this.State_BulletHit();
   }
   function State_ExplosionHit_Init()
   {
      this.State_BulletHit_Init();
   }
   function State_ExplosionHit()
   {
      this.State_BulletHit();
   }
   function State_BulletHit_Init()
   {
      this.mStateCount = 0;
      var _loc2_ = this.mDelta.mLength;
      while(_loc2_ >= 0.01)
      {
         this.mStateCount++;
         _loc2_ *= 0.65;
      }
      this.mWorld.mMap.mDecal.Draw_BloodSplat(this.mPosition,1);
      this.ClearCollideCell();
      this.mXSI_Animation.SetAnimation("shothit_" + (random(2) + 1),0);
      this.PlaySound(this.mSound.Damage);
      if(this.mMap.mCells[this.mPosition.mY & 0xFFFFFF][this.mPosition.mX & 0xFFFFFF].mCollide & World.Map.CMap_Cell.mCollide_StaticImpassable)
      {
         this.mDelta.mX = 0;
         this.mDelta.mY = 0;
         this.mDelta.mZ = 0;
      }
   }
   function State_BulletHit()
   {
      var _loc3_ = this.mPosition.Clone();
      var _loc2_ = this.mWorld.mMap.mCollide.CreatureCollide(this);
      if(isNaN(_loc2_.mX))
      {
         this.mFlags |= Thing.CThing.mFlag_DEAD;
         this.mThing_Collection.mThingCounters.INVALIDPOSITION++;
         this.SetState("State_Dying");
         return undefined;
      }
      this.Move(_loc2_);
      this.mDelta.ScaleN(0.65);
      if(this.mStateID != "State_ExplosionHit")
      {
         this.mWorld.mMap.mDecal.Draw_BloodSplat(this.mPosition);
      }
      if(this.mLife <= 0)
      {
         this.ClearAffects();
         this.mFlags |= Thing.CThing.mFlag_DEAD;
      }
      if(--this.mStateCount < 0)
      {
         if(this.CheckForDead())
         {
            return undefined;
         }
         this.mAngle.mAngle = this.mReturn_Angle.mAngle;
         this.SetState("State_Sleep");
         this.mStateCount = 3;
         this.mReturnStateID = this.mBaseStateID;
      }
   }
   function State_Dying_Init()
   {
      this.PlaySound(this.mSound.Death);
      this.ClearCollideCell();
      this.mFlags &= ~Thing.CThing.mFlag_Collidable;
      this.ClearAffects();
      this.mXSI_Animation.SetAnimation("dying",0);
      this.mStateCount = 0;
      this.mWorld.LogKill(this);
   }
   function State_Dying()
   {
      this.mWorld.mMap.mDecal.Draw_BloodSplat(this.mPosition,1);
      if(this.mXSI_Animation.Animate(0.34 * Thing.Creature.CThing_Creature.mAnimationSpeed))
      {
         this.PlaySound(CSound.mSamples.Creature_HitFloor_wav);
         this.SetState("State_Dead");
      }
   }
   function State_Dead_Init()
   {
      this.mStateCount = this._CLASSID_ != "CThing_Creature_Player" ? CMain.mFPS * 2 : CMain.mFPS * 4;
      this.mFlags |= Thing.CThing.mFlag_SortFloor;
      this.ClearCollideCell();
      this.mXSI_Animation.SetAnimation("dead",0);
      this.mWorld.mMap.mDecal.Draw_BloodSplat(this.mPosition,5);
   }
   function State_Dead()
   {
      this.mAlpha = !(this.mStateCount < CMain.mFPS && _root._quality != "LOW") ? 100 : this.mStateCount / CMain.mFPS * 100;
      if(--this.mStateCount < 0)
      {
         this.Delete();
      }
   }
   function CheckForDead()
   {
      if(this.mLife <= 0 || this.mFlags & Thing.CThing.mFlag_DEAD)
      {
         this.SetState("State_Dying");
         return true;
      }
      return false;
   }
   function SetCollideDirection(p, tCollideFlags)
   {
      this.mNewCell.mCollide &= ~tCollideFlags;
      this.mNewCell_Flags = tCollideFlags;
      this.mNewCell = this.mMap.GetCell(p.mX,p.mY);
      this.mNewCell.mCollide |= this.mNewCell_Flags;
   }
   function ClearCollideCell()
   {
      this.mNewCell.mCollide &= ~this.mNewCell_Flags;
      delete this.mNewCell;
   }
   function QMove()
   {
      this.mMapwho.MoveThing(this);
   }
   function Move(nPosition)
   {
      if(nPosition != this.mPosition)
      {
         this.mPosition.mX = nPosition.mX;
         this.mPosition.mY = nPosition.mY;
         this.mPosition.mZ = nPosition.mZ;
      }
      this.mMapwho.MoveThing(this);
   }
   function MoveAndReturn(nPosition)
   {
      var _loc2_ = "";
      if(nPosition != this.mPosition)
      {
         if(!nPosition.Equals(this.mPosition))
         {
            _loc2_ = "moved";
         }
         this.mPosition.mX = nPosition.mX;
         this.mPosition.mY = nPosition.mY;
         this.mPosition.mZ = nPosition.mZ;
      }
      if(this.mMapwho.MoveThing(this))
      {
         _loc2_ = "cellmoved";
      }
      return _loc2_;
   }
   function ProcessAffects()
   {
      this.mReturn_Angle = this.mAngle.Clone();
      var _loc2_;
      var _loc3_;
      if(!this.mInvincible)
      {
         for(var _loc4_ in this.mAffectors)
         {
            _loc2_ = this.mAffectors[_loc4_];
            switch(_loc2_.mType)
            {
               case Thing.Affect.CThing_Affect.mAffect_Bullet:
                  if(!(this._CLASSID_ == "CThing_Creature_Player" && !Thing.Creature.CThing_Creature.mDamageActive))
                  {
                     break;
                  }
                  continue;
               case Thing.Affect.CThing_Affect.mAffect_FireBall:
                  break;
               case Thing.Affect.CThing_Affect.mAffect_Explosion:
                  if(!(this._CLASSID_ == "CThing_Creature_Player" && !Thing.Creature.CThing_Creature.mDamageActive))
                  {
                     _loc3_ = _loc2_.AffectThing(this);
                     this.mDelta = this.mPosition.Subtract(_loc2_.mAffector.mPosition).Normalize(Math.min(_loc3_ / 5 * 2 / World.Map.CMap_Cell.mSize.x / this.mMass,0.3));
                     this.mDelta.mZ = 0;
                     this.mAngle.mAngle = this.mDelta.toAngleZ() + 3.141592653589793;
                     this.mHitAngle = _loc2_.mAffector.mAngle;
                     this.SetState("State_ExplosionHit");
                  }
                  continue;
               case Thing.Affect.CThing_Affect.mAffect_ZombieAttack:
                  _loc3_ = _loc2_.AffectThing(this);
                  this.mStateCount = Math.round(_loc3_ / 5);
                  this.mDelta = this.mPosition.Subtract(_loc2_.mAffector.mPosition).Normalize(Math.max(_loc3_ / 5 / World.Map.CMap_Cell.mSize.x / this.mMass,0.3));
                  this.mDelta.mZ = 0;
                  this.mAngle.mAngle = this.mDelta.toAngleZ() + 3.141592653589793;
                  this.mHitAngle = _loc2_.mAffector.mAngle;
                  this.SetState("State_ZombieHit");
                  continue;
               case Thing.Affect.CThing_Affect.mAffect_Push:
               default:
                  continue;
            }
            _loc3_ = _loc2_.AffectThing(this);
            this.mStateCount = Math.round(_loc3_ / 5 * 2);
            this.mDelta = this.mPosition.Subtract(_loc2_.mAffector.mPosition).Normalize(Math.max(_loc3_ / 5 * 2 / World.Map.CMap_Cell.mSize.x,0.3) / this.mMass);
            this.mDelta.mZ = 0;
            this.mAngle.mAngle = this.mDelta.toAngleZ() + 3.141592653589793;
            this.mHitAngle = _loc2_.mAffector.mAngle;
            this.SetState("State_BulletHit");
         }
      }
      this.mAffectors = new Array();
   }
}
