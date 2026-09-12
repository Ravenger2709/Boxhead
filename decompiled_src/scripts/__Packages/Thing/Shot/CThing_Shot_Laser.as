function §\x01\x02§()
{
   return 295;
}
var §\x01§ = 340 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 635)
   {
      set("\x01",eval("\x01") - 245);
      §§push(true);
   }
   else if(eval("\x01") == 473)
   {
      set("\x01",eval("\x01") - 55);
   }
   else
   {
      if(eval("\x01") == 98)
      {
         set("\x01",eval("\x01") + 382);
         _loc1_[§§constant(10)][§§constant(59)](_loc1_[§§constant(23)][§§constant(58)],§§pop()[§§constant(57)](),§§pop(),§§pop());
         §§pop()[§§pop()] = §§pop();
         _loc2_[§§constant(21)] = "{invalid_utf8=176}{invalid_utf8=240}{invalid_utf8=131}K";
         _loc2_[§§constant(39)] = 0;
         §§constant(60)(eval("{invalid_utf8=204}{invalid_utf8=225}\x1e")["{invalid_utf8=151}{invalid_utf8=130}~{invalid_utf8=222}"]["{invalid_utf8=176}{invalid_utf8=240}{invalid_utf8=131}K"][§§constant(19)],null,1);
         break;
      }
      if(eval("\x01") == 65)
      {
         set("\x01",eval("\x01") + 581);
         §§push(eval(§§pop()));
      }
      else if(eval("\x01") == 426)
      {
         set("\x01",eval("\x01") - 361);
         §§push("\x0f");
      }
      else
      {
         if(eval("\x01") == 2)
         {
            set("\x01",eval("\x01") + 374);
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
            if(!_global.Thing.Shot.CThing_Shot_Laser)
            {
               Thing.Shot.CThing_Shot_Laser extends Thing.Shot.CThing_Shot;
               _loc2_ = Thing.Shot.CThing_Shot_Laser = function(tPosition, tAngle, tParent, tDamage, tRange)
               {
                  super(tPosition,tAngle,tParent,tDamage);
                  tRange = tRange != undefined ? tRange : 10;
                  this.mDestination = this.mPosition.Add(this.mAngle.mDelta.ScaleN(100));
                  this.mAlpha = 75;
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
                  if(_root._quality != "LOW")
                  {
                     this.mWorld.mMap.mMapwho.MoveThing(this);
                  }
                  var _loc3_ = this.mWorld.mMap.mCollide.Collide_Line(this,this.mPosition,this.mDestination,0.04,Thing.Affect.CThing_Affect.mAffect_Bullet,true);
                  if(_loc3_)
                  {
                     if(_loc3_.mPOI)
                     {
                        this.mDestination.mX = _loc3_.mPOI.x;
                        this.mDestination.mY = _loc3_.mPOI.y;
                     }
                  }
                  this.mWorld.mMap.mAffect.Affect_Line(this,this.mPosition,this.mDestination,0.04,new Thing.Affect.CThing_Affect_Bullet(this.mParent,this,this.mDamage,this.mAngle));
                  this.Process = this.Process_Normal;
                  this.Process();
               };
               _loc2_.Process_Normal = function()
               {
                  if(--this.mLife == 0)
                  {
                     this.Delete();
                  }
               };
               _loc2_.Draw = function()
               {
                  var _loc3_ = this.mWorld.GetScreenPosition(this.mPosition);
                  var _loc2_ = this.mWorld.GetScreenPosition(this.mDestination);
                  DrawPrimitive.CDrawPrimitive_Line.Draw(this.mWorld.mcScratch,_loc3_,_loc2_,3,8421631,this.mAlpha * 0.5);
                  DrawPrimitive.CDrawPrimitive_Line.Draw(this.mWorld.mcScratch,_loc3_,_loc2_,2,16777215,this.mAlpha);
               };
               _loc2_._CLASSID_ = "CThing_Shot_Laser";
               §§push(ASSetPropFlags(Thing.Shot.CThing_Shot_Laser.prototype,null,1));
            }
            §§pop();
            break;
         }
         if(eval("\x01") == 537)
         {
            set("\x01",eval("\x01") - 535);
         }
         else if(eval("\x01") == 390)
         {
            set("\x01",eval("\x01") + 41);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 345);
            }
         }
         else if(eval("\x01") == 394)
         {
            set("\x01",eval("\x01") + 146);
            §§push("\x0f");
            §§push(1);
         }
         else
         {
            if(eval("\x01") == 431)
            {
               set("\x01",eval("\x01") + 345);
               break;
            }
            if(eval("\x01") == 646)
            {
               set("\x01",eval("\x01") - 170);
               §§push(!§§pop());
            }
            else if(eval("\x01") == 480)
            {
               set("\x01",eval("\x01") - 385);
            }
            else if(eval("\x01") == 776)
            {
               set("\x01",eval("\x01") - 358);
            }
            else if(eval("\x01") == 418)
            {
               set("\x01",eval("\x01") + 258);
               §§push(true);
            }
            else if(eval("\x01") == 696)
            {
               set("\x01",eval("\x01") + 294);
               if(§§pop())
               {
                  set("\x01",eval("\x01") - 765);
               }
            }
            else if(eval("\x01") == 676)
            {
               set("\x01",eval("\x01") - 578);
               if(§§pop())
               {
                  set("\x01",eval("\x01") + 382);
               }
            }
            else
            {
               if(eval("\x01") == 990)
               {
                  set("\x01",eval("\x01") - 765);
                  break;
               }
               if(eval("\x01") == 66)
               {
                  set("\x01",eval("\x01") + 29);
               }
               else if(eval("\x01") == 476)
               {
                  set("\x01",eval("\x01") + 61);
                  if(§§pop())
                  {
                     set("\x01",eval("\x01") - 535);
                  }
               }
               else if(eval("\x01") == 225)
               {
                  set("\x01",eval("\x01") + 169);
               }
               else if(eval("\x01") == 540)
               {
                  set("\x01",eval("\x01") - 114);
                  var §§pop() = §§pop();
               }
               else if(eval("\x01") == 95)
               {
                  set("\x01",eval("\x01") + 601);
                  §§push(true);
               }
               else
               {
                  if(eval("\x01") != 26)
                  {
                     if(eval("\x01") == 376)
                     {
                        set("\x01",eval("\x01") - 376);
                     }
                     break;
                  }
                  set("\x01",eval("\x01") + 368);
               }
            }
         }
      }
   }
}
