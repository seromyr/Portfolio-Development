import Entity from "../Entity";
import AssetManager from "../../Miscs/AssetManager";
import { PLAYER_JUMPSPEED } from "../../Constants/Constants_General";

export default class Tile extends Entity {

    protected _width:number;
    get Width():number {return this._width;}
    
    protected _height:number;
    get Height():number {return this._height;}

    // gameplay variables
    protected _lethal:boolean;
    get Lethal():boolean {return this._lethal;}

    protected _jumpVelocityBoost:number;
    get JumpVelocityBoost():number {return this._jumpVelocityBoost;}

    constructor(assetManager:AssetManager, stage:createjs.StageGL, type:string) {
        super(assetManager, stage, type);
        this._width = this._sprite.getBounds().width;
        this._height = this._sprite.getBounds().height;
        this._lethal = false;
        this._jumpVelocityBoost = PLAYER_JUMPSPEED;
    }
}