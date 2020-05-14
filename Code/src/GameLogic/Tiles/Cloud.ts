import { TILE_CLOUD } from "../../Constants/Constants_Tiles";
import AssetManager from "../../Miscs/AssetManager";
import Tile from "./Tile";

export default class Cloud extends Tile {    

    private _delay:number;
    private _interval:number;
    private _counter:number;

    constructor(assetManager:AssetManager, stage:createjs.StageGL, delay:number = 1000) {
        super(assetManager, stage, TILE_CLOUD);
        this._lethal = false;
        this._delay = delay;
        this._counter = 0;
    }
    
    public ActivateMe():void {
        // activate the window counter to change tile visual at a predefined interval
        // arrow function to fix the scoping problem
        this._interval = window.setInterval(() => {
            //console.log("this is " + this._counter);

            switch (this._counter) {
                case 0:
                    
                    this._sprite.gotoAndPlay("Cloud Disappear/Cloud_Disappear");
                    this._sprite.on("animationend", () => {
                        this._allowCollision = false;
                        this._sprite.alpha = 0;
                    }, this, true);
                    break;
                case 1:
                    this._allowCollision = true;
                    this._sprite.alpha = 1;
                    this._sprite.gotoAndPlay("Cloud Reappear/Cloud_Reappear");
                    this._sprite.on("animationend", () => {
                        this._sprite.gotoAndStop("Idle/Cloud_Idle");
                    }, this, true);
                    break;
            }

            this._counter++;            

            if (this._counter > 1) this._counter = 0;
        }, this._delay);
    }
    
}