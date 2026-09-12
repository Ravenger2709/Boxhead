stop();
mLoadingText = "LOADED";
_Cover._alpha = 0;
var mTimeStamp = getTimer();
var mFrameRate = 30;
var mCounter = mFrameRate * 2;
onEnterFrame = function()
{
   while(getTimer() - mTimeStamp > 1000 / mFrameRate)
   {
      mCounter--;
      mTimeStamp += 1000 / mFrameRate;
      if(mCounter < 0)
      {
         _Cover._alpha += 2;
         if(_Cover._alpha >= 100)
         {
            delete onEnterFrame;
            play();
            return undefined;
         }
      }
   }
};
_XSIDATA._visible = false;
