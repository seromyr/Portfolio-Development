import Entity from "./Entity";
import AssetManager from "../Miscs/AssetManager";

export default class Tile extends Entity {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager, stage, "tiles");
    }

    public ShowMe():void {
        
        //Display tile sprite
        super.ShowMe("Golden");
        
    }

}