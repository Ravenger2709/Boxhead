class World.Map.CMap
{
   var mAffect;
   var mCells;
   var mCollide;
   var mDecal;
   var mInvalidCell;
   var mMapwho;
   var mMath;
   var mNavigation;
   var mSize;
   var mWorld;
   var mWorldSize;
   static var mcDebug;
   var _CLASSID_ = "CMap";
   var _BASECLASSID_ = "CMap";
   static var mCheckSessionID = 1;
   var mFirstTime = true;
   function CMap(tWorld)
   {
      this.mWorld = tWorld;
      this.mWorldSize = this.mWorld.mArea.size;
      this.mSize = new flash.geom.Point(Math.round(this.mWorldSize.x / World.Map.CMap_Cell.mSize.x),Math.round(this.mWorldSize.y / World.Map.CMap_Cell.mSize.y));
      this.InitCells();
      this.mMath = new World.Map.CMap_Math(this);
      this.mNavigation = new World.Map.CMap_Navigation(this);
      this.mCollide = new World.Map.CMap_Collide(this);
      this.mAffect = new World.Map.CMap_Affect(this);
      this.mMapwho = new World.Map.CMap_Mapwho(this);
      this.mDecal = new World.Map.CMap_Decal(this);
   }
   function toString()
   {
      return this._CLASSID_;
   }
   function Dispose()
   {
   }
   function InitCells()
   {
      this.mCells = new Array();
      var _loc3_ = 0;
      var _loc4_;
      var _loc2_;
      while(_loc3_ < this.mSize.y)
      {
         this.mCells[_loc3_] = new Array();
         _loc4_ = 0;
         _loc2_ = this.mCells[_loc3_];
         while(_loc4_ < this.mSize.x)
         {
            _loc2_[_loc4_] = new World.Map.CMap_Cell(_loc4_,_loc3_);
            _loc4_ = _loc4_ + 1;
         }
         _loc3_ = _loc3_ + 1;
      }
      var _loc7_ = World.Map.CMap_Cell.mCollide_EdgeOfMap | World.Map.CMap_Cell.mCollide_Solid;
      _loc4_ = 0;
      var _loc6_ = this.mCells[0];
      var _loc5_ = this.mCells[this.mSize.y - 1];
      while(_loc4_ < this.mSize.x)
      {
         _loc6_[_loc4_].mCollide = _loc5_[_loc4_].mCollide = _loc7_;
         _loc4_ = _loc4_ + 1;
      }
      _loc3_ = 0;
      while(_loc3_ < this.mSize.y)
      {
         this.mCells[_loc3_][0].mCollide = this.mCells[_loc3_][this.mSize.x - 1].mCollide = _loc7_;
         _loc3_ = _loc3_ + 1;
      }
      this.SetAdjacentCells();
   }
   function SetAdjacentCells()
   {
      this.mInvalidCell = new World.Map.CMap_Cell(-1,-1);
      this.mInvalidCell.mCollide = World.Map.CMap_Cell.mCollide_Solid;
      var _loc6_ = 0;
      var _loc3_;
      var _loc7_;
      var _loc2_;
      var _loc5_;
      var _loc4_;
      while(_loc6_ < this.mSize.y)
      {
         _loc3_ = 0;
         _loc7_ = this.mCells[_loc6_];
         while(_loc3_ < this.mSize.x)
         {
            _loc2_ = 0;
            _loc5_ = new Array();
            while(_loc2_ < Thing.Math.CThing_Angle.mDirection_Amount)
            {
               _loc4_ = this.mCells[_loc6_ + Thing.Math.CThing_Angle.mDirection_Deltas[_loc2_].mY][_loc3_ + Thing.Math.CThing_Angle.mDirection_Deltas[_loc2_].mX];
               _loc5_[_loc2_] = _loc4_ != undefined ? _loc4_ : this.mInvalidCell;
               _loc2_ = _loc2_ + 1;
            }
            _loc7_[_loc3_].SetAdjacents(_loc5_);
            _loc3_ = _loc3_ + 1;
         }
         _loc6_ = _loc6_ + 1;
      }
   }
   function Draw(tArea)
   {
      var _loc19_ = Math.floor(tArea.left / World.Map.CMap_Cell.mSize.x - 0.5);
      var _loc17_ = Math.floor(tArea.top / World.Map.CMap_Cell.mSize.y - 0.5);
      var _loc18_ = Math.ceil(tArea.right / World.Map.CMap_Cell.mSize.x + 0.5);
      var _loc16_ = Math.ceil(tArea.bottom / World.Map.CMap_Cell.mSize.y + 0.5) + 1;
      var _loc22_ = _loc18_ - _loc19_;
      var _loc13_ = World.Map.CMap_Cell.mSize.y;
      var _loc14_ = Thing.CThing.mFlag_SortFloor;
      var _loc5_ = new Array();
      var _loc12_ = _loc17_;
      var _loc7_;
      var _loc10_;
      var _loc9_;
      var _loc6_;
      var _loc2_;
      var _loc4_;
      var _loc3_;
      while(_loc12_ < _loc16_)
      {
         _loc7_ = _loc19_;
         _loc10_ = this.mCells[_loc12_];
         while(_loc7_ < _loc18_)
         {
            _loc9_ = _loc10_[_loc7_];
            if(_loc9_.mChildCount)
            {
               _loc6_ = _loc9_.mObjects;
               for(var _loc15_ in _loc6_)
               {
                  _loc2_ = _loc6_[_loc15_];
                  _loc4_ = _loc2_.mP.mY;
                  _loc3_ = (!(_loc2_.mFlags & _loc14_) ? _loc4_ : _loc4_ & 0xFFFFFF) * _loc13_ & 0xFFFFFF;
                  !_loc5_[_loc3_] ? (_loc5_[_loc3_] = [_loc2_]) : _loc5_[_loc3_].push(_loc2_);
               }
            }
            _loc7_ = _loc7_ + 1;
         }
         _loc12_ = _loc12_ + 1;
      }
      _loc17_ *= _loc13_;
      _loc16_ *= _loc13_;
      var _loc11_;
      _loc12_ = _loc17_;
      var _loc8_;
      while(_loc12_ <= _loc16_)
      {
         if(_loc11_ = _loc5_[_loc12_])
         {
            for(var _loc20_ in _loc11_)
            {
               _loc8_ = _loc11_[_loc20_];
               _loc8_.Draw();
               _loc8_.mFlags |= Thing.CThing.mFlag_Drawn;
            }
         }
         _loc12_ = _loc12_ + 1;
      }
   }
   function GetCell(x, y)
   {
      return this.mCells[y & 0xFFFFFF][x & 0xFFFFFF];
   }
   function GetCellBounds(oRect)
   {
      var _loc2_ = new flash.geom.Rectangle();
      _loc2_.left = Math.max(0,Math.round(oRect.left) - 1);
      _loc2_.top = Math.max(0,Math.round(oRect.top) - 1);
      _loc2_.right = Math.min(this.mSize.x - 1,Math.round(oRect.right));
      _loc2_.bottom = Math.min(this.mSize.y - 1,Math.round(oRect.bottom));
      return _loc2_;
   }
   function GetCellBounds_Min(oRect)
   {
      var _loc2_ = new flash.geom.Rectangle();
      _loc2_.left = Math.max(0,Math.floor(oRect.left));
      _loc2_.top = Math.max(0,Math.floor(oRect.top));
      _loc2_.right = Math.min(this.mSize.x - 1,Math.floor(oRect.right));
      _loc2_.bottom = Math.min(this.mSize.y - 1,Math.floor(oRect.bottom));
      return _loc2_;
   }
   function GetCellList_Area(tArea, tMinArea)
   {
      var _loc6_ = new Array();
      if(isNaN(tArea.x))
      {
         return _loc6_;
      }
      var _loc3_ = tMinArea != true ? this.GetCellBounds(tArea) : this.GetCellBounds_Min(tArea);
      var _loc5_ = _loc3_.top;
      var _loc2_;
      var _loc4_;
      while(_loc5_ <= _loc3_.bottom)
      {
         _loc2_ = _loc3_.left;
         _loc4_ = this.mCells[_loc5_];
         while(_loc2_ <= _loc3_.right)
         {
            _loc6_.push(_loc4_[_loc2_]);
            _loc2_ = _loc2_ + 1;
         }
         _loc5_ = _loc5_ + 1;
      }
      return _loc6_;
   }
   function GetCellList_Area_FilterSessionID(tArea, tMinArea, tSessionID)
   {
      var _loc8_ = new Array();
      if(isNaN(tArea.x))
      {
         return _loc8_;
      }
      var _loc4_ = tMinArea != true ? this.GetCellBounds(tArea) : this.GetCellBounds_Min(tArea);
      var _loc6_ = _loc4_.top;
      var _loc3_;
      var _loc5_;
      var _loc2_;
      while(_loc6_ <= _loc4_.bottom)
      {
         _loc3_ = _loc4_.left;
         _loc5_ = this.mCells[_loc6_];
         while(_loc3_ <= _loc4_.right)
         {
            _loc2_ = _loc5_[_loc3_];
            if(_loc2_.mSessionIDCheck != tSessionID)
            {
               _loc2_.mSessionIDCheck = tSessionID;
               _loc8_.push(_loc2_);
            }
            _loc3_ = _loc3_ + 1;
         }
         _loc6_ = _loc6_ + 1;
      }
      return _loc8_;
   }
}
