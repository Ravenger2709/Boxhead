function §\x01\x02§()
{
   return 22;
}
var §\x01§ = 974 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 996)
   {
      set("\x01",eval("\x01") - 652);
      §§push(true);
   }
   else if(eval("\x01") == 914)
   {
      set("\x01",eval("\x01") - 200);
      §§push(!§§pop());
   }
   else
   {
      if(eval("\x01") == 799)
      {
         set("\x01",eval("\x01") - 173);
         break;
      }
      if(eval("\x01") == 580)
      {
         set("\x01",eval("\x01") + 334);
         §§push(eval(§§pop()));
      }
      else if(eval("\x01") == 714)
      {
         set("\x01",eval("\x01") + 87);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 651);
         }
      }
      else
      {
         if(eval("\x01") == 27)
         {
            set("\x01",eval("\x01") + 59);
            break;
         }
         if(eval("\x01") == 626)
         {
            set("\x01",eval("\x01") + 263);
         }
         else if(eval("\x01") == 728)
         {
            set("\x01",eval("\x01") - 701);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 59);
            }
         }
         else if(eval("\x01") == 344)
         {
            set("\x01",eval("\x01") + 455);
            if(§§pop())
            {
               set("\x01",eval("\x01") - 173);
            }
         }
         else if(eval("\x01") == 567)
         {
            set("\x01",eval("\x01") + 322);
         }
         else if(eval("\x01") == 933)
         {
            set("\x01",eval("\x01") - 353);
            §§push("\x0f");
         }
         else if(eval("\x01") == 86)
         {
            set("\x01",eval("\x01") + 764);
         }
         else if(eval("\x01") == 68)
         {
            set("\x01",eval("\x01") + 865);
            var §§pop() = §§pop();
         }
         else if(eval("\x01") == 889)
         {
            set("\x01",eval("\x01") - 161);
            §§push(true);
         }
         else if(eval("\x01") == 684)
         {
            set("\x01",eval("\x01") + 166);
         }
         else if(eval("\x01") == 801)
         {
            set("\x01",eval("\x01") - 651);
         }
         else
         {
            if(eval("\x01") == 150)
            {
               set("\x01",eval("\x01") - 68);
               if(!_global.Thing)
               {
                  _global.Thing = new Object();
               }
               §§pop();
               if(!_global.Thing.Shot)
               {
                  _global.Thing.Shot = new Object();
               }
               §§pop();
               if(!_global.Thing.Shot.CThing_Shot_FireBall)
               {
                  Thing.Shot.CThing_Shot_FireBall extends Thing.Shot.CThing_Shot;
                  _loc2_ = Thing.Shot.CThing_Shot_FireBall = function(tPosition, tAngle, tParent, tDamage, tDamageMultiply, tSpeed)
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
                  }.prototype;
                  _loc2_.toString = function()
                  {
                     return this._CLASSID_;
                  };
                  _loc2_.Dispose = function()
                  {
                     super.Dispose();
                  };
                  _loc2_.Process_Init = function()
                  {
                     this.mWorld.mMap.mMapwho.MoveThing(this);
                     this.SetRadius(!this.mDamageMultiply ? 0.25 : 1);
                     this.oCollide = this.mWorld.mMap.mCollide;
                     this.Process = this.Process_Normal;
                     this.Process();
                  };
                  _loc2_.Process_Normal = function()
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
                  };
                  _loc2_.Draw = function()
                  {
                     this.mcDrawObject.Render(this.mWorld.bmCurrentDraw,this.mWorld.GetScreenPosition(this.mPosition),1,100);
                  };
                  _loc2_._CLASSID_ = "CThing_Shot_FireBall";
                  Thing.Shot.CThing_Shot_FireBall = function(tPosition, tAngle, tParent, tDamage, tDamageMultiply, tSpeed)
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
                  }.mCollideRadius = 0.1;
                  §§push(ASSetPropFlags(Thing.Shot.CThing_Shot_FireBall.prototype,null,1));
               }
               §§pop();
               break;
            }
            if(eval("\x01") != 850)
            {
               if(eval("\x01") == 82)
               {
                  set("\x01",eval("\x01") - 82);
               }
               break;
            }
            set("\x01",eval("\x01") - 782);
            §§push("\x0f");
            §§push(1);
         }
      }
   }
}
