function §\x01\x02§()
{
   return 1369;
}
var §\x01§ = -1222 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 147)
   {
      set("\x01",eval("\x01") + 138);
      §§push(true);
   }
   else if(eval("\x01") == 123)
   {
      set("\x01",eval("\x01") + 619);
   }
   else if(eval("\x01") == 2)
   {
      set("\x01",eval("\x01") + 608);
   }
   else if(eval("\x01") == 285)
   {
      set("\x01",eval("\x01") + 17);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 37);
      }
   }
   else if(eval("\x01") == 220)
   {
      set("\x01",eval("\x01") - 97);
      if(§§pop())
      {
         set("\x01",eval("\x01") + 619);
      }
   }
   else if(eval("\x01") == 543)
   {
      set("\x01",eval("\x01") - 323);
      §§push(!§§pop());
   }
   else if(eval("\x01") == 568)
   {
      set("\x01",eval("\x01") - 350);
      var §§pop() = §§pop();
   }
   else
   {
      if(eval("\x01") == 742)
      {
         set("\x01",eval("\x01") + 242);
         if(!_global.Thing)
         {
            _global.Thing = new Object();
         }
         §§pop();
         if(!_global.Thing.Object)
         {
            _global.Thing.Object = new Object();
         }
         §§pop();
         if(!_global.Thing.Object.CThing_Object_ChargePack)
         {
            Thing.Object.CThing_Object_ChargePack extends Thing.Object.CThing_Object;
            _loc2_ = Thing.Object.CThing_Object_ChargePack = function(tPosition, tAngle, tParent, tDamage)
            {
               super(tPosition.mCellCentre,tAngle,tParent);
               this.mDamage = tDamage != undefined ? tDamage : 100;
               this.mFlags |= Thing.CThing.mFlag_SortFloor;
               this.mClusterExplode = this.mBiggerBang = 0;
               if(!Thing.Object.CThing_Object_ChargePack.mcDrawObject_Cache)
               {
                  Thing.Object.CThing_Object_ChargePack.mcDrawObject_Cache = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation("Object.ChargePack");
               }
               this.mcDrawObject = Thing.Object.CThing_Object_ChargePack.mcDrawObject_Cache.Clone();
               this.Process = this.Process_Init;
            }.prototype;
            _loc2_.toString = function()
            {
               return this._CLASSID_;
            };
            _loc2_.Dispose = function()
            {
               super.Dispose();
            };
            _loc2_.Process_Init = function()
            {
               this.mWorld.mMap.mMapwho.MoveThing(this);
               this.mCurrentCell = this.mWorld.mMap.GetCell(this.mPosition.mX,this.mPosition.mY);
               this.mWorld.mUpgrades.Register_Object(this);
               this.Process = this.Process_Normal;
               this.Process();
            };
            _loc2_.Process_Normal = function()
            {
               this.mcDrawObject.Animate_Cycle(1 / CMain.mFPS);
               if(this.mDetonate)
               {
                  this.mDetonateCounter = CMain.mFPS / 10;
                  this.PlaySound(CSound.mSamples.Object_Mine_Detonate_wav);
                  this.Process = this.Process_Detonate;
                  this.Process();
               }
            };
            _loc2_.Process_Detonate = function()
            {
               this.mcDrawObject.Animate_Cycle(1);
               var _loc2_;
               if(--this.mDetonateCounter < 0)
               {
                  this.mWorld.mUpgrades.ApplyUpgrade_Object(this);
                  _loc2_ = this.mThing_Collection.AddThing_Effect(new Thing.Effect.CThing_Effect_Explosion(this.mPosition,this.mAngle,this.mParent,this.mDamage));
                  _loc2_.mClusterExplode = this.mClusterExplode;
                  _loc2_.mBiggerBang = this.mBiggerBang;
                  this.Delete();
               }
            };
            _loc2_.Draw = function()
            {
               Thing.CThing.pDraw.x = this.mPosition.mX * World.Map.CMap_Cell.mSize.x - this.mWorld.mDrawPosition.x;
               Thing.CThing.pDraw.y = (this.mPosition.mY + this.mPosition.mZ * Thing.Math.CThing_Position.mPFactor) * World.Map.CMap_Cell.mSize.y - this.mWorld.mDrawPosition.y;
               this.mcDrawObject.Render(this.mWorld.bmCurrentDraw,Thing.CThing.pDraw,1,100);
            };
            _loc2_._CLASSID_ = "CThing_Object_ChargePack";
            §§push(ASSetPropFlags(Thing.Object.CThing_Object_ChargePack.prototype,null,1));
         }
         §§pop();
         break;
      }
      if(eval("\x01") == 862)
      {
         set("\x01",eval("\x01") - 860);
         §§pop()[§§pop()] = §§pop();
         if(!Thing.Object.CThing_Object_ChargePack.CThing)
         {
            Thing.Object.CThing_Object_ChargePack.CThing = new mClusterExplode.mBiggerBang.mcDrawObject_Cache("mFlag_SortFloor");
         }
         Thing.Object.CThing_Object_ChargePack = function(tPosition, tAngle, tParent, tDamage)
         {
            super(tPosition.mCellCentre,tAngle,tParent);
            this.mDamage = tDamage != undefined ? tDamage : 100;
            this.mFlags |= Thing.CThing.mFlag_SortFloor;
            this.mClusterExplode = this.mBiggerBang = 0;
            if(!Thing.Object.CThing_Object_ChargePack.mcDrawObject_Cache)
            {
               Thing.Object.CThing_Object_ChargePack.mcDrawObject_Cache = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation("Object.ChargePack");
            }
            this.mcDrawObject = Thing.Object.CThing_Object_ChargePack.mcDrawObject_Cache.Clone();
            this.Process = this.Process_Init;
         }["Object.ChargePack"] = Thing.Object.CThing_Object_ChargePack = function(tPosition, tAngle, tParent, tDamage)
         {
            super(tPosition.mCellCentre,tAngle,tParent);
            this.mDamage = tDamage != undefined ? tDamage : 100;
            this.mFlags |= Thing.CThing.mFlag_SortFloor;
            this.mClusterExplode = this.mBiggerBang = 0;
            if(!Thing.Object.CThing_Object_ChargePack.mcDrawObject_Cache)
            {
               Thing.Object.CThing_Object_ChargePack.mcDrawObject_Cache = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation("Object.ChargePack");
            }
            this.mcDrawObject = Thing.Object.CThing_Object_ChargePack.mcDrawObject_Cache.Clone();
            this.Process = this.Process_Init;
         }.DrawPrimitive;
         Thing.Object.CThing_Object_ChargePack extends Thing.Object.MovieClip;
         _loc2_ = §§pop()[§§pop()] = §§pop().CDrawPrimitive_MovieClip_Animation;
         _loc2_.mcDrawObject = function()
         {
            return this.Clone;
         };
         _loc2_.Process = function()
         {
            super.Process();
            this.Process_Init.CThing_Object &= ~prototype.toString._CLASSID_.Dispose;
         };
         _loc2_.DrawPrimitive = function()
         {
            this.mY(Thing.mWorld.mMap.mMapwho | Thing.mWorld.mMap.MoveThing | Thing.mWorld.mMap.mCurrentCell | Thing.mWorld.mMap.mPosition);
            this.mX = this.GetCell = 0;
            this.mUpgrades = this.Register_Object = 1;
            this.Process_Normal = 1;
            this.CMain.mFPS.Animate_Cycle.mDetonate(this);
            this.Process_Init = this.CMain.mFPS.Object_Mine_Detonate_wav(this.mDetonateCounter.mSamples,this.mDetonateCounter.CSound);
            this.Process_Init.CThing_Object |= prototype.toString._CLASSID_.Dispose;
            this.CMain.PlaySound.Process_Detonate(this);
            this["Object.ChargePack"] = !(this.Process_Init.CThing_Object & prototype.toString._CLASSID_.ApplyUpgrade_Object) ? this.mParent : this.mAngle;
            this["Object.ChargePack"]();
         };
         _loc2_.mAngle = function()
         {
            if(this.Process_Init.CThing_Object & prototype.toString._CLASSID_.ApplyUpgrade_Object)
            {
               return undefined;
            }
            this.Effect |= Thing.CThing_Effect_Explosion.mThing_Collection;
            this["Object.ChargePack"] = this.AddThing_Effect;
            this["Object.ChargePack"]();
         };
         _loc2_.AddThing_Effect = function()
         {
            if(!this.Delete(0.42))
            {
               this["Object.ChargePack"] = this.mParent;
               this["Object.ChargePack"]();
            }
         };
         _loc2_.mParent = function()
         {
            this.Draw(0.42);
            this.Effect |= Thing.CThing_Effect_Explosion.mThing_Collection;
            this["Object.ChargePack"] = this.pDraw;
            this["Object.ChargePack"]();
         };
         _loc2_.pDraw = function()
         {
            if(this.x.World)
            {
               this.Map();
            }
         };
         _loc2_.CMap_Cell = function()
         {
            Thing.CThing_Effect_Explosion.mSize.mDrawPosition = this.mDetonateCounter.mSamples * prototype.toString._CLASSID_.y.mDrawPosition - this.CMain.mZ.mDrawPosition;
            Thing.CThing_Effect_Explosion.mSize.Math = (this.mDetonateCounter.CSound + this.mDetonateCounter.CThing_Position * Thing.mPFactor.bmCurrentDraw.Render) * prototype.toString._CLASSID_.y.Math - this.CMain.mZ.Math;
            Thing.Object.CThing_Object_ChargePack.CThing[§§constant(71)](this.CMain.ASSetPropFlags,Thing.CThing_Effect_Explosion.mSize,100);
         };
         _loc2_.Map = function()
         {
            var _loc4_ = this.x;
            this.x = new §\§\§constant(72)§();
            var _loc3_;
            var _loc2_;
            for(var _loc5_ in _loc4_)
            {
               _loc3_ = _loc4_[_loc5_];
               switch(_loc3_[§§constant(73)])
               {
                  case Thing.mWorld.mMap.mCurrentCell:
                  case Thing.mWorld.mMap.mMapwho:
                  case Thing.mWorld.mMap.mPosition:
                  case Thing.mWorld.mMap.MoveThing:
                     this.CMain.PlaySound[§§constant(74)](this);
                     this[§§constant(75)]();
                     _loc2_ = this[§§constant(80)][§§constant(81)](new Thing[§§constant(78)][§§constant(79)](this.mDetonateCounter,this[§§constant(77)],this[§§constant(76)],this.mFlags));
                     _loc2_.mX = this.mX;
                     _loc2_.GetCell = this.GetCell;
                     return undefined;
               }
            }
         };
         _loc2_.Clone = "CThing_Object_ChargePack";
         §§constant(82)(Thing.Object.CThing_Object_ChargePack.CDrawPrimitive_MovieClip_Animation,null,1);
         break;
      }
      if(eval("\x01") == 128)
      {
         set("\x01",eval("\x01") + 460);
         §§push(true);
      }
      else if(eval("\x01") == 588)
      {
         set("\x01",eval("\x01") + 274);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 860);
         }
      }
      else if(eval("\x01") == 347)
      {
         set("\x01",eval("\x01") + 196);
         §§push(eval(§§pop()));
      }
      else
      {
         if(eval("\x01") == 984)
         {
            set("\x01",eval("\x01") - 984);
            break;
         }
         if(eval("\x01") == 872)
         {
            set("\x01",eval("\x01") - 744);
         }
         else
         {
            if(eval("\x01") == 337)
            {
               set("\x01",eval("\x01") + 535);
               loop1:
               while(true)
               {
                  if(!§§pop())
                  {
                     set("\x01",eval("\x01") - 649);
                  }
                  else if(eval("\x01") == 881)
                  {
                     set("\x01",eval("\x01") - 323);
                     §§push("\x0f");
                  }
                  else if(eval("\x01") == 162)
                  {
                     set("\x01",eval("\x01") + 452);
                     if(§§pop())
                     {
                        set("\x01",eval("\x01") - 577);
                     }
                  }
                  else if(eval("\x01") == 862)
                  {
                     set("\x01",eval("\x01") - 467);
                  }
                  else if(eval("\x01") == 395)
                  {
                     set("\x01",eval("\x01") + 127);
                     §§push("\x0f");
                     §§push(1);
                  }
                  else if(eval("\x01") == 522)
                  {
                     set("\x01",eval("\x01") + 359);
                     var §§pop() = §§pop();
                  }
                  else if(eval("\x01") == 966)
                  {
                     set("\x01",eval("\x01") - 526);
                     §§push(!§§pop());
                  }
                  else
                  {
                     if(eval("\x01") != 440)
                     {
                        if(eval("\x01") == 166)
                        {
                           set("\x01",eval("\x01") + 580);
                           if(!eval("ͫ\x0f{invalid_utf8=133}")["\x03{invalid_utf8=156}{invalid_utf8=159}J"])
                           {
                              eval("ͫ\x0f{invalid_utf8=133}")["\x03{invalid_utf8=156}{invalid_utf8=159}J"] = new §{invalid_utf8=231}{invalid_utf8=136}Y\x17{invalid_utf8=197}§();
                           }
                           §§pop();
                           if(!eval("ͫ\x0f{invalid_utf8=133}")["\x03{invalid_utf8=156}{invalid_utf8=159}J"][§§constant(3)])
                           {
                              eval("ͫ\x0f{invalid_utf8=133}")["\x03{invalid_utf8=156}{invalid_utf8=159}J"][§§constant(3)] = new §{invalid_utf8=231}{invalid_utf8=136}Y\x17{invalid_utf8=197}§();
                           }
                           §§pop();
                           if(!eval("ͫ\x0f{invalid_utf8=133}")["\x03{invalid_utf8=156}{invalid_utf8=159}J"][§§constant(3)][§§constant(4)])
                           {
                              eval("\x03{invalid_utf8=156}{invalid_utf8=159}J")[§§constant(3)][§§constant(4)] extends eval("\x03{invalid_utf8=156}{invalid_utf8=159}J")[§§constant(3)][§§constant(21)];
                              _loc2_ = eval("\x03{invalid_utf8=156}{invalid_utf8=159}J")[§§constant(3)][§§constant(4)] = function(tPosition, tAngle, tParent, tDamage)
                              {
                                 super(tPosition,tAngle,tParent,tDamage);
                                 this[§§constant(5)] = this[§§constant(6)] = 16 + random(8);
                                 this[§§constant(7)] = this[§§constant(8)][§§constant(7)];
                                 this[§§constant(7)][§§constant(11)](1 * (0.05 + eval(§§constant(9))[§§constant(10)]() * 0.05));
                                 this[§§constant(7)][§§constant(12)] = 0.5;
                                 this[§§constant(13)](0.1);
                                 if(!eval("\x03{invalid_utf8=156}{invalid_utf8=159}J")[§§constant(3)][§§constant(4)][§§constant(14)])
                                 {
                                    eval("\x03{invalid_utf8=156}{invalid_utf8=159}J")[§§constant(3)][§§constant(4)][§§constant(14)] = new eval(§§constant(16))[§§constant(17)][§§constant(18)](§§constant(15));
                                 }
                                 this[§§constant(19)] = this[§§constant(20)];
                              }[§§constant(22)];
                              _loc2_[§§constant(23)] = function()
                              {
                                 return this[§§constant(24)];
                              };
                              _loc2_[§§constant(25)] = function()
                              {
                                 super[§§constant(25)]();
                              };
                              _loc2_[§§constant(20)] = function()
                              {
                                 var _loc2_ = false;
                                 this[§§constant(7)][§§constant(12)] -= 0.06;
                                 if(this[§§constant(26)][§§constant(12)] + this[§§constant(7)][§§constant(12)] < 0)
                                 {
                                    if((this[§§constant(7)][§§constant(12)] = eval(§§constant(9))[§§constant(27)](this[§§constant(7)][§§constant(12)])) <= 0.06)
                                    {
                                       this[§§constant(7)][§§constant(12)] = 0;
                                    }
                                    this[§§constant(7)][§§constant(11)](0.5);
                                    this[§§constant(26)][§§constant(12)] = 0;
                                    _loc2_ = true;
                                 }
                                 if(this[§§constant(28)][§§constant(29)][§§constant(30)][§§constant(31)](this))
                                 {
                                    _loc2_ = true;
                                    this[§§constant(7)][§§constant(32)](0.25);
                                 }
                                 if(_loc2_ && this[§§constant(7)][§§constant(33)]() > 0.06)
                                 {
                                    this[§§constant(37)](eval(§§constant(34))[§§constant(35)][§§constant(36)]);
                                 }
                                 this[§§constant(39)](this[§§constant(26)][§§constant(38)](this[§§constant(7)]));
                                 if(--this[§§constant(6)] == 0)
                                 {
                                    this[§§constant(43)][§§constant(44)](new eval("\x03{invalid_utf8=156}{invalid_utf8=159}J")[§§constant(41)][§§constant(42)](this[§§constant(26)],this[§§constant(8)],this,this[§§constant(40)]));
                                    this[§§constant(45)]();
                                 }
                              };
                              _loc2_[§§constant(46)] = function()
                              {
                                 eval("\x03{invalid_utf8=156}{invalid_utf8=159}J")[§§constant(3)][§§constant(4)][§§constant(14)][§§constant(49)](this[§§constant(28)][§§constant(48)],this[§§constant(28)][§§constant(47)](this[§§constant(26)]),100);
                              };
                              _loc2_[§§constant(24)] = §§constant(4);
                              §§push(§§constant(50)(eval("\x03{invalid_utf8=156}{invalid_utf8=159}J")[§§constant(3)][§§constant(4)][§§constant(22)],null,1));
                           }
                           §§pop();
                           break;
                        }
                        if(eval("\x01") == 746)
                        {
                           set("\x01",eval("\x01") - 746);
                        }
                        break;
                     }
                     set("\x01",eval("\x01") + 375);
                     if(§§pop())
                     {
                        set("\x01",eval("\x01") - 649);
                     }
                  }
                  while(true)
                  {
                     if(eval("\x01") == 16)
                     {
                        set("\x01",eval("\x01") + 146);
                        §§push(true);
                        continue;
                     }
                     if(eval("\x01") == 614)
                     {
                        break;
                     }
                     if(eval("\x01") == 37)
                     {
                        set("\x01",eval("\x01") + 358);
                        continue;
                     }
                     if(eval("\x01") == 558)
                     {
                        set("\x01",eval("\x01") + 408);
                        §§push(eval(§§pop()));
                        continue;
                     }
                     continue loop1;
                  }
                  set("\x01",eval("\x01") - 577);
                  break;
                  §§push(eval("\x01") != 815);
               }
               break;
            }
            if(eval("\x01") == 824)
            {
               set("\x01",eval("\x01") - 487);
               if(§§pop())
               {
                  set("\x01",eval("\x01") + 535);
               }
            }
            else if(eval("\x01") == 218)
            {
               set("\x01",eval("\x01") + 129);
               §§push("\x0f");
            }
            else if(eval("\x01") == 93)
            {
               set("\x01",eval("\x01") + 731);
               §§push(true);
            }
            else if(eval("\x01") == 610)
            {
               set("\x01",eval("\x01") - 42);
               §§push("\x0f");
               §§push(1);
            }
            else if(eval("\x01") == 290)
            {
               set("\x01",eval("\x01") + 320);
            }
            else if(eval("\x01") == 934)
            {
               set("\x01",eval("\x01") - 806);
            }
            else if(eval("\x01") == 802)
            {
               set("\x01",eval("\x01") - 709);
            }
            else
            {
               if(eval("\x01") != 265)
               {
                  if(eval("\x01") == 302)
                  {
                     set("\x01",eval("\x01") - 37);
                     §§push(mbchr(§§pop()));
                  }
                  break;
               }
               set("\x01",eval("\x01") - 172);
            }
         }
      }
   }
}
