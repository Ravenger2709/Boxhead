class Screen.CScreen extends MovieClip
{
   var _Icon_Back;
   var mScreen_Transition;
   var nState;
   var pClass;
   var _CLASSID_ = "CScreen";
   var _BASECLASSID_ = "CScreen";
   static var bFlag_Delete = 1;
   function CScreen()
   {
      super();
      this._Icon_Back.pClass = this;
      this._Icon_Back.onPress = function()
      {
         CSound.mSamples.Click.PlaySound();
         this.pClass.GoBack();
      };
      this._visible = false;
      this.mScreen_Transition = new Screen.CScreen_Transition();
   }
   function GoBack()
   {
      this.nState = "State_Main";
   }
   function toString()
   {
      return this._CLASSID_;
   }
   function Dispose()
   {
      this.removeMovieClip();
   }
   function Open(mcBack)
   {
      this.mScreen_Transition.TransitionIn(this,mcBack);
   }
   function get mNormal()
   {
      return this.mScreen_Transition.mState == Screen.CScreen_Transition.mState_Normal;
   }
   function Process()
   {
      this.mScreen_Transition.Process();
   }
   function Draw()
   {
   }
}
