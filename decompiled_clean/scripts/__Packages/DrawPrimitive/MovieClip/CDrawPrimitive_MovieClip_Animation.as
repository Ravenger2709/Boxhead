class DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation extends DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip
{
   var EndRender;
   var StartRender;
   var bmList;
   var bmObject;
   var mAnimationPosition;
   var _CLASSID_ = "CDrawPrimitive_MovieClip_Animation";
   static var dPoint = new flash.geom.Point(0,0);
   function CDrawPrimitive_MovieClip_Animation(mcLink)
   {
      super();
      if(mcLink)
      {
         this.Buffer(_root.attachMovie(mcLink,"_TEMP" + _root.getNextHighestDepth(),_root.getNextHighestDepth()));
      }
   }
   function Clone()
   {
      var _loc2_ = new DrawPrimitive.MovieClip.CDrawPrimitive_MovieClip_Animation();
      _loc2_.bmList = this.bmList;
      _loc2_.bmObject = this.bmList[0];
      _loc2_.mAnimationPosition = 0;
      return _loc2_;
   }
   function Animate(tSpeed)
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
   }
   function Animate_Cycle(tSpeed)
   {
      this.mAnimationPosition = (this.mAnimationPosition + tSpeed) % this.bmList.length;
      this.bmObject = this.bmList[Math.floor(this.mAnimationPosition)];
   }
   function Animate_Random()
   {
      this.mAnimationPosition = random(this.bmList.length);
      this.bmObject = this.bmList[Math.floor(this.mAnimationPosition)];
   }
   function GotoToFrame(tFrameNumber)
   {
      this.mAnimationPosition = (tFrameNumber + this.mFrameAmount * 10) % this.mFrameAmount;
      this.bmObject = this.bmList[Math.floor(this.mAnimationPosition)];
   }
   function get mFrameAmount()
   {
      return this.bmList.length;
   }
   function Render(bmDraw, pos, tScale, tAlpha)
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
   }
   function Buffer(mc)
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
   }
}
