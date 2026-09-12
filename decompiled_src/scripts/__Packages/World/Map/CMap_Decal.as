function §\x01\x02§()
{
   return 2432;
}
var §\x01§ = -1708 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 724)
   {
      set("\x01",eval("\x01") - 515);
      §§push(true);
   }
   else if(eval("\x01") == 754)
   {
      set("\x01",eval("\x01") - 309);
   }
   else if(eval("\x01") == 452)
   {
      set("\x01",eval("\x01") + 232);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 660);
      }
   }
   else if(eval("\x01") == 876)
   {
      set("\x01",eval("\x01") - 77);
      §§push("\x0f");
   }
   else
   {
      if(eval("\x01") == 975)
      {
         set("\x01",eval("\x01") - 970);
         if(!_global.World)
         {
            _global.World = new Object();
         }
         §§pop();
         if(!_global.World.Map)
         {
            _global.World.Map = new Object();
         }
         §§pop();
         if(!_global.World.Map.CMap_Decal)
         {
            _loc2_ = World.Map.CMap_Decal = function(tMap)
            {
               this.mMap = tMap;
               this.mWorld = this.mMap.mWorld;
            }.prototype;
            _loc2_.toString = function()
            {
               return this._CLASSID_;
            };
            _loc2_.Dispose = function()
            {
            };
            _loc2_.Draw_BloodSplat = function(p, tAmount)
            {
               if(!World.Map.CMap_Decal.bmBloodSplat)
               {
                  DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.pGlobalScale.x = 1;
                  DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.pGlobalScale.y = 0.6;
                  World.Map.CMap_Decal.bmBloodSplat = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional("Effect.BloodSplat",3);
               }
               var _loc2_ = tAmount != undefined ? tAmount : 1;
               while(_loc2_)
               {
                  _loc2_ = _loc2_ - 1;
               }
               World.Map.CMap_Decal.bmBloodSplat.Animate_Random();
               World.Map.CMap_Decal.dPoint.x = (p.mX + (Math.random() * 0.5 - 0.25)) * World.Map.CMap_Cell.mSize.x;
               World.Map.CMap_Decal.dPoint.y = (p.mY + (Math.random() * 0.5 - 0.25)) * World.Map.CMap_Cell.mSize.y;
               World.Map.CMap_Decal.bmBloodSplat.QRender_Mask(this.mWorld.bmFloor,World.Map.CMap_Decal.dPoint,random(3),this.mWorld.bmDecalMask);
            };
            _loc2_.Draw_ScorchMark = function(p)
            {
               if(!World.Map.CMap_Decal.bmScorchMark)
               {
                  DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.pGlobalScale.x = 1;
                  DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.pGlobalScale.y = 0.6;
                  World.Map.CMap_Decal.bmScorchMark = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional("Effect.ScorchMark",3);
               }
               World.Map.CMap_Decal.bmScorchMark.Animate_Random();
               World.Map.CMap_Decal.dPoint.x = p.mX * World.Map.CMap_Cell.mSize.x;
               World.Map.CMap_Decal.dPoint.y = p.mY * World.Map.CMap_Cell.mSize.y;
               World.Map.CMap_Decal.bmScorchMark.QRender_Mask(this.mWorld.bmFloor,World.Map.CMap_Decal.dPoint,random(3),this.mWorld.bmDecalMask);
            };
            _loc2_._CLASSID_ = "CMap_Decal";
            _loc2_._BASECLASSID_ = "CMap_Decal";
            World.Map.CMap_Decal = function(tMap)
            {
               this.mMap = tMap;
               this.mWorld = this.mMap.mWorld;
            }.dPoint = new flash.geom.Point();
            §§push(ASSetPropFlags(World.Map.CMap_Decal.prototype,null,1));
         }
         §§pop();
         break;
      }
      if(eval("\x01") == 802)
      {
         set("\x01",eval("\x01") + 74);
         var §§pop() = §§pop();
      }
      else if(eval("\x01") == 633)
      {
         set("\x01",eval("\x01") + 342);
      }
      else if(eval("\x01") == 987)
      {
         set("\x01",eval("\x01") + 1);
         §§push(!§§pop());
      }
      else if(eval("\x01") == 445)
      {
         set("\x01",eval("\x01") + 357);
         §§push("\x0f");
         §§push(1);
      }
      else if(eval("\x01") == 209)
      {
         set("\x01",eval("\x01") + 17);
         if(§§pop())
         {
            set("\x01",eval("\x01") + 678);
         }
      }
      else
      {
         if(eval("\x01") == 5)
         {
            set("\x01",eval("\x01") - 5);
            break;
         }
         if(eval("\x01") == 24)
         {
            set("\x01",eval("\x01") + 421);
         }
         else
         {
            if(eval("\x01") == 226)
            {
               set("\x01",eval("\x01") + 678);
               break;
            }
            if(eval("\x01") == 799)
            {
               set("\x01",eval("\x01") + 188);
               §§push(eval(§§pop()));
            }
            else if(eval("\x01") == 904)
            {
               set("\x01",eval("\x01") - 522);
            }
            else if(eval("\x01") == 988)
            {
               set("\x01",eval("\x01") - 355);
               if(§§pop())
               {
                  set("\x01",eval("\x01") + 342);
               }
            }
            else
            {
               if(eval("\x01") == 684)
               {
                  set("\x01",eval("\x01") - 660);
                  loop1:
                  while(true)
                  {
                     while(true)
                     {
                        if(eval("\x01") == 463)
                        {
                           set("\x01",eval("\x01") - 27);
                           §§push(true);
                        }
                        else if(eval("\x01") == 230)
                        {
                           set("\x01",eval("\x01") + 302);
                           §§push("\x0f");
                           §§push(1);
                        }
                        else if(eval("\x01") == 822)
                        {
                           set("\x01",eval("\x01") - 549);
                        }
                        else if(eval("\x01") == 646)
                        {
                           set("\x01",eval("\x01") - 416);
                        }
                        else
                        {
                           if(eval("\x01") == 533)
                           {
                              break;
                           }
                           if(eval("\x01") == 597)
                           {
                              set("\x01",eval("\x01") - 324);
                           }
                           else if(eval("\x01") == 192)
                           {
                              set("\x01",eval("\x01") + 341);
                           }
                           else
                           {
                              if(eval("\x01") == 881)
                              {
                                 set("\x01",eval("\x01") - 284);
                                 §§push(§§pop() lt §§pop());
                                 return;
                              }
                              if(eval("\x01") == 89)
                              {
                                 set("\x01",eval("\x01") + 618);
                                 if(§§pop())
                                 {
                                    set("\x01",eval("\x01") - 208);
                                 }
                              }
                              else
                              {
                                 if(eval("\x01") == 436)
                                 {
                                    set("\x01",eval("\x01") + 445);
                                    if(§§pop())
                                    {
                                       set("\x01",eval("\x01") - 284);
                                    }
                                    continue loop1;
                                 }
                                 if(eval("\x01") == 273)
                                 {
                                    set("\x01",eval("\x01") - 184);
                                    §§push(true);
                                 }
                                 else if(eval("\x01") == 401)
                                 {
                                    set("\x01",eval("\x01") - 171);
                                 }
                                 else
                                 {
                                    if(eval("\x01") == 707)
                                    {
                                       set("\x01",eval("\x01") - 208);
                                       return;
                                    }
                                    if(eval("\x01") == 532)
                                    {
                                       set("\x01",eval("\x01") - 49);
                                       var §§pop() = §§pop();
                                    }
                                    else if(eval("\x01") == 539)
                                    {
                                       set("\x01",eval("\x01") - 359);
                                       §§push(true);
                                    }
                                    else
                                    {
                                       if(eval("\x01") == 669)
                                       {
                                          set("\x01",eval("\x01") - 669);
                                          return;
                                       }
                                       if(eval("\x01") == 719)
                                       {
                                          set("\x01",eval("\x01") - 527);
                                          if(§§pop())
                                          {
                                             set("\x01",eval("\x01") + 341);
                                          }
                                       }
                                       else if(eval("\x01") == 483)
                                       {
                                          set("\x01",eval("\x01") - 461);
                                          §§push("\x0f");
                                       }
                                       else if(eval("\x01") == 22)
                                       {
                                          set("\x01",eval("\x01") + 751);
                                          §§push(eval(§§pop()));
                                       }
                                       else if(eval("\x01") == 773)
                                       {
                                          set("\x01",eval("\x01") - 54);
                                          §§push(!§§pop());
                                       }
                                       else if(eval("\x01") == 180)
                                       {
                                          set("\x01",eval("\x01") + 696);
                                          if(§§pop())
                                          {
                                             set("\x01",eval("\x01") - 230);
                                          }
                                       }
                                       else if(eval("\x01") == 499)
                                       {
                                          set("\x01",eval("\x01") + 40);
                                       }
                                       else
                                       {
                                          if(eval("\x01") != 313)
                                          {
                                             if(eval("\x01") == 876)
                                             {
                                                set("\x01",eval("\x01") - 230);
                                                §§push(§§pop() >> (§§pop() | §§pop() >>> typeof §§pop()));
                                             }
                                             return;
                                          }
                                          set("\x01",eval("\x01") + 226);
                                       }
                                    }
                                 }
                              }
                           }
                        }
                     }
                     set("\x01",eval("\x01") + 136);
                     if(!_global.Screen)
                     {
                        _global.Screen = new Object();
                     }
                     §§pop();
                     if(!_global.Screen.CScreen)
                     {
                        Screen.CScreen extends MovieClip;
                        _loc2_ = Screen.CScreen = function()
                        {
                           super();
                           this._Icon_Back.pClass = this;
                           this._Icon_Back.onPress = function()
                           {
                              CSound.mSamples.Click.PlaySound();
                              this.pClass.GoBack();
                           };
                           this._visible = false;
                           this.mScreen_Transition = new Screen.CScreen_Transition();
                        }.prototype;
                        _loc2_.GoBack = function()
                        {
                           this.nState = "State_Main";
                        };
                        _loc2_.toString = function()
                        {
                           return this._CLASSID_;
                        };
                        _loc2_.Dispose = function()
                        {
                           this.removeMovieClip();
                        };
                        _loc2_.Open = function(mcBack)
                        {
                           this.mScreen_Transition.TransitionIn(this,mcBack);
                        };
                        _loc2_.__get__mNormal = function()
                        {
                           return this.mScreen_Transition.mState == Screen.CScreen_Transition.mState_Normal;
                        };
                        _loc2_.Process = function()
                        {
                           this.mScreen_Transition.Process();
                        };
                        _loc2_.Draw = function()
                        {
                        };
                        _loc2_._CLASSID_ = "CScreen";
                        _loc2_._BASECLASSID_ = "CScreen";
                        Screen.CScreen = function()
                        {
                           super();
                           this._Icon_Back.pClass = this;
                           this._Icon_Back.onPress = function()
                           {
                              CSound.mSamples.Click.PlaySound();
                              this.pClass.GoBack();
                           };
                           this._visible = false;
                           this.mScreen_Transition = new Screen.CScreen_Transition();
                        }.bFlag_Delete = 1;
                        §§push(_loc2_.addProperty("mNormal",_loc2_.__get__mNormal,function()
                        {
                        }
                        ));
                        §§push(ASSetPropFlags(Screen.CScreen.prototype,null,1));
                     }
                     §§pop();
                     break;
                  }
                  break;
               }
               if(eval("\x01") == 583)
               {
                  set("\x01",eval("\x01") - 201);
               }
               else
               {
                  if(eval("\x01") != 382)
                  {
                     break;
                  }
                  set("\x01",eval("\x01") + 70);
                  §§push(true);
               }
            }
         }
      }
   }
}
