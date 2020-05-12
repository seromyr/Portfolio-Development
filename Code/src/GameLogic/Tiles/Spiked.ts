import { TILE_SPIKED } from "../../Constants/Constants_Tiles";
import AssetManager from "../../Miscs/AssetManager";
import Tile from "./Tile";

export default class Spiked extends Tile {    

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager, stage, TILE_SPIKED);
        this._lethal = true;
    }
}