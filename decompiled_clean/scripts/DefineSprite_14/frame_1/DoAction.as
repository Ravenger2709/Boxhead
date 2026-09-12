function PlayIt()
{
   delete mTimeSlice;
   onEnterFrame = function()
   {
      if(tFrameIndex == GetFrameIndex(_totalframes,30))
      {
         gotoAndStop(tFrameIndex);
      }
      if(tFrameIndex == _totalframes)
      {
         play();
         delete onEnterFrame;
      }
   };
}
function GetFrameIndex(tTotalFrames, tFrameRate)
{
   mTimeSlice = mTimeSlice != undefined ? mTimeSlice : getTimer();
   var _loc1_ = int((getTimer() - mTimeSlice) / (1000 / tFrameRate)) + 1;
   if(_loc1_ > tTotalFrames)
   {
      _loc1_ = tTotalFrames;
   }
   return _loc1_;
}
stop();
