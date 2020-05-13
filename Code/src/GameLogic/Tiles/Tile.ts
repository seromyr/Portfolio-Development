import Entity from "../Entity";
import AssetManager from "../../Miscs/AssetManager";
import { PLAYER_JUMPSPEED, STAGE_WIDTH } from "../../Constants/Constants_General";

export default class Tile extends Entity {

    protected _allowCollision:boolean;
    get CollisionPermission():boolean {return this._allowCollision;}    

    // gameplay variables
    protected _lethal:boolean;
    get Lethal():boolean {return this._lethal;}

    protected _jumpVelocityBoost:number;
    get JumpVelocityBoost():number {return this._jumpVelocityBoost;}

    protected _isMoving:boolean;
    get IsMoving():boolean {return this._isMoving;}
    set IsMoving(value:boolean) {this._isMoving = value;}

    private _tileSpeed:number;
    get Speed():number {return this._tileSpeed;}

    constructor(assetManager:AssetManager, stage:createjs.StageGL, type:string) {
        super(assetManager, stage, type);
 
        this._allowCollision = true;
        this._lethal = false;
        this._jumpVelocityBoost = PLAYER_JUMPSPEED;
        this._isMoving = false;
        this._tileSpeed = 0;
    }

    public SetMotion(speed:number):void {
        this._tileSpeed = speed;

        // determine which side this tile is staying closer to then moving towards it
        if (this.X > STAGE_WIDTH - this.X) {
            this._tileSpeed = Math.abs(speed);
        } else this._tileSpeed = - Math.abs(speed);
    }

    public MoveMe():void {        
        if (this._isMoving) {
            this.X += this._tileSpeed;

            if (this.X <= 1) this._tileSpeed = Math.abs(this._tileSpeed);
            else if (this.X >= STAGE_WIDTH - this.Width) this._tileSpeed = - Math.abs(this._tileSpeed);
        }  
    }
}