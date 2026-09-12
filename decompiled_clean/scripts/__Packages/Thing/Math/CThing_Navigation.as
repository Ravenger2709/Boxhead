class Thing.Math.CThing_Navigation
{
   var mMap;
   var mOwner;
   var _CLASSID_ = "CThing_Navigation";
   var _BASECLASSID_ = "CThing_Navigation";
   function CThing_Navigation(tOwner)
   {
      this.mOwner = tOwner;
      this.mMap = this.mOwner.mWorld.mMap;
   }
   function toString()
   {
      return this._CLASSID_;
   }
   function Dispose()
   {
      super.Dispose();
   }
   function MoveInDirection2(tDirection)
   {
      var _loc6_ = this.mMap.GetCell(this.mOwner.mPosition.mX,this.mOwner.mPosition.mY);
      var _loc4_;
      var _loc5_;
      var _loc3_;
      var _loc2_;
      if(_loc6_.CollideFlagsInDirection(tDirection) & World.Map.CMap_Cell.mCollide_NonMovable)
      {
         _loc4_ = 1;
         _loc5_ = 1;
         _loc3_ = tDirection - _loc4_;
         _loc2_ = tDirection + _loc4_;
         while(_loc5_ <= 3)
         {
            if(!(_loc6_.CollideFlagsInDirection(_loc3_) & World.Map.CMap_Cell.mCollide_NonMovable))
            {
               return _loc3_;
            }
            if(!(_loc6_.CollideFlagsInDirection(_loc2_) & World.Map.CMap_Cell.mCollide_NonMovable))
            {
               return _loc2_;
            }
            _loc5_++;
            _loc3_ -= _loc4_;
            _loc2_ += _loc4_;
         }
      }
      return tDirection;
   }
}
