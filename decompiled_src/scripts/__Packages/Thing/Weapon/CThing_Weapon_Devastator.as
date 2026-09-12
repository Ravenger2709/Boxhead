function §\x01\x02§()
{
   return 444;
}
var §\x01§ = 213 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 657)
   {
      set("\x01",eval("\x01") - 315);
      §§push(true);
   }
   else if(eval("\x01") == 527)
   {
      set("\x01",eval("\x01") - 310);
   }
   else
   {
      if(eval("\x01") == 619)
      {
         set("\x01",eval("\x01") - 14);
         break;
      }
      if(eval("\x01") == 614)
      {
         set("\x01",eval("\x01") - 87);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 310);
         }
      }
      else if(eval("\x01") == 342)
      {
         set("\x01",eval("\x01") + 277);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 14);
         }
      }
      else if(eval("\x01") == 659)
      {
         set("\x01",eval("\x01") + 148);
         var §§pop() = §§pop();
      }
      else if(eval("\x01") == 98)
      {
         set("\x01",eval("\x01") + 516);
         §§push(!§§pop());
      }
      else if(eval("\x01") == 605)
      {
         set("\x01",eval("\x01") + 208);
      }
      else
      {
         if(eval("\x01") == 217)
         {
            set("\x01",eval("\x01") + 708);
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
            if(!_global.Thing.Weapon.CThing_Weapon_Devastator)
            {
               Thing.Weapon.CThing_Weapon_Devastator extends Thing.Weapon.CThing_Weapon;
               _loc2_ = Thing.Weapon.CThing_Weapon_Devastator = function(tPosition, tAngle, tParent)
               {
                  super(tPosition,tAngle,tParent);
                  this.mFireRate = 4;
                  this.mTotalAmmo = this.mAmmo = Thing.Weapon.CThing_Weapon.mInfinateAmmo;
                  this.mFireRateCount = 0;
                  this.mDamage = 100;
                  this.mAuto = true;
                  this.mRange = 8;
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
                  super.Fire(tPosition,tAngle);
                  this.mThing_Collection.AddThing_Shot(new Thing.Shot.CThing_Shot_Devastator(tPosition,tAngle,this.mParent,this.mDamage));
               };
               _loc2_._CLASSID_ = "CThing_Weapon_Devastator";
               _loc2_.mNameID = "devastator";
               _loc2_.mName = "The Devastator";
               §§push(ASSetPropFlags(Thing.Weapon.CThing_Weapon_Devastator.prototype,null,1));
            }
            §§pop();
            break;
         }
         if(eval("\x01") == 925)
         {
            set("\x01",eval("\x01") - 925);
            break;
         }
         if(eval("\x01") == 526)
         {
            set("\x01",eval("\x01") - 428);
            §§push(eval(§§pop()));
         }
         else if(eval("\x01") == 624)
         {
            set("\x01",eval("\x01") + 189);
         }
         else if(eval("\x01") == 813)
         {
            set("\x01",eval("\x01") - 154);
            §§push("\x0f");
            §§push(1);
         }
         else
         {
            if(eval("\x01") != 807)
            {
               break;
            }
            set("\x01",eval("\x01") - 281);
            §§push("\x0f");
         }
      }
   }
}
