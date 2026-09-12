class scidd.Draw.CColor
{
   var mAlpha;
   var mBlue;
   var mBrightness;
   var mGreen;
   var mRed;
   var _CLASSID_ = "scidd.Draw.CColor";
   static var _LumR = 0.3086;
   static var _LumG = 0.6094;
   static var _LumB = 0.082;
   function CColor(tRed, tGreen, tBlue, tAlpha, tBrightness)
   {
      this.mRed = scidd.Math.CMath.Define(tRed,255);
      this.mGreen = scidd.Math.CMath.Define(tGreen,255);
      this.mBlue = scidd.Math.CMath.Define(tBlue,255);
      this.mAlpha = scidd.Math.CMath.Define(tAlpha,255);
      this.mBrightness = scidd.Math.CMath.Define(tBrightness,0);
   }
   function toString()
   {
      return "{R:" + this.mRed + ", G:" + this.mGreen + ", B:" + this.mBlue + ", A:" + this.mAlpha + "}";
   }
   function Clone()
   {
      return new scidd.Draw.CColor(this.mRed,this.mGreen,this.mBlue,this.mAlpha,this.mBrightness);
   }
   static function Red(tAmount)
   {
      tAmount = scidd.Math.CMath.Define(tAmount,255);
      return new scidd.Draw.CColor(tAmount,0,0);
   }
   static function Green(tAmount)
   {
      tAmount = scidd.Math.CMath.Define(tAmount,255);
      return new scidd.Draw.CColor(0,tAmount,0);
   }
   static function Blue(tAmount)
   {
      tAmount = scidd.Math.CMath.Define(tAmount,255);
      return new scidd.Draw.CColor(0,0,tAmount);
   }
   static function White(tAmount)
   {
      tAmount = scidd.Math.CMath.Define(tAmount,255);
      return new scidd.Draw.CColor(tAmount,tAmount,tAmount);
   }
   static function Grey(tAmount)
   {
      tAmount = scidd.Math.CMath.Define(tAmount,128);
      return new scidd.Draw.CColor(tAmount,tAmount,tAmount);
   }
   static function Clear()
   {
      return new scidd.Draw.CColor(0,0,0,0);
   }
   static function Black()
   {
      return new scidd.Draw.CColor(0,0,0);
   }
   static function Blank()
   {
      return new scidd.Draw.CColor(0,0,0,0);
   }
   static function Random()
   {
      return new scidd.Draw.CColor(random(256),random(256),random(256));
   }
   static function FromRGB(tRGB)
   {
      var _loc3_ = tRGB >> 16 & 0xFF;
      var _loc1_ = tRGB >> 8 & 0xFF;
      var _loc4_ = tRGB >> 0 & 0xFF;
      return new scidd.Draw.CColor(_loc3_,_loc1_,_loc4_,255);
   }
   static function FromRGB32(tARGB)
   {
      var _loc4_ = tARGB >> 16 & 0xFF;
      var _loc2_ = tARGB >> 8 & 0xFF;
      var _loc5_ = tARGB >> 0 & 0xFF;
      var _loc3_ = tARGB >> 24 & 0xFF;
      return new scidd.Draw.CColor(_loc4_,_loc2_,_loc5_,_loc3_);
   }
   function Combine(combineColor)
   {
      var _loc2_ = new scidd.Draw.CColor(0,0,0,0);
      _loc2_.mRed = (this.mRed + combineColor.mRed) / 2;
      _loc2_.mGreen = (this.mGreen + combineColor.mGreen) / 2;
      _loc2_.mBlue = (this.mBlue + combineColor.mBlue) / 2;
      _loc2_.mAlpha = (this.mAlpha + combineColor.mAlpha) / 2;
      _loc2_.mBrightness = (this.mBrightness + combineColor.mBrightness) / 2;
      return _loc2_;
   }
   function GetBaseColor()
   {
      var _loc2_ = this.Clone();
      return _loc2_;
   }
   function getRGB()
   {
      var _loc3_;
      var _loc2_;
      var _loc4_;
      if(this.mBrightness < 0)
      {
         _loc3_ = scidd.Math.CMath.Range(this.mRed + this.mRed * this.mBrightness,0,255) << 16;
         _loc2_ = scidd.Math.CMath.Range(this.mGreen + this.mGreen * this.mBrightness,0,255) << 8;
         _loc4_ = scidd.Math.CMath.Range(this.mBlue + this.mBlue * this.mBrightness,0,255) << 0;
         return _loc3_ | _loc2_ | _loc4_;
      }
      if(this.mBrightness > 0)
      {
         _loc3_ = scidd.Math.CMath.Range(this.mRed + (255 - this.mRed) * this.mBrightness,0,255) << 16;
         _loc2_ = scidd.Math.CMath.Range(this.mGreen + (255 - this.mGreen) * this.mBrightness,0,255) << 8;
         _loc4_ = scidd.Math.CMath.Range(this.mBlue + (255 - this.mBlue) * this.mBrightness,0,255) << 0;
         return _loc3_ | _loc2_ | _loc4_;
      }
      return (this.mRed << 16) + (this.mGreen << 8) + this.mBlue;
   }
   function getRGB32()
   {
      return this.getRGB() + (this.mAlpha << 24);
   }
   function get mAlpha100()
   {
      return Math.round(this.mAlpha * 100 / 255);
   }
   static function GetColorMatrixFilter(dMat)
   {
      return new flash.filters.ColorMatrixFilter(dMat);
   }
   static function ColorMatrix_Identity()
   {
      return new Array(1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0);
   }
   static function _BlendMatrix(mat1, mat2, tAmount)
   {
      var _loc3_ = scidd.Draw.CColor.ColorMatrix_Identity();
      var _loc1_ = 0;
      while(_loc1_ < mat1.length)
      {
         _loc3_[_loc1_] = scidd.Math.CMath.Tween(mat1[_loc1_],mat2[_loc1_],tAmount);
         _loc1_ = _loc1_ + 1;
      }
      return _loc3_;
   }
   static function ColorMatrix_Colorize(tColor, tAmount, tLightness)
   {
      tLightness = scidd.Math.CMath.Define(tLightness,1);
      var _loc1_ = tAmount;
      var _loc5_ = 1 - _loc1_;
      var _loc3_ = tColor.mRed / 255 * (tLightness + 1);
      var _loc6_ = tColor.mGreen / 255 * (tLightness + 1);
      var _loc2_ = tColor.mBlue / 255 * (tLightness + 1);
      var _loc7_ = new Array(_loc5_ + _loc1_ * _loc3_ * scidd.Draw.CColor._LumR,_loc1_ * _loc3_ * scidd.Draw.CColor._LumG,_loc1_ * _loc3_ * scidd.Draw.CColor._LumB,0,0,_loc1_ * _loc6_ * scidd.Draw.CColor._LumR,_loc5_ + _loc1_ * _loc6_ * scidd.Draw.CColor._LumG,_loc1_ * _loc6_ * scidd.Draw.CColor._LumB,0,0,_loc1_ * _loc2_ * scidd.Draw.CColor._LumR,_loc1_ * _loc2_ * scidd.Draw.CColor._LumG,_loc5_ + _loc1_ * _loc2_ * scidd.Draw.CColor._LumB,0,0,0,0,0,1,0);
      return _loc7_;
   }
   static function ColorMatrix_Serpia(tAmount)
   {
      tAmount = scidd.Math.CMath.Define(tAmount,1);
      var _loc1_ = new Array(0.393,0.769,0.189,0,0,0.349,0.686,0.168,0,0,0.272,0.534,0.131,0,0,0,0,0,1,0);
      return scidd.Draw.CColor._BlendMatrix(scidd.Draw.CColor.ColorMatrix_Identity(),_loc1_,tAmount);
   }
   static function ColorMatrix_GreyScale(tAmount)
   {
      tAmount = scidd.Math.CMath.Define(tAmount,1);
      var _loc1_ = new Array(scidd.Draw.CColor._LumR,scidd.Draw.CColor._LumG,scidd.Draw.CColor._LumB,0,0,scidd.Draw.CColor._LumR,scidd.Draw.CColor._LumG,scidd.Draw.CColor._LumB,0,0,scidd.Draw.CColor._LumR,scidd.Draw.CColor._LumG,scidd.Draw.CColor._LumB,0,0,0,0,0,1,0);
      return scidd.Draw.CColor._BlendMatrix(scidd.Draw.CColor.ColorMatrix_Identity(),_loc1_,tAmount);
   }
   static function ColorMatrix_HUE(tHue)
   {
      var _loc1_;
      var _loc2_;
      var _loc5_;
      var _loc4_;
      var _loc3_;
      var _loc6_;
      if(tHue != 0)
      {
         _loc1_ = Math.cos(tHue);
         _loc2_ = Math.sin(tHue);
         _loc5_ = 0.213;
         _loc4_ = 0.715;
         _loc3_ = 0.072;
         _loc6_ = new Array(_loc5_ + _loc1_ * (1 - _loc5_) + _loc2_ * (- _loc5_),_loc4_ + _loc1_ * (- _loc4_) + _loc2_ * (- _loc4_),_loc3_ + _loc1_ * (- _loc3_) + _loc2_ * (1 - _loc3_),0,0,_loc5_ + _loc1_ * (- _loc5_) + _loc2_ * 0.143,_loc4_ + _loc1_ * (1 - _loc4_) + _loc2_ * 0.14,_loc3_ + _loc1_ * (- _loc3_) + _loc2_ * -0.283,0,0,_loc5_ + _loc1_ * (- _loc5_) + _loc2_ * (- (1 - _loc5_)),_loc4_ + _loc1_ * (- _loc4_) + _loc2_ * _loc4_,_loc3_ + _loc1_ * (1 - _loc3_) + _loc2_ * _loc3_,0,0,0,0,0,1,0,0,0,0,0,1);
         return _loc6_;
      }
      return scidd.Draw.CColor.ColorMatrix_Identity();
   }
   static function ColorMatrix_Saturation(tSaturation)
   {
      var _loc2_;
      var _loc3_;
      var _loc4_;
      var _loc5_;
      if(tSaturation != 0)
      {
         if(tSaturation > 0)
         {
            tSaturation = tSaturation * 5 + 1;
         }
         else if(tSaturation < 0)
         {
            tSaturation += 1;
         }
         _loc2_ = (1 - tSaturation) * scidd.Draw.CColor._LumR;
         _loc3_ = (1 - tSaturation) * scidd.Draw.CColor._LumG;
         _loc4_ = (1 - tSaturation) * scidd.Draw.CColor._LumB;
         _loc5_ = new Array(_loc2_ + tSaturation,_loc3_,_loc4_,0,0,_loc2_,_loc3_ + tSaturation,_loc4_,0,0,_loc2_,_loc3_,_loc4_ + tSaturation,0,0,0,0,0,1,0);
         return _loc5_;
      }
      return scidd.Draw.CColor.ColorMatrix_Identity();
   }
   static function ColorMatrix_Alpha(tAlpha)
   {
      var _loc1_;
      if(tAlpha != 1)
      {
         _loc1_ = new Array(1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,tAlpha,0);
         return _loc1_;
      }
      return scidd.Draw.CColor.ColorMatrix_Identity();
   }
   static function ColorMatrix_Contrast(tContrast)
   {
      var _loc2_;
      if(tContrast != 0)
      {
         if(tContrast > 0)
         {
            tContrast *= 5;
         }
         tContrast += 1;
         _loc2_ = new Array(tContrast,0,0,0,128 * (1 - tContrast),0,tContrast,0,0,128 * (1 - tContrast),0,0,tContrast,0,128 * (1 - tContrast),0,0,0,1,0);
         return _loc2_;
      }
      return scidd.Draw.CColor.ColorMatrix_Identity();
   }
   static function ColorMatrix_Brightness(tBrightness)
   {
      var _loc2_;
      if(tBrightness != 0)
      {
         tBrightness *= 255;
         _loc2_ = new Array(1,0,0,0,tBrightness,0,1,0,0,tBrightness,0,0,1,0,tBrightness,0,0,0,1,0);
         return _loc2_;
      }
      return scidd.Draw.CColor.ColorMatrix_Identity();
   }
   static function MatrixMulti(sMat, dMat)
   {
      var _loc6_ = new Array();
      var _loc5_ = 0;
      var _loc2_ = 0;
      var _loc1_;
      while(_loc5_ < 4)
      {
         _loc1_ = 0;
         while(_loc1_ < 5)
         {
            _loc6_[_loc2_ + _loc1_] = sMat[_loc2_] * dMat[_loc1_] + sMat[_loc2_ + 1] * dMat[_loc1_ + 5] + sMat[_loc2_ + 2] * dMat[_loc1_ + 10] + sMat[_loc2_ + 3] * dMat[_loc1_ + 15] + (_loc1_ != 4 ? 0 : sMat[_loc2_ + 4]);
            _loc1_ = _loc1_ + 1;
         }
         _loc5_++;
         _loc2_ += 5;
      }
      return _loc6_;
   }
}
