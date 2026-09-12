class Thing.Weapon.CThing_Weapon_Devastator extends Thing.Weapon.CThing_Weapon
{
   var Process;
   var mAmmo;
   var mAuto;
   var mDamage;
   var mFireRate;
   var mFireRateCount;
   var mParent;
   var mRange;
   var mThing_Collection;
   var mTotalAmmo;
   var _CLASSID_ = "CThing_Weapon_Devastator";
   var mNameID = "devastator";
   var mName = "The Devastator";
   function CThing_Weapon_Devastator(tPosition, tAngle, tParent)
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
   }
   function toString()
   {
      return this._CLASSID_;
   }
   function Dispose()
   {
      super.Dispose();
   }
   function Process_Normal()
   {
   }
   function Fire(tPosition, tAngle)
   {
      super.Fire(tPosition,tAngle);
      this.mThing_Collection.AddThing_Shot(new Thing.Shot.CThing_Shot_Devastator(tPosition,tAngle,this.mParent,this.mDamage));
   }
}
