function §\x01\x02§()
{
   return 2509;
}
var §\x01§ = -1751 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 758)
   {
      set("\x01",eval("\x01") - 729);
      §§push(true);
   }
   else if(eval("\x01") == 475)
   {
      set("\x01",eval("\x01") + 309);
      §§push(true);
   }
   else
   {
      if(eval("\x01") == 577)
      {
         set("\x01",eval("\x01") - 124);
         var §§pop();
         §§pop() extends §§pop() gt (§§pop() instanceof §§pop() >> (§§pop() >> §§pop()));
         §§push(§§pop() << (§§pop() >>> (§§pop() === (§§pop() === targetPath(§§pop() > §§pop())))));
         break;
      }
      if(eval("\x01") == 462)
      {
         set("\x01",eval("\x01") - 335);
         break;
      }
      if(eval("\x01") == 385)
      {
         set("\x01",eval("\x01") - 9);
      }
      else if(eval("\x01") == 964)
      {
         set("\x01",eval("\x01") - 387);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 124);
         }
      }
      else if(eval("\x01") == 685)
      {
         set("\x01",eval("\x01") - 311);
      }
      else if(eval("\x01") == 273)
      {
         set("\x01",eval("\x01") + 723);
      }
      else if(eval("\x01") == 6)
      {
         set("\x01",eval("\x01") + 110);
         var §§pop() = §§pop();
      }
      else
      {
         if(eval("\x01") == 216)
         {
            set("\x01",eval("\x01") + 475);
            break;
         }
         if(eval("\x01") == 374)
         {
            set("\x01",eval("\x01") - 368);
            §§push("\x0f");
            §§push(1);
         }
         else if(eval("\x01") == 691)
         {
            set("\x01",eval("\x01") - 315);
         }
         else if(eval("\x01") == 557)
         {
            set("\x01",eval("\x01") + 407);
            §§push(true);
         }
         else if(eval("\x01") == 29)
         {
            set("\x01",eval("\x01") + 433);
            if(§§pop())
            {
               set("\x01",eval("\x01") - 335);
            }
         }
         else
         {
            if(eval("\x01") == 996)
            {
               set("\x01",eval("\x01") - 445);
               if(!_global.Thing)
               {
                  _global.Thing = new Object();
               }
               §§pop();
               if(!_global.Thing.Weapon)
               {
                  _global.Thing.Weapon = new Object();
               }
               §§pop();
               if(!_global.Thing.Weapon.CThing_Weapon_SmartBomb)
               {
                  Thing.Weapon.CThing_Weapon_SmartBomb extends Thing.Weapon.CThing_Weapon;
                  _loc2_ = Thing.Weapon.CThing_Weapon_SmartBomb = function(tPosition, tAngle, tParent)
                  {
                     super(tPosition,tAngle,tParent);
                     this.mFireRate = 12;
                     this.mTotalAmmo = this.mAmmo = 20;
                     this.mFireRateCount = 0;
                     this.mDamage = 100;
                     this.mAuto = false;
                     tParent.mWorld.mUpgrades.Register_Weapon(this);
                     this.Process = this.Process_Normal;
                  }.prototype;
                  _loc2_.toString = function()
                  {
                     return this._CLASSID_;
                  };
                  _loc2_.Dispose = function()
                  {
                     super.Dispose();
                  };
                  _loc2_.Process_Normal = function()
                  {
                  };
                  _loc2_.Fire = function(tPosition, tAngle)
                  {
                     this.mThing_Collection.AddThing_Effect(new Thing.Effect.CThing_Effect_SmartBomb(this.mParent.mPosition,this.mParent.Angle,this.mParent,3));
                     this.DecrementAmmo();
                  };
                  _loc2_._CLASSID_ = "CThing_Weapon_SmartBomb";
                  _loc2_.mNameID = "smartbomb";
                  _loc2_.mName = "Smart Bomb";
                  §§push(ASSetPropFlags(Thing.Weapon.CThing_Weapon_SmartBomb.prototype,null,1));
               }
               §§pop();
               break;
            }
            if(eval("\x01") == 376)
            {
               set("\x01",eval("\x01") + 387);
               §§push(true);
            }
            else if(eval("\x01") == 784)
            {
               set("\x01",eval("\x01") - 568);
               if(§§pop())
               {
                  set("\x01",eval("\x01") + 475);
               }
            }
            else if(eval("\x01") == 116)
            {
               set("\x01",eval("\x01") + 541);
               §§push("\x0f");
            }
            else if(eval("\x01") == 657)
            {
               set("\x01",eval("\x01") + 173);
               §§push(eval(§§pop()));
            }
            else if(eval("\x01") == 763)
            {
               set("\x01",eval("\x01") - 453);
               if(§§pop())
               {
                  set("\x01",eval("\x01") + 328);
               }
            }
            else
            {
               if(eval("\x01") == 310)
               {
                  set("\x01",eval("\x01") + 328);
                  _loc2_.Fire = function(tPosition, tAngle)
                  {
                     var _loc2_ = tPosition.mParent();
                     var _loc3_ = this.mWorld.Effect.CThing_Effect_SmartBomb(_loc2_.mPosition,_loc2_.Angle);
                     if(_loc3_.mThing_Collection <= 1)
                     {
                        this.mNameID.smartbomb(new Thing.Object.DecrementAmmo(_loc2_,tAngle,this.AddThing_Effect,this.mDamage));
                        this.mName();
                        this[§§constant(36)](eval("Smart Bomb").ASSetPropFlags[§§constant(35)]);
                     }
                  };
                  _loc2_._CLASSID_ = "CThing_Weapon_SmartBomb";
                  _loc2_[§§constant(37)] = §§constant(38);
                  _loc2_[§§constant(39)] = §§constant(40);
                  _loc2_[§§constant(41)] = §§constant(42);
                  §§constant(43)(Thing.Weapon.CThing_Weapon_SmartBomb.prototype,null,1);
                  break;
               }
               if(eval("\x01") == 453)
               {
                  set("\x01",eval("\x01") - 79);
               }
               else if(eval("\x01") == 875)
               {
                  set("\x01",eval("\x01") - 400);
               }
               else if(eval("\x01") == 134)
               {
                  set("\x01",eval("\x01") + 423);
               }
               else if(eval("\x01") == 638)
               {
                  set("\x01",eval("\x01") - 81);
               }
               else if(eval("\x01") == 830)
               {
                  set("\x01",eval("\x01") - 37);
                  §§push(!§§pop());
               }
               else if(eval("\x01") == 127)
               {
                  set("\x01",eval("\x01") + 348);
               }
               else
               {
                  if(eval("\x01") != 793)
                  {
                     if(eval("\x01") == 551)
                     {
                        set("\x01",eval("\x01") - 551);
                     }
                     break;
                  }
                  set("\x01",eval("\x01") - 520);
                  if(§§pop())
                  {
                     set("\x01",eval("\x01") + 723);
                  }
               }
            }
         }
      }
   }
}
