import { PLAYER_JUMPSPEED } from "../../Constants/Constants_General";
import { TILE_TRAMPOLINE } from "../../Constants/Constants_Tiles";
import AssetManager from "../../Miscs/AssetManager";
import Tile from "./Tile";

export default class Trampoline extends Tile {    

    private _type:number;
    get Type():number {return this._type;}
    set Type(value:number) {this._type = value;}

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager, stage, TILE_TRAMPOLINE);
        this._jumpVelocityBoost = PLAYER_JUMPSPEED * 1.5;
        this._type = 1;
    }

    public ActivateMe():void {

        if (this._type == 1) {
            this._sprite.gotoAndPlay("Jellyfish/Bounce/Jellyfish_Bounce");
            this._sprite.on("animationend", function() {
            this._sprite.gotoAndPlay("Jellyfish/Jellyfish_Idle");
        }, this, true);
        }

        else if (this._type == 2) {
            this._sprite.gotoAndPlay("Leaves/Bounce/Leaves_Bounce");
            this._sprite.on("animationend", function() {
                this._sprite.gotoAndPlay("Leaves/Leaves_Idle");
            }, this, true);
        }

        else {
            this._sprite.gotoAndPlay("Alien/Bounce/Alien_Bounce");
            this._sprite.on("animationend", function() {
            this._sprite.gotoAndPlay("Alien/Alien_Idle");
        }, this, true);
        }
        
    }
}