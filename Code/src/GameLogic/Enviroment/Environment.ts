import Entity from "../Entity";
import AssetManager from "../../Miscs/AssetManager";

export default class Environment extends Entity {

    constructor(assetManager:AssetManager, stage:createjs.StageGL, bkgGroup:string) {
        super(assetManager, stage, bkgGroup);
    }
}