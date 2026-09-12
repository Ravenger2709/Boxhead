class System.CContextMenu
{
   var _CLASSID_ = "CContextMenu";
   function CContextMenu()
   {
   }
   static function Loading()
   {
      var _loc2_;
      var _loc4_ = function(obj, item)
      {
         External.CTracker.Click_SeanTCooper();
         getURL("http://www.games.seantcooper.com", "_blank");
      };
      var _loc3_ = function(obj, menuObj)
      {
      };
      _loc2_ = new ContextMenu(_loc3_);
      _loc2_.hideBuiltInItems();
      _loc2_.customItems.push(new ContextMenuItem("© Sean Cooper 2007",_loc4_));
      _root.menu = _loc2_;
      return _loc2_;
   }
   static function InGame()
   {
      var _loc2_ = System.CContextMenu.Loading();
      var _loc7_ = function(obj, item)
      {
         CSaveData._this.mSoundActive = !CSaveData._this.mSoundActive;
         var _loc1_ = !CSaveData._this.mSoundActive ? "OFF" : "ON";
         item.caption = "Sound: " + _loc1_;
      };
      var _loc4_ = function(obj, item)
      {
         CSaveData._this.mMusicActive = !CSaveData._this.mMusicActive;
         var _loc1_ = !CSaveData._this.mMusicActive ? "OFF" : "ON";
         item.caption = "Music: " + _loc1_;
      };
      var _loc6_ = function(obj, item)
      {
         CSaveData._this.mDetail = !CSaveData._this.mDetail;
         var _loc1_ = !CSaveData._this.mDetail ? "LOW" : "BEST";
         item.caption = "Quality: " + _loc1_;
      };
      var _loc10_ = !CSaveData._this.mSoundActive ? "OFF" : "ON";
      var _loc8_ = !CSaveData._this.mMusicActive ? "OFF" : "ON";
      var _loc9_ = !CSaveData._this.mDetail ? "LOW" : "BEST";
      var _loc3_ = new ContextMenuItem("Sound: " + _loc10_,_loc7_);
      _loc3_.separatorBefore = true;
      _loc2_.customItems.push(_loc3_);
      _loc2_.customItems.push(new ContextMenuItem("Music: " + _loc8_,_loc4_));
      _loc2_.customItems.push(new ContextMenuItem("Quality: " + _loc9_,_loc6_));
      _root.menu = _loc2_;
      return _loc2_;
   }
}
