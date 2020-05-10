import { PLAYER_JUMPSPEED } from "../Constants/Constants_General";
import { TILE_TRAMPOLINE } from "../Constants/Constants_Tiles";
import AssetManager from "../Miscs/AssetManager";
import Tile from "./Tile";

export default class Trampoline extends Tile {    

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager, stage, TILE_TRAMPOLINE);
        this._jumpVelocityBoost = PLAYER_JUMPSPEED * 1.5;
    }

    public ActivateMe():void {
        this._sprite.gotoAndPlay("Trampoline/Active/Trampoline_Active");
        this._sprite.on("animationend", function() {
            this._sprite.gotoAndPlay("Trampoline/Idle/Trampoline_Idle");
        }, this, true);
    }
}