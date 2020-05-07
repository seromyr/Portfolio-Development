import { PLAYER_JUMPSPEED, PLAYER_JUMPHEIGHT } from "../Constants";
import AssetManager from "../Miscs/AssetManager";
import Character from "./Entity";
import Tile from "./Tile";

export default class Player extends Character {

    // player variables
    private _jumpHeight:number;
    get JumpHeight():number      {return this._jumpHeight;}
    set JumpHeight(value:number) {this._jumpHeight = value;}
    
    private _jumpSpeed:number
    get JumpSpeed():number       {return this._jumpSpeed;}
    set JumpSpeed(value:number)  {this._jumpSpeed = value;}
    
    private _isGrounded:boolean;
    private _jumpDelay:number = 500;
    private _jumpTimer:number;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        
        super(assetManager, stage, "mainChar");
        this.JumpHeight = PLAYER_JUMPHEIGHT;
        this.JumpSpeed = PLAYER_JUMPSPEED;
        this.Jump = false;
    }

    public ShowMeIdling():void {        
        //Display character with looping animation
        //super.ShowMe("VirtualGuy/Idle/VGuy_idle");
        super.ShowMe("Dazzle/Dazzle Idle/Dazzle_Idle");
        // console.log(this._sprite.x);
        // console.log(this._sprite.y);

    }

    public ShowMeJumping():void {
        
        //Display character with no looping animation
        //super.ShowMe("VirtualGuy/Fall/VGuy_fall", false);
        super.ShowMe("Dazzle/Dazzle Jump/Dazzle_Jump", false);
        this._isGrounded = false;
        //this._jumpTimer = window.setInterval(,this._jumpDelay);
        // console.log(this._sprite.x);
        // console.log(this._sprite.y);

    }

    public Update():void {
        //if player touches the ground
        if (this._isGrounded && this.Jump) {

            this.Y -= this.JumpSpeed;
            this._isGrounded = false;
        }

        // if player is in mid-air and jumping
        else if (!this._isGrounded && this.Jump) {
            if (this.Y <= this.CurrentY) {

                this._jumpSpeed++;
                this.Y -= Math.sin(this._jumpSpeed) + this._jumpSpeed;
    
                // when player reaches max jump height, starts falling down
                if (this.Y < this.CurrentY - this._jumpHeight) {
                    this._jumpSpeed = PLAYER_JUMPSPEED;
                    this.Y = this.CurrentY - this._jumpHeight
                    //this._sprite.gotoAndPlay("VirtualGuy/Fall/VGuy_fall");
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
                    this.Jump = false;
                }
            }
        }


        // if player is in mid-air and falling
        else if (!this._isGrounded && !this.Jump){            
            //player is constantly falling when not colliding with any tile
            // this._sprite.gotoAndPlay("VirtualGuy/Fall/VGuy_fall");
            this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
            this._jumpSpeed += this._jumpSpeed * 0.01 + 1;
            this.Y += this.JumpSpeed * 0.3;
            console.log("falling");
        }   
    }

    public CollisionCheckWithTiles(tile:Tile[]):void {        
        for (let i:number = 0; i < tile.length; i++) {
            //if player collides with a tile
            if (this.X >= tile[i].X && this.X <= tile[i].X + tile[i].Width) {
                if (this.Y >= tile[i].Y && this.Y < tile[i].Y + tile[i].Height) {
                    console.log(`landed on a ${tile[i].Name} tile`);
                    //this.screen.dispatchEvent(this.playerCollision);
                    this._isGrounded = true;
                    this.Jump = true;
                    this.Y = this.CurrentY = tile[i].Y;
                    // this._sprite.gotoAndPlay("VirtualGuy/Jump/VGuy_jump");
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
                    this._jumpSpeed = PLAYER_JUMPSPEED;
                }
            }

            else {
                this._isGrounded = false;
            }
        }
    }

    // collision check with a single tile
    public CollisionCheckWithATile(tile:Tile):void {
        //if player collides with a tile while falling down
        if (this.X >= tile.X && this.X <= tile.X + tile.Width) {
            if (this.Y >= tile.Y && this.Y < tile.Y + tile.Height) {
                console.log(`landed on a ${tile.Name} tile`);
                //this.screen.dispatchEvent(this.playerCollision);
                this._isGrounded = true;
                this.Jump = true;
                this.Y = this.CurrentY = tile.Y;
                // this._sprite.gotoAndPlay("VirtualGuy/Jump/VGuy_jump");
                this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
                this._jumpSpeed = PLAYER_JUMPSPEED;
            }
        }
        else {
            this._isGrounded = false;
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

