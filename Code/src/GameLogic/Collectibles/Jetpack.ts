import { PLAYER_JUMPSPEED } from "../../Constants/Constants_General";
import { ITEM_JETPACK } from "../../Constants/Constants_Collectibles";
import AssetManager from "../../Miscs/AssetManager";
import Tile from "../Tiles/Tile";

export default class JetPack extends Tile {    

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager, stage, ITEM_JETPACK);
        this._jumpVelocityBoost = PLAYER_JUMPSPEED * 5;
    }

    public FlyMe():void {
        this._sprite.alpha = 0;
    }

    public ReEnableMe():void {
        this._sprite.alpha = 1;
    }
}