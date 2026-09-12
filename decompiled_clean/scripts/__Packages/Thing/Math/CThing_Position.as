class Thing.Math.CThing_Position
{
   var mX;
   var mY;
   var mZ;
   var _CLASSID_ = "CThing_Position";
   var _BASECLASSID_ = "CThing_Position";
   static var mPFactor = 1;
   static var PI = 3.141592653589793;
   static var PI360 = Thing.Math.CThing_Position.PI * 2;
   static var Deg2Rad = Thing.Math.CThing_Position.PI / 180;
   static var Rad2Deg = 180 / Thing.Math.CThing_Position.PI;
   function CThing_Position(tx, ty, tz)
   {
      this.mX = tx;
      this.mY = ty;
      this.mZ = tz;
   }
   function Clone()
   {
      return new Thing.Math.CThing_Position(this.mX,this.mY,this.mZ);
   }
   function ConvertScreenToCell()
   {
      this.mX /= World.Map.CMap_Cell.mSize.x;
      this.mY /= World.Map.CMap_Cell.mSize.y;
      return this;
   }
   function ConvertCellToScreen()
   {
      return new flash.geom.Point(Math.round(this.mX * World.Map.CMap_Cell.mSize.x),Math.round((this.mY + this.mZ * Thing.Math.CThing_Position.mPFactor) * World.Map.CMap_Cell.mSize.y));
   }
   function get mCellCentre()
   {
      return new Thing.Math.CThing_Position(Math.floor(this.mX) + 0.5,Math.floor(this.mY) + 0.5,this.mZ);
   }
   function CellCentre()
   {
      this.mX = Math.floor(this.mX) + 0.5;
      this.mY = Math.floor(this.mY) + 0.5;
      return this;
   }
   function Round()
   {
      this.mX = Math.round(this.mX);
      this.mY = Math.round(this.mY);
      return this;
   }
   function Floor()
   {
      this.mX = Math.floor(this.mX);
      this.mY = Math.floor(this.mY);
      return this;
   }
   function Ceil()
   {
      this.mX = Math.ceil(this.mX);
      this.mY = Math.ceil(this.mY);
      return this;
   }
   function Add(p)
   {
      return new Thing.Math.CThing_Position(this.mX + p.mX,this.mY + p.mY,this.mZ + p.mZ);
   }
   function Add2(p1, p2)
   {
      this.mX = p1.mX + p2.mX;
      this.mY = p1.mY + p2.mY;
      this.mZ = p1.mZ + p2.mZ;
      return this;
   }
   function Sub(p)
   {
      return new Thing.Math.CThing_Position(this.mX - p.mX,this.mY - p.mY,this.mZ - p.mZ);
   }
   function Subtract(p)
   {
      return new Thing.Math.CThing_Position(this.mX - p.mX,this.mY - p.mY,this.mZ - p.mZ);
   }
   function Equals(p)
   {
      return this.mX == p.mX && this.mY == p.mY && this.mZ == p.mZ;
   }
   function Equals0()
   {
      return this.mX == 0 && this.mY == 0 && this.mZ == 0;
   }
   function Set(p)
   {
      this.mX = p.mX;
      this.mY = p.mY;
      this.mZ = p.mZ;
      return this;
   }
   function SetXYZ(x, y, z)
   {
      this.mX = x;
      this.mY = y;
      this.mZ = z;
      return this;
   }
   function Clear()
   {
      this.mX = 0;
      this.mY = 0;
      this.mZ = 0;
      return this;
   }
   function ScaleN(tScale)
   {
      this.mX *= tScale;
      this.mY *= tScale;
      this.mZ *= tScale;
      return this;
   }
   function Scale(tScale)
   {
      this.mX *= tScale.mX;
      this.mY *= tScale.mY;
      this.mZ *= tScale.mZ;
      return this;
   }
   function Invert()
   {
      this.mX = - this.mX;
      this.mY = - this.mY;
      this.mZ = - this.mZ;
      return this;
   }
   function get mInverse()
   {
      return new Thing.Math.CThing_Position(- this.mX,- this.mY,- this.mZ);
   }
   function get mAbs()
   {
      return new Thing.Math.CThing_Position(Math.abs(this.mX),Math.abs(this.mY),Math.abs(this.mZ));
   }
   function get mLength_SQR()
   {
      return this.mX * this.mX + this.mY * this.mY + this.mZ * this.mZ;
   }
   function get mLength()
   {
      return Math.sqrt(this.mX * this.mX + this.mY * this.mY + this.mZ * this.mZ);
   }
   function get mLength2D_SQR()
   {
      return this.mX * this.mX + this.mY * this.mY;
   }
   function get mLength2D()
   {
      return Math.sqrt(this.mX * this.mX + this.mY * this.mY);
   }
   function toCVector3()
   {
      return new scidd.Math.CVector3(this.mX,this.mY,this.mZ);
   }
   function toPoint()
   {
      return new flash.geom.Point(this.mX,this.mY);
   }
   function toPointXY()
   {
      return new flash.geom.Point(this.mX,this.mY);
   }
   function toPointXZ()
   {
      return new flash.geom.Point(this.mX,this.mZ);
   }
   function toPointZY()
   {
      return new flash.geom.Point(this.mZ,this.mY);
   }
   function toAngleZ()
   {
      return Math.atan2(this.mY,this.mX);
   }
   function RoundBase(tBase)
   {
      this.mX = scidd.Math.CMath.Round(this.mX,tBase);
      this.mY = scidd.Math.CMath.Round(this.mY,tBase);
      this.mZ = scidd.Math.CMath.Round(this.mZ,tBase);
      return this;
   }
   function Distance(p)
   {
      var _loc4_ = this.mX - p.mX;
      var _loc3_ = this.mY - p.mY;
      var _loc2_ = this.mZ - p.mZ;
      return Math.sqrt(_loc4_ * _loc4_ + _loc3_ * _loc3_ + _loc2_ * _loc2_);
   }
   function Distance_SQR(p)
   {
      var _loc4_ = this.mX - p.mX;
      var _loc3_ = this.mY - p.mY;
      var _loc2_ = this.mZ - p.mZ;
      return _loc4_ * _loc4_ + _loc3_ * _loc3_ + _loc2_ * _loc2_;
   }
   function Distance2D(p)
   {
      var _loc3_ = this.mX - p.mX;
      var _loc2_ = this.mY - p.mY;
      return Math.sqrt(_loc3_ * _loc3_ + _loc2_ * _loc2_);
   }
   function Distance2D_SQR(p)
   {
      var _loc3_ = p.mX - this.mX;
      var _loc2_ = p.mY - this.mY;
      return _loc3_ * _loc3_ + _loc2_ * _loc2_;
   }
   function Normalize(tLength)
   {
      this.ScaleN(!(this.mX == 0 && this.mY == 0 && this.mZ == 0) ? tLength / Math.sqrt(this.mX * this.mX + this.mY * this.mY + this.mZ * this.mZ) : 1);
      return this;
   }
   function ScaleN2D(tScale)
   {
      this.mX *= tScale;
      this.mY *= tScale;
      return this;
   }
   function Normalize2D(tLength)
   {
      this.ScaleN2D(!(this.mX == 0 && this.mY == 0) ? tLength / Math.sqrt(this.mX * this.mX + this.mY * this.mY) : 1);
      return this;
   }
   function AngleToPosition(p)
   {
      var _loc2_;
      return (_loc2_ = Math.atan2(p.mY - this.mY,p.mX - this.mX)) >= 0 ? _loc2_ : _loc2_ + Thing.Math.CThing_Position.PI360;
   }
   function CAngleToPosition(p)
   {
      return new Thing.Math.CThing_Angle(this.AngleToPosition(p));
   }
   function DotProduct(tv)
   {
      return this.mX * tv.mX + this.mY * tv.mY + this.mZ * tv.mZ;
   }
   function CrossProduct(tv)
   {
      return new Thing.Math.CThing_Position(this.mY * tv.mZ - this.mZ * tv.mY,this.mZ * tv.mX - this.mX * tv.mZ,this.mX * tv.mY - this.mY * tv.mX);
   }
   function Precision(tPrecision)
   {
      var _loc2_ = tPrecision != 0 ? Math.pow(10,tPrecision) : 1;
      this.mX = Math.round(this.mX * _loc2_) / _loc2_;
      this.mY = Math.round(this.mY * _loc2_) / _loc2_;
      this.mZ = Math.round(this.mZ * _loc2_) / _loc2_;
      return this;
   }
   static function Average(tvlist)
   {
      var _loc3_ = tvlist[0].Clone();
      var _loc1_ = 1;
      while(_loc1_ < tvlist.length)
      {
         _loc3_.Add(tvlist[_loc1_]);
         _loc1_ = _loc1_ + 1;
      }
      return new Thing.Math.CThing_Position(_loc3_.mX / tvlist.length,_loc3_.mY / tvlist.length,_loc3_.mZ / tvlist.length);
   }
   function RotateZ(r)
   {
      var _loc3_ = Math.cos(r);
      var _loc2_ = Math.sin(r);
      var _loc4_ = this.mX * _loc3_ - this.mY * _loc2_;
      this.mY = this.mY * _loc3_ + this.mX * _loc2_;
      this.mX = _loc4_;
      return this;
   }
   function RotateY(r)
   {
      var _loc3_ = Math.cos(r);
      var _loc2_ = Math.sin(r);
      var _loc4_ = this.mX * _loc3_ - this.mZ * _loc2_;
      this.mZ = this.mZ * _loc3_ + this.mX * _loc2_;
      this.mX = _loc4_;
      return this;
   }
   static function PlaneNormal(tv1, tv2, tv3)
   {
      return tv3.Subtract(tv2).CrossProduct(tv1.Subtract(tv2)).Normalize(1);
   }
   function toString()
   {
      return this._CLASSID_ + ":{mX=" + this.mX + ", mY=" + this.mY + ", mZ=" + this.mZ + "}";
   }
}
