class DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation extends DrawPrimitive.XSI.CDrawPrimitive_XSI
{
   var mAnimEnd;
   var mAnimationObject;
   var mCollection;
   var mCurrentDirection;
   var mCurrentFrame;
   var mCurrentFrameID;
   var mFrameCount;
   var mPreUpdate;
   var mXSI_Info;
   var parentClass;
   var removeMovieClip;
   var _CLASSID_ = "CDrawPrimitive_XSI_Animation";
   static var mReturnFlag_EndOfAnimation = 1;
   static var mReturnFlag_NewFrame = 2;
   function CDrawPrimitive_XSI_Animation()
   {
      super();
   }
   static function CreateAnimationObject(tXSI_Collection)
   {
      var _loc1_ = new DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation();
      _loc1_.mCollection = tXSI_Collection;
      return _loc1_;
   }
   function SetAnimation(animID, tFrameID)
   {
      if(this.mAnimationObject != this.mCollection.mItems[animID].mAnimationObject)
      {
         this.mAnimationObject = this.mCollection.mItems[animID].mAnimationObject;
         this.mFrameCount = this.mAnimationObject.mFrameCount;
         this.mCurrentFrameID = tFrameID != undefined ? tFrameID : 0;
         this.Animate(0);
      }
   }
   function SetAnimation_FORCED(animID, tFrameID)
   {
      this.mAnimationObject = this.mCollection.mItems[animID].mAnimationObject;
      this.mFrameCount = this.mAnimationObject.mFrameCount;
      this.mCurrentFrameID = tFrameID != undefined ? tFrameID : 0;
      this.Animate(0);
   }
   function Animate(tSpeed)
   {
      if(this.mAnimationObject == undefined)
      {
         return false;
      }
      var _loc3_ = this.mCurrentFrameID;
      var _loc2_ = this.mCurrentFrameID + tSpeed;
      this.mCurrentFrameID = _loc2_ % this.mFrameCount;
      this.mAnimEnd = _loc2_ >= this.mFrameCount && _loc2_ > _loc3_;
      return this.mAnimEnd;
   }
   function QAnimate(tSpeed)
   {
      this.mCurrentFrameID = (this.mCurrentFrameID + tSpeed) % this.mFrameCount;
   }
   function Animate_RetObj(tSpeed)
   {
      if(this.mAnimationObject == undefined)
      {
         return false;
      }
      var _loc4_ = this.mCurrentFrameID;
      var _loc2_ = this.mCurrentFrameID + tSpeed;
      this.mCurrentFrameID = _loc2_ % this.mFrameCount;
      var _loc3_ = {mAnimEnd:_loc2_ >= this.mFrameCount && _loc2_ > _loc4_};
      _loc3_.mNewFrame = (_loc4_ & 0xFFFFFF) != (_loc2_ & 0xFFFFFF);
      _loc3_.mFrameIndex = this.mCurrentFrameID & 0xFFFFFF;
      return _loc3_;
   }
   function Update_CurrentFrame(tAngle)
   {
      this.mCurrentDirection = this.mAnimationObject.mDirections[this.mAnimationObject.mLookup256[tAngle.mAngle256]];
      this.mCurrentFrame = this.mCurrentDirection.mFrames[this.mCurrentFrameID & 0xFFFFFF];
      this.mPreUpdate = true;
   }
   function Render(pos, tAngle, tAlpha)
   {
      if(this.mPreUpdate == true)
      {
         this.mPreUpdate = false;
      }
      else
      {
         this.mCurrentDirection = this.mAnimationObject.mDirections[this.mAnimationObject.mLookup256[tAngle.mAngle256 & 0xFF]];
         this.mCurrentFrame = this.mCurrentDirection.mFrames[this.mCurrentFrameID & 0xFFFFFF];
      }
      this._Render(this.mCurrentFrame,pos,tAlpha);
      return true;
   }
   function _Render(oBMD, pos, tAlpha)
   {
      var _loc1_ = oBMD.mDisp;
      var _loc2_ = oBMD.sBMD;
      if(tAlpha >= 100)
      {
         DrawPrimitive.CDrawPrimitive.dPoint.x = pos.x + _loc1_.x;
         DrawPrimitive.CDrawPrimitive.dPoint.y = pos.y + _loc1_.y;
         DrawPrimitive.XSI.CDrawPrimitive_XSI.bmDraw.copyPixels(_loc2_,_loc2_.rectangle,DrawPrimitive.CDrawPrimitive.dPoint,undefined,undefined,true);
      }
      else
      {
         DrawPrimitive.CDrawPrimitive.mDrawMatrix.identity();
         DrawPrimitive.CDrawPrimitive.mDrawMatrix.tx = pos.x + _loc1_.x;
         DrawPrimitive.CDrawPrimitive.mDrawMatrix.ty = pos.y + _loc1_.y;
         DrawPrimitive.CDrawPrimitive.mDrawColorTransform.alphaMultiplier = tAlpha / 100;
         DrawPrimitive.XSI.CDrawPrimitive_XSI.bmDraw.draw(_loc2_,DrawPrimitive.CDrawPrimitive.mDrawMatrix,DrawPrimitive.CDrawPrimitive.mDrawColorTransform);
      }
   }
   function get XSI_Info()
   {
      return this.mCurrentFrame.XSI_Info;
   }
   static function Load(linkID, tRetrieveID)
   {
      var _loc1_ = new DrawPrimitive.XSI.CDrawPrimitive_XSI_Animation(tRetrieveID);
      _loc1_.mID = tRetrieveID;
      if(DrawPrimitive.XSI.CDrawPrimitive_XSI_DI.LoadAnimation(_loc1_,linkID,tRetrieveID))
      {
      }
      return _loc1_;
   }
   function _Load(linkID)
   {
      var pMC = _root;
      var d = pMC.getNextHighestDepth();
      var mc = pMC.attachMovie(linkID,linkID + d,d,{_visible:false});
      mc.stop();
      if(mc == undefined)
      {
         return undefined;
      }
      mc.parentClass = this;
      mc.onEnterFrame = function()
      {
         this.parentClass.Propagate_XSI_Info(this.XSI_Info);
         this.removeMovieClip();
      };
      this.Init_AnimationObject(mc._totalframes);
      var i = 0;
      while(i < this.mAnimationObject.mDirections.length)
      {
         mc.gotoAndStop(i + 1);
         var mcAnim = eval("mc.XSI_Rotation" + i);
         this.mAnimationObject.mDirections[i] = {mFrames:new Array(mcAnim._totalframes)};
         var oDirection = this.mAnimationObject.mDirections[i];
         this.mAnimationObject.mFrameCount = oDirection.mFrames.length;
         var f = 0;
         while(f < oDirection.mFrames.length)
         {
            oDirection.mFrames[f] = this.RenderToBitmap(mcAnim,f + 1);
            f++;
         }
         i++;
      }
   }
   function Init_AnimationObject(nDirections)
   {
      if(!Thing.Math.CThing_Angle.mLookup256)
      {
         Thing.Math.CThing_Angle.Create_LookupTables();
      }
      this.mXSI_Info = new Object();
      this.mAnimationObject = {XSI_Info:this.mXSI_Info};
      this.mAnimationObject.mDirections = new Array(nDirections);
      this.mAnimationObject.mDirectionAmount = nDirections;
      this.mAnimationObject.mLookup256 = Thing.Math.CThing_Angle.mLookup256[nDirections];
      this.mAnimationObject.divDir = 1 / (DrawPrimitive.CDrawPrimitive.PI360 / nDirections);
      this.mAnimationObject.roundDir = DrawPrimitive.CDrawPrimitive.PI360 / nDirections / 2;
      return this.mAnimationObject;
   }
   function Propagate_XSI_Info(XSI_Info)
   {
      this.mAnimationObject.XSI_Info.Tilt = XSI_Info.Tilt * 3.141592653589793 / 180;
      this.mAnimationObject.XSI_Info.Light = XSI_Info.Light;
      this.mAnimationObject.XSI_Info.PFactor = - Math.sin(this.mAnimationObject.XSI_Info.Tilt);
      var _loc5_ = 0;
      var _loc4_;
      var _loc3_;
      var _loc2_;
      while(_loc5_ < this.mAnimationObject.mDirections.length)
      {
         _loc4_ = this.mAnimationObject.mDirections[_loc5_];
         _loc3_ = 0;
         while(_loc3_ < _loc4_.mFrames.length)
         {
            _loc4_.mFrames[_loc3_].XSI_Info = XSI_Info.Positions[_loc5_][_loc3_];
            _loc4_.mFrames[_loc3_].XSI_Info.Tilt = this.mAnimationObject.XSI_Info.Tilt;
            _loc4_.mFrames[_loc3_].XSI_Info.PFactor = this.mAnimationObject.XSI_Info.PFactor;
            for(var _loc6_ in _loc4_.mFrames[_loc3_].XSI_Info)
            {
               _loc2_ = _loc4_.mFrames[_loc3_].XSI_Info[_loc6_];
               _loc2_.vPosition = new Thing.Math.CThing_Position(_loc2_.vPosition.mX,_loc2_.vPosition.mY,_loc2_.vPosition.mZ).ScaleN(DrawPrimitive.XSI.CDrawPrimitive_XSI.mGlobalScale);
               _loc2_.nPosition = new Thing.Math.CThing_Position(_loc2_.vPosition.mX,this.mAnimationObject.XSI_Info.PFactor * _loc2_.vPosition.mY,- _loc2_.vPosition.mZ).ScaleN(1 / World.Map.CMap_Cell.mCellSize);
            }
            _loc3_ = _loc3_ + 1;
         }
         _loc5_ = _loc5_ + 1;
      }
      Thing.Math.CThing_Position.mPFactor = this.mAnimationObject.XSI_Info.PFactor;
   }
   function RenderToBitmap(mc, frameIndex, tBlendMode)
   {
      var _loc2_ = DrawPrimitive.XSI.CDrawPrimitive_XSI.mGlobalScale;
      if(frameIndex != undefined && frameIndex != 1)
      {
         mc.gotoAndStop(frameIndex);
      }
      var _loc3_ = mc.getBounds(mc);
      var _loc1_ = new flash.geom.Rectangle(Math.floor(_loc3_.xMin),Math.floor(_loc3_.yMin),Math.ceil(_loc3_.xMax) - Math.floor(_loc3_.xMin),Math.ceil(_loc3_.yMax) - Math.floor(_loc3_.yMin));
      _loc1_.width *= _loc2_;
      _loc1_.height *= _loc2_;
      _loc1_.inflate(2,2);
      var _loc4_ = new flash.display.BitmapData(Math.ceil(_loc1_.width),Math.ceil(_loc1_.height),true,16711680);
      var _loc6_ = new flash.geom.Point(Math.floor(_loc1_.x * _loc2_),Math.floor(_loc1_.y * _loc2_));
      var _loc5_ = new flash.geom.Matrix();
      _loc5_.scale(_loc2_,_loc2_);
      _loc5_.translate(- _loc6_.x,- _loc6_.y);
      _loc4_.draw(mc,_loc5_);
      _loc4_.applyFilter(_loc4_,_loc4_.rectangle,new flash.geom.Point(0,0),new flash.filters.GlowFilter(0,1,4,4,2,1));
      var _loc9_ = {sBMD:_loc4_,mDisp:_loc6_,XSI_Info:undefined};
      return _loc9_;
   }
}
