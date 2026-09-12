function §\x01\x02§()
{
   return 676;
}
var §\x01§ = -51 + "\x01\x02"();
while(true)
{
   if(eval("\x01") == 625)
   {
      set("\x01",eval("\x01") - 441);
      §§push(true);
   }
   else if(eval("\x01") == 798)
   {
      set("\x01",eval("\x01") - 90);
      §§push("\x0f");
      §§push(1);
   }
   else
   {
      if(eval("\x01") == 689)
      {
         set("\x01",eval("\x01") - 146);
         break;
      }
      if(eval("\x01") == 156)
      {
         set("\x01",eval("\x01") + 229);
      }
      else
      {
         if(eval("\x01") == 385)
         {
            set("\x01",eval("\x01") - 154);
            if(!_global.scidd)
            {
               _global.scidd = new Object();
            }
            §§pop();
            break;
         }
         if(eval("\x01") == 687)
         {
            set("\x01",eval("\x01") - 179);
            §§push(true);
         }
         else if(eval("\x01") == 646)
         {
            set("\x01",eval("\x01") - 427);
            §§push(eval(§§pop()));
         }
         else if(eval("\x01") == 219)
         {
            set("\x01",eval("\x01") + 7);
            §§push(!§§pop());
         }
         else if(eval("\x01") == 799)
         {
            set("\x01",eval("\x01") - 112);
         }
         else if(eval("\x01") == 543)
         {
            set("\x01",eval("\x01") + 255);
         }
         else if(eval("\x01") == 708)
         {
            set("\x01",eval("\x01") + 118);
            var §§pop() = §§pop();
         }
         else
         {
            if(eval("\x01") == 218)
            {
               set("\x01",eval("\x01") + 581);
            }
            else
            {
               if(eval("\x01") == 184)
               {
                  set("\x01",eval("\x01") + 34);
                  if(§§pop())
                  {
                     set("\x01",eval("\x01") + 581);
                  }
                  continue;
               }
               if(eval("\x01") == 115)
               {
                  set("\x01",eval("\x01") + 572);
                  continue;
               }
               if(eval("\x01") == 508)
               {
                  set("\x01",eval("\x01") + 181);
                  if(§§pop())
                  {
                     set("\x01",eval("\x01") - 146);
                  }
                  continue;
               }
               if(eval("\x01") == 565)
               {
                  set("\x01",eval("\x01") + 233);
                  continue;
               }
               if(eval("\x01") == 826)
               {
                  set("\x01",eval("\x01") - 180);
                  §§push("\x0f");
                  continue;
               }
               if(eval("\x01") == 226)
               {
                  set("\x01",eval("\x01") - 70);
                  if(§§pop())
                  {
                     set("\x01",eval("\x01") + 229);
                  }
                  continue;
               }
               if(eval("\x01") == 231)
               {
                  set("\x01",eval("\x01") - 231);
               }
            }
            §§goto(addr2dfc);
         }
      }
   }
}
if(!_global.scidd.Math)
{
   _global.scidd.Math = new Object();
}
§§pop();
var _loc2_;
if(!_global.scidd.Math.CLine)
{
   _loc2_ = scidd.Math.CLine = function(p1, p2)
   {
      this.mP1 = p1;
      this.mP2 = p2;
   }.prototype;
   _loc2_.Clone = function(tNoPointClone)
   {
      return !(tNoPointClone == undefined || tNoPointClone == false) ? new scidd.Math.CLine(this.mP1,this.mP2) : new scidd.Math.CLine(this.mP1.clone(),this.mP2.clone());
   };
   _loc2_.toString = function()
   {
      return "CLine:: " + this.mP1 + " , " + this.mP2;
   };
   _loc2_.Draw = function(mc, tColor, tAlpha)
   {
      mc.lineStyle(1,tColor != undefined ? tColor : 65280,tAlpha != undefined ? tAlpha : 100);
      mc.moveTo(this.mP1.x,this.mP1.y);
      mc.lineTo(this.mP2.x,this.mP2.y);
   };
   _loc2_.DrawNormal = function(mc, tColor, tAlpha)
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
   };
   _loc2_.Move = function(d, scalar)
   {
      d = d.clone();
      d.normalize(d.length * scalar);
      this.mP1 = this.mP1.add(d);
      this.mP2 = this.mP2.add(d);
      return this;
   };
   _loc2_.Offset = function(d)
   {
      return new scidd.Math.CLine(this.mP1.add(d),this.mP2.add(d));
   };
   _loc2_.__get__mNormal = function()
   {
      return this._cache_Normal != undefined ? this._cache_Normal.clone() : (this._cache_Normal = new flash.geom.Point(this.mP1.y - this.mP2.y,this.mP2.x - this.mP1.x));
   };
   _loc2_.__get__mNormalUnit = function()
   {
      var _loc2_ = this.mNormal;
      _loc2_.normalize(1);
      return _loc2_;
   };
   _loc2_.__get__mCentre = function()
   {
      return this._cache_Centre != undefined ? this._cache_Centre.clone() : (this._cache_Centre = new flash.geom.Point((this.mP1.x + this.mP2.x) / 2,(this.mP2.y + this.mP1.y) / 2));
   };
   _loc2_.__get__mDelta = function()
   {
      return this._cache_Delta != undefined ? this._cache_Delta.clone() : (this._cache_Delta = this.mP2.subtract(this.mP1));
   };
   _loc2_.__get__mAngle = function()
   {
      return this._cache_Angle != undefined ? (this._cache_Angle = Math.atan2(this.mP2.y - this.mP1.y,this.mP2.x - this.mP1.x)) : this._cache_Angle;
   };
   _loc2_.__get__mLength = function()
   {
      var _loc2_;
      if(this._cache_Length == undefined)
      {
         _loc2_ = this.mDelta;
         return this._cache_Length = Math.sqrt(_loc2_.x * _loc2_.x + _loc2_.y * _loc2_.y);
      }
      return this._cache_Length;
   };
   _loc2_.__get__mLength_SQR = function()
   {
      var _loc2_;
      if(this._cache_LengthSQR == undefined)
      {
         _loc2_ = this.mDelta;
         return this._cache_LengthSQR = _loc2_.x * _loc2_.x + _loc2_.y * _loc2_.y;
      }
      return this._cache_LengthSQR;
   };
   _loc2_.__get__mCrossProduct = function()
   {
      return new flash.geom.Point(this.mP1.y * this.mP2.x - this.mP1.x * this.mP2.y,this.mP1.x * this.mP2.y - this.mP1.y * this.mP2.x);
   };
   _loc2_.__get__mGradient = function()
   {
      var _loc2_;
      if(this._cache_Gradient == undefined)
      {
         _loc2_ = this.mDelta;
         return _loc2_.x / _loc2_.y;
      }
      return this._cache_Gradient;
   };
   _loc2_.SideOfLine = function(p)
   {
      return (this.mP1.x - p.x) * (this.mP2.y - p.y) - (this.mP2.x - p.x) * (this.mP1.y - p.y);
   };
   _loc2_.__get__mInverse = function()
   {
      return new scidd.Math.CLine(this.mP2,this.mP1);
   };
   _loc2_.Scale = function(tScale)
   {
      var _loc2_ = this.mDelta;
      var _loc3_ = this.mCentre;
      _loc2_.x *= tScale * 0.5;
      _loc2_.y *= tScale * 0.5;
      return new scidd.Math.CLine(_loc3_.subtract(_loc2_),_loc3_.add(_loc2_));
   };
   _loc2_.Scale1 = function(tScale)
   {
      var _loc2_ = this.mDelta;
      _loc2_.x *= tScale;
      _loc2_.y *= tScale;
      return new scidd.Math.CLine(this.mP1,this.mP1.add(_loc2_));
   };
   _loc2_.Scale2 = function(tScale)
   {
      var _loc2_ = this.mDelta;
      _loc2_.x *= tScale;
      _loc2_.y *= tScale;
      return new scidd.Math.CLine(this.mP2.subtract(_loc2_),this.mP2);
   };
   _loc2_.SetLength = function(tLength)
   {
      var _loc2_ = this.mDelta;
      _loc2_.normalize(tLength / 2);
      var _loc3_ = this.mCentre;
      return new scidd.Math.CLine(_loc3_.subtract(_loc2_),_loc3_.add(_loc2_));
   };
   _loc2_.SetLength1 = function(tLength)
   {
      var _loc2_ = this.mDelta;
      _loc2_.normalize(tLength);
      return new scidd.Math.CLine(this.mP1,this.mP1.add(_loc2_));
   };
   _loc2_.SetLength2 = function(tLength)
   {
      var _loc2_ = this.mDelta;
      _loc2_.normalize(tLength);
      return new scidd.Math.CLine(this.mP2.subtract(_loc2_),this.mP2);
   };
   _loc2_.Rotate = function(tAngle)
   {
      var _loc2_ = this.mCentre;
      var _loc3_ = scidd.Math.CMath.GetMatrix_Angle(tAngle);
      return new scidd.Math.CLine(_loc3_.transformPoint(this.mP1.subtract(_loc2_)).add(_loc2_),_loc3_.transformPoint(this.mP2.subtract(_loc2_)).add(_loc2_));
   };
   _loc2_.Rotate90 = function()
   {
      return new scidd.Math.CLine(this.mP1,this.mP1.subtract(this.mNormal));
   };
   _loc2_.Rotate180 = function()
   {
      return new scidd.Math.CLine(this.mP1,this.mP1.subtract(this.mDelta));
   };
   _loc2_.Rotate270 = function()
   {
      return new scidd.Math.CLine(this.mP1,this.mP1.add(this.mNormal));
   };
   _loc2_.Average = function(l2)
   {
      var _loc3_ = this.mP1.add(l2.mP1);
      var _loc2_ = this.mP2.add(l2.mP2);
      _loc3_.x /= 2;
      _loc3_.y /= 2;
      _loc2_.x /= 2;
      _loc2_.y /= 2;
      return new scidd.Math.CLine(_loc3_,_loc2_);
   };
   _loc2_.Distance_PointToLine = function(p, inf)
   {
      return Math.sqrt(this.Distance_PointToLine_SQR(p,inf));
   };
   _loc2_.Distance_PointToLine_SQR = function(p, inf)
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
   };
   _loc2_.QDistance_PointToLine_SQR = function(p)
   {
      var _loc3_ = this.mP2.x - this.mP1.x;
      var _loc2_ = this.mP2.y - this.mP1.y;
      var _loc9_ = p.x - this.mP1.x;
      var _loc8_ = p.y - this.mP1.y;
      var _loc4_ = (_loc3_ * _loc9_ + _loc2_ * _loc8_) / (_loc3_ * _loc3_ + _loc2_ * _loc2_);
      var _loc7_ = p.x - (this.mP1.x + _loc3_ * _loc4_);
      var _loc6_ = p.y - (this.mP1.y + _loc2_ * _loc4_);
      return _loc7_ * _loc7_ + _loc6_ * _loc6_;
   };
   _loc2_.ProjectPointToLine = function(p, inf)
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
   };
   _loc2_.DirectionToPoint = function(p)
   {
      var _loc2_ = this.mDelta;
      var _loc3_ = p.subtract(this.mP1);
      return (_loc2_.x * _loc3_.x + _loc2_.y * _loc3_.y) / this.mLength_SQR;
   };
   _loc2_.IsPointOnLine = function(p)
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
   };
   _loc2_.Parallel = function(tLine)
   {
      var _loc3_ = this.mDelta;
      var _loc2_ = tLine.mDelta;
      return Math.abs(_loc3_.y * _loc2_.x - _loc3_.x * _loc2_.y) >= 0.00001 ? false : true;
   };
   _loc2_.GetRectangle = function()
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
   };
   _loc2_.Intersects = function(cLine, rp, inf)
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
   };
   _loc2_.DoesIntersect_Infinate = function(cLine)
   {
      return this.SideOfLine(cLine.mP1) != this.SideOfLine(cLine.mP2);
   };
   _loc2_.CrossLine = function(cLine)
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
   };
   _loc2_.QCrossLine = function(cLine)
   {
      var _loc3_ = cLine.mP1;
      var _loc2_ = cLine.mP2;
      return (this.mP1.x - _loc3_.x) * (this.mP2.y - _loc3_.y) - (this.mP2.x - _loc3_.x) * (this.mP1.y - _loc3_.y) != (this.mP1.x - _loc2_.x) * (this.mP2.y - _loc2_.y) - (this.mP2.x - _loc2_.x) * (this.mP1.y - _loc2_.y);
   };
   _loc2_.Reflect = function(v, tElasticity)
   {
      var _loc2_ = this.mNormal;
      _loc2_.normalize(1);
      var _loc3_ = 2 * (v.x * _loc2_.x + v.y * _loc2_.y);
      return new flash.geom.Point(_loc3_ * _loc2_.x,_loc3_ * v.y);
   };
   _loc2_.__get__mOrientation = function()
   {
      return this._cache_Orientation != undefined ? this._cache_Orientation : (this._cache_Orientation = this.GetOrientation(0));
   };
   _loc2_.__get__mOrientation180 = function()
   {
      return this._cache_Orientation180 != undefined ? this._cache_Orientation180 : (this._cache_Orientation180 = this.GetOrientation(3.141592653589793));
   };
   _loc2_.GetOrientation = function(tAdjustAngle)
   {
      tAdjustAngle = tAdjustAngle != undefined ? tAdjustAngle : 0;
      var _loc2_ = {mMatrix:new flash.geom.Matrix(),iMatrix:new flash.geom.Matrix(),mPosition:this.mP1,mAngle:Math.atan2(this.mP2.y - this.mP1.y,this.mP2.x - this.mP1.x) + tAdjustAngle};
      _loc2_.iMatrix.rotate(_loc2_.mAngle);
      _loc2_.iMatrix.translate(_loc2_.mPosition.x,_loc2_.mPosition.y);
      _loc2_.mMatrix.translate(- _loc2_.mPosition.x,- _loc2_.mPosition.y);
      _loc2_.mMatrix.rotate(- _loc2_.mAngle);
      _loc2_.mLine = this.ApplyMatrix(_loc2_.mMatrix);
      return _loc2_;
   };
   _loc2_.ApplyMatrix = function(m)
   {
      return new scidd.Math.CLine(m.transformPoint(this.mP1),m.transformPoint(this.mP2));
   };
   _loc2_._CLASSID_ = "scidd.Math.CLine";
   §§push(_loc2_.addProperty("mAngle",_loc2_.__get__mAngle,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mCentre",_loc2_.__get__mCentre,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mCrossProduct",_loc2_.__get__mCrossProduct,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mDelta",_loc2_.__get__mDelta,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mGradient",_loc2_.__get__mGradient,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mInverse",_loc2_.__get__mInverse,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mLength",_loc2_.__get__mLength,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mLength_SQR",_loc2_.__get__mLength_SQR,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mNormal",_loc2_.__get__mNormal,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mNormalUnit",_loc2_.__get__mNormalUnit,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mOrientation",_loc2_.__get__mOrientation,function()
   {
   }
   ));
   §§push(_loc2_.addProperty("mOrientation180",_loc2_.__get__mOrientation180,function()
   {
   }
   ));
   §§push(ASSetPropFlags(scidd.Math.CLine.prototype,null,1));
}
§§pop();
addr2dfc:
