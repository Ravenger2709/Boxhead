function §\x01\x02§()
{
   return 227;
}
var §\x01§ = 493 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 720)
   {
      set("\x01",eval("\x01") + 145);
      §§push(true);
   }
   else if(eval("\x01") == 93)
   {
      set("\x01",eval("\x01") + 886);
   }
   else if(eval("\x01") == 865)
   {
      set("\x01",eval("\x01") - 793);
      if(§§pop())
      {
         set("\x01",eval("\x01") + 21);
      }
   }
   else
   {
      if(eval("\x01") == 72)
      {
         set("\x01",eval("\x01") + 21);
         break;
      }
      if(eval("\x01") == 130)
      {
         set("\x01",eval("\x01") + 355);
         §§push(!§§pop());
      }
      else if(eval("\x01") == 277)
      {
         set("\x01",eval("\x01") + 209);
         var §§pop() = §§pop();
      }
      else if(eval("\x01") == 979)
      {
         set("\x01",eval("\x01") - 702);
         §§push("\x0f");
         §§push(1);
      }
      else if(eval("\x01") == 303)
      {
         set("\x01",eval("\x01") + 676);
      }
      else if(eval("\x01") == 486)
      {
         set("\x01",eval("\x01") - 380);
         §§push("\x0f");
      }
      else if(eval("\x01") == 106)
      {
         set("\x01",eval("\x01") + 24);
         §§push(eval(§§pop()));
      }
      else if(eval("\x01") == 485)
      {
         set("\x01",eval("\x01") + 220);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 104);
         }
      }
      else
      {
         if(eval("\x01") != 705)
         {
            if(eval("\x01") == 601)
            {
               set("\x01",eval("\x01") - 443);
               if(!_global.DrawPrimitive)
               {
                  _global.DrawPrimitive = new Object();
               }
               §§pop();
               if(!_global.DrawPrimitive.MovieClip)
               {
                  _global.DrawPrimitive.MovieClip = new Object();
               }
               §§pop();
               if(!_global.DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation)
               {
                  DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation extends DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip;
                  _loc2_ = DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation = function(mcLink)
                  {
                     super();
                     if(mcLink)
                     {
                        this.Buffer(_root.attachMovie(mcLink,"_TEMP" + _root.getNextHighestDepth(),_root.getNextHighestDepth()));
                     }
                  }.prototype;
                  _loc2_.Clone = function()
                  {
                     var _loc2_ = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation();
                     _loc2_.bmList = this.bmList;
                     _loc2_.bmObject = this.bmList[0];
                     _loc2_.mAnimationPosition = 0;
                     return _loc2_;
                  };
                  _loc2_.Animate = function(tSpeed)
                  {
                     this.mAnimationPosition += tSpeed;
                     if(this.mAnimationPosition >= this.bmList.length)
                     {
                        this.bmObject = this.bmList[this.bmList.length - 1];
                        this.mAnimationPosition = this.bmList.length;
                        return true;
                     }
                     this.bmObject = this.bmList[Math.floor(this.mAnimationPosition)];
                     return false;
                  };
                  _loc2_.Animate_Cycle = function(tSpeed)
                  {
                     this.mAnimationPosition = (this.mAnimationPosition + tSpeed) % this.bmList.length;
                     this.bmObject = this.bmList[Math.floor(this.mAnimationPosition)];
                  };
                  _loc2_.Animate_Random = function()
                  {
                     this.mAnimationPosition = random(this.bmList.length);
                     this.bmObject = this.bmList[Math.floor(this.mAnimationPosition)];
                  };
                  _loc2_.GotoToFrame = function(tFrameNumber)
                  {
                     this.mAnimationPosition = (tFrameNumber + this.mFrameAmount * 10) % this.mFrameAmount;
                     this.bmObject = this.bmList[Math.floor(this.mAnimationPosition)];
                  };
                  _loc2_.__get__mFrameAmount = function()
                  {
                     return this.bmList.length;
                  };
                  _loc2_.Render = function(bmDraw, pos, tScale, tAlpha)
                  {
                     var _loc4_ = this.bmObject;
                     var _loc2_ = _loc4_.mDisp;
                     var _loc6_;
                     if(tAlpha == 100 && tScale == 1)
                     {
                        _loc6_ = _loc4_.sBMD;
                        DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation.dPoint.x = pos.x + _loc2_.x;
                        DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation.dPoint.y = pos.y + _loc2_.y;
                        bmDraw.copyPixels(_loc6_,_loc6_.rectangle,DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation.dPoint,undefined,undefined,true);
                     }
                     else
                     {
                        DrawPrimitive.CDrawPrimitive.mDrawMatrix.identity();
                        DrawPrimitive.CDrawPrimitive.mDrawMatrix.a = tScale;
                        DrawPrimitive.CDrawPrimitive.mDrawMatrix.d = tScale;
                        DrawPrimitive.CDrawPrimitive.mDrawMatrix.tx = pos.x + _loc2_.x * tScale;
                        DrawPrimitive.CDrawPrimitive.mDrawMatrix.ty = pos.y + _loc2_.y * tScale;
                        DrawPrimitive.CDrawPrimitive.mDrawColorTransform.alphaMultiplier = tAlpha / 100;
                        bmDraw.draw(_loc4_.sBMD,DrawPrimitive.CDrawPrimitive.mDrawMatrix,DrawPrimitive.CDrawPrimitive.mDrawColorTransform);
                     }
                     return true;
                  };
                  _loc2_.Buffer = function(mc)
                  {
                     this.StartRender();
                     this.bmList = new Array();
                     var _loc2_;
                     if(mc._Contents)
                     {
                        _loc2_ = 1;
                        while(_loc2_ <= mc._Contents._totalframes)
                        {
                           mc._Contents.gotoAndStop(_loc2_);
                           this.bmList[_loc2_ - 1] = DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.RenderMovieClipAsBitmapObject(mc,_loc2_);
                           _loc2_ = _loc2_ + 1;
                        }
                     }
                     else
                     {
                        _loc2_ = 1;
                        while(_loc2_ <= mc._totalframes)
                        {
                           this.bmList[_loc2_ - 1] = DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.RenderMovieClipAsBitmapObject(mc,_loc2_);
                           _loc2_ = _loc2_ + 1;
                        }
                     }
                     mc.removeMovieClip();
                     this.EndRender();
                  };
                  _loc2_._CLASSID_ = "CDrawPrimitive_MovieClip_Animation";
                  DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation = function(mcLink)
                  {
                     super();
                     if(mcLink)
                     {
                        this.Buffer(_root.attachMovie(mcLink,"_TEMP" + _root.getNextHighestDepth(),_root.getNextHighestDepth()));
                     }
                  }.dPoint = new flash.geom.Point(0,0);
                  §§push(_loc2_.addProperty("mFrameAmount",_loc2_.__get__mFrameAmount,function()
                  {
                  }
                  ));
                  §§push(ASSetPropFlags(DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation.prototype,null,1));
               }
               §§pop();
               break;
            }
            if(eval("\x01") == 158)
            {
               set("\x01",eval("\x01") - 158);
            }
            break;
         }
         set("\x01",eval("\x01") - 104);
      }
   }
}
