function §\x01\x02§()
{
   return 418;
}
var §\x01§ = 362 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 780)
   {
      set("\x01",eval("\x01") - 3);
      §§push(true);
   }
   else if(eval("\x01") == 461)
   {
      set("\x01",eval("\x01") + 428);
      §§push(eval(§§pop()));
   }
   else if(eval("\x01") == 996)
   {
      set("\x01",eval("\x01") - 228);
   }
   else if(eval("\x01") == 714)
   {
      set("\x01",eval("\x01") + 148);
      if(§§pop())
      {
         set("\x01",eval("\x01") + 63);
      }
   }
   else if(eval("\x01") == 719)
   {
      set("\x01",eval("\x01") + 49);
   }
   else if(eval("\x01") == 889)
   {
      set("\x01",eval("\x01") - 175);
      §§push(!§§pop());
   }
   else
   {
      if(eval("\x01") == 704)
      {
         set("\x01",eval("\x01") + 292);
         §§pop() extends §§pop()[§§pop()]();
         §§push(§§pop() gt (§§pop() > §§pop()));
         break;
      }
      if(eval("\x01") == 768)
      {
         set("\x01",eval("\x01") - 765);
         §§push("\x0f");
         §§push(1);
      }
      else if(eval("\x01") == 862)
      {
         set("\x01",eval("\x01") + 63);
      }
      else if(eval("\x01") == 777)
      {
         set("\x01",eval("\x01") - 73);
         if(§§pop())
         {
            set("\x01",eval("\x01") + 292);
         }
      }
      else if(eval("\x01") == 480)
      {
         set("\x01",eval("\x01") - 19);
         §§push("\x0f");
      }
      else
      {
         if(eval("\x01") != 3)
         {
            if(eval("\x01") == 925)
            {
               set("\x01",eval("\x01") - 735);
               if(!_global.Thing)
               {
                  _global.Thing = new Object();
               }
               §§pop();
               if(!_global.Thing.CThing)
               {
                  _loc2_ = Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.prototype;
                  _loc2_.MakeIDUnique = function()
                  {
                     this.mID = this.mUniqueID;
                  };
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.Renew = function()
                  {
                     Thing.CThing.mAllocate_ID = 0;
                  };
                  _loc2_.toString = function()
                  {
                     return this._CLASSID_;
                  };
                  _loc2_.Dispose = function()
                  {
                     this.mWorld.mMap.mMapwho.DeleteThing(this);
                  };
                  _loc2_.SetRadius = function(tRadius)
                  {
                     this.mRadius = tRadius;
                     this.mRadius_SQR = this.mRadius * this.mRadius;
                  };
                  _loc2_.GrowRadius = function(tRadius)
                  {
                     if(this.mRadius == undefined)
                     {
                        this.mRadius = 0;
                     }
                     if(this.mRadius < tRadius)
                     {
                        this.SetRadius(this.mRadius + 0.05);
                        return true;
                     }
                     return false;
                  };
                  _loc2_.Delete = function()
                  {
                     delete this.Process;
                     this.mThing_Collection.DeleteThing(this);
                  };
                  _loc2_.Move = function(nPosition)
                  {
                     if(nPosition != this.mPosition)
                     {
                        this.mPosition.mX = nPosition.mX;
                        this.mPosition.mY = nPosition.mY;
                        this.mPosition.mZ = nPosition.mZ;
                     }
                     this.mWorld.mMap.mMapwho.MoveThing(this);
                  };
                  _loc2_.Affect_Setup = function(tFlags)
                  {
                     this.mAffectors = new Array();
                     this.mAffectFlags = tFlags;
                  };
                  _loc2_.Affect = function(tAffect)
                  {
                     this.mAffectors.push(tAffect);
                  };
                  _loc2_.ClearAffects = function()
                  {
                     this.mAffectFlags = 0;
                  };
                  _loc2_.PlaySound = function(tSound, tPosition)
                  {
                     tSound.PlaySound(new flash.geom.Point(0,0));
                  };
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.DummyThings = function()
                  {
                     Thing.CThing.Renew();
                     return undefined;
                  };
                  _loc2_._CLASSID_ = "CThing";
                  _loc2_._BASECLASSID_ = "CThing";
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.mAllocate_ID = 0;
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.mAllocate_ProcessID_Count = 3;
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.mFlag_Collidable = 1;
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.mFlag_WaitForMove = 2;
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.mFlag_CellMoved = 4;
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.mFlag_Drawn = 8;
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.mFlag_SortFloor = 16;
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.mFlag_DEAD = 32;
                  Thing.CThing = function(tPosition, tAngle, tParent)
                  {
                     this.mP = this.mPosition = tPosition;
                     this.mAngle = tAngle != undefined ? tAngle : new Thing.Math.CThing_Angle(0);
                     this.mParent = tParent;
                     this.mUniqueID = ++Thing.CThing.mAllocate_ID;
                     this.sUniqueID = "t" + this.mUniqueID;
                     this.mID = this.mParent != undefined ? tParent.mID : this.mUniqueID;
                     this.mFlags = 0;
                  }.pDraw = new flash.geom.Point(0,0);
                  §§push(ASSetPropFlags(Thing.CThing.prototype,null,1));
               }
               §§pop();
               break;
            }
            if(eval("\x01") == 190)
            {
               set("\x01",eval("\x01") - 190);
            }
            break;
         }
         set("\x01",eval("\x01") + 477);
         var §§pop() = §§pop();
      }
   }
}
