class DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional extends DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip
{
   var EndRender;
   var StartRender;
   var bmList;
   var mAnimationPosition;
   var _CLASSID_ = "CDrawPrimitive_MovieClip_Directional";
   static var dPoint = new flash.geom.Point(0,0);
   function CDrawPrimitive_MovieClip_Directional(mcLink, tDirections)
   {
      super();
      var _loc4_;
      if(mcLink)
      {
         _loc4_ = _root.attachMovie(mcLink,"_TEMP" + _root.getNextHighestDepth(),_root.getNextHighestDepth());
         this.Buffer(_loc4_,tDirections);
      }
   }
   function Clone()
   {
      var _loc2_ = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional();
      _loc2_.bmList = this.bmList;
      _loc2_.mAnimationPosition = 0;
      return _loc2_;
   }
   function Animate(tSpeed)
   {
      this.mAnimationPosition += tSpeed;
      if(this.mAnimationPosition >= this.mFrameAmount)
      {
         this.mAnimationPosition = this.mFrameAmount - 1;
         return true;
      }
      return false;
   }
   function Animate_Cycle(tSpeed)
   {
      this.mAnimationPosition = (this.mAnimationPosition + tSpeed) % this.mFrameAmount;
   }
   function Animate_Random()
   {
      this.mAnimationPosition = random(this.mFrameAmount);
   }
   function GotoToFrame(tFrameNumber)
   {
      this.mAnimationPosition = (tFrameNumber + this.mFrameAmount * 10) % this.mFrameAmount;
   }
   function get mFrameAmount()
   {
      return this.bmList[0].length;
   }
   function Render(bmDraw, pos, tAngle, tScale, tAlpha)
   {
      var _loc4_ = this.bmList[tAngle.ToDirectionN(this.mFrameAmount)][Math.floor(this.mAnimationPosition)];
      var _loc2_ = _loc4_.mDisp;
      var _loc6_;
      if(tAlpha == 100 && tScale == 1)
      {
         _loc6_ = _loc4_.sBMD;
         DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint.x = pos.x + _loc2_.x;
         DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint.y = pos.y + _loc2_.y;
         bmDraw.copyPixels(_loc6_,_loc6_.rectangle,DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint,undefined,undefined,true);
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
   }
   function QRender(bmDraw, pos, dir)
   {
      var _loc3_ = this.bmList[dir][Math.floor(this.mAnimationPosition)];
      var _loc2_ = _loc3_.mDisp;
      var _loc4_ = _loc3_.sBMD;
      DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint.x = pos.x + _loc2_.x;
      DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint.y = pos.y + _loc2_.y;
      bmDraw.copyPixels(_loc4_,_loc4_.rectangle,DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint,undefined,undefined,true);
   }
   function QRender_Mask(bmDraw, pos, dir, tMask)
   {
      var _loc3_ = this.bmList[dir][Math.floor(this.mAnimationPosition)];
      var _loc2_ = _loc3_.mDisp;
      var _loc4_ = _loc3_.sBMD;
      DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint.x = pos.x + _loc2_.x;
      DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint.y = pos.y + _loc2_.y;
      bmDraw.copyPixels(_loc4_,_loc4_.rectangle,DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint,tMask,DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Directional.dPoint,true);
   }
   function Buffer(mc, tDirections)
   {
      this.bmList = new Array();
      var _loc4_;
      var _loc3_;
      if(tDirections != undefined)
      {
         this.StartRender();
         _loc4_ = 0;
         while(_loc4_ < tDirections)
         {
            this.bmList[_loc4_] = new Array();
            if(mc._Contents)
            {
               mc._Contents._rotation = _loc4_ * 360 / tDirections;
               _loc3_ = 1;
               while(_loc3_ <= mc._Contents._totalframes)
               {
                  mc._Contents.gotoAndStop(_loc3_);
                  this.bmList[_loc4_][_loc3_ - 1] = DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.RenderMovieClipAsBitmapObject(mc);
                  _loc3_ = _loc3_ + 1;
               }
            }
            else
            {
               mc._rotation = _loc4_ * 360 / tDirections;
               _loc3_ = 1;
               while(_loc3_ <= mc._totalframes)
               {
                  this.bmList[_loc4_][_loc3_ - 1] = DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.RenderMovieClipAsBitmapObject(mc,_loc3_);
                  _loc3_ = _loc3_ + 1;
               }
            }
            _loc4_ = _loc4_ + 1;
         }
         this.EndRender();
      }
      mc.removeMovieClip();
      DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.pGlobalScale.x = 1;
      DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip.pGlobalScale.y = 1;
   }
}
