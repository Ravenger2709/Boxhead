function §\x01\x02§()
{
   return 1818;
}
var §\x01§ = -1497 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 321)
   {
      set("\x01",eval("\x01") + 335);
      §§push(true);
   }
   else if(eval("\x01") == 656)
   {
      set("\x01",eval("\x01") + 246);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 87);
      }
   }
   else if(eval("\x01") == 231)
   {
      set("\x01",eval("\x01") + 159);
      §§push(!§§pop());
   }
   else if(eval("\x01") == 423)
   {
      set("\x01",eval("\x01") + 317);
      §§push(true);
   }
   else if(eval("\x01") == 776)
   {
      set("\x01",eval("\x01") - 302);
      var §§pop() = §§pop();
   }
   else if(eval("\x01") == 827)
   {
      set("\x01",eval("\x01") - 596);
      §§push(eval(§§pop()));
   }
   else if(eval("\x01") == 88)
   {
      set("\x01",eval("\x01") + 194);
   }
   else
   {
      if(eval("\x01") == 902)
      {
         set("\x01",eval("\x01") - 87);
         §§pop() extends §§pop();
         §§pop() extends {};
         var §§pop();
         §§pop() extends §§pop();
         §§pop() extends §§pop() | §§pop();
         break;
      }
      if(eval("\x01") == 494)
      {
         set("\x01",eval("\x01") + 282);
         §§push("\x0f");
         §§push(1);
      }
      else if(eval("\x01") == 740)
      {
         set("\x01",eval("\x01") + 192);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 844);
         }
      }
      else if(eval("\x01") == 815)
      {
         set("\x01",eval("\x01") - 392);
      }
      else if(eval("\x01") == 390)
      {
         set("\x01",eval("\x01") + 388);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 321);
         }
      }
      else if(eval("\x01") == 329)
      {
         set("\x01",eval("\x01") + 94);
      }
      else
      {
         if(eval("\x01") == 932)
         {
            set("\x01",eval("\x01") - 844);
            break;
         }
         if(eval("\x01") == 946)
         {
            set("\x01",eval("\x01") - 83);
            if(§§pop())
            {
               set("\x01",eval("\x01") - 701);
            }
         }
         else if(eval("\x01") == 162)
         {
            set("\x01",eval("\x01") + 332);
         }
         else if(eval("\x01") == 282)
         {
            set("\x01",eval("\x01") + 664);
            §§push(true);
         }
         else if(eval("\x01") == 809)
         {
            set("\x01",eval("\x01") - 527);
         }
         else if(eval("\x01") == 89)
         {
            set("\x01",eval("\x01") + 405);
         }
         else
         {
            if(eval("\x01") == 863)
            {
               set("\x01",eval("\x01") - 701);
               break;
            }
            if(eval("\x01") == 474)
            {
               set("\x01",eval("\x01") + 353);
               §§push("\x0f");
            }
            else
            {
               if(eval("\x01") != 778)
               {
                  if(eval("\x01") == 457)
                  {
                     set("\x01",eval("\x01") + 211);
                     if(!_global.Thing)
                     {
                        _global.Thing = new Object();
                     }
                     §§pop();
                     if(!_global.Thing.Object)
                     {
                        _global.Thing.Object = new Object();
                     }
                     §§pop();
                     if(!_global.Thing.Object.CThing_Object_Pickup)
                     {
                        Thing.Object.CThing_Object_Pickup extends Thing.Object.CThing_Object;
                        _loc2_ = Thing.Object.CThing_Object_Pickup = function(tPosition, tAngle, tParent)
                        {
                           super(tPosition.mCellCentre,tAngle,tParent);
                           if(!Thing.Object.CThing_Object_Pickup.mcDrawObject_Cache)
                           {
                              Thing.Object.CThing_Object_Pickup.mcDrawObject_Cache = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation("Object.Pickup");
                           }
                           this.mcDrawObject = Thing.Object.CThing_Object_Pickup.mcDrawObject_Cache.Clone();
                           this.Process = this.Process_Init;
                           this.mAlpha = 100;
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
                           this.mWorld.mMap.mMapwho.AddThing(this);
                           this.mCurrentCell = this.mWorld.mMap.GetCell(this.mPosition.mX,this.mPosition.mY);
                           this.Process = this.Process_Normal;
                           this.Process();
                        };
                        _loc2_.Process_Normal = function()
                        {
                           if(this.mCurrentCell.mCollide & World.Map.CMap_Cell.mCollide_Player)
                           {
                              this.PickedUp();
                           }
                        };
                        _loc2_.Process_Count = function()
                        {
                           if(--this.mReappearCount < 0)
                           {
                              this.Process = this.Process_Init;
                           }
                        };
                        _loc2_.Process_DeleteCounter_Init = function()
                        {
                           this.mWorld.mMap.mMapwho.MoveThing(this);
                           this.mCurrentCell = this.mWorld.mMap.GetCell(this.mPosition.mX,this.mPosition.mY);
                           this.Process = this.Process_DeleteCounter;
                        };
                        _loc2_.Process_DeleteCounter = function()
                        {
                           if(--this.mDeleteCounter < 0)
                           {
                              this.Delete();
                              return undefined;
                           }
                           if(this.mDeleteCounter < CMain.mFPS)
                           {
                              this.mAlpha = this.mDeleteCounter / CMain.mFPS * 100;
                           }
                           if(this.mCurrentCell.mCollide & World.Map.CMap_Cell.mCollide_Player)
                           {
                              this.PickedUp();
                           }
                        };
                        _loc2_.PickedUp = function()
                        {
                           var _loc2_;
                           if(_loc2_ = this.mCurrentCell.ContainsClassID("CThing_Creature_Player"))
                           {
                              if(_loc2_.mFlags & Thing.CThing.mFlag_DEAD)
                              {
                                 return undefined;
                              }
                              _loc2_.RandomPickup();
                           }
                           this.PlaySound(CSound.mSamples.Object_Pickup_wav);
                           if(this.mDeleteOnPickup)
                           {
                              this.Delete();
                              return undefined;
                           }
                           this.mWorld.mMap.mMapwho.DeleteThing(this);
                           this.mReappearCount = CMain.mFPS * (World.CWorld.mGameMode != "DeathMatch" ? 30 : 10);
                           this.Process = this.Process_Count;
                        };
                        _loc2_.SetDeleteCounter = function(tCount)
                        {
                           this.mDeleteCounter = tCount;
                           this.Process = this.Process_DeleteCounter_Init;
                        };
                        _loc2_.Draw = function()
                        {
                           Thing.CThing.pDraw.x = this.mPosition.mX * World.Map.CMap_Cell.mSize.x - this.mWorld.mDrawPosition.x;
                           Thing.CThing.pDraw.y = (this.mPosition.mY + this.mPosition.mZ * Thing.Math.CThing_Position.mPFactor) * World.Map.CMap_Cell.mSize.y - this.mWorld.mDrawPosition.y;
                           this.mcDrawObject.Render(this.mWorld.bmCurrentDraw,Thing.CThing.pDraw,1,this.mAlpha);
                        };
                        _loc2_._CLASSID_ = "CThing_Object_Pickup";
                        §§push(ASSetPropFlags(Thing.Object.CThing_Object_Pickup.prototype,null,1));
                     }
                     §§pop();
                     break;
                  }
                  if(eval("\x01") == 668)
                  {
                     set("\x01",eval("\x01") - 668);
                  }
                  break;
               }
               set("\x01",eval("\x01") - 321);
            }
         }
      }
   }
}
