class Thing.Weapon.CThing_Weapon_FakeWall extends Thing.Weapon.CThing_Weapon
{
   var DecrementAmmo;
   var PlaySound;
   var Process;
   var mAmmo;
   var mAuto;
   var mDamage;
   var mFireRate;
   var mFireRateCount;
   var mParent;
   var mThing_Collection;
   var mTotalAmmo;
   var mWorld;
   var _CLASSID_ = "CThing_Weapon_FakeWall";
   var mNameID = "fakewall";
   var mName = "Fake Walls";
   var mShortName = "Walls";
   function CThing_Weapon_FakeWall(tPosition, tAngle, tParent)
   {
      super(tPosition,tAngle,tParent);
      this.mFireRate = 1;
      this.mTotalAmmo = this.mAmmo = 5;
      this.mFireRateCount = 0;
      this.mDamage = 100;
      this.mAuto = false;
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
      var _loc2_ = tPosition.Clone();
      var _loc3_ = this.mWorld.mMap.GetCell(_loc2_.mX,_loc2_.mY);
      if(_loc3_.mChildCount <= 1)
      {
         this.mThing_Collection.AddThing(new Thing.Object.CThing_Object_Wall(_loc2_,tAngle,this.mParent));
         this.DecrementAmmo();
         this.PlaySound(CSound.mSamples.Object_Barrel_Place_wav);
      }
   }
}
