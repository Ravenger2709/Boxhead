class Thing.Effect.CThing_Effect_RocketSmoke extends Thing.Effect.CThing_Effect
{
   var Delete;
   var Move;
   var Process;
   var mAngle;
   var mDelta;
   var mPosition;
   var mWorld;
   var mcDrawObject;
   static var mcDrawObject_Cache;
   var _CLASSID_ = "CThing_Effect_RocketSmoke";
   function CThing_Effect_RocketSmoke(tPosition, tAngle, tParent)
   {
      super(tPosition,tAngle,tParent);
      if(!Thing.Effect.CThing_Effect_RocketSmoke.mcDrawObject_Cache)
      {
         Thing.Effect.CThing_Effect_RocketSmoke.mcDrawObject_Cache = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation("Effect.RocketSmoke");
      }
      this.mcDrawObject = Thing.Effect.CThing_Effect_RocketSmoke.mcDrawObject_Cache.Clone();
      this.mDelta = this.mAngle.mDelta.ScaleN(0.5).Invert();
      this.Process = this.Process_Init;
   }
   function toString()
   {
      return this._CLASSID_;
   }
   function Dispose()
   {
      super.Dispose();
   }
   function Process_Init()
   {
      this.mWorld.mMap.mMapwho.MoveThing(this);
      this.Process = this.Process_Normal;
      this.Process();
   }
   function Process_Normal()
   {
      this.Move(this.mPosition.Add(this.mDelta.ScaleN(1.2)));
      if(this.mcDrawObject.Animate(1))
      {
         this.Delete();
      }
   }
   function Draw()
   {
      this.mcDrawObject.Render(this.mWorld.bmCurrentDraw,this.mWorld.GetScreenPosition(this.mPosition),1,100);
   }
}
