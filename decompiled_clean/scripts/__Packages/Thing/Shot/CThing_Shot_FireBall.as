class Thing.Shot.CThing_Shot_FireBall extends Thing.Shot.CThing_Shot
{
   var Delete;
   var Move;
   var Process;
   var SetRadius;
   var mAngle;
   var mDamage;
   var mDamageMultiply;
   var mDelta;
   var mParent;
   var mPosition;
   var mRadius;
   var mWorld;
   var mcDrawObject;
   var oCollide;
   static var mcDrawObject_Cache;
   var _CLASSID_ = "CThing_Shot_FireBall";
   static var mCollideRadius = 0.1;
   function CThing_Shot_FireBall(tPosition, tAngle, tParent, tDamage, tDamageMultiply, tSpeed)
   {
      super(tPosition,tAngle,tParent,tDamage);
      if(!Thing.Shot.CThing_Shot_FireBall.mcDrawObject_Cache)
      {
         Thing.Shot.CThing_Shot_FireBall.mcDrawObject_Cache = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation("Effect.FireBall");
      }
      this.mcDrawObject = Thing.Shot.CThing_Shot_FireBall.mcDrawObject_Cache.Clone();
      this.mDamageMultiply = tDamageMultiply;
      this.mDelta = this.mAngle.mDelta.ScaleN(tSpeed != undefined ? tSpeed : 0.15);
      this.Process = this.Process_Init;
      this.mDamage = tDamage;
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
      this.SetRadius(!this.mDamageMultiply ? 0.25 : 1);
      this.oCollide = this.mWorld.mMap.mCollide;
      this.Process = this.Process_Normal;
      this.Process();
   }
   function Process_Normal()
   {
      this.mDelta.ScaleN(1.02);
      var _loc2_;
      if(this.oCollide.GenericCollide(this))
      {
         _loc2_ = new flash.geom.Rectangle(this.mPosition.mX - this.mRadius,this.mPosition.mY - this.mRadius,this.mRadius * 2,this.mRadius * 2);
         this.mWorld.mMap.mAffect.AffectArea(_loc2_,!this.mDamageMultiply ? new Thing.Affect.CThing_Affect_FireBall(this.mParent,this,this.mDamage,this.mAngle) : new Thing.Affect.CThing_Affect_DevilAttack(this.mParent,this,10000,this.mAngle));
         this.Delete();
         return undefined;
      }
      this.Move(this.mPosition.Add(this.mDelta));
      this.mcDrawObject.Animate_Cycle(1);
   }
   function Draw()
   {
      this.mcDrawObject.Render(this.mWorld.bmCurrentDraw,this.mWorld.GetScreenPosition(this.mPosition),1,100);
   }
}
