import Entity from "./Entity";
import AssetManager from "../Miscs/AssetManager";

export default class Environment extends Entity {

    private _width:number;
    get Width():number             {return this._width;}
    
    private _height:number;
    get Height():number             {return this._height;}

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager, stage, "environment");
        this._width = this._sprite.getBounds().width;
        this._height = this._sprite.getBounds().height;        
    }
}