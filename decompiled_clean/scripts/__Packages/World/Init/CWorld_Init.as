class World.Init.CWorld_Init extends MovieClip
{
   var mWorld;
   var _CLASSID_ = "CWorld_Init";
   var _BASECLASSID_ = "CWorld_Init";
   function CWorld_Init()
   {
      super();
      this.mWorld = this.FindParent("CWorld");
      this.mWorld.AddInitObject(this);
   }
   function FindParent(tClassID)
   {
      var _loc3_ = 0;
      var _loc2_ = this._parent;
      while(_loc3_ < 10)
      {
         if(_loc2_._CLASSID_ == tClassID)
         {
            return _loc2_;
         }
         _loc2_ = _loc2_._parent;
         _loc3_++;
      }
      return undefined;
   }
   function GetPosition(mc)
   {
      var _loc2_ = new flash.geom.Point(0,0);
      mc.localToGlobal(_loc2_);
      this.mWorld.globalToLocal(_loc2_);
      return new Thing.Math.CThing_Position(_loc2_.x,_loc2_.y,0);
   }
   function get mPosition()
   {
      return this.GetPosition(this);
   }
   function get mPosition2()
   {
      var _loc2_ = this.mPosition;
      return new Thing.Math.CThing_Position(_loc2_.mX + this._width,_loc2_.mY + this._height,0);
   }
   function get mAngle()
   {
      var _loc2_ = this._rotation * Thing.Math.CThing_Angle.Deg2Rad;
      return new Thing.Math.CThing_Angle(_loc2_);
   }
   function toString()
   {
      return this._CLASSID_ + "," + this._x + "," + this._y + "," + this._width + "," + this._height;
   }
   function Dispose()
   {
      this.removeMovieClip();
   }
}
