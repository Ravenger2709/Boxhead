function §\x01\x02§()
{
   return 485;
}
var §\x01§ = -158 + "\x01\x02"();
var _loc2_;
var _loc203_;
while(true)
{
   if(eval("\x01") == 327)
   {
      set("\x01",eval("\x01") + 367);
      §§push(true);
   }
   else if(eval("\x01") == 675)
   {
      set("\x01",eval("\x01") + 293);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 722);
      }
   }
   else
   {
      if(eval("\x01") == 246)
      {
         set("\x01",eval("\x01") - 132);
         if(!_global.Thing)
         {
            _global.Thing = new Object();
         }
         §§pop();
         if(!_global.Thing.Effect)
         {
            _global.Thing.Effect = new Object();
         }
         §§pop();
         if(!_global.Thing.Effect.CThing_Effect_Explosion)
         {
            Thing.Effect.CThing_Effect_Explosion extends Thing.Effect.CThing_Effect;
            _loc2_ = Thing.Effect.CThing_Effect_Explosion = function(tPosition, tAngle, tParent, tDamage)
            {
               super(tPosition,tAngle,tParent);
               this.MakeIDUnique();
               this.mDamage = tDamage;
               this.mRange = 2 + Math.max(this.mDamage - 100,0) * 0.005;
               this.mDelay = 0;
               this.mClusterExplode = this.mBiggerBang = 0;
               if(!Thing.Effect.CThing_Effect_Explosion.mcDrawObject_Cache)
               {
                  Thing.Effect.CThing_Effect_Explosion.mcDrawObject_Cache = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation("Effect.Explosion");
               }
               this.Process = this.Process_Init;
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
               var _loc2_;
               var _loc3_;
               var _loc4_;
               if(this.mClusterExplode)
               {
                  _loc2_ = 0;
                  _loc3_ = Thing.Math.CThing_Angle.PI360 / 4;
                  while(_loc2_ < Thing.Math.CThing_Angle.PI360)
                  {
                     _loc4_ = new Thing.Math.CThing_Angle(_loc2_ + Math.random() * (_loc3_ / 2) - _loc3_ / 4);
                     this.mThing_Collection.AddThing_Shot(new Thing.Shot.CThing_Shot_ClusterShell(this.mPosition.Clone(),_loc4_,this.mParent,this.mDamage));
                     _loc2_ += _loc3_;
                  }
               }
               var _loc5_;
               if(this.mBiggerBang)
               {
                  _loc2_ = 0;
                  _loc3_ = Thing.Math.CThing_Angle.PI360 / (this.mBiggerBang * 1.5);
                  while(_loc2_ < Thing.Math.CThing_Angle.PI360)
                  {
                     _loc4_ = new Thing.Math.CThing_Angle(_loc2_ + Math.random() * (_loc3_ / 4) - _loc3_ / 8);
                     _loc5_ = this.mThing_Collection.AddThing_Effect(new Thing.Effect.CThing_Effect_Explosion(this.mPosition.Add(_loc4_.mDelta),_loc4_,this.mParent,this.mDamage));
                     _loc5_.mDelay = 2 + random(4);
                     _loc2_ += _loc3_;
                  }
               }
               this.Process = this.Process_Delay;
               this.Process();
            };
            _loc2_.Process_Delay = function()
            {
               if(--this.mDelay >= 0)
               {
                  return undefined;
               }
               this.mWorld.Shake(new flash.geom.Point(0,30));
               this.mWorld.mBrightness = 1;
               var _loc2_ = new flash.geom.Rectangle(this.mPosition.mX - this.mRange,this.mPosition.mY - this.mRange,this.mRange * 2,this.mRange * 2);
               this.mWorld.mMap.mAffect.AffectArea(_loc2_,new Thing.Affect.CThing_Affect_Explosion(this.mParent,this,this.mDamage,this.mRange));
               this.mWorld.mBrightness = 1;
               this.mWorld.mMap.mDecal.Draw_ScorchMark(this.mPosition);
               this.PlaySound(CSound.mSamples.Effect_Explosion_wav);
               this.mcDrawObject = Thing.Effect.CThing_Effect_Explosion.mcDrawObject_Cache.Clone();
               this.mWorld.mMap.mMapwho.MoveThing(this);
               this.Process = this.Process_Normal;
               this.Process();
            };
            _loc2_.Process_Normal = function()
            {
               if(this.mcDrawObject.Animate(2.5))
               {
                  this.Delete();
               }
            };
            _loc2_.Draw = function()
            {
               this.mcDrawObject.Render(this.mWorld.bmCurrentDraw,this.mWorld.GetScreenPosition(this.mPosition),1,100);
            };
            _loc2_._CLASSID_ = "CThing_Effect_Explosion";
            §§push(ASSetPropFlags(Thing.Effect.CThing_Effect_Explosion.prototype,null,1));
         }
         §§pop();
         break;
      }
      if(eval("\x01") == 694)
      {
         set("\x01",eval("\x01") - 332);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 11);
         }
      }
      else if(eval("\x01") == 968)
      {
         set("\x01",eval("\x01") - 722);
      }
      else if(eval("\x01") == 954)
      {
         set("\x01",eval("\x01") - 272);
         var §§pop() = §§pop();
      }
      else
      {
         if(eval("\x01") == 362)
         {
            set("\x01",eval("\x01") - 11);
            §§push(_loc203_ = §§pop());
            break;
         }
         if(eval("\x01") == 197)
         {
            set("\x01",eval("\x01") + 757);
            §§push("\x0f");
            §§push(1);
         }
         else if(eval("\x01") == 351)
         {
            set("\x01",eval("\x01") - 154);
         }
         else if(eval("\x01") == 304)
         {
            set("\x01",eval("\x01") - 107);
         }
         else if(eval("\x01") == 682)
         {
            set("\x01",eval("\x01") + 17);
            §§push("\x0f");
         }
         else if(eval("\x01") == 699)
         {
            set("\x01",eval("\x01") - 436);
            §§push(eval(§§pop()));
         }
         else
         {
            if(eval("\x01") != 263)
            {
               if(eval("\x01") == 114)
               {
                  set("\x01",eval("\x01") - 114);
               }
               break;
            }
            set("\x01",eval("\x01") + 412);
            §§push(!§§pop());
         }
      }
   }
}
