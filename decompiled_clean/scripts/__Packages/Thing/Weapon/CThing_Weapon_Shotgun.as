class Thing.Weapon.CThing_Weapon_Shotgun extends Thing.Weapon.CThing_Weapon
{
   var PlaySound;
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
   var mWideShot;
   static var mcMuzzleFlash;
   var _CLASSID_ = "CThing_Weapon_Shotgun";
   var mNameID = "shotgun";
   var mName = "Shotgun";
   var mShortName = "Shotgun";
   function CThing_Weapon_Shotgun(tPosition, tAngle, tParent)
   {
      super(tPosition,tAngle,tParent);
      this.mFireRate = 12;
      this.mTotalAmmo = this.mAmmo = 20;
      this.mFireRateCount = 0;
      this.mDamage = 51;
      this.mAuto = false;
      this.mRange = 7;
      this.mWideShot = 0;
      tParent.mWorld.mUpgrades.Register_Weapon(this);
      if(!Thing.Weapon.CThing_Weapon_Shotgun.mcMuzzleFlash)
      {
         Thing.Weapon.CThing_Weapon_Shotgun.mcMuzzleFlash = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_OmniDirectional("Shotgun.MuzzleFlash",8);
      }
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
      this.mThing_Collection.AddThing_Effect(new Thing.Effect.CThing_Effect_MuzzleFlash(tPosition.Clone(),tAngle,Thing.Weapon.CThing_Weapon_Shotgun.mcMuzzleFlash));
      this.PlaySound(CSound.mSamples.Weapon_Shotgun_Fire_wav);
      var _loc6_ = this.mRange;
      var _loc8_ = this.mParent;
      this.mThing_Collection.AddThing_Shot(new Thing.Shot.CThing_Shot_Bullet(tPosition.Clone(),tAngle,_loc8_,this.mDamage,_loc6_));
      var _loc3_ = 0;
      var _loc5_ = 1.25 * (this.mWideShot + 1);
      var _loc4_ = _loc5_;
      while(_loc3_ <= (!this.mWideShot ? 0 : 1))
      {
         this.mThing_Collection.AddThing_Shot(new Thing.Shot.CThing_Shot_Bullet(tPosition.Clone(),new Thing.Math.CThing_Angle(tAngle.mAngle - _loc4_ * 3.141592653589793 / 180),_loc8_,this.mDamage,_loc6_,_loc3_ >= 1));
         this.mThing_Collection.AddThing_Shot(new Thing.Shot.CThing_Shot_Bullet(tPosition.Clone(),new Thing.Math.CThing_Angle(tAngle.mAngle + _loc4_ * 3.141592653589793 / 180),_loc8_,this.mDamage,_loc6_,_loc3_ >= 1));
         _loc3_++;
         _loc4_ += _loc5_;
      }
   }
}
