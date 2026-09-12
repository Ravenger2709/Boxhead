function §\x01\x02§()
{
   return 305;
}
var §\x01§ = 77 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 382)
   {
      set("\x01",eval("\x01") + 530);
      §§push(true);
   }
   else if(eval("\x01") == 139)
   {
      set("\x01",eval("\x01") + 464);
   }
   else if(eval("\x01") == 912)
   {
      set("\x01",eval("\x01") - 218);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 555);
      }
   }
   else if(eval("\x01") == 6)
   {
      set("\x01",eval("\x01") + 788);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 316);
      }
   }
   else if(eval("\x01") == 603)
   {
      set("\x01",eval("\x01") + 27);
      §§push(true);
   }
   else if(eval("\x01") == 581)
   {
      set("\x01",eval("\x01") - 104);
   }
   else
   {
      if(eval("\x01") == 617)
      {
         set("\x01",eval("\x01") - 610);
         §§push(§§pop() lt §§pop());
         break;
      }
      if(eval("\x01") == 713)
      {
         set("\x01",eval("\x01") - 707);
         §§push(!§§pop());
      }
      else if(eval("\x01") == 7)
      {
         set("\x01",eval("\x01") + 470);
      }
      else if(eval("\x01") == 180)
      {
         set("\x01",eval("\x01") + 533);
         §§push(eval(§§pop()));
      }
      else if(eval("\x01") == 760)
      {
         set("\x01",eval("\x01") - 157);
      }
      else if(eval("\x01") == 477)
      {
         set("\x01",eval("\x01") + 362);
         §§push("\x0f");
         §§push(1);
      }
      else if(eval("\x01") == 630)
      {
         set("\x01",eval("\x01") - 13);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 610);
         }
      }
      else
      {
         if(eval("\x01") == 694)
         {
            set("\x01",eval("\x01") - 555);
            §§pop()[§§pop()] = §§pop() | (!§§pop() ? 0 : wall.Delete.mCounter.mZ);
            _loc1_.CThing_Shot = wall.Sub.Move != "Animate_Cycle" ? _loc1_.mY : _loc1_.mX;
            _loc1_.CThing_Shot();
            §§pop()[§§pop()] = §§pop();
            _loc2_.mX = function()
            {
               if((this.mPosition.GetCell & this.mCollideType) == 0)
               {
                  this.CThing_Shot = this.mY;
               }
            };
            _loc2_.mY = function()
            {
               this.__get__mDelta.CMap_Cell(1 / World.Map);
               if(this.mPosition.GetCell & this.mCollideType)
               {
                  this.mCollide_StaticImpassable = World.Map * 2;
                  this.AddThing_Effect(Effect.CThing_Effect_Explosion.mThing_Collection);
                  this.CThing_Shot = this.Draw;
                  this.CThing_Shot();
               }
            };
            _loc2_.Draw = function()
            {
               this.__get__mDelta.CMap_Cell(1);
               var _loc2_;
               if(--this.mCollide_StaticImpassable < 0)
               {
                  this.mMapwho.mCollide.GetScreenPosition(this);
                  _loc2_ = this[§§constant(62)][§§constant(63)](new Thing.ASSetPropFlags[§§constant(61)](this.Add,this.Render,this.bmCurrentDraw,this.mcDrawObject_Cache));
                  _loc2_.Process = this.Process;
                  _loc2_.Process_Init = this.Process_Init;
                  this[§§constant(64)]();
               }
            };
            _loc2_[§§constant(65)] = function()
            {
               Thing.DrawPrimitive[§§constant(66)][§§constant(67)] = this.Add.CThing_Affect * wall.Delete.mCounter[§§constant(68)][§§constant(67)] - this.mMapwho[§§constant(69)][§§constant(67)];
               Thing.DrawPrimitive[§§constant(66)][§§constant(70)] = (this.Add.Affect + this.Add[§§constant(71)] * Thing[§§constant(72)][§§constant(73)][§§constant(74)]) * wall.Delete.mCounter[§§constant(68)][§§constant(70)] - this.mMapwho[§§constant(69)][§§constant(70)];
               this.__get__mDelta[§§constant(76)](this.mMapwho[§§constant(75)],Thing.DrawPrimitive[§§constant(66)],1,100);
            };
            _loc2_.mWorld = "Shot";
            §§constant(77)(Thing.Object.Shot._CLASSID_,null,1);
            break;
         }
         if(eval("\x01") == 794)
         {
            set("\x01",eval("\x01") - 316);
         }
         else
         {
            if(eval("\x01") == 478)
            {
               set("\x01",eval("\x01") + 79);
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
               if(!_global.Thing.Shot.CThing_Shot_Devastator)
               {
                  Thing.Shot.CThing_Shot_Devastator extends Thing.Shot.CThing_Shot;
                  _loc2_ = Thing.Shot.CThing_Shot_Devastator = function(tPosition, tAngle, tParent, tDamage)
                  {
                     super(tPosition,tAngle,tParent,tDamage);
                     if(!Thing.Shot.CThing_Shot_Devastator.mcDrawObject_Cache)
                     {
                        Thing.Shot.CThing_Shot_Devastator.mcDrawObject_Cache = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation("Shot.Devastator");
                     }
                     this.mcDrawObject = Thing.Shot.CThing_Shot_Devastator.mcDrawObject_Cache.Clone();
                     this.mDelta = this.mAngle.mDelta.ScaleN(0.9);
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
                     this.mWorld.mMap.mMapwho.MoveThing(this);
                     this.SetRadius(0.25);
                     this.Process = this.Process_Normal;
                     this.Process();
                  };
                  _loc2_.Process_Normal = function()
                  {
                     var _loc2_ = this.mPosition.Add(this.mDelta);
                     var _loc3_ = this.mWorld.mMap.mCollide.Collide_Line(this,this.mPosition,_loc2_,0.04,Thing.Affect.CThing_Affect.mAffect_Bullet);
                     if(_loc3_)
                     {
                        if(_loc3_.mCollideType == "wall")
                        {
                           this.Delete();
                           return undefined;
                        }
                     }
                     if(!(this.mCounter++ % 2) && this.mCounter >= 4)
                     {
                        this._FireLine(this.mAngle.Clone().Add(1.5707963267948966));
                        this._FireLine(this.mAngle.Clone().Sub(1.5707963267948966));
                     }
                     this.Move(_loc2_);
                     this.mcDrawObject.Animate_Cycle(1);
                  };
                  _loc2_._FireLine = function(a)
                  {
                     var _loc5_ = this.mWorld.mMap;
                     var _loc4_ = a.mDelta.ScaleN(0.4);
                     var _loc2_ = this.mPosition.Add(_loc4_);
                     _loc2_.mZ = 0;
                     _loc4_.ScaleN(2);
                     var _loc3_ = 8;
                     while(_loc3_)
                     {
                        if(_loc5_.GetCell(_loc2_.mX,_loc2_.mY).mCollide & World.Map.CMap_Cell.mCollide_StaticImpassable)
                        {
                           break;
                        }
                        this.mThing_Collection.AddThing_Effect(new Thing.Effect.CThing_Effect_Explosion(_loc2_,this.mAngle.Clone(),this,200));
                        _loc3_--;
                        _loc2_ = _loc2_.Add(_loc4_);
                     }
                  };
                  _loc2_.Draw = function()
                  {
                     this.mcDrawObject.Render(this.mWorld.bmCurrentDraw,this.mWorld.GetScreenPosition(this.mPosition),1,100);
                  };
                  _loc2_._CLASSID_ = "CThing_Shot_Devastator";
                  _loc2_.mCounter = 0;
                  §§push(ASSetPropFlags(Thing.Shot.CThing_Shot_Devastator.prototype,null,1));
               }
               §§pop();
               break;
            }
            if(eval("\x01") == 839)
            {
               set("\x01",eval("\x01") - 732);
               var §§pop() = §§pop();
            }
            else
            {
               if(eval("\x01") != 107)
               {
                  if(eval("\x01") == 557)
                  {
                     set("\x01",eval("\x01") - 557);
                  }
                  break;
               }
               set("\x01",eval("\x01") + 73);
               §§push("\x0f");
            }
         }
      }
   }
}
