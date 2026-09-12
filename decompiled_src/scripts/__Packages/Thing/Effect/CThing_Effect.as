function §\x01\x02§()
{
   return 1111;
}
var §\x01§ = -742 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 369)
   {
      set("\x01",eval("\x01") + 222);
      §§push(true);
   }
   else if(eval("\x01") == 815)
   {
      set("\x01",eval("\x01") - 614);
      var §§pop() = §§pop();
   }
   else if(eval("\x01") == 980)
   {
      set("\x01",eval("\x01") - 803);
      if(§§pop())
      {
         set("\x01",eval("\x01") - 68);
      }
   }
   else
   {
      if(eval("\x01") == 219)
      {
         set("\x01",eval("\x01") + 289);
         §§push(§§pop() >> §§pop());
         break;
      }
      if(eval("\x01") == 287)
      {
         set("\x01",eval("\x01") + 528);
         §§push("\x0f");
         §§push(1);
      }
      else if(eval("\x01") == 516)
      {
         set("\x01",eval("\x01") + 368);
         if(§§pop())
         {
            set("\x01",eval("\x01") - 98);
         }
      }
      else if(eval("\x01") == 591)
      {
         set("\x01",eval("\x01") - 372);
         if(§§pop())
         {
            set("\x01",eval("\x01") + 289);
         }
      }
      else if(eval("\x01") == 508)
      {
         set("\x01",eval("\x01") + 414);
      }
      else if(eval("\x01") == 806)
      {
         set("\x01",eval("\x01") - 519);
      }
      else if(eval("\x01") == 109)
      {
         set("\x01",eval("\x01") + 178);
      }
      else if(eval("\x01") == 201)
      {
         set("\x01",eval("\x01") + 465);
         §§push("\x0f");
      }
      else if(eval("\x01") == 666)
      {
         set("\x01",eval("\x01") + 264);
         §§push(eval(§§pop()));
      }
      else if(eval("\x01") == 930)
      {
         set("\x01",eval("\x01") - 414);
         §§push(!§§pop());
      }
      else if(eval("\x01") == 922)
      {
         set("\x01",eval("\x01") + 58);
         §§push(true);
      }
      else if(eval("\x01") == 884)
      {
         set("\x01",eval("\x01") - 98);
      }
      else
      {
         if(eval("\x01") == 786)
         {
            set("\x01",eval("\x01") - 628);
            if(!_global.Thing)
            {
               _global.Thing = new Object();
            }
            §§pop();
            if(!_global.Thing.Effect)
            {
               _global.Thing.Effect = new Object();
            }
            §§pop();
            if(!_global.Thing.Effect.CThing_Effect)
            {
               Thing.Effect.CThing_Effect extends Thing.CThing;
               _loc2_ = Thing.Effect.CThing_Effect = function(tPosition, tAngle, tParent)
               {
                  super(tPosition,tAngle,tParent);
                  this.Process = this.Process_Normal;
               }.prototype;
               _loc2_.toString = function()
               {
                  return this._CLASSID_;
               };
               _loc2_.Dispose = function()
               {
                  super.Dispose();
               };
               _loc2_.Process_Normal = function()
               {
               };
               _loc2_._CLASSID_ = "CThing_Effect";
               _loc2_._BASECLASSID_ = "CThing_Effect";
               §§push(ASSetPropFlags(Thing.Effect.CThing_Effect.prototype,null,1));
            }
            §§pop();
            break;
         }
         if(eval("\x01") == 158)
         {
            set("\x01",eval("\x01") - 158);
            break;
         }
         if(eval("\x01") == 177)
         {
            set("\x01",eval("\x01") - 68);
            if(!§§pop()[§§pop()][§§constant(3)])
            {
               eval("{invalid_utf8=206}{invalid_utf8=231}")["k{invalid_utf8=133}Y"][§§constant(3)] = new §{invalid_utf8=176}{invalid_utf8=204}\x04{invalid_utf8=245}§();
            }
            §§pop();
            if(!eval("{invalid_utf8=206}{invalid_utf8=231}")["k{invalid_utf8=133}Y"][§§constant(3)][§§constant(4)])
            {
               eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(4)] extends eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(5)];
               _loc2_ = eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(4)] = function()
               {
                  super();
               }[§§constant(6)];
               eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(4)] = function()
               {
                  super();
               }[§§constant(7)] = function(tXSI_Collection)
               {
                  var _loc1_ = new eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(4)]();
                  _loc1_[§§constant(8)] = tXSI_Collection;
                  return _loc1_;
               };
               _loc2_[§§constant(9)] = function(animID, tFrameID)
               {
                  if(this[§§constant(10)] != this[§§constant(8)][§§constant(11)][animID][§§constant(10)])
                  {
                     this[§§constant(10)] = this[§§constant(8)][§§constant(11)][animID][§§constant(10)];
                     this[§§constant(12)] = this[§§constant(10)][§§constant(12)];
                     this[§§constant(13)] = tFrameID != undefined ? tFrameID : 0;
                     this[§§constant(14)](0);
                  }
               };
               _loc2_[§§constant(15)] = function(animID, tFrameID)
               {
                  this[§§constant(10)] = this[§§constant(8)][§§constant(11)][animID][§§constant(10)];
                  this[§§constant(12)] = this[§§constant(10)][§§constant(12)];
                  this[§§constant(13)] = tFrameID != undefined ? tFrameID : 0;
                  this[§§constant(14)](0);
               };
               _loc2_[§§constant(14)] = function(tSpeed)
               {
                  if(this[§§constant(10)] == undefined)
                  {
                     return false;
                  }
                  var _loc3_ = this[§§constant(13)];
                  var _loc2_ = this[§§constant(13)] + tSpeed;
                  this[§§constant(13)] = _loc2_ % this[§§constant(12)];
                  this[§§constant(16)] = _loc2_ >= this[§§constant(12)] && _loc2_ > _loc3_;
                  return this[§§constant(16)];
               };
               _loc2_[§§constant(17)] = function(tSpeed)
               {
                  this[§§constant(13)] = (this[§§constant(13)] + tSpeed) % this[§§constant(12)];
               };
               _loc2_[§§constant(18)] = function(tSpeed)
               {
                  if(this[§§constant(10)] == undefined)
                  {
                     return false;
                  }
                  var _loc4_ = this[§§constant(13)];
                  var _loc2_ = this[§§constant(13)] + tSpeed;
                  this[§§constant(13)] = _loc2_ % this[§§constant(12)];
                  var _loc3_ = {(§§constant(16)):_loc2_ >= this[§§constant(12)] && _loc2_ > _loc4_};
                  _loc3_[§§constant(19)] = (_loc4_ & 0xFFFFFF) != (_loc2_ & 0xFFFFFF);
                  _loc3_[§§constant(20)] = this[§§constant(13)] & 0xFFFFFF;
                  return _loc3_;
               };
               _loc2_[§§constant(21)] = function(tAngle)
               {
                  this[§§constant(22)] = this[§§constant(10)][§§constant(23)][this[§§constant(10)][§§constant(24)][tAngle[§§constant(25)]()]];
                  this[§§constant(26)] = this[§§constant(22)][§§constant(27)][this[§§constant(13)] & 0xFFFFFF];
                  this[§§constant(28)] = true;
               };
               _loc2_[§§constant(29)] = function(pos, tAngle, tAlpha)
               {
                  if(this[§§constant(28)] == true)
                  {
                     this[§§constant(28)] = false;
                  }
                  else
                  {
                     this[§§constant(22)] = this[§§constant(10)][§§constant(23)][this[§§constant(10)][§§constant(24)][tAngle[§§constant(25)]() & 0xFF]];
                     this[§§constant(26)] = this[§§constant(22)][§§constant(27)][this[§§constant(13)] & 0xFFFFFF];
                  }
                  this[§§constant(30)](this[§§constant(26)],pos,tAlpha);
                  return true;
               };
               _loc2_[§§constant(30)] = function(oBMD, pos, tAlpha)
               {
                  var _loc1_ = oBMD[§§constant(31)];
                  var _loc2_ = oBMD[§§constant(32)];
                  if(tAlpha >= 100)
                  {
                     eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(34)][§§constant(35)] = pos[§§constant(35)] + _loc1_[§§constant(35)];
                     eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(34)][§§constant(36)] = pos[§§constant(36)] + _loc1_[§§constant(36)];
                     eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(5)][§§constant(38)][§§constant(39)](_loc2_,_loc2_[§§constant(37)],eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(34)],undefined,undefined,true);
                  }
                  else
                  {
                     eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(40)][§§constant(41)]();
                     eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(40)][§§constant(42)] = pos[§§constant(35)] + _loc1_[§§constant(35)];
                     eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(40)][§§constant(43)] = pos[§§constant(36)] + _loc1_[§§constant(36)];
                     eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(44)][§§constant(45)] = tAlpha / 100;
                     eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(5)][§§constant(38)][§§constant(46)](_loc2_,eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(40)],eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(44)]);
                  }
               };
               _loc2_[§§constant(47)] = function()
               {
                  return this[§§constant(26)][§§constant(48)];
               };
               eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(4)] = function()
               {
                  super();
               }[§§constant(49)] = function(linkID, tRetrieveID)
               {
                  var _loc1_ = new eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(4)](tRetrieveID);
                  _loc1_[§§constant(50)] = tRetrieveID;
                  if(eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(51)][§§constant(52)](_loc1_,linkID,tRetrieveID))
                  {
                  }
                  return _loc1_;
               };
               _loc2_[§§constant(53)] = function(linkID)
               {
                  var §§constant(54) = eval(§§constant(55));
                  var §§constant(56) = eval(§§constant(54))[§§constant(57)]();
                  var §§constant(58) = eval(§§constant(54))[§§constant(61)](eval(§§constant(60)),eval(§§constant(60)) + eval(§§constant(56)),eval(§§constant(56)),{(§§constant(59)):false});
                  eval(§§constant(58))[§§constant(62)]();
                  if(eval(§§constant(58)) == undefined)
                  {
                     return undefined;
                  }
                  eval(§§constant(58))[§§constant(63)] = eval(§§constant(64));
                  eval(§§constant(58))[§§constant(65)] = function()
                  {
                     this[§§constant(63)][§§constant(66)](this[§§constant(48)]);
                     this[§§constant(67)]();
                  };
                  eval(§§constant(64))[§§constant(69)](eval(§§constant(58))[§§constant(68)]);
                  var §§constant(70) = 0;
                  while(eval(§§constant(70)) < eval(§§constant(64))[§§constant(10)][§§constant(23)][§§constant(71)])
                  {
                     eval(§§constant(58))[§§constant(72)](eval(§§constant(70)) + 1);
                     var §§constant(73) = eval(§§constant(74) + eval(§§constant(70)));
                     eval(§§constant(64))[§§constant(10)][§§constant(23)][eval(§§constant(70))] = {(§§constant(27)):new §\§\§constant(75)§(eval(§§constant(73))[§§constant(68)])};
                     var §§constant(76) = eval(§§constant(64))[§§constant(10)][§§constant(23)][eval(§§constant(70))];
                     eval(§§constant(64))[§§constant(10)][§§constant(12)] = eval(§§constant(76))[§§constant(27)][§§constant(71)];
                     var §§constant(77) = 0;
                     while(eval(§§constant(77)) < eval(§§constant(76))[§§constant(27)][§§constant(71)])
                     {
                        eval(§§constant(76))[§§constant(27)][eval(§§constant(77))] = eval(§§constant(64))[§§constant(78)](eval(§§constant(73)),eval(§§constant(77)) + 1);
                        set(§§constant(77),eval(§§constant(77)) + 1);
                     }
                     set(§§constant(70),eval(§§constant(70)) + 1);
                  }
               };
               _loc2_[§§constant(69)] = function(nDirections)
               {
                  if(!eval(§§constant(79))[§§constant(80)][§§constant(81)][§§constant(24)])
                  {
                     eval(§§constant(79))[§§constant(80)][§§constant(81)][§§constant(82)]();
                  }
                  this[§§constant(83)] = new §{invalid_utf8=176}{invalid_utf8=204}\x04{invalid_utf8=245}§();
                  this[§§constant(10)] = {(§§constant(48)):this[§§constant(83)]};
                  this[§§constant(10)][§§constant(23)] = new §\§\§constant(75)§(nDirections);
                  this[§§constant(10)][§§constant(84)] = nDirections;
                  this[§§constant(10)][§§constant(24)] = eval(§§constant(79))[§§constant(80)][§§constant(81)][§§constant(24)][nDirections];
                  this[§§constant(10)][§§constant(85)] = 1 / (eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(86)] / nDirections);
                  this[§§constant(10)][§§constant(87)] = eval("k{invalid_utf8=133}Y")[§§constant(33)][§§constant(86)] / nDirections / 2;
                  return this[§§constant(10)];
               };
               _loc2_[§§constant(66)] = function(XSI_Info)
               {
                  this[§§constant(10)][§§constant(48)][§§constant(88)] = XSI_Info[§§constant(88)] * 3.141592653589793 / 180;
                  this[§§constant(10)][§§constant(48)][§§constant(89)] = XSI_Info[§§constant(89)];
                  this[§§constant(10)][§§constant(48)][§§constant(90)] = - eval(§§constant(80))[§§constant(91)](this[§§constant(10)][§§constant(48)][§§constant(88)]);
                  var _loc5_ = 0;
                  var _loc4_;
                  var _loc3_;
                  var _loc2_;
                  while(_loc5_ < this[§§constant(10)][§§constant(23)][§§constant(71)])
                  {
                     _loc4_ = this[§§constant(10)][§§constant(23)][_loc5_];
                     _loc3_ = 0;
                     while(_loc3_ < _loc4_[§§constant(27)][§§constant(71)])
                     {
                        _loc4_[§§constant(27)][_loc3_][§§constant(48)] = XSI_Info[§§constant(92)][_loc5_][_loc3_];
                        _loc4_[§§constant(27)][_loc3_][§§constant(48)][§§constant(88)] = this[§§constant(10)][§§constant(48)][§§constant(88)];
                        _loc4_[§§constant(27)][_loc3_][§§constant(48)][§§constant(90)] = this[§§constant(10)][§§constant(48)][§§constant(90)];
                        for(var _loc6_ in _loc4_[§§constant(27)][_loc3_][§§constant(48)])
                        {
                           _loc2_ = _loc4_[§§constant(27)][_loc3_][§§constant(48)][_loc6_];
                           _loc2_[§§constant(93)] = new eval(§§constant(79))[§§constant(80)][§§constant(98)](_loc2_[§§constant(93)][§§constant(97)],_loc2_[§§constant(93)][§§constant(96)],_loc2_[§§constant(93)][§§constant(95)])[§§constant(99)](eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(5)][§§constant(94)]);
                           _loc2_[§§constant(100)] = new eval(§§constant(79))[§§constant(80)][§§constant(98)](_loc2_[§§constant(93)][§§constant(97)],this[§§constant(10)][§§constant(48)][§§constant(90)] * _loc2_[§§constant(93)][§§constant(96)],- _loc2_[§§constant(93)][§§constant(95)])[§§constant(99)](1 / eval(§§constant(101))[§§constant(102)][§§constant(103)][§§constant(104)]);
                        }
                        _loc3_ = _loc3_ + 1;
                     }
                     _loc5_ = _loc5_ + 1;
                  }
                  eval(§§constant(79))[§§constant(80)][§§constant(98)][§§constant(105)] = this[§§constant(10)][§§constant(48)][§§constant(90)];
               };
               _loc2_[§§constant(78)] = function(mc, frameIndex, tBlendMode)
               {
                  var _loc2_ = eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(5)][§§constant(94)];
                  if(frameIndex != undefined && frameIndex != 1)
                  {
                     mc[§§constant(72)](frameIndex);
                  }
                  var _loc3_ = mc[§§constant(106)](mc);
                  var _loc1_ = new eval(§§constant(113))[§§constant(114)][§§constant(115)](eval(§§constant(80))[§§constant(110)](_loc3_[§§constant(112)]),eval(§§constant(80))[§§constant(110)](_loc3_[§§constant(109)]),eval(§§constant(80))[§§constant(108)](_loc3_[§§constant(111)]) - eval(§§constant(80))[§§constant(110)](_loc3_[§§constant(112)]),eval(§§constant(80))[§§constant(108)](_loc3_[§§constant(107)]) - eval(§§constant(80))[§§constant(110)](_loc3_[§§constant(109)]));
                  _loc1_[§§constant(116)] *= _loc2_;
                  _loc1_[§§constant(117)] *= _loc2_;
                  _loc1_[§§constant(118)](2,2);
                  var _loc4_ = new eval(§§constant(113))[§§constant(119)][§§constant(120)](eval(§§constant(80))[§§constant(108)](_loc1_[§§constant(116)]),eval(§§constant(80))[§§constant(108)](_loc1_[§§constant(117)]),true,16711680);
                  var _loc6_ = new eval(§§constant(113))[§§constant(114)][§§constant(121)](eval(§§constant(80))[§§constant(110)](_loc1_[§§constant(35)] * _loc2_),eval(§§constant(80))[§§constant(110)](_loc1_[§§constant(36)] * _loc2_));
                  var _loc5_ = new eval(§§constant(113))[§§constant(114)][§§constant(122)]();
                  _loc5_[§§constant(123)](_loc2_,_loc2_);
                  _loc5_[§§constant(124)](- _loc6_[§§constant(35)],- _loc6_[§§constant(36)]);
                  _loc4_[§§constant(46)](mc,_loc5_);
                  _loc4_[§§constant(127)](_loc4_,_loc4_[§§constant(37)],new eval(§§constant(113))[§§constant(114)][§§constant(121)](0,0),new eval(§§constant(113))[§§constant(125)][§§constant(126)](0,1,4,4,2,1));
                  var _loc9_ = {(§§constant(32)):_loc4_,(§§constant(31)):_loc6_,(§§constant(48)):undefined};
                  return _loc9_;
               };
               _loc2_[§§constant(128)] = §§constant(4);
               eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(4)] = function()
               {
                  super();
               }[§§constant(129)] = 1;
               eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(4)] = function()
               {
                  super();
               }[§§constant(130)] = 2;
               §§push(_loc2_[§§constant(131)](§§constant(48),_loc2_[§§constant(47)],function()
               {
               }
               ));
               §§push(§§constant(132)(eval("k{invalid_utf8=133}Y")[§§constant(3)][§§constant(4)][§§constant(6)],null,1));
            }
            §§pop();
            break;
         }
         if(eval("\x01") != 714)
         {
            break;
         }
         set("\x01",eval("\x01") + 208);
      }
   }
}
