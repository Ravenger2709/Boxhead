_global.mProduct = new Object();
_global.mProduct.mName = "Boxhead: 2Play Rooms";
_global.mProduct.mVersionName = "Final";
_global.mProduct.mMajorVersion = 1;
_global.mProduct.mCompileDate = "16/05/2007 22:37";
_global.mProduct.mMinorVersion = "00110";
_global.mProduct.mVersionID = _global.mProduct.mVersionName + "." + _global.mProduct.mMajorVersion + "." + _global.mProduct.mMinorVersion;
_global.mProduct.mVersionString = _global.mProduct.mName + ": " + _global.mProduct.mVersionID + " (" + _global.mProduct.mCompileDate + ")";
System.security.allowDomain("www.boxhead.seantcooper.com");
var nContextMenu;
nContextMenu = new ContextMenu(function(obj, menuObj)
{
});
nContextMenu.hideBuiltInItems();
nContextMenu.customItems.push(new ContextMenuItem("© Sean Cooper 2007",function(obj, item)
{
   getURL("http://www.games.seantcooper.com", "_blank");
}));
_root.menu = nContextMenu;
_global.mURLWindow = "_blank";
_global.mCrazyMonkeyGames = true;
_global.mDebug = false;
_global.mAllowLocalHost = false;
_global.mInfinateLife = false;
_global.mRecordMode = false;
_global.mCheat_OneZombie = false;
_global.mCheatsActive = false;
tbVersion.text = _global.mProduct.mVersionString;
Stage.scaleMode = "noScale";
_global.mHostedOnCMG = false;
var startData = new Date(2007,3,23,12,0,0,0);
var timeLimit = 15552000000;
_HostedOnCMG = false;
var nDate = new Date();
if(nDate.getTime() - startData.getTime() > timeLimit)
{
   _global.mHostedOnCMG = true;
}
else
{
   var validURLs = ["http://www.crazymonkeygames.com","http://crazymonkeygames.com"];
   _global.mHostedOnCMG = false;
   for(var prop in validURLs)
   {
      _global.mHostedOnCMG = _url.substring(0,validURLs[prop].length).toUpperCase() != validURLs[prop].toUpperCase() ? _global.mHostedOnCMG : true;
   }
}
if(_global.mRecordMode)
{
   _global.mHostedOnCMG = true;
}
gotoAndStop("START_LOAD");
play();
