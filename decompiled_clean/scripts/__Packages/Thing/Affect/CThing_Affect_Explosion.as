class Thing.Affect.CThing_Affect_Explosion extends Thing.Affect.CThing_Affect
{
   var mAffector;
   var mDamage;
   var mRange;
   var _CLASSID_ = "CThing_Affect_Explosion";
   function CThing_Affect_Explosion(tOwner, tAffector, tDamage, tRange)
   {
      super(Thing.Affect.CThing_Affect.mAffect_Explosion,tOwner,tAffector,tDamage);
      this.mRange = tRange;
   }
   function AffectThing(tThing)
   {
      var _loc4_ = tThing.mPosition.Distance2D(this.mAffector.mPosition);
      var _loc3_;
      var _loc2_;
      if(_loc4_ <= this.mRange)
      {
         _loc3_ = _loc4_ / this.mRange;
         _loc2_ = _loc3_ > 0.5 ? (_loc3_ > 0.75 ? this.mDamage * 0.5 : this.mDamage * 0.75) : this.mDamage;
         tThing.mLife -= _loc2_;
         return _loc2_;
      }
      return 0;
   }
}
