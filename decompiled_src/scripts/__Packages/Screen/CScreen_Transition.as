function §\x01\x02§()
{
   return 1462;
}
var §\x01§ = -476 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 986)
   {
      set("\x01",eval("\x01") - 807);
      §§push(true);
   }
   else if(eval("\x01") == 269)
   {
      set("\x01",eval("\x01") + 34);
      §§push(!§§pop());
   }
   else if(eval("\x01") == 278)
   {
      set("\x01",eval("\x01") + 534);
   }
   else if(eval("\x01") == 708)
   {
      set("\x01",eval("\x01") - 389);
   }
   else if(eval("\x01") == 145)
   {
      set("\x01",eval("\x01") + 829);
   }
   else if(eval("\x01") == 581)
   {
      set("\x01",eval("\x01") - 189);
      if(§§pop())
      {
         set("\x01",eval("\x01") + 236);
      }
   }
   else if(eval("\x01") == 628)
   {
      set("\x01",eval("\x01") - 324);
   }
   else if(eval("\x01") == 492)
   {
      set("\x01",eval("\x01") + 157);
      §§push("\x0f");
   }
   else if(eval("\x01") == 407)
   {
      set("\x01",eval("\x01") - 88);
   }
   else if(eval("\x01") == 179)
   {
      set("\x01",eval("\x01") + 50);
      if(§§pop())
      {
         set("\x01",eval("\x01") + 178);
      }
   }
   else if(eval("\x01") == 402)
   {
      set("\x01",eval("\x01") + 90);
      var §§pop() = §§pop();
   }
   else
   {
      if(eval("\x01") == 974)
      {
         set("\x01",eval("\x01") - 242);
         if(!_global.Screen)
         {
            _global.Screen = new Object();
         }
         §§pop();
         if(!_global.Screen.CScreen_Transition)
         {
            _loc2_ = Screen.CScreen_Transition = function()
            {
               this.mTick = 0;
            }.prototype;
            _loc2_.toString = function()
            {
               return this._CLASSID_;
            };
            _loc2_.Dispose = function()
            {
            };
            _loc2_.TransitionIn = function(tmcIN, tmcOUT)
            {
               this.mState = Screen.CScreen_Transition.mState_TransitionIn;
               this.mState_CountTarget = this.mTransitionIn_Time;
               this.mState_Count = 0;
               this.mcIN = tmcIN;
               this.mcOUT = tmcOUT;
            };
            _loc2_.TransitionIn_Process = function()
            {
               if(this.bmIN == undefined)
               {
                  this.mcContainer = this.mcIN._parent.createEmptyMovieClip("_ScreenTransition_Container",this.mcIN._parent.getNextHighestDepth());
                  this.mcContainer_OUT = this.mcContainer.createEmptyMovieClip("_OUT",this.mcContainer.getNextHighestDepth());
                  this.mcContainer_IN = this.mcContainer.createEmptyMovieClip("_IN",this.mcContainer.getNextHighestDepth());
                  this.bmIN = new flash.display.BitmapData(Screen.CScreen_Transition.mScreenSize.x,Screen.CScreen_Transition.mScreenSize.y,false,0);
                  this.bmOUT = new flash.display.BitmapData(Screen.CScreen_Transition.mScreenSize.x,Screen.CScreen_Transition.mScreenSize.y,false,0);
                  this.bmIN.draw(this.mcIN);
                  this.bmOUT.draw(_root);
                  this.mcContainer_IN.attachBitmap(this.bmIN,1);
                  this.mcContainer_OUT.attachBitmap(this.bmOUT,1);
                  this.mcContainer_IN.filters = [new flash.filters.DropShadowFilter()];
                  this.mcOUT.removeMovieClip();
                  this.mcContainer_IN._alpha = 0;
               }
               this.mcContainer_IN._alpha += 10;
               this.mcContainer_OUT._alpha -= 10;
               if(this.mcContainer_IN._alpha >= 100)
               {
                  this.bmIN.dispose();
                  this.bmOUT.dispose();
                  delete this.bmIN;
                  delete this.bmOUT;
                  this.mcContainer_OUT.removeMovieClip();
                  this.mcContainer_IN.removeMovieClip();
                  this.mcContainer.removeMovieClip();
                  return true;
               }
               return false;
            };
            _loc2_.Process = function()
            {
               switch(this.mState)
               {
                  case Screen.CScreen_Transition.mState_TransitionIn:
                     this.mState_Count = this.mState_Count + 1;
                     if(this.TransitionIn_Process())
                     {
                        this.mcIN._visible = true;
                        this.mState = Screen.CScreen_Transition.mState_Normal;
                     }
                     break;
                  case Screen.CScreen_Transition.mState_Normal:
                  default:
                     return;
               }
            };
            _loc2_.Draw = function()
            {
            };
            _loc2_._CLASSID_ = "CScreen_Transition";
            _loc2_._BASECLASSID_ = "CScreen_Transition";
            Screen.CScreen_Transition = function()
            {
               this.mTick = 0;
            }.mState_TransitionIn = 0;
            Screen.CScreen_Transition = function()
            {
               this.mTick = 0;
            }.mState_Normal = 2;
            _loc2_.mTransitionIn_Time = 30;
            _loc2_.mTransitionOut_Time = 30;
            _loc2_.mTransitionIn_InFront = true;
            §§push(ASSetPropFlags(Screen.CScreen_Transition.prototype,null,1));
         }
         §§pop();
         break;
      }
      if(eval("\x01") == 914)
      {
         set("\x01",eval("\x01") - 426);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 107);
         }
      }
      else
      {
         if(eval("\x01") == 392)
         {
            set("\x01",eval("\x01") + 236);
            break;
         }
         if(eval("\x01") == 319)
         {
            set("\x01",eval("\x01") + 262);
            §§push(true);
         }
         else if(eval("\x01") == 649)
         {
            set("\x01",eval("\x01") - 380);
            §§push(eval(§§pop()));
         }
         else
         {
            if(eval("\x01") == 488)
            {
               set("\x01",eval("\x01") - 107);
               break;
            }
            if(eval("\x01") == 381)
            {
               set("\x01",eval("\x01") + 431);
            }
            else if(eval("\x01") == 297)
            {
               set("\x01",eval("\x01") + 7);
            }
            else if(eval("\x01") == 303)
            {
               set("\x01",eval("\x01") - 158);
               if(§§pop())
               {
                  set("\x01",eval("\x01") + 829);
               }
            }
            else if(eval("\x01") == 812)
            {
               set("\x01",eval("\x01") - 410);
               §§push("\x0f");
               §§push(1);
            }
            else
            {
               if(eval("\x01") == 229)
               {
                  set("\x01",eval("\x01") + 178);
                  return eval(new §\§\§pop()§())[§§constant(85)]() || eval(§§constant(64))[§§constant(85)](Screen.CScreen_Transition = function()
                  {
                     this.mTick = 0;
                  }[§§constant(86)]);
               }
               if(eval("\x01") != 304)
               {
                  if(eval("\x01") == 732)
                  {
                     set("\x01",eval("\x01") - 732);
                  }
                  break;
               }
               set("\x01",eval("\x01") + 610);
               §§push(true);
            }
         }
      }
   }
}
