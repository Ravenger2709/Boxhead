class Thing.Object.CThing_Object_WallMovable extends Thing.Object.CThing_Object
{
   var Process;
   var _CLASSID_ = "CThing_Object_WallMovable";
   function CThing_Object_WallMovable(tPosition, tAngle, tParent)
   {
      super(tPosition,tAngle,tParent);
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
}
