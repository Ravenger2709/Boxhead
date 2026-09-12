class scidd.Math.CLine
{
   var _cache_Angle;
   var _cache_Centre;
   var _cache_Delta;
   var _cache_Gradient;
   var _cache_Length;
   var _cache_LengthSQR;
   var _cache_Normal;
   var _cache_Orientation;
   var _cache_Orientation180;
   var mP1;
   var mP2;
   var _CLASSID_ = "scidd.Math.CLine";
   function CLine(p1, p2)
   {
      this.mP1 = p1;
      this.mP2 = p2;
   }
   function Clone(tNoPointClone)
   {
      return !(tNoPointClone == undefined || tNoPointClone == false) ? new scidd.Math.CLine(this.mP1,this.mP2) : new scidd.Math.CLine(this.mP1.clone(),this.mP2.clone());
   }
   function toString()
   {
      return "CLine:: " + this.mP1 + " , " + this.mP2;
   }
   function Draw(mc, tColor, tAlpha)
   {
      mc.lineStyle(1,tColor != undefined ? tColor : 65280,tAlpha != undefined ? tAlpha : 100);
      mc.moveTo(this.mP1.x,this.mP1.y);
      mc.lineTo(this.mP2.x,this.mP2.y);
   }
   function DrawNormal(mc, tColor, tAlpha)
   {
      mc.lineStyle(1,tColor != undefined ? tColor : 65280,tAlpha != undefined ? tAlpha : 100);
      mc.moveTo(this.mP1.x,this.mP1.y);
      mc.lineTo(this.mP2.x,this.mP2.y);
      var _loc2_ = this.mP2.subtract(this.mP1);
      _loc2_.normalize(_loc2_.length / 2);
      _loc2_ = _loc2_.add(this.mP1);
      mc.moveTo(_loc2_.x,_loc2_.y);
      var _loc4_ = this.mNormal;
      _loc4_.normalize(this.mDelta.length / 4);
      _loc2_ = _loc2_.add(_loc4_);
      mc.lineTo(_loc2_.x,_loc2_.y);
   }
   function Move(d, scalar)
   {
      d = d.clone();
      d.normalize(d.length * scalar);
      this.mP1 = this.mP1.add(d);
      this.mP2 = this.mP2.add(d);
      return this;
   }
   function Offset(d)
   {
      return new scidd.Math.CLine(this.mP1.add(d),this.mP2.add(d));
   }
   function get mNormal()
   {
      return this._cache_Normal != undefined ? this._cache_Normal.clone() : (this._cache_Normal = new flash.geom.Point(this.mP1.y - this.mP2.y,this.mP2.x - this.mP1.x));
   }
   function get mNormalUnit()
   {
      var _loc2_ = this.mNormal;
      _loc2_.normalize(1);
      return _loc2_;
   }
   function get mCentre()
   {
      return this._cache_Centre != undefined ? this._cache_Centre.clone() : (this._cache_Centre = new flash.geom.Point((this.mP1.x + this.mP2.x) / 2,(this.mP2.y + this.mP1.y) / 2));
   }
   function get mDelta()
   {
      return this._cache_Delta != undefined ? this._cache_Delta.clone() : (this._cache_Delta = this.mP2.subtract(this.mP1));
   }
   function get mAngle()
   {
      return this._cache_Angle != undefined ? (this._cache_Angle = Math.atan2(this.mP2.y - this.mP1.y,this.mP2.x - this.mP1.x)) : this._cache_Angle;
   }
   function get mLength()
   {
      var _loc2_;
      if(this._cache_Length == undefined)
      {
         _loc2_ = this.mDelta;
         return this._cache_Length = Math.sqrt(_loc2_.x * _loc2_.x + _loc2_.y * _loc2_.y);
      }
      return this._cache_Length;
   }
   function get mLength_SQR()
   {
      var _loc2_;
      if(this._cache_LengthSQR == undefined)
      {
         _loc2_ = this.mDelta;
         return this._cache_LengthSQR = _loc2_.x * _loc2_.x + _loc2_.y * _loc2_.y;
      }
      return this._cache_LengthSQR;
   }
   function get mCrossProduct()
   {
      return new flash.geom.Point(this.mP1.y * this.mP2.x - this.mP1.x * this.mP2.y,this.mP1.x * this.mP2.y - this.mP1.y * this.mP2.x);
   }
   function get mGradient()
   {
      var _loc2_;
      if(this._cache_Gradient == undefined)
      {
         _loc2_ = this.mDelta;
         return _loc2_.x / _loc2_.y;
      }
      return this._cache_Gradient;
   }
   function SideOfLine(p)
   {
      return (this.mP1.x - p.x) * (this.mP2.y - p.y) - (this.mP2.x - p.x) * (this.mP1.y - p.y);
   }
   function get mInverse()
   {
      return new scidd.Math.CLine(this.mP2,this.mP1);
   }
   function Scale(tScale)
   {
      var _loc2_ = this.mDelta;
      var _loc3_ = this.mCentre;
      _loc2_.x *= tScale * 0.5;
      _loc2_.y *= tScale * 0.5;
      return new scidd.Math.CLine(_loc3_.subtract(_loc2_),_loc3_.add(_loc2_));
   }
   function Scale1(tScale)
   {
      var _loc2_ = this.mDelta;
      _loc2_.x *= tScale;
      _loc2_.y *= tScale;
      return new scidd.Math.CLine(this.mP1,this.mP1.add(_loc2_));
   }
   function Scale2(tScale)
   {
      var _loc2_ = this.mDelta;
      _loc2_.x *= tScale;
      _loc2_.y *= tScale;
      return new scidd.Math.CLine(this.mP2.subtract(_loc2_),this.mP2);
   }
   function SetLength(tLength)
   {
      var _loc2_ = this.mDelta;
      _loc2_.normalize(tLength / 2);
      var _loc3_ = this.mCentre;
      return new scidd.Math.CLine(_loc3_.subtract(_loc2_),_loc3_.add(_loc2_));
   }
   function SetLength1(tLength)
   {
      var _loc2_ = this.mDelta;
      _loc2_.normalize(tLength);
      return new scidd.Math.CLine(this.mP1,this.mP1.add(_loc2_));
   }
   function SetLength2(tLength)
   {
      var _loc2_ = this.mDelta;
      _loc2_.normalize(tLength);
      return new scidd.Math.CLine(this.mP2.subtract(_loc2_),this.mP2);
   }
   function Rotate(tAngle)
   {
      var _loc2_ = this.mCentre;
      var _loc3_ = scidd.Math.CMath.GetMatrix_Angle(tAngle);
      return new scidd.Math.CLine(_loc3_.transformPoint(this.mP1.subtract(_loc2_)).add(_loc2_),_loc3_.transformPoint(this.mP2.subtract(_loc2_)).add(_loc2_));
   }
   function Rotate90()
   {
      return new scidd.Math.CLine(this.mP1,this.mP1.subtract(this.mNormal));
   }
   function Rotate180()
   {
      return new scidd.Math.CLine(this.mP1,this.mP1.subtract(this.mDelta));
   }
   function Rotate270()
   {
      return new scidd.Math.CLine(this.mP1,this.mP1.add(this.mNormal));
   }
   function Average(l2)
   {
      var _loc3_ = this.mP1.add(l2.mP1);
      var _loc2_ = this.mP2.add(l2.mP2);
      _loc3_.x /= 2;
      _loc3_.y /= 2;
      _loc2_.x /= 2;
      _loc2_.y /= 2;
      return new scidd.Math.CLine(_loc3_,_loc2_);
   }
   function Distance_PointToLine(p, inf)
   {
      return Math.sqrt(this.Distance_PointToLine_SQR(p,inf));
   }
   function Distance_PointToLine_SQR(p, inf)
   {
      var _loc2_;
      var _loc3_;
      var _loc8_;
      var _loc10_;
      var _loc9_;
      if(inf)
      {
         _loc2_ = this.mDelta;
         _loc3_ = p.subtract(this.mP1);
         _loc8_ = (_loc2_.x * _loc3_.x + _loc2_.y * _loc3_.y) / (_loc2_.x * _loc2_.x + _loc2_.y * _loc2_.y);
         _loc10_ = p.x - (this.mP1.x + _loc2_.x * _loc8_);
         _loc9_ = p.y - (this.mP1.y + _loc2_.y * _loc8_);
         return _loc10_ * _loc10_ + _loc9_ * _loc9_;
      }
      var _loc4_ = this;
      _loc2_ = _loc4_.mDelta;
      _loc3_ = p.subtract(_loc4_.mP1);
      var _loc7_ = _loc2_.x * _loc3_.x + _loc2_.y * _loc3_.y;
      if(_loc7_ <= 0)
      {
         return _loc3_.x * _loc3_.x + _loc3_.y * _loc3_.y;
      }
      var _loc11_ = _loc2_.x * _loc2_.x + _loc2_.y * _loc2_.y;
      var _loc5_;
      if(_loc11_ <= _loc7_)
      {
         _loc5_ = p.subtract(_loc4_.mP2);
         return _loc5_.x * _loc5_.x + _loc5_.y * _loc5_.y;
      }
      _loc8_ = _loc7_ / _loc11_;
      var _loc12_ = new flash.geom.Point(_loc4_.mP1.x + _loc8_ * _loc2_.x,_loc4_.mP1.y + _loc8_ * _loc2_.y);
      _loc5_ = p.subtract(_loc12_);
      return _loc5_.x * _loc5_.x + _loc5_.y * _loc5_.y;
   }
   function QDistance_PointToLine_SQR(p)
   {
      var _loc3_ = this.mP2.x - this.mP1.x;
      var _loc2_ = this.mP2.y - this.mP1.y;
      var _loc9_ = p.x - this.mP1.x;
      var _loc8_ = p.y - this.mP1.y;
      var _loc4_ = (_loc3_ * _loc9_ + _loc2_ * _loc8_) / (_loc3_ * _loc3_ + _loc2_ * _loc2_);
      var _loc7_ = p.x - (this.mP1.x + _loc3_ * _loc4_);
      var _loc6_ = p.y - (this.mP1.y + _loc2_ * _loc4_);
      return _loc7_ * _loc7_ + _loc6_ * _loc6_;
   }
   function ProjectPointToLine(p, inf)
   {
      var _loc2_;
      var _loc6_;
      var _loc4_;
      if(inf)
      {
         _loc2_ = this.mDelta;
         _loc6_ = p.subtract(this.mP1);
         if(_loc2_.x == 0 && _loc2_.y == 0)
         {
            return this.mP1;
         }
         _loc4_ = (_loc2_.x * _loc6_.x + _loc2_.y * _loc6_.y) / this.mLength_SQR;
         return new flash.geom.Point(this.mP1.x + _loc4_ * _loc2_.x,this.mP1.y + _loc4_ * _loc2_.y);
      }
      _loc2_ = this.mDelta;
      _loc6_ = p.subtract(this.mP1);
      if(_loc2_.x == 0 && _loc2_.y == 0)
      {
         return this.mP1;
      }
      var _loc3_ = _loc2_.x * _loc6_.x + _loc2_.y * _loc6_.y;
      var _loc5_ = this.mLength_SQR;
      if(_loc5_ <= _loc3_ || _loc3_ < 0)
      {
         return undefined;
      }
      _loc4_ = _loc3_ / _loc5_;
      return new flash.geom.Point(this.mP1.x + _loc4_ * _loc2_.x,this.mP1.y + _loc4_ * _loc2_.y);
   }
   function DirectionToPoint(p)
   {
      var _loc2_ = this.mDelta;
      var _loc3_ = p.subtract(this.mP1);
      return (_loc2_.x * _loc3_.x + _loc2_.y * _loc3_.y) / this.mLength_SQR;
   }
   function IsPointOnLine(p)
   {
      var _loc2_;
      var _loc5_;
      var _loc4_;
      var _loc6_;
      if(Math.abs((this.mP1.x - p.x) * (this.mP2.y - p.y) - (this.mP2.x - p.x) * (this.mP1.y - p.y)) < 0.00001)
      {
         _loc2_ = this.mDelta;
         _loc5_ = p.subtract(this.mP1);
         _loc4_ = _loc5_.x * _loc2_.x + _loc5_.y * _loc2_.y;
         _loc6_ = _loc2_.x * _loc2_.x + _loc2_.y * _loc2_.y;
         if(_loc4_ >= 0 && _loc6_ >= _loc4_)
         {
            return true;
         }
      }
      return false;
   }
   function Parallel(tLine)
   {
      var _loc3_ = this.mDelta;
      var _loc2_ = tLine.mDelta;
      return Math.abs(_loc3_.y * _loc2_.x - _loc3_.x * _loc2_.y) >= 0.00001 ? false : true;
   }
   function GetRectangle()
   {
      var _loc2_;
      var _loc3_;
      var _loc4_;
      var _loc5_;
      if(this.mP1.x > this.mP2.x)
      {
         _loc2_ = this.mP2.x;
         _loc4_ = this.mP1.x;
      }
      else
      {
         _loc2_ = this.mP1.x;
         _loc4_ = this.mP2.x;
      }
      if(this.mP1.y > this.mP2.y)
      {
         _loc3_ = this.mP2.y;
         _loc5_ = this.mP1.y;
      }
      else
      {
         _loc3_ = this.mP1.y;
         _loc5_ = this.mP2.y;
      }
      return new flash.geom.Rectangle(_loc2_,_loc3_,_loc4_ - _loc2_,_loc5_ - _loc3_);
   }
   function Intersects(cLine, rp, inf)
   {
      var _loc4_;
      var _loc6_;
      var _loc12_;
      var _loc9_;
      var _loc14_;
      if(inf)
      {
         _loc4_ = this.mDelta;
         _loc6_ = cLine.mDelta;
         _loc12_ = _loc4_.y * _loc6_.x - _loc4_.x * _loc6_.y;
         if(Math.abs(_loc12_) < 0.00001)
         {
            return false;
         }
         _loc9_ = cLine.mP1.subtract(this.mP1);
         _loc14_ = (_loc6_.y * _loc9_.x - _loc6_.x * _loc9_.y) / _loc12_;
         rp.x = this.mP1.x - _loc4_.x * _loc14_;
         rp.y = this.mP1.y - _loc4_.y * _loc14_;
         return true;
      }
      var _loc2_ = cLine.mP1;
      var _loc7_ = cLine.mP2;
      _loc4_ = cLine.mDelta;
      _loc6_ = this.mDelta;
      var _loc13_ = _loc4_.x * _loc6_.y;
      var _loc11_ = _loc6_.x * _loc4_.y;
      var _loc5_ = ((_loc2_.y - this.mP1.y) * _loc6_.x - (_loc2_.x - this.mP1.x) * _loc6_.y) / (_loc13_ - _loc11_);
      if(isNaN(_loc5_))
      {
         if(_loc2_.equals(_loc7_))
         {
            rp.x = _loc7_.x;
            rp.y = _loc7_.y;
         }
         else
         {
            if(!this.mP1.equals(this.mP2))
            {
               return false;
            }
            rp.x = this.mP1.x;
            rp.y = this.mP1.y;
         }
      }
      else
      {
         rp.x = _loc2_.x + _loc5_ * _loc4_.x;
         rp.y = _loc2_.y + _loc5_ * _loc4_.y;
      }
      var _loc10_ = ((this.mP1.y - _loc2_.y) * _loc4_.x - (this.mP1.x - _loc2_.x) * _loc4_.y) / (_loc11_ - _loc13_);
      return !(_loc5_ >= 0 && _loc5_ <= 1 && _loc10_ >= 0 && _loc10_ <= 1) ? false : true;
   }
   function DoesIntersect_Infinate(cLine)
   {
      return this.SideOfLine(cLine.mP1) != this.SideOfLine(cLine.mP2);
   }
   function CrossLine(cLine)
   {
      var _loc3_ = this.SideOfLine(cLine.mP1);
      var _loc2_ = this.SideOfLine(cLine.mP2);
      if(_loc3_ > _loc2_)
      {
         return -1;
      }
      if(_loc3_ < _loc2_)
      {
         return 1;
      }
      return 0;
   }
   function QCrossLine(cLine)
   {
      var _loc3_ = cLine.mP1;
      var _loc2_ = cLine.mP2;
      return (this.mP1.x - _loc3_.x) * (this.mP2.y - _loc3_.y) - (this.mP2.x - _loc3_.x) * (this.mP1.y - _loc3_.y) != (this.mP1.x - _loc2_.x) * (this.mP2.y - _loc2_.y) - (this.mP2.x - _loc2_.x) * (this.mP1.y - _loc2_.y);
   }
   function Reflect(v, tElasticity)
   {
      var _loc2_ = this.mNormal;
      _loc2_.normalize(1);
      var _loc3_ = 2 * (v.x * _loc2_.x + v.y * _loc2_.y);
      return new flash.geom.Point(_loc3_ * _loc2_.x,_loc3_ * v.y);
   }
   function get mOrientation()
   {
      return this._cache_Orientation != undefined ? this._cache_Orientation : (this._cache_Orientation = this.GetOrientation(0));
   }
   function get mOrientation180()
   {
      return this._cache_Orientation180 != undefined ? this._cache_Orientation180 : (this._cache_Orientation180 = this.GetOrientation(3.141592653589793));
   }
   function GetOrientation(tAdjustAngle)
   {
      tAdjustAngle = tAdjustAngle != undefined ? tAdjustAngle : 0;
      var _loc2_ = {mMatrix:new flash.geom.Matrix(),iMatrix:new flash.geom.Matrix(),mPosition:this.mP1,mAngle:Math.atan2(this.mP2.y - this.mP1.y,this.mP2.x - this.mP1.x) + tAdjustAngle};
      _loc2_.iMatrix.rotate(_loc2_.mAngle);
      _loc2_.iMatrix.translate(_loc2_.mPosition.x,_loc2_.mPosition.y);
      _loc2_.mMatrix.translate(- _loc2_.mPosition.x,- _loc2_.mPosition.y);
      _loc2_.mMatrix.rotate(- _loc2_.mAngle);
      _loc2_.mLine = this.ApplyMatrix(_loc2_.mMatrix);
      return _loc2_;
   }
   function ApplyMatrix(m)
   {
      return new scidd.Math.CLine(m.transformPoint(this.mP1),m.transformPoint(this.mP2));
   }
}
