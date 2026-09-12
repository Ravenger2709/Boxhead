function §\x01\x02§()
{
   return 24;
}
var §\x01§ = 576 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 600)
   {
      set("\x01",eval("\x01") - 501);
      §§push(true);
   }
   else if(eval("\x01") == 280)
   {
      set("\x01",eval("\x01") + 547);
   }
   else if(eval("\x01") == 502)
   {
      set("\x01",eval("\x01") + 176);
      §§push("\x0f");
   }
   else if(eval("\x01") == 344)
   {
      set("\x01",eval("\x01") - 64);
      if(§§pop())
      {
         set("\x01",eval("\x01") + 547);
      }
   }
   else if(eval("\x01") == 99)
   {
      set("\x01",eval("\x01") + 670);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 34);
      }
   }
   else if(eval("\x01") == 326)
   {
      set("\x01",eval("\x01") + 594);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 337);
      }
   }
   else
   {
      if(eval("\x01") == 827)
      {
         set("\x01",eval("\x01") - 7);
         if(!eval("r{invalid_utf8=192}V{invalid_utf8=252}{invalid_utf8=160}")["\x14Xê\t"])
         {
            eval("r{invalid_utf8=192}V{invalid_utf8=252}{invalid_utf8=160}")["\x14Xê\t"] = new §{invalid_utf8=180}s{invalid_utf8=188}EA§();
         }
         §§pop();
         if(!eval("r{invalid_utf8=192}V{invalid_utf8=252}{invalid_utf8=160}")["\x14Xê\t"]["O\x1dsJ-"])
         {
            eval("r{invalid_utf8=192}V{invalid_utf8=252}{invalid_utf8=160}")["\x14Xê\t"]["O\x1dsJ-"] = new §{invalid_utf8=180}s{invalid_utf8=188}EA§();
         }
         §§pop();
         if(!eval("r{invalid_utf8=192}V{invalid_utf8=252}{invalid_utf8=160}")["\x14Xê\t"]["O\x1dsJ-"].hw)
         {
            _loc2_ = eval("\x14Xê\t")["O\x1dsJ-"].hw = function(tMap)
            {
               this[§§constant(5)] = tMap;
            }[§§constant(6)];
            _loc2_[§§constant(7)] = function()
            {
               return this[§§constant(8)];
            };
            _loc2_[§§constant(9)] = function()
            {
            };
            _loc2_[§§constant(10)] = function(tArea, tAffect)
            {
               var _loc5_ = this[§§constant(5)][§§constant(11)](tArea);
               var _loc3_;
               var _loc2_;
               for(var _loc7_ in _loc5_)
               {
                  if(_loc5_[_loc7_][§§constant(12)])
                  {
                     _loc3_ = _loc5_[_loc7_][§§constant(13)];
                     for(var _loc6_ in _loc3_)
                     {
                        _loc2_ = _loc3_[_loc6_];
                        if(_loc2_[§§constant(14)] & tAffect[§§constant(15)] && tAffect[§§constant(16)][§§constant(17)] != _loc2_[§§constant(17)])
                        {
                           _loc2_[§§constant(18)](tAffect);
                        }
                     }
                  }
               }
            };
            _loc2_[§§constant(19)] = function(cThing, p1, p2, radius, tAffect)
            {
               var _loc9_ = p2[§§constant(20)](p1);
               var _loc7_ = _loc9_[§§constant(21)]() / eval("\x14Xê\t")["O\x1dsJ-"].hw[§§constant(22)];
               var _loc4_ = new eval(§§constant(25))[§§constant(26)][§§constant(27)](p1[§§constant(24)] - radius,p1[§§constant(23)] - radius,radius * 2,radius * 2);
               var _loc11_ = _loc9_[§§constant(24)] / _loc7_;
               var _loc10_ = _loc9_[§§constant(23)] / _loc7_;
               var _loc6_ = new eval(§§constant(29))[§§constant(30)][§§constant(31)](p1[§§constant(28)](),p2[§§constant(28)]());
               _loc6_[§§constant(32)] = new §{invalid_utf8=180}s{invalid_utf8=188}EA§();
               _loc6_[§§constant(32)][§§constant(33)] = _loc9_[§§constant(23)] / _loc9_[§§constant(24)];
               _loc6_[§§constant(32)][§§constant(34)] = _loc9_[§§constant(24)] / _loc9_[§§constant(23)];
               _loc6_[§§constant(32)][§§constant(35)] = eval(§§constant(29))[§§constant(30)][§§constant(36)][§§constant(37)](_loc9_[§§constant(24)]);
               _loc6_[§§constant(32)][§§constant(38)] = eval(§§constant(29))[§§constant(30)][§§constant(36)][§§constant(37)](_loc9_[§§constant(23)]);
               _loc6_[§§constant(32)][§§constant(17)] = cThing[§§constant(17)];
               _loc6_[§§constant(32)][§§constant(39)] = tAffect[§§constant(15)];
               var _loc3_ = new §\§\§constant(40)§();
               var _loc8_;
               eval("\x14Xê\t")["O\x1dsJ-"][§§constant(41)][§§constant(42)]++;
               var _loc12_;
               while(_loc7_ > 0)
               {
                  if(_loc8_ = this[§§constant(43)](_loc4_,_loc6_))
                  {
                     _loc3_ = _loc3_[§§constant(44)](_loc8_);
                  }
                  _loc7_ -= eval("\x14Xê\t")["O\x1dsJ-"].hw[§§constant(22)];
                  _loc4_[§§constant(45)] += _loc11_;
                  _loc4_[§§constant(46)] += _loc10_;
               }
               _loc4_[§§constant(45)] = p2[§§constant(24)];
               _loc4_[§§constant(46)] = p2[§§constant(23)];
               if(_loc8_ = this[§§constant(43)](_loc4_,_loc6_))
               {
                  _loc3_ = _loc3_[§§constant(44)](_loc8_);
               }
               var _loc2_;
               for(var _loc13_ in _loc3_)
               {
                  _loc2_ = _loc3_[_loc13_];
                  if(_loc2_[§§constant(14)] & tAffect[§§constant(15)] && tAffect[§§constant(16)][§§constant(17)] != _loc2_[§§constant(17)])
                  {
                     _loc2_[§§constant(18)](tAffect);
                  }
               }
               return _loc3_[§§constant(47)];
            };
            _loc2_[§§constant(43)] = function(rArea, cLine)
            {
               var _loc3_ = this[§§constant(5)][§§constant(48)](rArea,false,eval("\x14Xê\t")["O\x1dsJ-"][§§constant(41)][§§constant(42)]);
               var _loc2_ = new §\§\§constant(40)§();
               var _loc4_;
               for(var _loc6_ in _loc3_)
               {
                  if(_loc4_ = _loc3_[_loc6_][§§constant(49)](cLine))
                  {
                     _loc2_ = _loc2_[§§constant(44)](_loc4_);
                  }
               }
               return _loc2_;
            };
            _loc2_[§§constant(8)] = "hw";
            _loc2_[§§constant(50)] = "hw";
            eval("\x14Xê\t")["O\x1dsJ-"].hw = function(tMap)
            {
               this[§§constant(5)] = tMap;
            }[§§constant(22)] = 1;
            §§push(§§constant(51)(eval("\x14Xê\t")["O\x1dsJ-"].hw[§§constant(6)],null,1));
         }
         §§pop();
         break;
      }
      if(eval("\x01") == 735)
      {
         set("\x01",eval("\x01") - 245);
      }
      else if(eval("\x01") == 617)
      {
         set("\x01",eval("\x01") - 127);
      }
      else
      {
         if(eval("\x01") == 769)
         {
            set("\x01",eval("\x01") - 34);
            if((§§pop()[§§pop()] = §§pop()) == -1)
            {
               (eval("\x14Xê\t")["O\x1dsJ-"].hw = function(tMap)
               {
                  this[§§constant(5)] = tMap;
               })[§§constant(41)](§§constant(91));
               return undefined;
            }
            (eval("\x14Xê\t")["O\x1dsJ-"].hw = function(tMap)
            {
               this[§§constant(5)] = tMap;
            })[§§constant(93)](§§constant(92),_loc2_,eval("\x14Xê\t")["O\x1dsJ-"].hw = function(tMap)
            {
               this[§§constant(5)] = tMap;
            }[§§constant(80)]);
            return undefined;
         }
         if(eval("\x01") == 490)
         {
            set("\x01",eval("\x01") - 164);
            §§push(true);
         }
         else
         {
            if(eval("\x01") == 920)
            {
               set("\x01",eval("\x01") - 337);
               break;
            }
            if(eval("\x01") == 714)
            {
               set("\x01",eval("\x01") - 370);
               §§push(!§§pop());
            }
            else if(eval("\x01") == 583)
            {
               set("\x01",eval("\x01") - 66);
            }
            else if(eval("\x01") == 658)
            {
               set("\x01",eval("\x01") - 141);
            }
            else if(eval("\x01") == 517)
            {
               set("\x01",eval("\x01") + 425);
               §§push("\x0f");
               §§push(1);
            }
            else if(eval("\x01") == 942)
            {
               set("\x01",eval("\x01") - 440);
               var §§pop() = §§pop();
            }
            else
            {
               if(eval("\x01") != 678)
               {
                  if(eval("\x01") == 820)
                  {
                     set("\x01",eval("\x01") - 820);
                  }
                  break;
               }
               set("\x01",eval("\x01") + 36);
               §§push(eval(§§pop()));
            }
         }
      }
   }
}
