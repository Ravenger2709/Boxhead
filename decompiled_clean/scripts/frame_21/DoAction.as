var f1 = this.getBytesLoaded() / this.getBytesTotal();
var f2 = (getTimer() - mLoadingTimeStamp) / 500;
if(f2 > 1)
{
   f2 = 1;
}
var f = f1 >= f2 ? f2 : f1;
_LoadingBar.gotoAndStop(int(f * 100) + 1);
if(f == 1)
{
   gotoAndStop("LOADED");
   play();
}
else
{
   gotoAndStop("LOADING");
   play();
}
