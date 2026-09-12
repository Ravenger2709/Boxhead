function §\x01\x02§()
{
   return 1899;
}
var §\x01§ = -1322 + "\x01\x02"();
var _loc2_;
while(true)
{
   if(eval("\x01") == 577)
   {
      set("\x01",eval("\x01") - 344);
      §§push(true);
   }
   else if(eval("\x01") == 178)
   {
      set("\x01",eval("\x01") + 364);
      §§push("\x0f");
      §§push(1);
   }
   else
   {
      if(eval("\x01") == 472)
      {
         set("\x01",eval("\x01") + 421);
         §§push(§§pop()[§§pop() >>> (§§pop() | §§pop() << new §§pop()[§§pop()]())]);
         break;
      }
      if(eval("\x01") == 395)
      {
         set("\x01",eval("\x01") - 217);
      }
      else if(eval("\x01") == 753)
      {
         set("\x01",eval("\x01") - 575);
      }
      else if(eval("\x01") == 417)
      {
         set("\x01",eval("\x01") - 368);
         §§push(true);
      }
      else
      {
         if(eval("\x01") == 372)
         {
            set("\x01",eval("\x01") + 381);
            break;
         }
         if(eval("\x01") == 493)
         {
            set("\x01",eval("\x01") + 405);
            §§push(true);
         }
         else if(eval("\x01") == 989)
         {
            set("\x01",eval("\x01") - 492);
            §§push(!§§pop());
         }
         else if(eval("\x01") == 893)
         {
            set("\x01",eval("\x01") - 400);
         }
         else if(eval("\x01") == 49)
         {
            set("\x01",eval("\x01") + 323);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 381);
            }
         }
         else if(eval("\x01") == 542)
         {
            set("\x01",eval("\x01") + 331);
            var §§pop() = §§pop();
         }
         else if(eval("\x01") == 292)
         {
            set("\x01",eval("\x01") + 125);
         }
         else if(eval("\x01") == 521)
         {
            set("\x01",eval("\x01") - 28);
         }
         else if(eval("\x01") == 873)
         {
            set("\x01",eval("\x01") - 235);
            §§push("\x0f");
         }
         else if(eval("\x01") == 233)
         {
            set("\x01",eval("\x01") + 239);
            if(§§pop())
            {
               set("\x01",eval("\x01") + 421);
            }
         }
         else if(eval("\x01") == 692)
         {
            set("\x01",eval("\x01") - 25);
         }
         else if(eval("\x01") == 898)
         {
            set("\x01",eval("\x01") - 167);
            if(§§pop())
            {
               set("\x01",eval("\x01") - 47);
            }
         }
         else
         {
            if(eval("\x01") == 731)
            {
               set("\x01",eval("\x01") - 47);
               break;
            }
            if(eval("\x01") == 638)
            {
               set("\x01",eval("\x01") + 351);
               §§push(eval(§§pop()));
            }
            else if(eval("\x01") == 497)
            {
               set("\x01",eval("\x01") + 195);
               if(§§pop())
               {
                  set("\x01",eval("\x01") - 25);
               }
            }
            else
            {
               if(eval("\x01") == 667)
               {
                  set("\x01",eval("\x01") - 216);
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
                  if(!_global.Thing.Effect.CThing_Effect_SmartBomb)
                  {
                     Thing.Effect.CThing_Effect_SmartBomb extends Thing.Effect.CThing_Effect;
                     _loc2_ = Thing.Effect.CThing_Effect_SmartBomb = function(tPosition, tAngle, tParent, tLife)
                     {
                        super(tPosition,tAngle,tParent);
                        this.mLife = tLife != undefined ? tLife : 10;
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
                     _loc2_.Process_Init = function()
                     {
                        this.mWorld.mMap.mMapwho.MoveThing(this);
                        this.Process = this.Process_Normal;
                        this.Process();
                     };
                     _loc2_.Process_Normal = function()
                     {
                        this.Delete();
                     };
                     _loc2_.Draw = function()
                     {
                     };
                     _loc2_._CLASSID_ = "CThing_Effect_SmartBomb";
                     §§push(ASSetPropFlags(Thing.Effect.CThing_Effect_SmartBomb.prototype,null,1));
                  }
                  §§pop();
                  break;
               }
               if(eval("\x01") != 684)
               {
                  if(eval("\x01") == 451)
                  {
                     set("\x01",eval("\x01") - 451);
                  }
                  break;
               }
               set("\x01",eval("\x01") - 267);
            }
         }
      }
   }
}
