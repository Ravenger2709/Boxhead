function §\x01\x02§()
{
   return 1695;
}
var §\x01§ = -963 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 732)
   {
      set("\x01",eval("\x01") - 113);
      §§push(true);
   }
   else if(eval("\x01") == 803)
   {
      set("\x01",eval("\x01") - 546);
      §§push(true);
   }
   else if(eval("\x01") == 9)
   {
      set("\x01",eval("\x01") + 896);
      §§push("\x0f");
      §§push(1);
   }
   else if(eval("\x01") == 785)
   {
      set("\x01",eval("\x01") - 704);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 12);
      }
   }
   else if(eval("\x01") == 90)
   {
      set("\x01",eval("\x01") + 713);
   }
   else if(eval("\x01") == 13)
   {
      set("\x01",eval("\x01") + 9);
   }
   else if(eval("\x01") == 86)
   {
      set("\x01",eval("\x01") + 358);
      §§push("\x0f");
   }
   else if(eval("\x01") == 264)
   {
      set("\x01",eval("\x01") + 539);
   }
   else if(eval("\x01") == 924)
   {
      set("\x01",eval("\x01") - 915);
   }
   else if(eval("\x01") == 444)
   {
      set("\x01",eval("\x01") + 85);
      §§push(eval(§§pop()));
   }
   else if(eval("\x01") == 626)
   {
      set("\x01",eval("\x01") - 434);
   }
   else if(eval("\x01") == 22)
   {
      set("\x01",eval("\x01") + 63);
      §§push(true);
   }
   else if(eval("\x01") == 619)
   {
      set("\x01",eval("\x01") - 20);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 586);
      }
   }
   else if(eval("\x01") == 529)
   {
      set("\x01",eval("\x01") + 288);
      §§push(!§§pop());
   }
   else
   {
      if(eval("\x01") == 599)
      {
         set("\x01",eval("\x01") - 586);
         eval(§§pop())["FC{invalid_utf8=233}|"][§§constant(4)][§§constant(15)] = new eval(§§constant(17))[§§constant(18)][§§constant(19)](§§constant(16),8);
         §§push(_loc1_);
         §§push(§§constant(20));
         §§push(_loc1_);
         §§push(§§constant(21));
         break;
      }
      if(eval("\x01") == 847)
      {
         set("\x01",eval("\x01") - 825);
      }
      else if(eval("\x01") == 85)
      {
         set("\x01",eval("\x01") + 368);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 189);
         }
      }
      else
      {
         if(eval("\x01") == 453)
         {
            set("\x01",eval("\x01") - 189);
            toggleHighQuality();
            §§push(substring(§§pop(),§§pop(),§§pop()));
            break;
         }
         if(eval("\x01") == 257)
         {
            set("\x01",eval("\x01") - 210);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 247);
            }
         }
         else if(eval("\x01") == 192)
         {
            set("\x01",eval("\x01") + 593);
            §§push(true);
         }
         else if(eval("\x01") == 905)
         {
            set("\x01",eval("\x01") - 819);
            var §§pop() = §§pop();
         }
         else
         {
            if(eval("\x01") == 47)
            {
               set("\x01",eval("\x01") + 247);
               §§pop() extends §§pop();
               §§push(§§pop() | §§pop() >>> (§§pop() > §§pop()));
            }
            else
            {
               if(eval("\x01") == 744)
               {
                  set("\x01",eval("\x01") + 133);
                  continue;
               }
               if(eval("\x01") == 877)
               {
                  set("\x01",eval("\x01") - 218);
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
                  if(!_global.Thing.Weapon.CThing_Weapon_ChargePack)
                  {
                     Thing.Weapon.CThing_Weapon_ChargePack extends Thing.Weapon.CThing_Weapon;
                     _loc2_ = Thing.Weapon.CThing_Weapon_ChargePack = function(tPosition, tAngle, tParent)
                     {
                        super(tPosition,tAngle,tParent);
                        this.mFireRate = 1;
                        this.mTotalAmmo = this.mAmmo = 10;
                        this.mFireRateCount = 0;
                        this.mDamage = 150;
                        this.mAuto = false;
                        tParent.mWorld.mUpgrades.Register_Weapon(this);
                        this.Reset();
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
                        var _loc2_;
                        var _loc4_;
                        var _loc5_;
                        if(this.mDetonate)
                        {
                           _loc2_ = this.mThing_Collection.SearchThings("mParent",this.mParent,this.mThing_Collection.SearchThings("_CLASSID_","CThing_Object_ChargePack"));
                           for(var _loc3_ in _loc2_)
                           {
                              _loc2_[_loc3_].mDetonate = true;
                           }
                           this.mDetonate = false;
                        }
                        else
                        {
                           this.PlaySound(CSound.mSamples.Weapon_Mine_Place_wav);
                           _loc4_ = tPosition.Clone();
                           _loc5_ = this.mWorld.mMap.GetCell(_loc4_.mX,_loc4_.mY);
                           if(_loc5_.mChildCount <= 1)
                           {
                              this.mThing_Collection.AddThing(new Thing.Object.CThing_Object_ChargePack(_loc4_,tAngle,this.mParent,this.mDamage));
                              this.mDetonate = true;
                              this.DecrementAmmo();
                           }
                        }
                     };
                     _loc2_.WeaponEmpty = function()
                     {
                        var _loc2_ = this.mThing_Collection.SearchThings("mParent",this.mParent,this.mThing_Collection.SearchThings("_CLASSID_","CThing_Object_ChargePack"));
                        return _loc2_.length == 0 && this.mAmmo <= 0;
                     };
                     _loc2_.Reset = function()
                     {
                        super.Reset();
                        var _loc3_ = this.mThing_Collection.SearchThings("mParent",this.mParent,this.mThing_Collection.SearchThings("_CLASSID_","CThing_Object_ChargePack"));
                        this.mDetonate = _loc3_.length && this.mAmmo <= 0;
                     };
                     _loc2_._CLASSID_ = "CThing_Weapon_ChargePack";
                     _loc2_.mNameID = "chargepack";
                     _loc2_.mName = "Charge Packs";
                     _loc2_.mShortName = "Charges";
                     §§push(ASSetPropFlags(Thing.Weapon.CThing_Weapon_ChargePack.prototype,null,1));
                  }
                  §§pop();
               }
               else
               {
                  if(eval("\x01") == 294)
                  {
                     set("\x01",eval("\x01") - 102);
                     continue;
                  }
                  if(eval("\x01") == 81)
                  {
                     set("\x01",eval("\x01") - 12);
                  }
                  else
                  {
                     if(eval("\x01") == 69)
                     {
                        set("\x01",eval("\x01") - 60);
                        continue;
                     }
                     if(eval("\x01") == 817)
                     {
                        set("\x01",eval("\x01") - 73);
                        if(§§pop())
                        {
                           set("\x01",eval("\x01") + 133);
                        }
                        continue;
                     }
                     if(eval("\x01") == 659)
                     {
                        set("\x01",eval("\x01") - 659);
                     }
                  }
               }
            }
            §§goto(addr100d);
         }
      }
   }
}
§§pop()[§§pop()] = §§pop()[§§pop()];
eval("{invalid_utf8=189}{invalid_utf8=190}r{invalid_utf8=161}")["FC{invalid_utf8=233}|"][§§constant(4)] extends eval("{invalid_utf8=189}{invalid_utf8=190}r{invalid_utf8=161}")["FC{invalid_utf8=233}|"][§§constant(22)];
_loc2_ = §§pop()[§§pop()] = §§pop()[§§constant(23)];
_loc2_[§§constant(24)] = function()
{
   return this[§§constant(25)];
};
_loc2_[§§constant(26)] = function()
{
   super[§§constant(26)]();
};
_loc2_[§§constant(21)] = function()
{
};
_loc2_[§§constant(27)] = function(tPosition, tAngle)
{
   super[§§constant(27)](tPosition,tAngle);
   this[§§constant(31)][§§constant(32)](new eval("{invalid_utf8=189}{invalid_utf8=190}r{invalid_utf8=161}")[§§constant(29)][§§constant(30)](tPosition[§§constant(28)](),tAngle,eval("{invalid_utf8=189}{invalid_utf8=190}r{invalid_utf8=161}")["FC{invalid_utf8=233}|"][§§constant(4)][§§constant(15)]));
   this[§§constant(31)][§§constant(36)](new eval("{invalid_utf8=189}{invalid_utf8=190}r{invalid_utf8=161}")[§§constant(34)][§§constant(35)](tPosition,tAngle,this[§§constant(33)],this[§§constant(9)],this[§§constant(11)]));
   this[§§constant(40)](eval(§§constant(37))[§§constant(38)][§§constant(39)]);
};
_loc2_[§§constant(25)] = §§constant(4);
_loc2_[§§constant(41)] = §§constant(42);
_loc2_[§§constant(43)] = §§constant(44);
_loc2_[§§constant(45)] = §§constant(44);
§§constant(46)(eval("{invalid_utf8=189}{invalid_utf8=190}r{invalid_utf8=161}")["FC{invalid_utf8=233}|"][§§constant(4)][§§constant(23)],null,1);
addr100d:
