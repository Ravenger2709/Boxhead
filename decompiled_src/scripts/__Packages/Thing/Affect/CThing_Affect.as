function §\x01\x02§()
{
   return 462;
}
var §\x01§ = -416 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 46)
   {
      set("\x01",eval("\x01") + 508);
      §§push(true);
   }
   else if(eval("\x01") == 10)
   {
      set("\x01",eval("\x01") + 300);
   }
   else if(eval("\x01") == 232)
   {
      set("\x01",eval("\x01") - 133);
      if(§§pop())
      {
         set("\x01",eval("\x01") + 520);
      }
   }
   else if(eval("\x01") == 215)
   {
      set("\x01",eval("\x01") + 17);
      §§push(!§§pop());
   }
   else if(eval("\x01") == 554)
   {
      set("\x01",eval("\x01") + 30);
      if(§§pop())
      {
         set("\x01",eval("\x01") + 331);
      }
   }
   else if(eval("\x01") == 534)
   {
      set("\x01",eval("\x01") - 224);
   }
   else if(eval("\x01") == 683)
   {
      set("\x01",eval("\x01") - 468);
      §§push(eval(§§pop()));
   }
   else if(eval("\x01") == 910)
   {
      set("\x01",eval("\x01") - 375);
      §§push(true);
   }
   else if(eval("\x01") == 704)
   {
      set("\x01",eval("\x01") - 21);
      §§push("\x0f");
   }
   else if(eval("\x01") == 785)
   {
      set("\x01",eval("\x01") + 125);
   }
   else if(eval("\x01") == 99)
   {
      set("\x01",eval("\x01") + 520);
   }
   else
   {
      if(eval("\x01") == 619)
      {
         set("\x01",eval("\x01") + 254);
         if(!_global.Thing)
         {
            _global.Thing = new Object();
         }
         §§pop();
         if(!_global.Thing.Affect)
         {
            _global.Thing.Affect = new Object();
         }
         §§pop();
         if(!_global.Thing.Affect.CThing_Affect)
         {
            _loc2_ = Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.prototype;
            _loc2_.toString = function()
            {
               return this._CLASSID_;
            };
            _loc2_.Dispose = function()
            {
            };
            _loc2_.AffectThing = function(tThing)
            {
               tThing.mLife -= this.mDamage;
               return this.mDamage;
            };
            _loc2_._CLASSID_ = "CThing_Affect";
            _loc2_._BASECLASSID_ = "CThing_Affect";
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_None = 0;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_Bullet = 1;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_Electricuted = 2;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_Explosion = 4;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_Punched = 8;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_Push = 16;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_Vapourize = 32;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_ZombieAttack = 64;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_PlayerLineOfSight = 128;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_DevilAttack = 256;
            Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
            {
               this.mType = tType;
               this.mDamage = tDamage;
               this.mAffector = tAffector;
               this.mOwner = tOwner;
            }.mAffect_FireBall = 512;
            §§push(ASSetPropFlags(Thing.Affect.CThing_Affect.prototype,null,1));
         }
         §§pop();
         break;
      }
      if(eval("\x01") == 798)
      {
         set("\x01",eval("\x01") + 112);
      }
      else if(eval("\x01") == 751)
      {
         set("\x01",eval("\x01") - 47);
         var §§pop() = §§pop();
      }
      else if(eval("\x01") == 535)
      {
         set("\x01",eval("\x01") - 501);
         if(§§pop())
         {
            set("\x01",eval("\x01") + 500);
         }
      }
      else if(eval("\x01") == 310)
      {
         set("\x01",eval("\x01") + 441);
         §§push("\x0f");
         §§push(1);
      }
      else
      {
         if(eval("\x01") == 34)
         {
            set("\x01",eval("\x01") + 500);
            break;
         }
         if(eval("\x01") == 873)
         {
            set("\x01",eval("\x01") - 873);
            break;
         }
         if(eval("\x01") == 78)
         {
            set("\x01",eval("\x01") + 701);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 19);
            }
         }
         else
         {
            if(eval("\x01") == 584)
            {
               set("\x01",eval("\x01") + 331);
               (Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }).ContainsBaseClassID(!(Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }.mType == 0 && Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }.mDamage == 0 && Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }.mAffector == 0) ? _loc2_ / Affect[§§constant(47)](Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }.mType * Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }.mType + Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }.mDamage * Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }.mDamage + Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }.mAffector * Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               }.mAffector) : 1);
               return Thing.Affect.CThing_Affect = function(tType, tOwner, tAffector, tDamage)
               {
                  this.mType = tType;
                  this.mDamage = tDamage;
                  this.mAffector = tAffector;
                  this.mOwner = tOwner;
               };
            }
            if(eval("\x01") == 779)
            {
               set("\x01",eval("\x01") + 19);
               while(true)
               {
                  set(§§pop(),§§pop() + §§pop());
                  while(true)
                  {
                     if(eval("\x01") == 735)
                     {
                        set("\x01",eval("\x01") - 578);
                        §§push(true);
                     }
                     else if(eval("\x01") == 863)
                     {
                        set("\x01",eval("\x01") - 743);
                        §§push("\x0f");
                        §§push(1);
                     }
                     else if(eval("\x01") == 366)
                     {
                        set("\x01",eval("\x01") + 430);
                        §§push(eval(§§pop()));
                     }
                     else if(eval("\x01") == 157)
                     {
                        set("\x01",eval("\x01") + 228);
                        if(§§pop())
                        {
                           set("\x01",eval("\x01") + 407);
                        }
                     }
                     else if(eval("\x01") == 535)
                     {
                        set("\x01",eval("\x01") - 476);
                        if(§§pop())
                        {
                           set("\x01",eval("\x01") + 32);
                        }
                     }
                     else
                     {
                        if(eval("\x01") == 471)
                        {
                           break;
                        }
                        if(eval("\x01") == 137)
                        {
                           set("\x01",eval("\x01") + 229);
                           §§push("\x0f");
                        }
                        else if(eval("\x01") == 621)
                        {
                           set("\x01",eval("\x01") - 150);
                           if(§§pop())
                           {
                              set("\x01",eval("\x01") + 15);
                           }
                        }
                        else if(eval("\x01") == 91)
                        {
                           set("\x01",eval("\x01") + 772);
                        }
                        else
                        {
                           if(eval("\x01") == 59)
                           {
                              set("\x01",eval("\x01") + 32);
                              return;
                           }
                           if(eval("\x01") == 120)
                           {
                              set("\x01",eval("\x01") + 17);
                              var §§pop() = §§pop();
                           }
                           else if(eval("\x01") == 796)
                           {
                              set("\x01",eval("\x01") - 175);
                              §§push(!§§pop());
                           }
                           else if(eval("\x01") == 792)
                           {
                              set("\x01",eval("\x01") + 25);
                           }
                           else
                           {
                              if(eval("\x01") == 385)
                              {
                                 set("\x01",eval("\x01") + 407);
                                 return;
                              }
                              if(eval("\x01") == 486)
                              {
                                 set("\x01",eval("\x01") - 238);
                                 if(!eval("\x01D").Ѵ)
                                 {
                                    eval("\x01D").Ѵ = new §\x07X{invalid_utf8=200}^§();
                                 }
                                 §§pop();
                                 if(!eval("\x01D").Ѵ[§§constant(3)])
                                 {
                                    eval("\x01D").Ѵ[§§constant(3)] = new §\x07X{invalid_utf8=200}^§();
                                 }
                                 §§pop();
                                 if(!eval("\x01D").Ѵ[§§constant(3)][§§constant(4)])
                                 {
                                    _loc2_ = Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(26)];
                                    _loc2_[§§constant(27)] = function(tList)
                                    {
                                       this[§§constant(28)] = tList;
                                       this[§§constant(29)] = this[§§constant(28)];
                                       this[§§constant(30)] = this[§§constant(28)][0];
                                       this[§§constant(31)] = this[§§constant(28)][2];
                                       this[§§constant(32)] = this[§§constant(28)][4];
                                       this[§§constant(33)] = this[§§constant(28)][6];
                                       this[§§constant(34)] = this[§§constant(30)];
                                    };
                                    _loc2_[§§constant(35)] = function()
                                    {
                                       return this[§§constant(36)];
                                    };
                                    _loc2_[§§constant(37)] = function()
                                    {
                                    };
                                    _loc2_[§§constant(38)] = function(cCLASSID)
                                    {
                                       for(var _loc2_ in this[§§constant(23)])
                                       {
                                          if(this[§§constant(23)][_loc2_][§§constant(36)] == cCLASSID)
                                          {
                                             return this[§§constant(23)][_loc2_];
                                          }
                                       }
                                       return undefined;
                                    };
                                    _loc2_[§§constant(39)] = function(cBASECLASSID)
                                    {
                                       for(var _loc2_ in this[§§constant(23)])
                                       {
                                          if(this[§§constant(23)][_loc2_][§§constant(40)] == cBASECLASSID)
                                          {
                                             return this[§§constant(23)][_loc2_];
                                          }
                                       }
                                       return undefined;
                                    };
                                    _loc2_[§§constant(41)] = function()
                                    {
                                       if(this[§§constant(20)] > 1)
                                       {
                                          this[§§constant(23)][§§constant(43)](this[§§constant(42)]);
                                       }
                                       for(var _loc2_ in this[§§constant(23)])
                                       {
                                          this[§§constant(23)][_loc2_][§§constant(41)]();
                                       }
                                    };
                                    _loc2_[§§constant(44)] = function()
                                    {
                                       if(this[§§constant(21)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(45)])
                                       {
                                          eval(§§constant(49))[§§constant(50)][§§constant(41)](Ѵ[§§constant(3)][§§constant(47)][§§constant(48)],new eval(§§constant(6))[§§constant(7)][§§constant(8)](this[§§constant(5)][§§constant(17)] * Ѵ[§§constant(3)][§§constant(4)][§§constant(46)][§§constant(17)],this[§§constant(5)][§§constant(16)] * Ѵ[§§constant(3)][§§constant(4)][§§constant(46)][§§constant(16)]),Ѵ[§§constant(3)][§§constant(4)][§§constant(46)][§§constant(17)],65280,50,false);
                                       }
                                    };
                                    _loc2_[§§constant(51)] = function(tColor, tSolid)
                                    {
                                       eval(§§constant(49))[§§constant(50)][§§constant(41)](Ѵ[§§constant(3)][§§constant(47)][§§constant(48)],new eval(§§constant(6))[§§constant(7)][§§constant(8)](this[§§constant(5)][§§constant(17)] * Ѵ[§§constant(3)][§§constant(4)][§§constant(46)][§§constant(17)],this[§§constant(5)][§§constant(16)] * Ѵ[§§constant(3)][§§constant(4)][§§constant(46)][§§constant(16)]),Ѵ[§§constant(3)][§§constant(4)][§§constant(46)][§§constant(17)],tColor,50,tSolid);
                                    };
                                    _loc2_[§§constant(42)] = function(a, b)
                                    {
                                       var _loc2_ = a[§§constant(5)][§§constant(52)];
                                       var _loc1_ = b[§§constant(5)][§§constant(52)];
                                       return _loc2_ <= _loc1_ ? (_loc2_ >= _loc1_ ? 0 : 1) : -1;
                                    };
                                    _loc2_[§§constant(53)] = function(tObject)
                                    {
                                       delete this[§§constant(23)][tObject[§§constant(54)]];
                                       this[§§constant(20)]--;
                                    };
                                    _loc2_[§§constant(55)] = function(tObject)
                                    {
                                       this[§§constant(23)][tObject[§§constant(54)]] = tObject;
                                       this[§§constant(20)]++;
                                    };
                                    _loc2_[§§constant(56)] = function(tAffect)
                                    {
                                       var _loc2_;
                                       for(var _loc4_ in this[§§constant(23)])
                                       {
                                          _loc2_ = this[§§constant(23)][_loc4_];
                                          if(_loc2_[§§constant(57)] & tAffect[§§constant(58)] && tAffect[§§constant(59)][§§constant(19)] != _loc2_[§§constant(19)])
                                          {
                                             this[§§constant(23)][_loc4_][§§constant(56)](tAffect);
                                          }
                                       }
                                    };
                                    _loc2_[§§constant(60)] = function(d)
                                    {
                                       var _loc2_ = this[§§constant(29)][d][§§constant(21)];
                                       return !(d & 1) ? _loc2_ : _loc2_ | (this[§§constant(29)][d - 1 & 7][§§constant(21)] | this[§§constant(29)][d + 1 & 7][§§constant(21)]);
                                    };
                                    _loc2_[§§constant(61)] = function(d2, d1)
                                    {
                                       var _loc2_;
                                       var _loc5_ = d2 <= d1 ? (eval(§§constant(13))[§§constant(62)](d2 - d1) <= 4 ? -1 : 1) : (eval(§§constant(13))[§§constant(62)](d2 - d1) <= 4 ? 1 : -1);
                                       var _loc3_;
                                       if(d2 & 1)
                                       {
                                          _loc3_ = 1;
                                          while(_loc3_ <= 3)
                                          {
                                             _loc2_ = d2 + _loc3_ * _loc5_ & 7;
                                             if(!(this[§§constant(60)](_loc2_) & Ѵ[§§constant(3)][§§constant(4)][§§constant(63)]))
                                             {
                                                return _loc2_;
                                             }
                                             _loc2_ = d2 - _loc3_ * _loc5_ & 7;
                                             if(!(this[§§constant(60)](_loc2_) & Ѵ[§§constant(3)][§§constant(4)][§§constant(63)]))
                                             {
                                                return _loc2_;
                                             }
                                             _loc3_ += 2;
                                          }
                                       }
                                       else
                                       {
                                          _loc2_ = d2 + 2 * _loc5_ & 7;
                                          if(!(this[§§constant(60)](_loc2_) & Ѵ[§§constant(3)][§§constant(4)][§§constant(63)]))
                                          {
                                             return _loc2_;
                                          }
                                          _loc2_ = d2 - 2 * _loc5_ & 7;
                                          if(!(this[§§constant(60)](_loc2_) & Ѵ[§§constant(3)][§§constant(4)][§§constant(63)]))
                                          {
                                             return _loc2_;
                                          }
                                       }
                                       return -1;
                                    };
                                    _loc2_[§§constant(64)] = function()
                                    {
                                       var _loc2_ = 0;
                                       while(_loc2_ < 8)
                                       {
                                          if(this[§§constant(28)][_loc2_] != undefined && (this[§§constant(28)][_loc2_][§§constant(21)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(65)]) == 0)
                                          {
                                             return this[§§constant(28)][_loc2_];
                                          }
                                          _loc2_ += 2;
                                       }
                                       return undefined;
                                    };
                                    _loc2_[§§constant(66)] = function(cLine)
                                    {
                                       var _loc10_ = this[§§constant(67)](cLine);
                                       if(_loc10_)
                                       {
                                          return _loc10_;
                                       }
                                       var _loc3_;
                                       var _loc2_;
                                       var _loc4_;
                                       for(var _loc9_ in this[§§constant(23)])
                                       {
                                          _loc3_ = cLine[§§constant(68)];
                                          _loc2_ = this[§§constant(23)][_loc9_];
                                          if(_loc3_[§§constant(19)] != _loc2_[§§constant(19)] && _loc2_[§§constant(57)] & _loc3_[§§constant(69)])
                                          {
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(70)][§§constant(17)] = _loc2_[§§constant(5)][§§constant(71)];
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(70)][§§constant(16)] = _loc2_[§§constant(5)][§§constant(52)];
                                             _loc4_ = cLine[§§constant(72)](Ѵ[§§constant(3)][§§constant(4)][§§constant(70)]);
                                             if(_loc4_ < _loc2_[§§constant(73)])
                                             {
                                                return {(§§constant(74)):§§constant(75),(§§constant(76)):_loc2_,(§§constant(77)):Ѵ[§§constant(3)][§§constant(4)][§§constant(70)]};
                                             }
                                          }
                                       }
                                       return undefined;
                                    };
                                    _loc2_[§§constant(78)] = function(cLine)
                                    {
                                       var _loc4_ = cLine[§§constant(68)];
                                       var _loc5_ = new §\§\§constant(24)§();
                                       var _loc2_;
                                       var _loc3_;
                                       for(var _loc7_ in this[§§constant(23)])
                                       {
                                          _loc2_ = this[§§constant(23)][_loc7_];
                                          if(_loc4_[§§constant(19)] != _loc2_[§§constant(19)] && _loc2_[§§constant(57)] & _loc4_[§§constant(69)])
                                          {
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(70)][§§constant(17)] = _loc2_[§§constant(5)][§§constant(71)];
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(70)][§§constant(16)] = _loc2_[§§constant(5)][§§constant(52)];
                                             _loc3_ = cLine[§§constant(72)](Ѵ[§§constant(3)][§§constant(4)][§§constant(70)]);
                                             if(_loc3_ < _loc2_[§§constant(73)])
                                             {
                                                _loc5_[§§constant(79)](_loc2_);
                                             }
                                          }
                                       }
                                       return _loc5_[§§constant(80)] <= 0 ? undefined : _loc5_;
                                    };
                                    _loc2_[§§constant(67)] = function(cLine)
                                    {
                                       var _loc3_ = cLine[§§constant(68)];
                                       var _loc4_;
                                       var _loc5_;
                                       var _loc6_;
                                       var _loc7_;
                                       if((this[§§constant(21)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(45)]) == Ѵ[§§constant(3)][§§constant(4)][§§constant(45)])
                                       {
                                          if(cLine[§§constant(68)][§§constant(81)] > 0)
                                          {
                                             _loc6_ = cLine[§§constant(9)][§§constant(16)] + (this[§§constant(9)][§§constant(17)] - cLine[§§constant(9)][§§constant(17)]) * _loc3_[§§constant(82)];
                                             if(_loc6_ >= this[§§constant(9)][§§constant(16)] && _loc6_ <= this[§§constant(10)][§§constant(16)])
                                             {
                                                _loc4_ = true;
                                                Ѵ[§§constant(3)][§§constant(4)][§§constant(70)][§§constant(17)] = this[§§constant(9)][§§constant(17)];
                                                Ѵ[§§constant(3)][§§constant(4)][§§constant(70)][§§constant(16)] = _loc6_;
                                             }
                                          }
                                          else if(_loc3_[§§constant(81)] < 0)
                                          {
                                             _loc6_ = cLine[§§constant(9)][§§constant(16)] + (this[§§constant(10)][§§constant(17)] - cLine[§§constant(9)][§§constant(17)]) * _loc3_[§§constant(82)];
                                             if(_loc6_ >= this[§§constant(9)][§§constant(16)] && _loc6_ <= this[§§constant(10)][§§constant(16)])
                                             {
                                                _loc4_ = true;
                                                Ѵ[§§constant(3)][§§constant(4)][§§constant(70)][§§constant(17)] = this[§§constant(10)][§§constant(17)];
                                                Ѵ[§§constant(3)][§§constant(4)][§§constant(70)][§§constant(16)] = _loc6_;
                                             }
                                          }
                                          if(_loc3_[§§constant(83)] > 0)
                                          {
                                             _loc7_ = cLine[§§constant(9)][§§constant(17)] + (this[§§constant(9)][§§constant(16)] - cLine[§§constant(9)][§§constant(16)]) * _loc3_[§§constant(84)];
                                             if(_loc7_ >= this[§§constant(9)][§§constant(17)] && _loc7_ <= this[§§constant(10)][§§constant(17)])
                                             {
                                                _loc5_ = true;
                                                Ѵ[§§constant(3)][§§constant(4)][§§constant(85)][§§constant(17)] = _loc7_;
                                                Ѵ[§§constant(3)][§§constant(4)][§§constant(85)][§§constant(16)] = this[§§constant(9)][§§constant(16)];
                                             }
                                          }
                                          else if(_loc3_[§§constant(83)] < 0)
                                          {
                                             _loc7_ = cLine[§§constant(9)][§§constant(17)] + (this[§§constant(10)][§§constant(16)] - cLine[§§constant(9)][§§constant(16)]) * _loc3_[§§constant(84)];
                                             if(_loc7_ >= this[§§constant(9)][§§constant(17)] && _loc7_ <= this[§§constant(10)][§§constant(17)])
                                             {
                                                _loc5_ = true;
                                                Ѵ[§§constant(3)][§§constant(4)][§§constant(85)][§§constant(17)] = _loc7_;
                                                Ѵ[§§constant(3)][§§constant(4)][§§constant(85)][§§constant(16)] = this[§§constant(10)][§§constant(16)];
                                             }
                                          }
                                          if(_loc4_ != undefined && _loc5_ != undefined)
                                          {
                                             return {(§§constant(74)):§§constant(86),(§§constant(77)):(eval(§§constant(87))[§§constant(13)][§§constant(88)][§§constant(89)](Ѵ[§§constant(3)][§§constant(4)][§§constant(70)],cLine[§§constant(9)]) >= eval(§§constant(87))[§§constant(13)][§§constant(88)][§§constant(89)](Ѵ[§§constant(3)][§§constant(4)][§§constant(85)],cLine[§§constant(9)]) ? Ѵ[§§constant(3)][§§constant(4)][§§constant(85)] : Ѵ[§§constant(3)][§§constant(4)][§§constant(70)])};
                                          }
                                          if(_loc4_ != undefined || _loc5_ != undefined)
                                          {
                                             return {(§§constant(74)):§§constant(86),(§§constant(77)):(_loc4_ != undefined ? Ѵ[§§constant(3)][§§constant(4)][§§constant(70)] : Ѵ[§§constant(3)][§§constant(4)][§§constant(85)])};
                                          }
                                       }
                                       return undefined;
                                    };
                                    _loc2_[§§constant(90)] = function(cDir, tDir, tCollideFlags, tForceIt)
                                    {
                                       var _loc10_;
                                       var _loc9_;
                                       var _loc4_;
                                       var _loc2_;
                                       var _loc3_;
                                       if(Ѵ[§§constant(3)][§§constant(4)][§§constant(91)] - this[§§constant(25)] < 2000)
                                       {
                                          _loc9_ = §§constant(92);
                                          if(this[§§constant(29)][tDir][§§constant(93)] < this[§§constant(93)])
                                          {
                                             if(!(this[§§constant(94) + tDir]() & tCollideFlags))
                                             {
                                                return tDir;
                                             }
                                          }
                                          if(this[§§constant(29)][cDir][§§constant(93)] < this[§§constant(93)])
                                          {
                                             if(!(this[§§constant(94) + cDir]() & tCollideFlags))
                                             {
                                                return cDir;
                                             }
                                          }
                                          if(tForceIt == false)
                                          {
                                             if(++Ѵ[§§constant(3)][§§constant(4)][§§constant(95)] > 5)
                                             {
                                                return -1;
                                             }
                                          }
                                          if(this[§§constant(96)](tCollideFlags) == 0)
                                          {
                                             if(tForceIt == true)
                                             {
                                             }
                                             return -1;
                                          }
                                          _loc4_ = this[§§constant(29)][§§constant(100)](§§constant(93),eval(§§constant(24))[§§constant(97)] | eval(§§constant(24))[§§constant(98)] | eval(§§constant(24))[§§constant(99)]);
                                          _loc2_ = _loc4_[§§constant(80)] - 1;
                                          while(_loc2_ >= 0)
                                          {
                                             _loc3_ = _loc4_[_loc2_];
                                             if(this[§§constant(101)] & 1 << _loc3_)
                                             {
                                                return _loc3_;
                                             }
                                             _loc2_ = _loc2_ - 1;
                                          }
                                          if(tForceIt == true)
                                          {
                                          }
                                          return -1;
                                       }
                                       return this[§§constant(102)](tDir,cDir,tCollideFlags);
                                    };
                                    _loc2_[§§constant(102)] = function(d2, d1, tCollideFlags)
                                    {
                                       var _loc5_ = §§constant(94);
                                       var _loc6_;
                                       var _loc3_;
                                       if(!(this[_loc5_ + d2]() & tCollideFlags))
                                       {
                                          return d2;
                                       }
                                       if(d1 != d2)
                                       {
                                          if(!(this[_loc5_ + d1]() & tCollideFlags))
                                          {
                                             return d1;
                                          }
                                          _loc6_ = d2 <= d1 ? (eval(§§constant(13))[§§constant(62)](d2 - d1) <= 4 ? -1 : 1) : (eval(§§constant(13))[§§constant(62)](d2 - d1) <= 4 ? 1 : -1);
                                       }
                                       else
                                       {
                                          _loc6_ = random(2) * 2 - 1;
                                       }
                                       var _loc2_;
                                       if(d2 & 1)
                                       {
                                          _loc2_ = 1;
                                          while(_loc2_ <= 3)
                                          {
                                             if(!(this[_loc5_ + (_loc3_ = d2 + _loc2_ * _loc6_ & 7)]() & tCollideFlags))
                                             {
                                                return _loc3_;
                                             }
                                             if(!(this[_loc5_ + (_loc3_ = d2 - _loc2_ * _loc6_ & 7)]() & tCollideFlags))
                                             {
                                                return _loc3_;
                                             }
                                             _loc2_ += 2;
                                          }
                                       }
                                       else
                                       {
                                          if(!(this[_loc5_ + (_loc3_ = d2 + 2 * _loc6_ & 7)]() & tCollideFlags))
                                          {
                                             return _loc3_;
                                          }
                                          if(!(this[_loc5_ + (_loc3_ = d2 - 2 * _loc6_ & 7)]() & tCollideFlags))
                                          {
                                             return _loc3_;
                                          }
                                       }
                                       return -1;
                                    };
                                    _loc2_[§§constant(96)] = function(tCollideFlags)
                                    {
                                       this[§§constant(101)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(103)];
                                       if(this[§§constant(30)][§§constant(21)] & tCollideFlags)
                                       {
                                          this[§§constant(101)] &= Ѵ[§§constant(3)][§§constant(4)][§§constant(104)];
                                       }
                                       if(this[§§constant(31)][§§constant(21)] & tCollideFlags)
                                       {
                                          this[§§constant(101)] &= Ѵ[§§constant(3)][§§constant(4)][§§constant(105)];
                                       }
                                       if(this[§§constant(32)][§§constant(21)] & tCollideFlags)
                                       {
                                          this[§§constant(101)] &= Ѵ[§§constant(3)][§§constant(4)][§§constant(106)];
                                       }
                                       if(this[§§constant(33)][§§constant(21)] & tCollideFlags)
                                       {
                                          this[§§constant(101)] &= Ѵ[§§constant(3)][§§constant(4)][§§constant(107)];
                                       }
                                       if(this[§§constant(101)] == 0)
                                       {
                                          return this[§§constant(101)];
                                       }
                                       if(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(108)])
                                       {
                                          if(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(109)])
                                          {
                                             if(this[§§constant(29)][1][§§constant(21)] & tCollideFlags)
                                             {
                                                this[§§constant(101)] &= Ѵ[§§constant(3)][§§constant(4)][§§constant(110)];
                                             }
                                          }
                                          if(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(111)])
                                          {
                                             if(this[§§constant(29)][3][§§constant(21)] & tCollideFlags)
                                             {
                                                this[§§constant(101)] &= Ѵ[§§constant(3)][§§constant(4)][§§constant(112)];
                                             }
                                          }
                                          if(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(113)])
                                          {
                                             if(this[§§constant(29)][5][§§constant(21)] & tCollideFlags)
                                             {
                                                this[§§constant(101)] &= Ѵ[§§constant(3)][§§constant(4)][§§constant(114)];
                                             }
                                          }
                                          if(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(115)])
                                          {
                                             if(this[§§constant(29)][7][§§constant(21)] & tCollideFlags)
                                             {
                                                this[§§constant(101)] &= Ѵ[§§constant(3)][§§constant(4)][§§constant(116)];
                                             }
                                          }
                                       }
                                       return this[§§constant(101)];
                                    };
                                    _loc2_[§§constant(117)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? -1 : 6) : 2) : 0;
                                    };
                                    _loc2_[§§constant(121)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? -1 : 0) : 4) : 2;
                                    };
                                    _loc2_[§§constant(123)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? -1 : 2) : 6) : 4;
                                    };
                                    _loc2_[§§constant(124)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? -1 : 4) : 0) : 6;
                                    };
                                    _loc2_[§§constant(125)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(109)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? -1 : 0) : 2) : 1;
                                    };
                                    _loc2_[§§constant(126)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(111)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? -1 : 2) : 4) : 3;
                                    };
                                    _loc2_[§§constant(127)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(113)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? -1 : 4) : 6) : 5;
                                    };
                                    _loc2_[§§constant(128)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(115)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? -1 : 6) : 0) : 7;
                                    };
                                    _loc2_[§§constant(129)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? -1 : 2) : 6) : 0;
                                    };
                                    _loc2_[§§constant(130)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? -1 : 4) : 0) : 2;
                                    };
                                    _loc2_[§§constant(131)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? -1 : 6) : 2) : 4;
                                    };
                                    _loc2_[§§constant(132)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? -1 : 0) : 4) : 6;
                                    };
                                    _loc2_[§§constant(133)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(109)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? -1 : 2) : 0) : 1;
                                    };
                                    _loc2_[§§constant(134)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(111)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(119)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? -1 : 4) : 2) : 3;
                                    };
                                    _loc2_[§§constant(135)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(113)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(122)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? -1 : 6) : 4) : 5;
                                    };
                                    _loc2_[§§constant(136)] = function()
                                    {
                                       return !(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(115)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(120)]) ? (!(this[§§constant(101)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(118)]) ? -1 : 0) : 6) : 7;
                                    };
                                    _loc2_[§§constant(137)] = function()
                                    {
                                       return this[§§constant(29)][0][§§constant(21)];
                                    };
                                    _loc2_[§§constant(138)] = function()
                                    {
                                       return this[§§constant(29)][1][§§constant(21)] | this[§§constant(29)][0][§§constant(21)] | this[§§constant(29)][2][§§constant(21)];
                                    };
                                    _loc2_[§§constant(139)] = function()
                                    {
                                       return this[§§constant(29)][2][§§constant(21)];
                                    };
                                    _loc2_[§§constant(140)] = function()
                                    {
                                       return this[§§constant(29)][3][§§constant(21)] | this[§§constant(29)][2][§§constant(21)] | this[§§constant(29)][4][§§constant(21)];
                                    };
                                    _loc2_[§§constant(141)] = function()
                                    {
                                       return this[§§constant(29)][4][§§constant(21)];
                                    };
                                    _loc2_[§§constant(142)] = function()
                                    {
                                       return this[§§constant(29)][5][§§constant(21)] | this[§§constant(29)][4][§§constant(21)] | this[§§constant(29)][6][§§constant(21)];
                                    };
                                    _loc2_[§§constant(143)] = function()
                                    {
                                       return this[§§constant(29)][6][§§constant(21)];
                                    };
                                    _loc2_[§§constant(144)] = function()
                                    {
                                       return this[§§constant(29)][7][§§constant(21)] | this[§§constant(29)][6][§§constant(21)] | this[§§constant(29)][0][§§constant(21)];
                                    };
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(145)] = function()
                                    {
                                       Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] = §§constant(147);
                                       Ѵ[§§constant(3)][§§constant(4)][§§constant(148)] = 0;
                                       delete Ѵ[§§constant(3)][§§constant(4)][§§constant(149)];
                                    };
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(150)] = function()
                                    {
                                       Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] != §§constant(151) ? Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] : §§constant(147);
                                       if(Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] == §§constant(147))
                                       {
                                          Ѵ[§§constant(3)][§§constant(4)][§§constant(148)]++;
                                       }
                                    };
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(152)] = function(sCellList)
                                    {
                                       Ѵ[§§constant(3)][§§constant(4)][§§constant(91)] = getTimer();
                                       Ѵ[§§constant(3)][§§constant(4)][§§constant(95)] = 0;
                                       var _loc3_;
                                       var _loc1_;
                                       var _loc2_;
                                       if(Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] == §§constant(147) || Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] == undefined)
                                       {
                                          Ѵ[§§constant(3)][§§constant(4)][§§constant(153)] = new §\§\§constant(24)§();
                                          Ѵ[§§constant(3)][§§constant(4)][§§constant(148)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(91)];
                                          Ѵ[§§constant(3)][§§constant(4)][§§constant(154)] = 0;
                                          for(var _loc5_ in sCellList)
                                          {
                                             sCellList[_loc5_][§§constant(155)]();
                                          }
                                          _loc3_ = 0;
                                          while(_loc3_ < 5 && Ѵ[§§constant(3)][§§constant(4)][§§constant(153)][§§constant(80)])
                                          {
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(149)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(153)];
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(153)] = new §\§\§constant(24)§();
                                             for(var _loc2_ in Ѵ[§§constant(3)][§§constant(4)][§§constant(149)])
                                             {
                                                _loc1_ = Ѵ[§§constant(3)][§§constant(4)][§§constant(149)][_loc2_][§§constant(29)];
                                                _loc1_[0][§§constant(155)]();
                                                _loc1_[2][§§constant(155)]();
                                                _loc1_[4][§§constant(155)]();
                                                _loc1_[6][§§constant(155)]();
                                             }
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(154)]++;
                                             _loc3_ = _loc3_ + 1;
                                          }
                                          Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] = !Ѵ[§§constant(3)][§§constant(4)][§§constant(153)][§§constant(80)] ? §§constant(151) : §§constant(156);
                                       }
                                       else if(Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] == §§constant(156))
                                       {
                                          _loc3_ = 0;
                                          while(_loc3_ < 5 && Ѵ[§§constant(3)][§§constant(4)][§§constant(153)][§§constant(80)])
                                          {
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(149)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(153)];
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(153)] = new §\§\§constant(24)§();
                                             while(Ѵ[§§constant(3)][§§constant(4)][§§constant(149)][§§constant(80)])
                                             {
                                                _loc2_ = Ѵ[§§constant(3)][§§constant(4)][§§constant(157)] && Ѵ[§§constant(3)][§§constant(4)][§§constant(149)][§§constant(80)];
                                                while(_loc2_)
                                                {
                                                   _loc1_ = Ѵ[§§constant(3)][§§constant(4)][§§constant(149)][§§constant(158)]()[§§constant(29)];
                                                   _loc1_[0][§§constant(155)]();
                                                   _loc1_[2][§§constant(155)]();
                                                   _loc1_[4][§§constant(155)]();
                                                   _loc1_[6][§§constant(155)]();
                                                   _loc2_ = _loc2_ - 1;
                                                }
                                                if(getTimer() - Ѵ[§§constant(3)][§§constant(4)][§§constant(91)] > Ѵ[§§constant(3)][§§constant(4)][§§constant(159)])
                                                {
                                                   Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] = §§constant(160);
                                                   return undefined;
                                                }
                                             }
                                             Ѵ[§§constant(3)][§§constant(4)][§§constant(154)]++;
                                             _loc3_ = _loc3_ + 1;
                                          }
                                          Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] = !Ѵ[§§constant(3)][§§constant(4)][§§constant(153)][§§constant(80)] ? §§constant(151) : §§constant(156);
                                       }
                                       else if(Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] == §§constant(160))
                                       {
                                          while(Ѵ[§§constant(3)][§§constant(4)][§§constant(149)][§§constant(80)])
                                          {
                                             _loc2_ = Ѵ[§§constant(3)][§§constant(4)][§§constant(157)];
                                             while(_loc2_ && Ѵ[§§constant(3)][§§constant(4)][§§constant(149)][§§constant(80)])
                                             {
                                                _loc1_ = Ѵ[§§constant(3)][§§constant(4)][§§constant(149)][§§constant(158)]()[§§constant(29)];
                                                _loc1_[0][§§constant(155)]();
                                                _loc1_[2][§§constant(155)]();
                                                _loc1_[4][§§constant(155)]();
                                                _loc1_[6][§§constant(155)]();
                                                _loc2_ = _loc2_ - 1;
                                             }
                                             if(getTimer() - Ѵ[§§constant(3)][§§constant(4)][§§constant(91)] > Ѵ[§§constant(3)][§§constant(4)][§§constant(159)])
                                             {
                                                Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] = §§constant(160);
                                                return undefined;
                                             }
                                          }
                                          Ѵ[§§constant(3)][§§constant(4)][§§constant(154)]++;
                                          Ѵ[§§constant(3)][§§constant(4)][§§constant(146)] = !Ѵ[§§constant(3)][§§constant(4)][§§constant(153)][§§constant(80)] ? §§constant(151) : §§constant(156);
                                       }
                                    };
                                    _loc2_[§§constant(155)] = function()
                                    {
                                       if(!(this[§§constant(21)] & Ѵ[§§constant(3)][§§constant(4)][§§constant(161)] || this[§§constant(25)] == Ѵ[§§constant(3)][§§constant(4)][§§constant(148)]))
                                       {
                                          this[§§constant(25)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(148)];
                                          this[§§constant(93)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(154)];
                                          Ѵ[§§constant(3)][§§constant(4)][§§constant(153)][§§constant(79)](this);
                                       }
                                       return undefined;
                                    };
                                    _loc2_[§§constant(36)] = §§constant(4);
                                    _loc2_[§§constant(40)] = §§constant(4);
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(162)] = 32;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(46)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](Ѵ[§§constant(3)][§§constant(4)][§§constant(162)],Ѵ[§§constant(3)][§§constant(4)][§§constant(162)]);
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(22)] = 0;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(45)] = 1;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(163)] = 2;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(164)] = 4;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(165)] = 8;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(166)] = 16;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(167)] = 32;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(168)] = 64;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(169)] = 128;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(170)] = 256;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(65)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(163)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(45)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(171)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(45)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(63)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(65)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(167)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(169)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(168)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(172)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(167)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(168)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(173)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(65)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(167)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(169)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(168)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(174)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(167)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(169)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(161)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(65)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(169)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(175)] = 8;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(176)] = 0;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(118)] = 1;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(109)] = 2;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(119)] = 4;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(111)] = 8;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(122)] = 16;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(113)] = 32;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(120)] = 64;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(115)] = 128;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(108)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(109)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(111)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(113)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(115)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(177)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(118)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(119)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(122)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(120)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(103)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(108)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(177)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(104)] = ~(Ѵ[§§constant(3)][§§constant(4)][§§constant(118)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(115)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(109)]);
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(110)] = ~Ѵ[§§constant(3)][§§constant(4)][§§constant(109)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(105)] = ~(Ѵ[§§constant(3)][§§constant(4)][§§constant(119)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(109)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(111)]);
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(112)] = ~Ѵ[§§constant(3)][§§constant(4)][§§constant(111)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(106)] = ~(Ѵ[§§constant(3)][§§constant(4)][§§constant(122)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(111)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(113)]);
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(114)] = ~Ѵ[§§constant(3)][§§constant(4)][§§constant(113)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(107)] = ~(Ѵ[§§constant(3)][§§constant(4)][§§constant(120)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(113)] | Ѵ[§§constant(3)][§§constant(4)][§§constant(115)]);
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(116)] = ~Ѵ[§§constant(3)][§§constant(4)][§§constant(115)];
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(70)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)]();
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(85)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)]();
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(154)] = 0;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(157)] = 5;
                                    Ѵ[§§constant(3)][§§constant(4)] = function(x, y)
                                    {
                                       this[§§constant(5)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x,y);
                                       this[§§constant(9)] = this[§§constant(5)];
                                       this[§§constant(10)] = new eval(§§constant(6))[§§constant(7)][§§constant(8)](x + 1,y + 1);
                                       this[§§constant(11)] = new eval(§§constant(12))[§§constant(13)][§§constant(14)](x + 0.5,y + 0.5,0);
                                       this[§§constant(15)] = new eval(§§constant(6))[§§constant(7)][§§constant(18)](this[§§constant(5)][§§constant(17)],this[§§constant(5)][§§constant(16)],1,1);
                                       this[§§constant(19)] = this[§§constant(5)];
                                       this[§§constant(20)] = 0;
                                       this[§§constant(21)] = Ѵ[§§constant(3)][§§constant(4)][§§constant(22)];
                                       this[§§constant(23)] = new §\§\§constant(24)§();
                                       this[§§constant(25)] = -1;
                                    }[§§constant(159)] = 3;
                                    §§push(§§constant(178)(Ѵ[§§constant(3)][§§constant(4)][§§constant(26)],null,1));
                                 }
                                 §§pop();
                                 return;
                              }
                              if(eval("\x01") == 779)
                              {
                                 set("\x01",eval("\x01") + 38);
                              }
                              else if(eval("\x01") == 175)
                              {
                                 set("\x01",eval("\x01") + 688);
                              }
                              else
                              {
                                 if(eval("\x01") != 817)
                                 {
                                    if(eval("\x01") == 248)
                                    {
                                       set("\x01",eval("\x01") - 248);
                                    }
                                    return;
                                 }
                                 set("\x01",eval("\x01") - 282);
                                 §§push(true);
                              }
                           }
                        }
                     }
                  }
                  §§push("\x01");
                  §§push(eval("\x01"));
                  §§push(15);
               }
               break;
            }
            if(eval("\x01") == 711)
            {
               set("\x01",eval("\x01") - 633);
               §§push(true);
            }
            else if(eval("\x01") == 328)
            {
               set("\x01",eval("\x01") + 383);
            }
            else
            {
               if(eval("\x01") != 915)
               {
                  break;
               }
               set("\x01",eval("\x01") - 204);
            }
         }
      }
   }
}
