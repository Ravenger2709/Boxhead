function §\x01\x02§()
{
   return 2288;
}
var §\x01§ = -1695 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 593)
   {
      set("\x01",eval("\x01") + 182);
      §§push(true);
   }
   else if(eval("\x01") == 441)
   {
      set("\x01",eval("\x01") + 302);
      §§push(!§§pop());
   }
   else if(eval("\x01") == 114)
   {
      set("\x01",eval("\x01") + 654);
      var §§pop() = §§pop();
   }
   else if(eval("\x01") == 675)
   {
      set("\x01",eval("\x01") - 325);
   }
   else if(eval("\x01") == 489)
   {
      set("\x01",eval("\x01") + 406);
   }
   else if(eval("\x01") == 102)
   {
      set("\x01",eval("\x01") + 248);
   }
   else
   {
      if(eval("\x01") == 212)
      {
         set("\x01",eval("\x01") - 110);
         var §§pop() >>> §§pop();
         §§push(§§pop() >>> (§§pop() > §§pop()));
         break;
      }
      if(eval("\x01") == 775)
      {
         set("\x01",eval("\x01") - 563);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 110);
         }
      }
      else if(eval("\x01") == 350)
      {
         set("\x01",eval("\x01") - 236);
         §§push("\x0f");
         §§push(1);
      }
      else if(eval("\x01") == 768)
      {
         set("\x01",eval("\x01") + 52);
         §§push("\x0f");
      }
      else if(eval("\x01") == 820)
      {
         set("\x01",eval("\x01") - 379);
         §§push(eval(§§pop()));
      }
      else
      {
         if(eval("\x01") != 743)
         {
            if(eval("\x01") == 895)
            {
               set("\x01",eval("\x01") - 889);
               if(!_global.Screen)
               {
                  _global.Screen = new Object();
               }
               §§pop();
               if(!_global.Screen.CScreen_Debrief_Winner)
               {
                  Screen.CScreen_Debrief_Winner extends Screen.CScreen;
                  _loc2_ = Screen.CScreen_Debrief_Winner = function()
                  {
                     super();
                     this.tbWinner.text = "PLAYER " + (Screen.CScreen_Debrief_Winner.mWinnerIndex + 1) + " WINS";
                     this.mcWinners.gotoAndStop(CMain.mSaveData["mPlayer" + (Screen.CScreen_Debrief_Winner.mWinnerIndex + 1) + "_CharacterIndex"] + 1);
                     CSound.mSamples.World_End_wav.PlaySound();
                     this.mStatus.text = this.mEndText[random(this.mEndText.length)];
                     this._Retry.pClass = this;
                     this._Retry.onPress = function()
                     {
                        this.pClass.nState = "State_LoadWorld";
                        CSound.mSamples.Click.PlaySound();
                     };
                     this._Exit.pClass = this;
                     this._Exit.onPress = function()
                     {
                        this.pClass.nState = "State_SelectWorld";
                        CSound.mSamples.Click.PlaySound();
                     };
                     this._ViewHighscores.pClass = this;
                     this._ViewHighscores.onRelease = function()
                     {
                        if(_global.mCrazyMonkeyGames)
                        {
                           this.getURL("http://scores.crazymonkeygames.com/hs/listscores.php?id=" + External.CHighscore_Submit.mGameID,"_BLANK");
                           External.CTracker.Click_ViewHighscore();
                        }
                     };
                     if(!(CMain.mSaveData.mDevilsActive == 1 && CMain.mSaveData.mCollisionsActive == 1 && CMain.mSaveData.mDamageActive == 1))
                     {
                        this.DisableSubmitScore();
                     }
                     this.DisableSubmitScore();
                  }.prototype;
                  _loc2_.toString = function()
                  {
                     return this._CLASSID_;
                  };
                  _loc2_.Dispose = function()
                  {
                     super.Dispose();
                  };
                  _loc2_.SubmitHighscore = function()
                  {
                     this.mcSubmitHighScore = this.attachMovie("Screen.SubmitHighScore","_SubmitHighscore",this.getNextHighestDepth(),{playerName:this.mUsername.text,playerScore:this.mScore.text});
                  };
                  _loc2_.Process = function()
                  {
                     super.Process();
                     if(this.mcSubmitHighScore != undefined)
                     {
                        this.mcSubmitHighScore.Process();
                        if(External.CHighscore_Submit.mContinue)
                        {
                           this.mcSubmitHighScore.Dispose();
                           delete this.mcSubmitHighScore;
                           this.DisableSubmitScore();
                        }
                     }
                  };
                  _loc2_.DisableSubmitScore = function()
                  {
                     this.mUsername.selectable = false;
                     this.mUsername._alpha = 50;
                     this._SendScore.enabled = false;
                     this._SendScore._alpha = 50;
                     this._Boundary._alpha = 50;
                     this.txtEnterYourName._alpha = 50;
                  };
                  _loc2_.Draw = function()
                  {
                     super.Draw();
                  };
                  _loc2_._CLASSID_ = "CScreen_Debrief_Winner";
                  _loc2_.mFirstTime = true;
                  _loc2_.mEndText = ["YOU WERE EATEN!","DEATH!","WIMPISH!","YOUR HEAD WAS RIPPED OFF!","GAME OVER!","LOSER!","BLED TO DEATH","DRAINED OF BLOOD"];
                  §§push(ASSetPropFlags(Screen.CScreen_Debrief_Winner.prototype,null,1));
               }
               §§pop();
               break;
            }
            if(eval("\x01") == 6)
            {
               set("\x01",eval("\x01") - 6);
            }
            break;
         }
         set("\x01",eval("\x01") - 254);
         if(§§pop())
         {
            set("\x01",eval("\x01") + 406);
         }
      }
   }
}
