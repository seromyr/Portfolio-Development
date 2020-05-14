import AssetManager from "../../Miscs/AssetManager";
import Environment from "./Environment";
import { ENV_OCEAN, ENV_SURFACE, ENV_SPACE } from "../../Constants/Constants_Environment";
import { STAGE_HEIGHT } from "../../Constants/Constants_General";

export default class GameWorld {

    // underwater backgrounds
    private bgOcean:Environment;
    private bgOceanFloor:Environment;
    private bgOceanLeft:Environment;
    private bgOceanRight:Environment;

    // surface backgrounds
    private bgSurface:Environment;
    private bgSurfaceSky:Environment;
    private bgSurfaceClouds:Environment;

    // space backgrounds
    private bgMoon:Environment;
    private bgPlanets:Environment;
    private bgAsteroids:Environment;

    constructor (assetManager:AssetManager, stage:createjs.StageGL) {

       this.bgOcean         = new Environment(assetManager, stage, ENV_OCEAN);
       this.bgOceanFloor    = new Environment(assetManager, stage, ENV_OCEAN);
       this.bgOceanLeft     = new Environment(assetManager, stage, ENV_OCEAN);
       this.bgOceanRight    = new Environment(assetManager, stage, ENV_OCEAN);

       this.bgSurface       = new Environment(assetManager, stage, ENV_SURFACE);
       this.bgSurfaceSky    = new Environment(assetManager, stage, ENV_SURFACE);
       this.bgSurfaceClouds = new Environment(assetManager, stage, ENV_SURFACE);

       this.bgMoon          = new Environment(assetManager, stage, ENV_SPACE);
       this.bgPlanets       = new Environment(assetManager, stage, ENV_SPACE);
       this.bgAsteroids     = new Environment(assetManager, stage, ENV_SPACE);
    }

    public ShowMe():void {
        this.bgOcean.ShowMe("Ocean Floor (first background)/Blue");
        this.bgOcean.X = 0;
        this.bgOcean.Y = 0;
        
        this.bgOceanLeft.ShowMe("Ocean Floor (first background)/Coral");
        this.bgOceanLeft.X = 0;
        this.bgOceanLeft.Y = 0;
        
        this.bgOceanRight.ShowMe("Ocean Floor (first background)/Seaweed");
        this.bgOceanRight.X = 0;
        this.bgOceanRight.Y = 0;

        this.bgOceanFloor.ShowMe("Ocean Floor (first background)/Shells");
        this.bgOceanFloor.X = 0;
        this.bgOceanFloor.Y = 0;
        // ---------------------------------------------------------------------- 
        this.bgSurfaceSky.ShowMe("Ocean Surface (second background)/Sky");
        this.bgSurfaceSky.X = 0;
        this.bgSurfaceSky.Y = - STAGE_HEIGHT;
        
        this.bgSurfaceClouds.ShowMe("Ocean Surface (second background)/Clouds");
        this.bgSurfaceClouds.X = 0;
        this.bgSurfaceClouds.Y = - STAGE_HEIGHT ;
        
        this.bgSurface.ShowMe("Ocean Surface (second background)/Water");
        this.bgSurface.X = 0;
        this.bgSurface.Y = - STAGE_HEIGHT;
        // ----------------------------------------------------------------------
        this.bgMoon.ShowMe("Space (third background)/Moon");
        this.bgMoon.X = 0;
        this.bgMoon.Y = - STAGE_HEIGHT * 2;

        this.bgAsteroids.ShowMe("Space (third background)/Asteroids");
        this.bgAsteroids.X = 0;
        this.bgAsteroids.Y = - STAGE_HEIGHT * 2;

        this.bgPlanets.ShowMe("Space (third background)/Planets");
        this.bgPlanets.X = 0;
        this.bgPlanets.Y = - STAGE_HEIGHT * 2;

    }


    public UpdateMe(speed:number):void {
        // create a parallax effect

        this.bgOcean.Y          += speed *  0.05; //0.05;
        this.bgOceanLeft.Y      += speed *  0.2;   //0.2;
        this.bgOceanRight.Y     += speed *  0.3; //0.3;
        this.bgOceanFloor.Y     += speed *  0.4  //0.4;

        // wait until ocean group moved of the screen
        if (this.bgOcean.Y == STAGE_HEIGHT) {

            this.bgOcean.HideMe();
            this.bgOceanLeft.HideMe();
            this.bgOceanRight.HideMe();
            this.bgOceanFloor.HideMe();

            this.bgSurfaceSky.Y     += speed * 0.05;
            this.bgSurfaceClouds.Y  += speed * 0.3;
            this.bgSurface.Y        += speed * 0.4;

        } else {

            this.bgSurfaceSky.Y     += speed * 0.05;
            this.bgSurfaceClouds.Y  += speed * 0.05;
            this.bgSurface.Y        += speed * 0.05;
        }

        // wait until surface group moved out of the screen
        if (this.bgSurface.Y == STAGE_HEIGHT) {

            this.bgSurface.HideMe();
            this.bgSurfaceClouds.HideMe();
            this.bgSurfaceSky.HideMe();

            this.bgMoon.Y           += speed * 0.05;
            this.bgPlanets.Y        += speed * 0.3;  
            this.bgAsteroids.Y      += speed * 0.4;
        } else {

            this.bgMoon.Y           += speed * 0.05;
            this.bgPlanets.Y        += speed * 0.05;  
            this.bgAsteroids.Y      += speed * 0.05;
        }

        // space group never goes out screen
        if (this.bgMoon.Y >= 0) {
            this.bgMoon.Y = 0;
        }

        if (this.bgPlanets.Y >= 0) {
            this.bgPlanets.Y = 0;
        }

        if (this.bgAsteroids.Y >= 0) {
            this.bgPlanets.Y = 0;
        }
        
    }
}