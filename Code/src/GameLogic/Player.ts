import Character from "./Entity";
import AssetManager from "../Miscs/AssetManager";
import { PLAYER_JUMPSPEED } from "../Constants";

export default class Player extends Character {

    private _jumpHeight:number;
    private _jumpSpeed:number
    private _up:boolean;
     

    get JumpHeight():number           {return this._jumpHeight;}
    set JumpHeight(value:number)      {this._jumpHeight = value;}

    get JumpSpeed():number           {return this._jumpSpeed;}
    set JumpSpeed(value:number)      {this._jumpSpeed = value;}

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        
        super(assetManager, stage, "mainChar");

    }

    public ShowMeIdling():void {
        
        //Display with idle animation
        super.ShowMe("VirtualGuy/Idle/VGuy_idle");
        // console.log(this._sprite.x);
        // console.log(this._sprite.y);

    }

    public ShowMeJumping():void {
        
        //Display with idle animation
        super.ShowMe("VirtualGuy/Jump/VGuy_jump", false);
        this._up = true;
        //this.Jump = true;
        // console.log(this._sprite.x);
        // console.log(this._sprite.y);

    }

    public Update():void {
        
        if (this.Jump) {
            //console.log(this._jumpSpeed)

            if (this._up && this.Y >= this.CurrentY - this._jumpHeight) {
                this._jumpSpeed++;
                this.Y -= Math.cos(this._jumpSpeed) + this._jumpSpeed;
                
                if (this.Y <= this.CurrentY - this._jumpHeight) {
                    this._up = false;
                    this._sprite.gotoAndPlay("VirtualGuy/Fall/VGuy_fall");
                    //console.log("reach max height");
                    this._jumpSpeed = PLAYER_JUMPSPEED;
                }
            }

           else {
                this._jumpSpeed += this._jumpSpeed * 0.01 + 1;                
                this.Y += this.JumpSpeed * 0.3;
                
                if (this.Y >= this.CurrentY) {
                    this.Y = this.CurrentY;
                    this._up = true;
                    this._sprite.gotoAndPlay("VirtualGuy/Jump/VGuy_jump");
                    this._jumpSpeed = PLAYER_JUMPSPEED;
                }
            }         
        }
    }
}
