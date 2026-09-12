function §\x01\x02§()
{
   return 1449;
}
var §\x01§ = -551 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 898)
   {
      set("\x01",eval("\x01") - 248);
      §§push(true);
   }
   else
   {
      if(eval("\x01") == 721)
      {
         set("\x01",eval("\x01") - 183);
         §§pop()[§§pop()][§§constant(4)][§§constant(26)][§§constant(27)] = pos[§§constant(27)] + _loc2_[§§constant(27)];
         eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)][§§constant(28)] = pos[§§constant(28)] + _loc2_[§§constant(28)];
         bmDraw[§§constant(30)](_loc6_,_loc6_[§§constant(29)],eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)],undefined,undefined,true);
         return true;
      }
      if(eval("\x01") == 977)
      {
         set("\x01",eval("\x01") - 270);
         §§push("\x0f");
      }
      else
      {
         if(eval("\x01") == 268)
         {
            set("\x01",eval("\x01") + 232);
            break;
         }
         if(eval("\x01") == 101)
         {
            set("\x01",eval("\x01") + 255);
            if(!eval(§§constant(0))[§§constant(1)])
            {
               eval(§§constant(0))[§§constant(1)] = new §\§\§constant(2)§();
            }
            §§pop();
            if(!eval(§§constant(0))[§§constant(1)][§§constant(3)])
            {
               eval(§§constant(0))[§§constant(1)][§§constant(3)] = new §\§\§constant(2)§();
            }
            §§pop();
            if(!eval(§§constant(0))[§§constant(1)][§§constant(3)][§§constant(4)])
            {
               eval(§§constant(1))[§§constant(3)][§§constant(4)] extends eval(§§constant(1))[§§constant(3)][§§constant(9)];
               _loc2_ = eval(§§constant(1))[§§constant(3)][§§constant(4)] = function(mcLink, tDirections)
               {
                  super();
                  var _loc4_;
                  if(mcLink)
                  {
                     _loc4_ = _root[§§constant(7)](mcLink,§§constant(6) + _root[§§constant(5)](),_root[§§constant(5)]());
                     this[§§constant(8)](_loc4_,tDirections);
                  }
               }[§§constant(10)];
               _loc2_[§§constant(11)] = function()
               {
                  var _loc2_ = new eval(§§constant(1))[§§constant(3)][§§constant(4)]();
                  _loc2_[§§constant(12)] = this[§§constant(12)];
                  _loc2_[§§constant(13)] = 0;
                  return _loc2_;
               };
               _loc2_[§§constant(14)] = function(tSpeed)
               {
                  this[§§constant(13)] += tSpeed;
                  if(this[§§constant(13)] >= this[§§constant(15)]())
                  {
                     this[§§constant(13)] = this[§§constant(15)]() - 1;
                     return true;
                  }
                  return false;
               };
               _loc2_[§§constant(16)] = function(tSpeed)
               {
                  this[§§constant(13)] = (this[§§constant(13)] + tSpeed) % this[§§constant(15)]();
               };
               _loc2_[§§constant(17)] = function()
               {
                  this[§§constant(13)] = random(this[§§constant(15)]());
               };
               _loc2_[§§constant(18)] = function(tFrameNumber)
               {
                  this[§§constant(13)] = (tFrameNumber + this[§§constant(15)]() * 10) % this[§§constant(15)]();
               };
               _loc2_[§§constant(15)] = function()
               {
                  return this[§§constant(12)][0][§§constant(19)];
               };
               _loc2_[§§constant(20)] = function(bmDraw, pos, tAngle, tScale, tAlpha)
               {
                  var _loc4_ = this[§§constant(12)][tAngle[§§constant(21)](this[§§constant(15)]())][eval(§§constant(22))[§§constant(23)](this[§§constant(13)])];
                  var _loc2_ = _loc4_[§§constant(24)];
                  var _loc6_;
                  if(tAlpha == 100 && tScale == 1)
                  {
                     _loc6_ = _loc4_[§§constant(25)];
                     eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)][§§constant(27)] = pos[§§constant(27)] + _loc2_[§§constant(27)];
                     eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)][§§constant(28)] = pos[§§constant(28)] + _loc2_[§§constant(28)];
                     bmDraw[§§constant(30)](_loc6_,_loc6_[§§constant(29)],eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)],undefined,undefined,true);
                  }
                  else
                  {
                     eval(§§constant(1))[§§constant(31)][§§constant(32)][§§constant(33)]();
                     eval(§§constant(1))[§§constant(31)][§§constant(32)][§§constant(34)] = tScale;
                     eval(§§constant(1))[§§constant(31)][§§constant(32)][§§constant(35)] = tScale;
                     eval(§§constant(1))[§§constant(31)][§§constant(32)][§§constant(36)] = pos[§§constant(27)] + _loc2_[§§constant(27)] * tScale;
                     eval(§§constant(1))[§§constant(31)][§§constant(32)][§§constant(37)] = pos[§§constant(28)] + _loc2_[§§constant(28)] * tScale;
                     eval(§§constant(1))[§§constant(31)][§§constant(38)][§§constant(39)] = tAlpha / 100;
                     bmDraw[§§constant(40)](_loc4_[§§constant(25)],eval(§§constant(1))[§§constant(31)][§§constant(32)],eval(§§constant(1))[§§constant(31)][§§constant(38)]);
                  }
                  return true;
               };
               _loc2_[§§constant(41)] = function(bmDraw, pos, dir)
               {
                  var _loc3_ = this[§§constant(12)][dir][eval(§§constant(22))[§§constant(23)](this[§§constant(13)])];
                  var _loc2_ = _loc3_[§§constant(24)];
                  var _loc4_ = _loc3_[§§constant(25)];
                  eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)][§§constant(27)] = pos[§§constant(27)] + _loc2_[§§constant(27)];
                  eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)][§§constant(28)] = pos[§§constant(28)] + _loc2_[§§constant(28)];
                  bmDraw[§§constant(30)](_loc4_,_loc4_[§§constant(29)],eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)],undefined,undefined,true);
               };
               _loc2_[§§constant(42)] = function(bmDraw, pos, dir, tMask)
               {
                  var _loc3_ = this[§§constant(12)][dir][eval(§§constant(22))[§§constant(23)](this[§§constant(13)])];
                  var _loc2_ = _loc3_[§§constant(24)];
                  var _loc4_ = _loc3_[§§constant(25)];
                  eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)][§§constant(27)] = pos[§§constant(27)] + _loc2_[§§constant(27)];
                  eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)][§§constant(28)] = pos[§§constant(28)] + _loc2_[§§constant(28)];
                  bmDraw[§§constant(30)](_loc4_,_loc4_[§§constant(29)],eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)],tMask,eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(26)],true);
               };
               _loc2_[§§constant(8)] = function(mc, tDirections)
               {
                  this[§§constant(12)] = new §\§\§constant(43)§();
                  var _loc4_;
                  var _loc3_;
                  if(tDirections != undefined)
                  {
                     this[§§constant(44)]();
                     _loc4_ = 0;
                     while(_loc4_ < tDirections)
                     {
                        this[§§constant(12)][_loc4_] = new §\§\§constant(43)§();
                        if(mc[§§constant(45)])
                        {
                           mc[§§constant(45)][§§constant(46)] = _loc4_ * 360 / tDirections;
                           _loc3_ = 1;
                           while(_loc3_ <= mc[§§constant(45)][§§constant(47)])
                           {
                              mc[§§constant(45)][§§constant(48)](_loc3_);
                              this[§§constant(12)][_loc4_][_loc3_ - 1] = eval(§§constant(1))[§§constant(3)][§§constant(9)][§§constant(49)](mc);
                              _loc3_ = _loc3_ + 1;
                           }
                        }
                        else
                        {
                           mc[§§constant(46)] = _loc4_ * 360 / tDirections;
                           _loc3_ = 1;
                           while(_loc3_ <= mc[§§constant(47)])
                           {
                              this[§§constant(12)][_loc4_][_loc3_ - 1] = eval(§§constant(1))[§§constant(3)][§§constant(9)][§§constant(49)](mc,_loc3_);
                              _loc3_ = _loc3_ + 1;
                           }
                        }
                        _loc4_ = _loc4_ + 1;
                     }
                     this[§§constant(50)]();
                  }
                  mc[§§constant(51)]();
                  eval(§§constant(1))[§§constant(3)][§§constant(9)][§§constant(52)][§§constant(27)] = 1;
                  eval(§§constant(1))[§§constant(3)][§§constant(9)][§§constant(52)][§§constant(28)] = 1;
               };
               _loc2_[§§constant(53)] = §§constant(4);
               eval(§§constant(1))[§§constant(3)][§§constant(4)] = function(mcLink, tDirections)
               {
                  super();
                  var _loc4_;
                  if(mcLink)
                  {
                     _loc4_ = _root[§§constant(7)](mcLink,§§constant(6) + _root[§§constant(5)](),_root[§§constant(5)]());
                     this[§§constant(8)](_loc4_,tDirections);
                  }
               }[§§constant(26)] = new eval(§§constant(54))[§§constant(55)][§§constant(56)](0,0);
               §§push(_loc2_[§§constant(58)](§§constant(57),_loc2_[§§constant(15)],function()
               {
               }
               ));
               §§push(§§constant(59)(eval(§§constant(1))[§§constant(3)][§§constant(4)][§§constant(10)],null,1));
            }
            §§pop();
            break;
         }
         if(eval("\x01") == 650)
         {
            set("\x01",eval("\x01") - 382);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 232);
            }
         }
         else if(eval("\x01") == 500)
         {
            set("\x01",eval("\x01") + 496);
         }
         else if(eval("\x01") == 967)
         {
            set("\x01",eval("\x01") - 866);
         }
         else if(eval("\x01") == 821)
         {
            set("\x01",eval("\x01") + 146);
            if(§§pop())
            {
               set("\x01",eval("\x01") - 866);
            }
         }
         else if(eval("\x01") == 841)
         {
            set("\x01",eval("\x01") + 155);
         }
         else if(eval("\x01") == 996)
         {
            set("\x01",eval("\x01") - 969);
            §§push(true);
         }
         else if(eval("\x01") == 731)
         {
            set("\x01",eval("\x01") - 282);
         }
         else
         {
            if(eval("\x01") == 356)
            {
               set("\x01",eval("\x01") - 356);
               break;
            }
            if(eval("\x01") == 118)
            {
               set("\x01",eval("\x01") + 703);
               §§push(!§§pop());
            }
            else if(eval("\x01") == 27)
            {
               set("\x01",eval("\x01") + 694);
               if(§§pop())
               {
                  set("\x01",eval("\x01") - 183);
               }
            }
            else if(eval("\x01") == 73)
            {
               set("\x01",eval("\x01") + 904);
               var §§pop() = §§pop();
            }
            else if(eval("\x01") == 538)
            {
               set("\x01",eval("\x01") - 89);
            }
            else if(eval("\x01") == 707)
            {
               set("\x01",eval("\x01") - 589);
               §§push(eval(§§pop()));
            }
            else
            {
               if(eval("\x01") != 449)
               {
                  break;
               }
               set("\x01",eval("\x01") - 376);
               §§push("\x0f");
               §§push(1);
            }
         }
      }
   }
}
