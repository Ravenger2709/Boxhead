function §\x01\x02§()
{
   return 396;
}
var §\x01§ = 265 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 661)
   {
      set("\x01",eval("\x01") - 253);
      §§push(true);
   }
   else if(eval("\x01") == 228)
   {
      set("\x01",eval("\x01") - 92);
   }
   else
   {
      if(eval("\x01") == 550)
      {
         set("\x01",eval("\x01") - 80);
         §§pop()[§§pop()] = (§§pop()[§§pop()] + _loc1_[§§constant(25)][§§constant(67)] * eval("4{invalid_utf8=240}(6{invalid_utf8=166}")[§§constant(68)][§§constant(69)][§§constant(70)]) * eval(§§constant(31))[§§constant(32)][§§constant(33)][§§constant(64)][§§constant(66)] - _loc1_[§§constant(20)][§§constant(65)][§§constant(66)];
         _loc1_[§§constant(10)][§§constant(72)](_loc1_[§§constant(20)][§§constant(71)],eval("4{invalid_utf8=240}(6{invalid_utf8=166}")[§§constant(48)][§§constant(62)],1,_loc1_[§§constant(14)]);
         §§pop()[§§pop()] = §§pop();
         _loc2_[§§constant(18)] = "{invalid_utf8=166}{invalid_utf8=134}{invalid_utf8=203}";
         §§constant(73)(eval("4{invalid_utf8=240}(6{invalid_utf8=166}")["Fm{invalid_utf8=245}u"]["{invalid_utf8=166}{invalid_utf8=134}{invalid_utf8=203}"][§§constant(16)],null,1);
         break;
      }
      if(eval("\x01") == 469)
      {
         set("\x01",eval("\x01") - 333);
      }
      else if(eval("\x01") == 255)
      {
         set("\x01",eval("\x01") + 734);
      }
      else if(eval("\x01") == 322)
      {
         set("\x01",eval("\x01") + 381);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 234);
         }
      }
      else if(eval("\x01") == 136)
      {
         set("\x01",eval("\x01") + 536);
         §§push(true);
      }
      else
      {
         if(eval("\x01") == 703)
         {
            set("\x01",eval("\x01") - 234);
            nextFrame();
            toggleHighQuality();
            return §§pop()[§§pop() or §§pop()];
         }
         if(eval("\x01") == 989)
         {
            set("\x01",eval("\x01") - 667);
            §§push(true);
         }
         else if(eval("\x01") == 470)
         {
            set("\x01",eval("\x01") + 519);
         }
         else if(eval("\x01") == 408)
         {
            set("\x01",eval("\x01") + 142);
            if(§§pop())
            {
               set("\x01",eval("\x01") - 80);
            }
         }
         else if(eval("\x01") == 23)
         {
            set("\x01",eval("\x01") + 552);
            §§push("\x0f");
         }
         else if(eval("\x01") == 535)
         {
            set("\x01",eval("\x01") + 445);
            if(§§pop())
            {
               set("\x01",eval("\x01") - 476);
            }
         }
         else if(eval("\x01") == 672)
         {
            set("\x01",eval("\x01") + 171);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 2);
            }
         }
         else
         {
            if(eval("\x01") == 843)
            {
               set("\x01",eval("\x01") + 2);
               loop1:
               while(true)
               {
                  if(eval(§§pop()) == 774)
                  {
                     set("\x01",eval("\x01") - 64);
                  }
                  else if(eval("\x01") == 710)
                  {
                     set("\x01",eval("\x01") + 164);
                     §§push("\x0f");
                     §§push(1);
                  }
                  else if(eval("\x01") == 874)
                  {
                     set("\x01",eval("\x01") - 301);
                     var §§pop() = §§pop();
                  }
                  else if(eval("\x01") == 970)
                  {
                     set("\x01",eval("\x01") - 726);
                     §§push(eval(§§pop()));
                  }
                  else
                  {
                     if(eval("\x01") != 246)
                     {
                        if(eval("\x01") == 531)
                        {
                           set("\x01",eval("\x01") - 162);
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
                           if(!_global.Thing.Object.CThing_Object_Barrel)
                           {
                              Thing.Object.CThing_Object_Barrel extends Thing.Object.CThing_Object;
                              _loc2_ = Thing.Object.CThing_Object_Barrel = function(tPosition, tAngle, tParent, tDamage)
                              {
                                 super(tPosition.mCellCentre,tAngle,tParent);
                                 this.MakeIDUnique();
                                 this.mDamage = tDamage != undefined ? tDamage : 100;
                                 if(!Thing.Object.CThing_Object_Barrel.mcDrawObject)
                                 {
                                    Thing.Object.CThing_Object_Barrel.mcDrawObject = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Static("Object.Barrel");
                                 }
                                 this.Process = this.Process_Init;
                              }.prototype;
                              _loc2_.toString = function()
                              {
                                 return this._CLASSID_;
                              };
                              _loc2_.Dispose = function()
                              {
                                 super.Dispose();
                                 this.mCurrentCell.mCollide &= ~World.Map.CMap_Cell.mCollide_Object;
                              };
                              _loc2_.Process_Init = function()
                              {
                                 this.Affect_Setup(Thing.Affect.CThing_Affect.mAffect_Bullet | Thing.Affect.CThing_Affect.mAffect_Explosion | Thing.Affect.CThing_Affect.mAffect_DevilAttack | Thing.Affect.CThing_Affect.mAffect_FireBall);
                                 this.mClusterExplode = this.mBiggerBang = 0;
                                 this.mMaxLife = this.mLife = 1;
                                 this.mHeight = 1;
                                 this.mWorld.mMap.mMapwho.MoveThing(this);
                                 this.mCurrentCell = this.mWorld.mMap.GetCell(this.mPosition.mX,this.mPosition.mY);
                                 this.mCurrentCell.mCollide |= World.Map.CMap_Cell.mCollide_Object;
                                 this.mWorld.mUpgrades.Register_Object(this);
                                 this.Process = !(this.mCurrentCell.mCollide & World.Map.CMap_Cell.mCollide_Player) ? this.Process_Normal_Init : this.Process_PlayerOnCell;
                                 this.Process();
                              };
                              _loc2_.Process_PlayerOnCell = function()
                              {
                                 if(this.mCurrentCell.mCollide & World.Map.CMap_Cell.mCollide_Player)
                                 {
                                    return undefined;
                                 }
                                 this.mFlags |= Thing.CThing.mFlag_Collidable;
                                 this.Process = this.Process_GrowRadius;
                                 this.Process();
                              };
                              _loc2_.Process_GrowRadius = function()
                              {
                                 if(!this.GrowRadius(0.42))
                                 {
                                    this.Process = this.Process_Normal_Init;
                                    this.Process();
                                 }
                              };
                              _loc2_.Process_Normal_Init = function()
                              {
                                 this.SetRadius(0.42);
                                 this.mFlags |= Thing.CThing.mFlag_Collidable;
                                 this.Process = this.Process_Normal;
                                 this.Process();
                              };
                              _loc2_.Process_Normal = function()
                              {
                                 if(this.mAffectors.length)
                                 {
                                    this.ProcessAffects();
                                 }
                              };
                              _loc2_.Draw = function()
                              {
                                 Thing.CThing.pDraw.x = this.mPosition.mX * World.Map.CMap_Cell.mSize.x - this.mWorld.mDrawPosition.x;
                                 Thing.CThing.pDraw.y = (this.mPosition.mY + this.mPosition.mZ * Thing.Math.CThing_Position.mPFactor) * World.Map.CMap_Cell.mSize.y - this.mWorld.mDrawPosition.y;
                                 Thing.Object.CThing_Object_Barrel.mcDrawObject.Render(this.mWorld.bmCurrentDraw,Thing.CThing.pDraw,100);
                              };
                              _loc2_.ProcessAffects = function()
                              {
                                 var _loc4_ = this.mAffectors;
                                 this.mAffectors = new Array();
                                 var _loc3_;
                                 var _loc2_;
                                 for(var _loc5_ in _loc4_)
                                 {
                                    _loc3_ = _loc4_[_loc5_];
                                    switch(_loc3_.mType)
                                    {
                                       case Thing.Affect.CThing_Affect.mAffect_DevilAttack:
                                       case Thing.Affect.CThing_Affect.mAffect_Bullet:
                                       case Thing.Affect.CThing_Affect.mAffect_FireBall:
                                       case Thing.Affect.CThing_Affect.mAffect_Explosion:
                                          this.mWorld.mUpgrades.ApplyUpgrade_Object(this);
                                          this.Delete();
                                          _loc2_ = this.mThing_Collection.AddThing_Effect(new Thing.Effect.CThing_Effect_Explosion(this.mPosition,this.mAngle,this.mParent,this.mDamage));
                                          _loc2_.mClusterExplode = this.mClusterExplode;
                                          _loc2_.mBiggerBang = this.mBiggerBang;
                                          return undefined;
                                    }
                                 }
                              };
                              _loc2_._CLASSID_ = "CThing_Object_Barrel";
                              §§push(ASSetPropFlags(Thing.Object.CThing_Object_Barrel.prototype,null,1));
                           }
                           §§pop();
                           break;
                        }
                        if(eval("\x01") == 369)
                        {
                           set("\x01",eval("\x01") - 369);
                        }
                        break;
                     }
                     set("\x01",eval("\x01") + 311);
                     if(§§pop())
                     {
                        set("\x01",eval("\x01") - 26);
                     }
                  }
                  while(true)
                  {
                     if(eval("\x01") == 397)
                     {
                        set("\x01",eval("\x01") - 263);
                        §§push(true);
                        continue;
                     }
                     if(eval("\x01") == 134)
                     {
                        set("\x01",eval("\x01") + 394);
                        if(§§pop())
                        {
                           set("\x01",eval("\x01") - 163);
                        }
                        continue;
                     }
                     if(eval("\x01") == 573)
                     {
                        set("\x01",eval("\x01") + 397);
                        §§push("\x0f");
                        continue;
                     }
                     if(eval("\x01") == 244)
                     {
                        set("\x01",eval("\x01") + 2);
                        §§push(!§§pop());
                        continue;
                     }
                     if(eval("\x01") == 557)
                     {
                        set("\x01",eval("\x01") - 26);
                        continue;
                     }
                     if(eval("\x01") == 528)
                     {
                        break;
                     }
                     if(eval("\x01") == 365)
                     {
                        set("\x01",eval("\x01") + 345);
                        continue;
                     }
                     continue loop1;
                  }
                  set("\x01",eval("\x01") - 163);
                  §§pop()[§§pop()]();
                  Thing.Object.CThing_Object_Barrel = function(tPosition, tAngle, tParent, tDamage)
                  {
                     super(tPosition.mCellCentre,tAngle,tParent);
                     this.MakeIDUnique();
                     this.mDamage = tDamage != undefined ? tDamage : 100;
                     if(!Thing.Object.CThing_Object_Barrel.mcDrawObject)
                     {
                        Thing.Object.CThing_Object_Barrel.mcDrawObject = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Static("Object.Barrel");
                     }
                     this.Process = this.Process_Init;
                  }.Process = Thing.CThing_Object_Barrel.DrawPrimitive.mAffect_Explosion(_loc2_);
                  _loc2_.mAffect_DevilAttack();
                  (Thing.Object.CThing_Object_Barrel = function(tPosition, tAngle, tParent, tDamage)
                  {
                     super(tPosition.mCellCentre,tAngle,tParent);
                     this.MakeIDUnique();
                     this.mDamage = tDamage != undefined ? tDamage : 100;
                     if(!Thing.Object.CThing_Object_Barrel.mcDrawObject)
                     {
                        Thing.Object.CThing_Object_Barrel.mcDrawObject = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Static("Object.Barrel");
                     }
                     this.Process = this.Process_Init;
                  }).mAffect_FireBall();
                  §§pop()[§§pop()] = §§pop();
                  _loc2_.Affect_Setup = "__get__mCellCentre";
                  Thing.Object.CThing_Object_Barrel = function(tPosition, tAngle, tParent, tDamage)
                  {
                     super(tPosition.mCellCentre,tAngle,tParent);
                     this.MakeIDUnique();
                     this.mDamage = tDamage != undefined ? tDamage : 100;
                     if(!Thing.Object.CThing_Object_Barrel.mcDrawObject)
                     {
                        Thing.Object.CThing_Object_Barrel.mcDrawObject = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Static("Object.Barrel");
                     }
                     this.Process = this.Process_Init;
                  }.prototype = new mClusterExplode.mBiggerBang.mMaxLife(0,0);
                  mLife(Thing.CThing_Object_Barrel.__get__mCellCentre.MovieClip,null,1);
                  break;
                  §§push("\x01");
               }
               break;
            }
            if(eval("\x01") == 396)
            {
               set("\x01",eval("\x01") - 227);
            }
            else if(eval("\x01") == 845)
            {
               set("\x01",eval("\x01") - 676);
            }
            else if(eval("\x01") == 88)
            {
               set("\x01",eval("\x01") + 447);
               §§push(!§§pop());
            }
            else if(eval("\x01") == 169)
            {
               set("\x01",eval("\x01") + 735);
               §§push("\x0f");
               §§push(1);
            }
            else if(eval("\x01") == 980)
            {
               set("\x01",eval("\x01") - 476);
            }
            else if(eval("\x01") == 904)
            {
               set("\x01",eval("\x01") - 881);
               var §§pop() = §§pop();
            }
            else
            {
               if(eval("\x01") == 504)
               {
                  set("\x01",eval("\x01") - 435);
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
                  if(!_global.Thing.Object.CThing_Object_Barrel)
                  {
                     Thing.Object.CThing_Object_Barrel extends Thing.Object.mDamage;
                     _loc2_ = Thing.Object.CThing_Object_Barrel = function(tPosition, tAngle, tParent)
                     {
                        super(tPosition,tAngle,tParent);
                        this.__get__mCellCentre = this.MakeIDUnique;
                     }.mcDrawObject;
                     _loc2_["Object.Barrel"] = function()
                     {
                        return this.DrawPrimitive;
                     };
                     _loc2_.MovieClip = function()
                     {
                        super.MovieClip();
                     };
                     _loc2_.MakeIDUnique = function()
                     {
                     };
                     _loc2_.DrawPrimitive = "CThing_Object_Barrel";
                     §§push(CDrawPrimitive_MovieClip_Static(Thing.Object.CThing_Object_Barrel.mcDrawObject,null,1));
                  }
                  §§pop();
                  break;
               }
               if(eval("\x01") != 575)
               {
                  if(eval("\x01") == 69)
                  {
                     set("\x01",eval("\x01") - 69);
                  }
                  break;
               }
               set("\x01",eval("\x01") - 487);
               §§push(eval(§§pop()));
            }
         }
      }
   }
}
