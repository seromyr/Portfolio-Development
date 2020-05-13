import { TILE_BREAKABLE } from "../../Constants/Constants_Tiles";
import AssetManager from "../../Miscs/AssetManager";
import Tile from "./Tile";

export default class Breakable extends Tile {

    private _hit:number;
    set Hit(value:number) {this._hit = value;}
    
    private _once:boolean;
    get Once():boolean {return this._once;}

    constructor(assetManager:AssetManager, stage:createjs.StageGL, once:boolean) {
        super(assetManager, stage, TILE_BREAKABLE);
        this._hit = 3;
        this._allowCollision = true;
        this._once = once;
    }
    
    public BreakMe():void {

        this._hit--; 
        
        switch (this._hit) {
            case 3:
                this._sprite.gotoAndStop("Stone/Stone_Idle 01");
                break;
                    case 2:
                        this._sprite.gotoAndStop("Stone/Stone_Idle 02");
                        break;
                        case 1:
                            this._sprite.gotoAndStop("Stone/Stone_Idle 03");
                            break;
                            case 0:
                                this._allowCollision = false;
                                this.HideMe();
                                break;
        }
    }

    public BreakMeNow():void {

        this._sprite.gotoAndPlay("Bubble/ExplodeB/Bubble_Explode_b");

        this._sprite.on("animationend", function() {
            this._allowCollision = false;
            this.HideMe();
        }, this, true);
    }

    public ReActivateMe():void {
        this._allowCollision = true;
    }
}