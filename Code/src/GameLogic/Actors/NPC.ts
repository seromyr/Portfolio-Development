import { PLAYER_JUMPSPEED, ANCHOR } from "../../Constants/Constants_General";
import AssetManager from "../../Miscs/AssetManager";
import Character from "../Entity";
import Tile from "../Tiles/Tile";

export default class NPC extends Character {

    // player variables
    private _isGrounded:boolean;

    // jump mechanism variables
    private _jumpVelocity: number;
    get JumpSpeed():number       {return this._jumpVelocity;}
    set JumpSpeed(value:number)  {this._jumpVelocity = value;}
    private _jumpVelocityModifer:number;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {        
        super(assetManager, stage, "npc01");
        this.Jump = false;
        this._jumpVelocity = PLAYER_JUMPSPEED * 0.5;
        this._jumpVelocityModifer = 1;
    }

    public ShowMeIdling():void {        
        //Display character with looping animation
        super.ShowMe("VirtualGuy/Idle/VGuy_idle");
    }

    public ShowMeJumping():void {        
        //Display character with no looping animation
        super.ShowMe("VirtualGuy/Fall/VGuy_fall", false);
        this._isGrounded = false;
    }

    public Update():void {
        //if player touches the ground
        if (this._isGrounded && this.Jump) {
            this._isGrounded = false;
        }

        // if player is in mid-air and jumping
        else if (!this._isGrounded && this.Jump) {
            if (this.Y <= this.CurrentY) {

                if (this.Y < ANCHOR) {
                    this.Y = ANCHOR - 1;
                    //console.log(this._jumpVelocity);
                }

                if (this._jumpVelocity < PLAYER_JUMPSPEED * 0.3)
                {
                    this._jumpVelocityModifer = 0.3;
                }

                else this._jumpVelocityModifer = 1;
                this._jumpVelocity -= this._jumpVelocityModifer;
                this.Y -= this._jumpVelocity;

                // when jump velocity reaches minimum, player starts falling down
                if (this._jumpVelocity <= 0) {
                    //slowly fall down
                    this._jumpVelocity = PLAYER_JUMPSPEED * 0.3;
                    this._sprite.gotoAndPlay("VirtualGuy/Fall/VGuy_fall");
                    this.Jump = false;
                }
            }
        }

        // if player is in mid-air and falling
        else if (!this._isGrounded && !this.Jump){            
            //player is constantly falling when not colliding with any tile
            this._jumpVelocityModifer = 0.1;
            this._jumpVelocity += this._jumpVelocityModifer;
            // increase jump velocity acceleration 
            if (this._jumpVelocity > PLAYER_JUMPSPEED * 0.5) {
                this._jumpVelocity += 0.2;
            }
            
            this.Y += this._jumpVelocity;
        }
    }    
    
    public CollisionCheckWithTiles(tile:Tile[]):void {        
        for (let i:number = 0; i < tile.length; i++) {
            //if player collides with a tile
            if (this.X >= tile[i].X - 24 && this.X <= tile[i].X + tile[i].Width + 24) {
                if (this.Y >= tile[i].Y && this.Y < tile[i].Y + tile[i].Height) {
                    //console.log(`landed on a ${tile[i].Name} tile`);

                    this._isGrounded = true;
                    this.Jump = true;
                    this.Y = this.CurrentY = tile[i].Y;
                    this._sprite.gotoAndPlay("VirtualGuy/Jump/VGuy_jump");
                    this._jumpVelocity = PLAYER_JUMPSPEED * 0.5;
                    this._jumpVelocityModifer = 0.3;
                }
            }
            else {
                this._isGrounded = false;
            }
        }
    }

    // flip
    public FlipMeOver(side:string):void {
        switch (side) {
            case "left":
                this._sprite.scaleX = -1;
                break;
            case "right":
                this._sprite.scaleX = 1;
                break;
        }
    }
}

