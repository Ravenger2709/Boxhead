class Thing.Math.CThing_Angle
{
   var mRadians;
   static var mLookup256;
   var _CLASSID_ = "CThing_Angle";
   var _BASECLASSID_ = "CThing_Angle";
   static var PI = 3.141592653589793;
   static var PI360 = Thing.Math.CThing_Angle.PI * 2;
   static var PI360x100 = Thing.Math.CThing_Angle.PI360 * 100;
   static var Deg2Rad = Thing.Math.CThing_Angle.PI / 180;
   static var Rad2Deg = 180 / Thing.Math.CThing_Angle.PI;
   static var RadsTo256 = 256 / Thing.Math.CThing_Angle.PI360;
   static var mDirection_E = 0;
   static var mDirection_SE = 1;
   static var mDirection_S = 2;
   static var mDirection_SW = 3;
   static var mDirection_W = 4;
   static var mDirection_NW = 5;
   static var mDirection_N = 6;
   static var mDirection_NE = 7;
   static var mDirection_Amount = 8;
   static var mDirection_Amountx100 = Thing.Math.CThing_Angle.mDirection_Amount * 100;
   static var mRadsToDirection = Thing.Math.CThing_Angle.PI * 2 / Thing.Math.CThing_Angle.mDirection_Amount;
   static var mDirection_Deltas = [new Thing.Math.CThing_Position(1,0,0),new Thing.Math.CThing_Position(1,1,0),new Thing.Math.CThing_Position(0,1,0),new Thing.Math.CThing_Position(-1,1,0),new Thing.Math.CThing_Position(-1,0,0),new Thing.Math.CThing_Position(-1,-1,0),new Thing.Math.CThing_Position(0,-1,0),new Thing.Math.CThing_Position(1,-1,0)];
   static var mDirection_Angles = [Thing.Math.CThing_Angle.PI * 0,Thing.Math.CThing_Angle.PI * 0.25,Thing.Math.CThing_Angle.PI * 0.5,Thing.Math.CThing_Angle.PI * 0.75,Thing.Math.CThing_Angle.PI * 1,Thing.Math.CThing_Angle.PI * 1.25,Thing.Math.CThing_Angle.PI * 1.5,Thing.Math.CThing_Angle.PI * 1.75];
   function CThing_Angle(a)
   {
      this.mRadians = Thing.Math.CThing_Angle.Correct(a);
   }
   function Clone(rads)
   {
      return new Thing.Math.CThing_Angle(this.mRadians);
   }
   function toString()
   {
      return this._CLASSID_ + ":{mRadians=" + this.mRadians + ", mDirection=" + this.mDirection + "}";
   }
   function get mAngle()
   {
      return this.mRadians;
   }
   function set mAngle(a)
   {
      this.mRadians = Thing.Math.CThing_Angle.Correct(a);
   }
   function get mRotation()
   {
      return this.mRadians * Thing.Math.CThing_Angle.Rad2Deg;
   }
   function set mRotation(a)
   {
      this.mRadians = a * Thing.Math.CThing_Angle.Deg2Rad;
   }
   function Add(a)
   {
      this.mRadians = Thing.Math.CThing_Angle.Correct(this.mRadians + a);
      return this;
   }
   function Sub(a)
   {
      this.mRadians = Thing.Math.CThing_Angle.Correct(this.mRadians - a);
      return this;
   }
   function Random()
   {
      this.mRadians = Math.random() * Thing.Math.CThing_Angle.PI360;
      return this;
   }
   function RandomDirection()
   {
      this.mDirection = random(4) * 2;
      return this;
   }
   function TurnAngle(targetAngle)
   {
      if(targetAngle.mRadians == this.mRadians)
      {
         return 0;
      }
      var _loc2_ = Math.abs(targetAngle.mRadians - this.mRadians) <= Thing.Math.CThing_Angle.PI ? 1 : -1;
      return targetAngle.mRadians <= this.mRadians ? - _loc2_ : _loc2_;
   }
   function TurnDirection(d2)
   {
      var _loc2_ = this.mDirection;
      if(_loc2_ == d2)
      {
         return 0;
      }
      var _loc3_ = Math.abs(d2 - _loc2_) <= 4 ? 1 : -1;
      return d2 <= _loc2_ ? - _loc3_ : _loc3_;
   }
   function AngleDifference(targetAngle)
   {
      var _loc2_ = targetAngle.mRadians - this.mRadians;
      return _loc2_ >= - Thing.Math.CThing_Angle.PI ? (_loc2_ <= Thing.Math.CThing_Angle.PI ? _loc2_ : _loc2_ - Thing.Math.CThing_Angle.PI360) : _loc2_ + Thing.Math.CThing_Angle.PI360;
   }
   static function Correct(a)
   {
      return (a + Thing.Math.CThing_Angle.PI360x100) % Thing.Math.CThing_Angle.PI360;
   }
   static function CorrectDirection(d)
   {
      return d & 7;
   }
   function get mDirection()
   {
      return Math.round(this.mRadians / Thing.Math.CThing_Angle.mRadsToDirection) & 7;
   }
   function set mDirection(d)
   {
      this.mRadians = Thing.Math.CThing_Angle.mDirection_Angles[d & 7];
   }
   function get mDirectionOpposite()
   {
      return Math.round(this.mRadians / Thing.Math.CThing_Angle.mRadsToDirection + Thing.Math.CThing_Angle.mDirection_Amount / 2) & 7;
   }
   function ToDirectionN(tNumberOfDirections)
   {
      return Math.round(this.mRadians / (Thing.Math.CThing_Angle.PI360 / tNumberOfDirections)) % tNumberOfDirections;
   }
   static function GetDirection(rads)
   {
      return Math.round(rads / Thing.Math.CThing_Angle.mRadsToDirection) & 7;
   }
   function get mDelta()
   {
      return new Thing.Math.CThing_Position(Math.cos(this.mRadians),Math.sin(this.mRadians),0);
   }
   function set mDelta(d)
   {
      this.mRadians = Thing.Math.CThing_Angle.Correct(Math.atan2(d.mY,d.mX));
   }
   function get mDirectionDelta()
   {
      return Thing.Math.CThing_Angle.mDirection_Deltas[this.mDirection];
   }
   function set mDirectionDelta(d)
   {
      this.mRadians = Thing.Math.CThing_Angle.Correct(Math.atan2(d.mY,d.mX));
   }
   function get mDirectionDeltaOpposite()
   {
      return Thing.Math.CThing_Angle.mDirection_Deltas[this.mDirectionOpposite];
   }
   function get mAngle256()
   {
      return this.mRadians * Thing.Math.CThing_Angle.RadsTo256 & 0xFF;
   }
   static function Create_LookupTables()
   {
      var _loc2_;
      var _loc1_;
      if(Thing.Math.CThing_Angle.mLookup256 == undefined)
      {
         Thing.Math.CThing_Angle.mLookup256 = new Array();
         _loc2_ = 32;
         while(_loc2_)
         {
            Thing.Math.CThing_Angle.mLookup256[_loc2_] = new Array();
            _loc1_ = 255;
            while(_loc1_ >= 0)
            {
               Thing.Math.CThing_Angle.mLookup256[_loc2_][_loc1_] = Math.round(_loc1_ / (256 / _loc2_)) % _loc2_;
               _loc1_ = _loc1_ - 1;
            }
            _loc2_ = _loc2_ - 1;
         }
      }
   }
}
