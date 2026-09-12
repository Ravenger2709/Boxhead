class DrawPrimitive.CDrawPrimitive
{
   var mBackQuality;
   var _CLASSID_ = "CDrawPrimitive";
   var _BASECLASSID_ = "CDrawPrimitive";
   static var mGlobalScale = 1;
   static var mDrawMatrix = new flash.geom.Matrix();
   static var mDrawColorTransform = new flash.geom.ColorTransform(1,1,1,1,0,0,0,0);
   static var dPoint = new flash.geom.Point(0,0);
   static var zPoint = new flash.geom.Point(0,0);
   static var PI360 = 6.283185307179586;
   static var mRadsTo256 = 256 / DrawPrimitive.CDrawPrimitive.PI360;
   static var PI360x100 = 628.3185307179587;
   function CDrawPrimitive()
   {
   }
   static function InvertAlpha(bm)
   {
      var _loc2_ = new Array();
      var _loc1_ = 0;
      while(_loc1_ <= 255)
      {
         _loc2_[_loc1_] = 255 - _loc1_ << 24;
         _loc1_ = _loc1_ + 1;
      }
      bm.paletteMap(bm,bm.rectangle,DrawPrimitive.CDrawPrimitive.zPoint,null,null,null,_loc2_);
   }
   function toString()
   {
      return this._CLASSID_;
   }
   function Dispose()
   {
   }
   function StartRender(tScale)
   {
      DrawPrimitive.CDrawPrimitive.mGlobalScale = tScale != undefined ? tScale : 1;
      this.mBackQuality = this.mBackQuality != undefined ? this.mBackQuality : _root._quality;
      _root._quality = "BEST";
   }
   function EndRender()
   {
      _root._quality = this.mBackQuality;
      delete this.mBackQuality;
   }
   static function RenderMovieClipAsBitmapObject(mc, frameIndex, tFilters)
   {
      if(frameIndex)
      {
         mc.gotoAndStop(frameIndex);
      }
      if(tFilters != undefined)
      {
         mc.filters = tFilters;
      }
      var _loc2_ = mc.getBounds(mc);
      var _loc1_ = new flash.geom.Rectangle(Math.floor(_loc2_.xMin),Math.floor(_loc2_.yMin),Math.ceil(_loc2_.xMax) - Math.floor(_loc2_.xMin),Math.ceil(_loc2_.yMax) - Math.floor(_loc2_.yMin));
      _loc1_.width *= DrawPrimitive.CDrawPrimitive.mGlobalScale;
      _loc1_.height *= DrawPrimitive.CDrawPrimitive.mGlobalScale;
      _loc1_.inflate(1,1);
      var _loc6_ = new flash.display.BitmapData(Math.ceil(_loc1_.width),Math.ceil(_loc1_.height),true,16711680);
      var _loc5_ = new flash.geom.Point(Math.floor(_loc1_.x * DrawPrimitive.CDrawPrimitive.mGlobalScale),Math.floor(_loc1_.y * DrawPrimitive.CDrawPrimitive.mGlobalScale));
      var _loc4_ = new flash.geom.Matrix();
      _loc4_.scale(DrawPrimitive.CDrawPrimitive.mGlobalScale,DrawPrimitive.CDrawPrimitive.mGlobalScale);
      _loc4_.translate(- _loc5_.x,- _loc5_.y);
      _loc6_.draw(mc,_loc4_,undefined,"normal",undefined,false);
      var _loc7_ = {sBMD:_loc6_,mDisp:_loc5_,XSI_Info:undefined};
      return _loc7_;
   }
}
