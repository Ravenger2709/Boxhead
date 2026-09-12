class World.CHud
{
   var bmDraw;
   var mMessages;
   var mPlayer1_Deaths;
   var mPlayer2_Deaths;
   var mPlayers;
   var mScores;
   var mTotalScore;
   var mWorld;
   var mcPlayerFrags;
   var mcPlayers;
   var mcScreenPause;
   var nTotalScore;
   var pClass;
   static var mBackQuality;
   static var mcMessage;
   static var mcScore;
   static var mcScoreTotal;
   var _CLASSID_ = "CHud";
   var _BASECLASSID_ = "CHud";
   var mSilentMessages = false;
   static var dPoint = new flash.geom.Point();
   static var dMatrix = new flash.geom.Matrix();
   static var dColorTransform = new flash.geom.ColorTransform(1,1,1,1,0,0,0,0);
   static var rm = new flash.geom.Matrix();
   function CHud(tWorld)
   {
      this.mWorld = tWorld;
      this.mScores = new Array();
      this.mMessages = new Array();
      this.mTotalScore = this.nTotalScore = 0;
      this.mPlayers = new Object();
      if(World.CHud.mcMessage == undefined)
      {
         World.CHud.mcMessage = _root.attachMovie("Hud.Message","_HUD_02",_root.getNextHighestDepth(),{_visible:false});
         World.CHud.mcScore = _root.attachMovie("Hud.Score","_HUD_03",_root.getNextHighestDepth(),{_visible:false});
      }
      if(World.CWorld.mGameMode != "DeathMatch")
      {
         World.CHud.mcScoreTotal = this.mWorld.attachMovie("Hud.ScoreTotal","_HUD_04",this.mWorld.getNextHighestDepth(),{_visible:false});
      }
      else
      {
         this.mcPlayerFrags = this.mWorld.attachMovie("Hud_PlayerFrags","_HUD_05",this.mWorld.getNextHighestDepth(),{_visible:false});
      }
      this.mcPlayers = new Array();
      this.mPlayer1_Deaths = this.mPlayer2_Deaths = 0;
      this.mcPlayerFrags.mcSwitchSides.onRelease = function()
      {
         CMain.mSaveData.mViewSide_DeathMatch = (CMain.mSaveData.mViewSide_DeathMatch + 1) % 2;
      };
   }
   function toString()
   {
      return this._CLASSID_;
   }
   function Dispose()
   {
   }
   function Pause(tState)
   {
      var _loc4_;
      var _loc10_;
      var _loc2_;
      var _loc6_;
      var _loc7_;
      var _loc5_;
      var _loc3_;
      if(tState)
      {
         this.mcScreenPause = this.mWorld.attachMovie("HUD.Paused","_PauseScreen",this.mWorld.getNextHighestDepth());
         _loc4_ = this.mWorld.mUpgrades.mMultiplierList;
         _loc10_ = Math.ceil(_loc4_.length / 3);
         _loc2_ = 0;
         _loc6_ = 0;
         _loc7_ = 1;
         while(_loc2_ < _loc4_.length)
         {
            _loc5_ = this.mcScreenPause["_Upgrade_C" + _loc7_];
            _loc3_ = _loc5_.duplicateMovieClip("upgrade_" + _loc2_,this.mcScreenPause.getNextHighestDepth(),{_x:_loc5_._x,_y:_loc5_._y + _loc6_ * 17});
            _loc3_.txtUpgrade.text = _loc4_[_loc2_].mName;
            _loc3_.txtMultiple.text = _loc4_[_loc2_].mIndex;
            _loc3_.txtUpgrade.textColor = _loc4_[_loc2_].mName.substr(0,3) != "New" ? 16777215 : 65280;
            _loc3_._alpha = _loc4_[_loc2_].mActive != true ? 25 : 100;
            if((_loc6_ = _loc6_ + 1) > _loc10_)
            {
               _loc7_ = _loc7_ + 1;
               _loc6_ = 0;
            }
            _loc2_ = _loc2_ + 1;
         }
         this.mcScreenPause._Upgrade_C1._visible = false;
         this.mcScreenPause._Upgrade_C2._visible = false;
         this.mcScreenPause._Upgrade_C3._visible = false;
         this.mcScreenPause.cacheAsBitmap = true;
         this.mcScreenPause._Quit.pClass = this.mWorld;
         this.mcScreenPause._Quit.onRelease = function()
         {
            this.pClass.mCompleteState = "quit";
         };
      }
      else
      {
         this.mcScreenPause.removeMovieClip();
         delete this.mcScreenPause;
      }
   }
   function Process()
   {
   }
   function Draw(t_bmDraw)
   {
      this.bmDraw = t_bmDraw;
      if(_global.mRecordMode)
      {
         this.mcPlayers[0]._visible = false;
         this.mcPlayers[1]._visible = false;
         return undefined;
      }
      var _loc3_;
      for(var _loc7_ in this.mScores)
      {
         _loc3_ = this.mScores[_loc7_];
         _loc3_.mPosition = _loc3_.mPosition.add(_loc3_.mDelta);
         _loc3_.mDelta.x *= 1.05;
         _loc3_.mDelta.y *= 1.05;
         this.DrawBMObject(_loc3_.bmObject,_loc3_.mPosition,_loc3_.mPosition.y < 140 ? _loc3_.mPosition.y - 40 : 100);
         if(_loc3_.mPosition.y <= 0)
         {
            this.mScores.splice(Number(_loc7_),1);
         }
      }
      var _loc4_;
      var _loc5_;
      var _loc6_;
      for(_loc7_ in this.mMessages)
      {
         _loc4_ = this.mMessages[_loc7_];
         _loc5_ = getTimer() - _loc4_.mTimeStamp;
         if(_loc5_ >= 3000)
         {
            this.mMessages.splice(Number(_loc7_),1);
            return undefined;
         }
         if(_loc4_.mMoveCount > 0)
         {
            _loc6_ = _loc4_.mMoveCount * 0.25;
            _loc4_.mPosition.y -= _loc6_;
            _loc4_.mMoveCount -= _loc6_;
         }
         this.DrawBMObject(_loc4_.bmObject,_loc4_.mPosition,_loc5_ < 2500 ? 100 : 100 - (_loc5_ - 2500) / 5);
      }
      World.CHud.mcScoreTotal._visible = true;
      this.mTotalScore = this.nTotalScore;
      World.CHud.mcScoreTotal.tfScore.text = this.PadScore(String(this.mTotalScore));
      World.CHud.mcScoreTotal.mcTimer.gotoAndStop(1 + Math.floor(this.mWorld.mUpgrades.mMultiplierTickRatio * World.CHud.mcScoreTotal.mcTimer._totalframes));
      World.CHud.mcScoreTotal.tfMultiple.text = "x" + this.mWorld.mUpgrades.mMultiplier;
      World.CHud.mcScoreTotal._x = this.mWorld.mScreenSize.x / 2;
      World.CHud.mcScoreTotal._y = 0;
      this.mcPlayerFrags._visible = true;
      this.mcPlayerFrags._x = 0;
      this.mcPlayerFrags._y = 0;
      if(CMain.mSaveData.mViewSide_DeathMatch == 0)
      {
         this.mcPlayerFrags.mcPlayer1.tfPlayerName.text = "Player 1";
         this.mcPlayerFrags.mcPlayer2.tfPlayerName.text = "Player 2";
         this.mcPlayerFrags.mcPlayer1.tfFrags.text = this.PadFrags(String(this.mPlayer1_Deaths));
         this.mcPlayerFrags.mcPlayer2.tfFrags.text = this.PadFrags(String(this.mPlayer2_Deaths));
         this.mcPlayerFrags.mcPlayer1.tfFrags.text = this.PadFrags(String(this.mPlayer1_Deaths));
      }
      else
      {
         this.mcPlayerFrags.mcPlayer1.tfPlayerName.text = "Player 2";
         this.mcPlayerFrags.mcPlayer2.tfPlayerName.text = "Player 1";
         this.mcPlayerFrags.mcPlayer2.tfFrags.text = this.PadFrags(String(this.mPlayer1_Deaths));
         this.mcPlayerFrags.mcPlayer1.tfFrags.text = this.PadFrags(String(this.mPlayer2_Deaths));
      }
   }
   function PadScore(s)
   {
      while(s.length < 12)
      {
         s = "0" + s;
      }
      return s;
   }
   function PadFrags(s)
   {
      while(s.length < 2)
      {
         s = "0" + s;
      }
      return s;
   }
   function get mScore()
   {
      return World.CHud.mcScoreTotal.tfScore.text;
   }
   function AddPlayer(tPlayer)
   {
      var _loc2_ = tPlayer.mPlayerIndex;
      this.mcPlayers[_loc2_] = this.mWorld.attachMovie("Hud.Player","_HUD_PLAYER" + _loc2_,this.mWorld.getNextHighestDepth(),{_visible:false});
      var _loc3_ = this.mcPlayers[_loc2_];
      var _loc4_ = _loc3_.mcAmmo.tfAmount.getTextFormat();
      _loc4_.letterSpacing = -2;
      _loc3_.mcAmmo.tfAmount.setTextFormat(_loc4_);
   }
   function DeletePlayer(tPlayer)
   {
      var _loc2_ = tPlayer.mPlayerIndex;
      this.mcPlayers[_loc2_].removeMovieClip();
   }
   function UpdatePlayer(tPlayer, pDraw, tScalar)
   {
      var _loc2_ = this.mcPlayers[tPlayer.mPlayerIndex];
      var _loc4_ = tPlayer.mWeapon_Current.mAmmo;
      var _loc6_ = tPlayer.mWeapon_Current.mShortName;
      var _loc5_ = tPlayer.mLife / tPlayer.mMaxLife;
      _loc2_.mcAmmo.gotoAndStop(1);
      _loc2_.mcAmmo.tfAmount.text = _loc6_ + (_loc4_ != Thing.Weapon.CThing_Weapon.mInfinateAmmo ? ":" + _loc4_ : "");
      var _loc7_ = Math.min(Math.max(1,_loc2_.mcLife._totalframes * _loc5_ + 1),_loc2_.mcLife._totalframes);
      _loc2_.mcLife.gotoAndStop(Math.floor(_loc7_));
      _loc2_._visible = tPlayer.mVisible && !(tPlayer.mFlags & Thing.CThing.mFlag_DEAD);
      _loc2_._x = pDraw.x;
      _loc2_._y = pDraw.y;
   }
   function AddMessage_Info(tText)
   {
      this.AddMessage(tText,16777215);
   }
   function AddMessage_Level(tText)
   {
      this.AddMessage(tText,16777215);
   }
   function AddMessage_Upgrade(tText)
   {
      this.AddMessage(tText,65280);
   }
   function AddMessage_Critical(tText)
   {
      this.AddMessage(tText,16711680);
   }
   function AddMessage(tText, tColor)
   {
      if(this.mSilentMessages)
      {
         return undefined;
      }
      World.CHud.mcMessage.tfMessage.text = tText;
      World.CHud.mcMessage.tfMessage.textColor = tColor;
      var _loc3_ = new flash.geom.Point(this.mWorld.mScreenSize.x / 2,this.mWorld.mScreenSize.y);
      for(var _loc2_ in this.mMessages)
      {
         this.mMessages[_loc2_].mMoveCount += 19;
      }
      this.mMessages.push({mPosition:_loc3_,mMoveCount:100,mTimeStamp:getTimer(),bmObject:World.CHud.RenderMovieClipAsBitmapObject(World.CHud.mcMessage)});
   }
   function AddScore(p, tScore)
   {
      this.nTotalScore += tScore;
      World.CHud.mcScore.tfAmount.text = "+" + tScore;
      var _loc3_ = new flash.geom.Point(World.CHud.mcScoreTotal._x - p.x,World.CHud.mcScoreTotal._y - p.y);
      _loc3_.normalize(5);
      if(_root._quality != "LOW")
      {
         this.mScores.push({mPosition:p,mDelta:_loc3_,bmObject:World.CHud.RenderMovieClipAsBitmapObject(World.CHud.mcScore)});
      }
   }
   function DrawBMObject(bmObject, p, tAlpha)
   {
      var _loc3_ = bmObject.mDisp;
      var _loc5_;
      if(tAlpha >= 100 || _root._quality == "LOW")
      {
         _loc5_ = bmObject.sBMD;
         World.CHud.dPoint.x = p.x + _loc3_.x;
         World.CHud.dPoint.y = p.y + _loc3_.y;
         this.bmDraw.copyPixels(_loc5_,_loc5_.rectangle,World.CHud.dPoint,undefined,undefined,true);
      }
      else
      {
         World.CHud.dMatrix.tx = p.x + _loc3_.x;
         World.CHud.dMatrix.ty = p.y + _loc3_.y;
         World.CHud.dColorTransform.alphaMultiplier = tAlpha / 100;
         this.bmDraw.draw(bmObject.sBMD,World.CHud.dMatrix,World.CHud.dColorTransform);
      }
      return true;
   }
   static function RenderMovieClipAsBitmapObject(mc, bmObject)
   {
      World.CHud.StartRender();
      var _loc1_;
      var _loc5_;
      var _loc6_;
      var _loc3_;
      if(bmObject == undefined)
      {
         _loc1_ = mc.getBounds(mc);
         _loc5_ = new flash.geom.Rectangle(Math.floor(_loc1_.xMin),Math.floor(_loc1_.yMin),Math.ceil(_loc1_.xMax) - Math.floor(_loc1_.xMin),Math.ceil(_loc1_.yMax) - Math.floor(_loc1_.yMin));
         _loc6_ = new flash.display.BitmapData(Math.ceil(_loc5_.width),Math.ceil(_loc5_.height),true,16711680);
         _loc3_ = new flash.geom.Point(_loc5_.x,_loc5_.y);
         World.CHud.rm.tx = - _loc3_.x;
         World.CHud.rm.ty = - _loc3_.y;
         _loc6_.draw(mc,World.CHud.rm,undefined,"normal",undefined,false);
         World.CHud.EndRender();
         return {sBMD:_loc6_,mDisp:_loc3_,mBounds:_loc5_};
      }
      bmObject.sBMD.fillRect(bmObject.sBMD.rectangle,0);
      _loc5_ = bmObject.mBounds;
      World.CHud.rm.tx = - _loc5_.x;
      World.CHud.rm.ty = - _loc5_.y;
      bmObject.sBMD.draw(mc,World.CHud.rm,undefined,"normal",undefined,false);
      World.CHud.EndRender();
      return bmObject;
   }
   static function StartRender(tScale)
   {
      World.CHud.mBackQuality = World.CHud.mBackQuality != undefined ? World.CHud.mBackQuality : _root._quality;
      _root._quality = "BEST";
   }
   static function EndRender()
   {
      _root._quality = World.CHud.mBackQuality;
      delete World.CHud.mBackQuality;
   }
}
