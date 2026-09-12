function §\x01\x02§()
{
   return 2908;
}
var §\x01§ = -2267 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 641)
   {
      set("\x01",eval("\x01") - 520);
      §§push(true);
   }
   else if(eval("\x01") == 310)
   {
      set("\x01",eval("\x01") + 668);
   }
   else if(eval("\x01") == 758)
   {
      set("\x01",eval("\x01") + 40);
   }
   else
   {
      if(eval("\x01") == 439)
      {
         set("\x01",eval("\x01") + 473);
         _loc2_ = this[§§constant(31)][§§constant(32)][§§constant(38)][§§constant(39)](this,§§pop()[§§pop() * §§pop()],§§pop(),§§pop(),§§pop(),§§pop());
         if(_loc2_)
         {
            if(_loc2_[§§constant(40)])
            {
               this[§§constant(5)][§§constant(41)] = _loc2_[§§constant(40)][§§constant(22)];
               this[§§constant(5)][§§constant(42)] = _loc2_[§§constant(40)][§§constant(21)];
            }
         }
         this[§§constant(31)][§§constant(32)][§§constant(46)][§§constant(47)](this,this[§§constant(12)],this[§§constant(5)],0.04,new eval("{")[§§constant(35)][§§constant(45)](this[§§constant(44)],this,this[§§constant(43)],this[§§constant(6)]));
         this[§§constant(24)] = this[§§constant(48)];
         this[§§constant(24)]();
         break;
      }
      if(eval("\x01") == 411)
      {
         set("\x01",eval("\x01") - 137);
         §§pop() extends §§pop() < §§pop();
         §§pop() extends typeof §§pop();
         §§pop() extends §§pop() << (§§pop() >>> §§pop());
      }
      else
      {
         if(eval("\x01") == 307)
         {
            set("\x01",eval("\x01") + 611);
            if(§§pop())
            {
               set("\x01",eval("\x01") - 796);
            }
            continue;
         }
         if(eval("\x01") == 912)
         {
            set("\x01",eval("\x01") - 114);
            continue;
         }
         if(eval("\x01") == 798)
         {
            set("\x01",eval("\x01") - 491);
            §§push(true);
            continue;
         }
         if(eval("\x01") == 71)
         {
            set("\x01",eval("\x01") + 239);
            trace(§§pop());
            ifFrameLoaded(1100)
            {
            }
            return;
         }
         if(eval("\x01") == 846)
         {
            set("\x01",eval("\x01") + 132);
            continue;
         }
         if(eval("\x01") == 121)
         {
            set("\x01",eval("\x01") - 50);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 239);
            }
            continue;
         }
         if(eval("\x01") == 978)
         {
            set("\x01",eval("\x01") - 119);
            §§push(true);
            continue;
         }
         if(eval("\x01") == 181)
         {
            set("\x01",eval("\x01") + 811);
            §§push(true);
            continue;
         }
         if(eval("\x01") == 859)
         {
            set("\x01",eval("\x01") - 420);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 473);
            }
            continue;
         }
         if(eval("\x01") == 918)
         {
            set("\x01",eval("\x01") - 796);
         }
         else
         {
            if(eval("\x01") == 558)
            {
               set("\x01",eval("\x01") - 370);
               var §§pop() = §§pop();
               continue;
            }
            if(eval("\x01") == 122)
            {
               set("\x01",eval("\x01") + 59);
               continue;
            }
            if(eval("\x01") == 509)
            {
               set("\x01",eval("\x01") + 43);
               if(§§pop())
               {
                  set("\x01",eval("\x01") + 12);
               }
               continue;
            }
            if(eval("\x01") == 299)
            {
               set("\x01",eval("\x01") - 118);
               continue;
            }
            if(eval("\x01") == 992)
            {
               set("\x01",eval("\x01") - 581);
               if(§§pop())
               {
                  set("\x01",eval("\x01") - 137);
               }
               continue;
            }
            if(eval("\x01") == 160)
            {
               set("\x01",eval("\x01") + 398);
               §§push("\x0f");
               §§push(1);
               continue;
            }
            if(eval("\x01") == 274)
            {
               set("\x01",eval("\x01") - 114);
               continue;
            }
            if(eval("\x01") == 463)
            {
               set("\x01",eval("\x01") - 303);
               continue;
            }
            if(eval("\x01") == 188)
            {
               set("\x01",eval("\x01") - 14);
               §§push("\x0f");
               continue;
            }
            if(eval("\x01") == 174)
            {
               set("\x01",eval("\x01") + 516);
               §§push(eval(§§pop()));
               continue;
            }
            if(eval("\x01") == 690)
            {
               set("\x01",eval("\x01") - 181);
               §§push(!§§pop());
               continue;
            }
            if(eval("\x01") == 552)
            {
               set("\x01",eval("\x01") + 12);
               continue;
            }
            if(eval("\x01") == 564)
            {
               set("\x01",eval("\x01") - 460);
               if(!_global.Thing)
               {
                  _global.Thing = new Object();
               }
               §§pop();
               if(!_global.Thing.Shot)
               {
                  _global.Thing.Shot = new Object();
               }
               §§pop();
               addr06d5:
               if(!_global.Thing.Shot.CThing_Shot_Railgun)
               {
                  Thing.Shot.CThing_Shot_Railgun extends Thing.Shot.CThing_Shot;
                  _loc2_ = Thing.Shot.CThing_Shot_Railgun = function(tPosition, tAngle, tParent, tDamage, tRange)
                  {
                     super(tPosition,tAngle,tParent,tDamage);
                     tRange = tRange != undefined ? tRange : 10;
                     this.mDestination = this.mPosition.Add(new Thing.Math.CThing_Position(1,0,0).RotateZ(this.mAngle.mAngle).Normalize(tRange));
                     this.mMaxLife = this.mLife = 2;
                     this.mDelta = new Thing.Math.CThing_Position(0,(random(4) + 2) / World.Map.CMap_Cell.mSize.x,(random(4) + 2) / World.Map.CMap_Cell.mSize.y).RotateZ(this.mAngle.mAngle);
                     this.mAlpha = 75;
                     this.Process = this.Process_Init;
                  }.prototype;
                  _loc2_.toString = function()
                  {
                     return this._CLASSID_;
                  };
                  _loc2_.Dispose = function()
                  {
                     super.Dispose();
                  };
                  §§push(_loc2_);
                  §§push("Process_Init");
                  function()
                  {
                     this.mWorld.mMap.mMapwho.MoveThing(this);
                     var _loc2_ = this[§§constant(31)][§§constant(32)][§§constant(38)][§§constant(39)](this,this.mPosition,this.mDestination,0.04,Thing.Affect.CThing_Affect.mAffect_Bullet,true);
                     if(_loc2_)
                     {
                        if(_loc2_[§§constant(40)])
                        {
                           this[§§constant(5)][§§constant(41)] = _loc2_[§§constant(40)][§§constant(22)];
                           this[§§constant(5)][§§constant(42)] = _loc2_[§§constant(40)][§§constant(21)];
                        }
                     }
                     this[§§constant(31)][§§constant(32)][§§constant(46)][§§constant(47)](this,this[§§constant(12)],this[§§constant(5)],0.04,new eval("{")[§§constant(35)][§§constant(45)](this[§§constant(44)],this,this[§§constant(43)],this[§§constant(6)]));
                     this[§§constant(24)] = this[§§constant(48)];
                     this[§§constant(24)]();
                  }
                  break;
               }
               §§pop();
            }
            else if(eval("\x01") == 104)
            {
               set("\x01",eval("\x01") - 104);
            }
         }
      }
      return;
   }
}
§§pop()[§§pop()] = §§pop();
_loc2_[§§constant(48)] = function()
{
   this[§§constant(16)][§§constant(49)](0.75);
   this[§§constant(5)][§§constant(41)] += this[§§constant(16)][§§constant(41)] * 0.5;
   this[§§constant(5)][§§constant(42)] += this[§§constant(16)][§§constant(42)] * 0.5;
   this[§§constant(5)][§§constant(50)] += this[§§constant(16)][§§constant(50)] * 0.5;
   this[§§constant(12)][§§constant(41)] += this[§§constant(16)][§§constant(41)];
   this[§§constant(12)][§§constant(42)] += this[§§constant(16)][§§constant(42)];
   this[§§constant(12)][§§constant(50)] += this[§§constant(16)][§§constant(50)];
   if(--this[§§constant(15)] == 0)
   {
      this[§§constant(51)]();
   }
};
_loc2_[§§constant(52)] = function()
{
   var _loc3_ = this[§§constant(31)][§§constant(53)](this[§§constant(12)]);
   var _loc2_ = this[§§constant(31)][§§constant(53)](this[§§constant(5)]);
   eval(§§constant(55))[§§constant(56)][§§constant(52)](this[§§constant(31)][§§constant(54)],_loc3_,_loc2_,2,10053375,this[§§constant(23)] * 0.75);
};
_loc2_[§§constant(29)] = §§constant(4);
Thing.Shot.CThing_Shot_Railgun = function(tPosition, tAngle, tParent, tDamage, tRange)
{
   super(tPosition,tAngle,tParent,tDamage);
   tRange = tRange != undefined ? tRange : 10;
   this.mDestination = this.mPosition.Add(new Thing.Math.CThing_Position(1,0,0).RotateZ(this.mAngle.mAngle).Normalize(tRange));
   this.mMaxLife = this.mLife = 2;
   this.mDelta = new Thing.Math.CThing_Position(0,(random(4) + 2) / World.Map.CMap_Cell.mSize.x,(random(4) + 2) / World.Map.CMap_Cell.mSize.y).RotateZ(this.mAngle.mAngle);
   this.mAlpha = 75;
   this.Process = this.Process_Init;
}[§§constant(57)] = new eval(§§constant(58))[§§constant(59)][§§constant(60)]();
§§goto(addr06d5);
§§push(§§constant(61)(eval("{")[§§constant(3)][§§constant(4)][§§constant(27)],null,1));
