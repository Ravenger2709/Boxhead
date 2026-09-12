function §\x01\x02§()
{
   return 1415;
}
var §\x01§ = -1184 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 231)
   {
      set("\x01",eval("\x01") + 694);
      §§push(true);
   }
   else
   {
      if(eval("\x01") == 912)
      {
         set("\x01",eval("\x01") - 827);
         break;
      }
      if(eval("\x01") == 609)
      {
         set("\x01",eval("\x01") - 420);
      }
      else if(eval("\x01") == 488)
      {
         set("\x01",eval("\x01") - 315);
         var §§pop() = §§pop();
      }
      else if(eval("\x01") == 925)
      {
         set("\x01",eval("\x01") - 13);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 827);
         }
      }
      else if(eval("\x01") == 85)
      {
         set("\x01",eval("\x01") + 104);
      }
      else if(eval("\x01") == 189)
      {
         set("\x01",eval("\x01") + 299);
         §§push("\x0f");
         §§push(1);
      }
      else if(eval("\x01") == 173)
      {
         set("\x01",eval("\x01") + 659);
         §§push("\x0f");
      }
      else if(eval("\x01") == 832)
      {
         set("\x01",eval("\x01") + 96);
         §§push(eval(§§pop()));
      }
      else if(eval("\x01") == 928)
      {
         set("\x01",eval("\x01") - 92);
         §§push(!§§pop());
      }
      else if(eval("\x01") == 836)
      {
         set("\x01",eval("\x01") + 6);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 761);
         }
      }
      else
      {
         if(eval("\x01") != 842)
         {
            if(eval("\x01") == 81)
            {
               set("\x01",eval("\x01") + 890);
               if(!_global.Thing)
               {
                  _global.Thing = new Object();
               }
               §§pop();
               if(!_global.Thing.Creature)
               {
                  _global.Thing.Creature = new Object();
               }
               §§pop();
               if(!_global.Thing.Creature.CThing_Creature_Devil)
               {
                  Thing.Creature.CThing_Creature_Devil extends Thing.Creature.CThing_Creature;
                  _loc2_ = Thing.Creature.CThing_Creature_Devil = function(tPosition, tAngle, tParent)
                  {
                     super(tPosition,tAngle,tParent);
                     this.mColor = 16711680;
                     this.mXSI_Animation = DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.CreateAnimationObject(Thing.Creature.CThing_Creature_Devil.GetCollection());
                     this.Process = this.Process_Init;
                  }.prototype;
                  Thing.Creature.CThing_Creature_Devil = function(tPosition, tAngle, tParent)
                  {
                     super(tPosition,tAngle,tParent);
                     this.mColor = 16711680;
                     this.mXSI_Animation = DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.CreateAnimationObject(Thing.Creature.CThing_Creature_Devil.GetCollection());
                     this.Process = this.Process_Init;
                  }.GetCollection = function()
                  {
                     if(Thing.Creature.CThing_Creature_Devil.mXSI_Collection)
                     {
                        return Thing.Creature.CThing_Creature_Devil.mXSI_Collection;
                     }
                     Thing.Creature.CThing_Creature_Devil.mXSI_Collection = new DrawPrimitive.XSI.CDrawPrimitive_XSI_Collection();
                     DrawPrimitive.XSI.CDrawPrimitive_XSI_StyleSheet.SS_DEVIL(Thing.Creature.CThing_Creature_Devil.mDefault_Scale);
                     Thing.Creature.CThing_Creature_Devil.mXSI_Collection.AddItem(DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.Load("Player_Stand","stand"));
                     Thing.Creature.CThing_Creature_Devil.mXSI_Collection.AddItem(DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.Load("Player_Walk","walk"));
                     Thing.Creature.CThing_Creature_Devil.mXSI_Collection.AddItem(DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.Load("Player_HitRear","shothit_1"));
                     Thing.Creature.CThing_Creature_Devil.mXSI_Collection.AddItem(DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.Load("Player_HitFront","shothit_2"));
                     Thing.Creature.CThing_Creature_Devil.mXSI_Collection.AddItem(DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.Load("Player_Dying","dying"));
                     Thing.Creature.CThing_Creature_Devil.mXSI_Collection.AddItem(DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.Load("Player_Dead","dead"));
                     Thing.Creature.CThing_Creature_Devil.mXSI_Collection.AddItem(DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.Load("Devil_Devil_Attack","attack"));
                     return Thing.Creature.CThing_Creature_Devil.mXSI_Collection;
                  };
                  _loc2_.toString = function()
                  {
                     return this._CLASSID_;
                  };
                  _loc2_.Dispose = function()
                  {
                     super.Dispose();
                  };
                  _loc2_.State_Dead_Init = function()
                  {
                     super.State_Dead_Init();
                  };
                  _loc2_.Affect_Setup = function(tFlags)
                  {
                     super.Affect_Setup(tFlags | Thing.Affect.CThing_Affect.mAffect_PlayerLineOfSight);
                  };
                  _loc2_.Process_Init = function()
                  {
                     super.Process_Init();
                     this.mSpeed = 0.04;
                     this.SetRadius(Thing.Creature.CThing_Creature_Devil.mDefault_Scale);
                     this.mMaxLife = this.mLife = 1000;
                     this.mAttackRange = 5;
                     this.mAttackDamage = 50;
                     this.mMass = 5;
                     this.mFireRate = 0;
                     this.mScore = 1000;
                     this.mHeight = 1.8;
                     this.mFireRateCount = 5;
                     this.mWorld.mUpgrades.Register_Creature_Zombie(this);
                     this.SetState("State_EnterMap");
                     this.mSound = new Object();
                     this.mSound.Damage = CSound.mSamples["Creature_Zombie_Hit_" + (random(4) + 1) + "_wav"];
                     this.mSound.Death = CSound.mSamples["Creature_Zombie_Hit_" + (random(4) + 1) + "_wav"];
                  };
                  _loc2_.Process_Normal = function()
                  {
                     super.Process_Normal();
                     this.mFireRateCount = this.mFireRateCount - 1;
                  };
                  _loc2_.Brain = function()
                  {
                     this.mTarget_Player = this.mThing_Collection.GetClosestPlayer(this.mPosition);
                     this.mTarget_Position = this.mTarget_Player.mPosition;
                     if(this.mTarget_Player == undefined)
                     {
                     }
                     if(this.State_Attack_Decision())
                     {
                        this.mDamageMulitply = false;
                        this.mAttackAngle = this.mPosition.CAngleToPosition(this.mTarget_Player.mPosition);
                        this.SetState("State_Attack");
                        return true;
                     }
                     this.mCanAttack = true;
                     return false;
                  };
                  _loc2_.State_GotoPlayer_Init = function()
                  {
                     this.mBaseStateID = this.mStateID;
                     this.mXSI_Animation.SetAnimation("walk");
                  };
                  _loc2_.State_GotoPlayer = function()
                  {
                     if(this.Brain())
                     {
                        return undefined;
                     }
                     var _loc2_ = this.mAngle.mDirection;
                     this.mCurrentCell = this.mMap.mCells[this.mPosition.mY & 0xFFFFFF][this.mPosition.mX & 0xFFFFFF];
                     this.mTarget_Angle.mAngle = Math.atan2((this.mTarget_Position.mY & 0xFFFFFF) + 0.5 - this.mPosition.mY,(this.mTarget_Position.mX & 0xFFFFFF) + 0.5 - this.mPosition.mX);
                     this.mTarget_Direction = this.mTarget_Angle.mDirection;
                     var _loc3_ = this.mCurrentCell["NavReal_" + this.mTarget_Direction]();
                     if(!(_loc3_ & World.Map.CMap_Cell.mCollide_Player))
                     {
                     }
                     if(_loc3_ & World.Map.CMap_Cell.mCollide_Object)
                     {
                        this.mAttackAngle = this.mAngle.Clone();
                        this.mAttackAngle.mDirection = this.mAngle.mDirection;
                        this.mDamageMulitply = true;
                        this.SetState_WithDirection("State_Attack",_loc2_,this.mTarget_Direction);
                        return undefined;
                     }
                     if((this.mTarget_Direction = this.mCurrentCell.Nav_Direction(_loc2_,this.mTarget_Direction,World.Map.CMap_Cell.mCollide_NonMovable,true)) == -1)
                     {
                        this.SetState("State_Wait");
                        return undefined;
                     }
                     this.SetState_WithDirection_Wait("State_CellToCell",_loc2_,this.mTarget_Direction);
                     return undefined;
                  };
                  _loc2_.State_Attack_Decision = function()
                  {
                     if(!this.mCanAttack || this.mFireRateCount > 0)
                     {
                        return false;
                     }
                     if(this.mTarget_Player.mLife <= 0)
                     {
                        return false;
                     }
                     var _loc2_ = this.mTarget_Player.mPosition;
                     if(this.mPosition.CAngleToPosition(_loc2_).mDirection != this.mAngle.mDirection)
                     {
                        return false;
                     }
                     if(this.mPosition.Distance_SQR(_loc2_) > this.mAttackRange * this.mAttackRange)
                     {
                        return false;
                     }
                     var _loc3_ = this.mWorld.mMap.mCollide.Collide_Line(this,this.mPosition,_loc2_,Thing.Shot.CThing_Shot_FireBall.mCollideRadius,Thing.Affect.CThing_Affect.mAffect_PlayerLineOfSight);
                     if(_loc3_.mThing._CLASSID_ != this.mTarget_Player._CLASSID_)
                     {
                        return false;
                     }
                     return true;
                  };
                  _loc2_.State_Attack_Init = function()
                  {
                     this.mXSI_Animation.SetAnimation("attack");
                  };
                  _loc2_.State_Attack = function()
                  {
                     var _loc3_ = this.mXSI_Animation.Animate_RetObj(Math.min(0.2 * (this.mSpeed * 25 * 1.5),1));
                     var _loc5_;
                     var _loc6_;
                     var _loc4_;
                     var _loc2_;
                     if(_loc3_.mNewFrame && _loc3_.mFrameIndex == 3)
                     {
                        _loc5_ = this.mAttackDamage;
                        _loc6_ = this.mAttackSpeed;
                        _loc4_ = this.mAttackAngle;
                        this.mXSI_Animation.Update_CurrentFrame(this.mAngle);
                        _loc2_ = this.mXSI_Animation.XSI_Info.XSI_Model_Hand_Right.nPosition;
                        _loc2_ = _loc2_.Add(this.mXSI_Animation.XSI_Info.XSI_Model_Hand_Left.nPosition);
                        _loc2_ = this.mPosition.Add(_loc2_.ScaleN(0.5));
                        if(isNaN(_loc2_.mX) || isNaN(_loc2_.mY))
                        {
                           _loc2_ = this.mPosition.Clone();
                           _loc2_ = _loc2_.Add(_loc4_.mDelta.Normalize(this.mRadius + this.mRadius / 2));
                           _loc2_.mZ = 0.84;
                        }
                        this.mThing_Collection.AddThing_Shot(new Thing.Shot.CThing_Shot_FireBall(_loc2_,_loc4_.Clone(),this,_loc5_,this.mDamageMulitply,_loc6_));
                        this.mFireRateCount = this.mFireRate;
                     }
                     if(_loc3_.mAnimEnd)
                     {
                        this.SetState(this.mReturnStateID);
                     }
                  };
                  _loc2_.State_TrackTarget_Init = function()
                  {
                     this.mXSI_Animation.SetAnimation("stand");
                  };
                  _loc2_.State_TrackTarget = function()
                  {
                  };
                  _loc2_.State_RemoveObject_Init = function()
                  {
                     this.mXSI_Animation.SetAnimation("stand");
                     this.mCurrentCell = this.mMap.mCells[this.mPosition.mY & 0xFFFFFF][this.mPosition.mX & 0xFFFFFF];
                  };
                  _loc2_.State_RemoveObject = function()
                  {
                     if(this.mCurrentCell.mAdjacentCells[this.mAngle.mDirection].mCollide & World.Map.CMap_Cell.mCollide_Object)
                     {
                        this.mCurrentCell.mAdjacentCells[this.mAngle.mDirection].Affect(new Thing.Affect.CThing_Affect_DevilAttack(this,this,100000,this.mAngle));
                     }
                     else
                     {
                        this.SetState("State_GotoPlayer");
                     }
                  };
                  _loc2_._CLASSID_ = "CThing_Creature_Devil";
                  Thing.Creature.CThing_Creature_Devil = function(tPosition, tAngle, tParent)
                  {
                     super(tPosition,tAngle,tParent);
                     this.mColor = 16711680;
                     this.mXSI_Animation = DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation.CreateAnimationObject(Thing.Creature.CThing_Creature_Devil.GetCollection());
                     this.Process = this.Process_Init;
                  }.mDefault_Scale = 0.42;
                  §§push(ASSetPropFlags(Thing.Creature.CThing_Creature_Devil.prototype,null,1));
               }
               §§pop();
               break;
            }
            if(eval("\x01") == 971)
            {
               set("\x01",eval("\x01") - 971);
            }
            break;
         }
         set("\x01",eval("\x01") - 761);
      }
   }
}
