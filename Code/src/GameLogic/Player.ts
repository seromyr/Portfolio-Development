import { PLAYER_JUMPSPEED, PLAYER_JUMPHEIGHT, STAGE_HEIGHT, ANCHOR } from "../Constants";
import AssetManager from "../Miscs/AssetManager";
import Character from "./Entity";
import Tile from "./Tile";
import Trap from "./Trap";

export default class Player extends Character {

    // player variables
    private _jumpHeight:number;
    get JumpHeight():number      {return this._jumpHeight;}
    set JumpHeight(value:number) {this._jumpHeight = value;}
    
    private _jumpSpeed:number
    get JumpSpeed():number       {return this._jumpSpeed;}
    set JumpSpeed(value:number)  {this._jumpSpeed = value;}
    
    private _isGrounded:boolean;

    //height difference of a tile
    private heightDiff:number;
    get HeightDiff():number {return this.heightDiff;}


    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        
        super(assetManager, stage, "mainChar");
        this.JumpHeight = PLAYER_JUMPHEIGHT;
        this.JumpSpeed = PLAYER_JUMPSPEED;
        this.Jump = false;
    }

    public ShowMeIdling():void {        
        //Display character with looping animation
        super.ShowMe("Dazzle/Dazzle Idle/Dazzle_Idle");
        // console.log(this._sprite.x);
        // console.log(this._sprite.y);

    }

    public ShowMeJumping():void {
        
        //Display character with no looping animation
        super.ShowMe("Dazzle/Dazzle Jump/Dazzle_Jump", false);
        this._isGrounded = false;
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
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
                    this.Jump = false;
                }
            }
        }

        // if player is in mid-air and falling
        else if (!this._isGrounded && !this.Jump){            
            //player is constantly falling when not colliding with any tile
            this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
            this._jumpSpeed += this._jumpSpeed * 0.01 + 1;
            this.Y += this.JumpSpeed * 0.3;
            //console.log("falling");
        }   
    }

    public CollisionCheckWithTiles(tile:Tile[]):void {        
        for (let i:number = 0; i < tile.length; i++) {
            //if player collides with a tile
            if (this.X >= tile[i].X - 4 && this.X <= tile[i].X + tile[i].Width + 4) {
                if (this.Y >= tile[i].Y && this.Y < tile[i].Y + tile[i].Height) {
                    console.log(`landed on a ${tile[i].Name} tile`);

                    // get height diff between tile and anchor to shift tile correctly
                    if (tile[i].Y >= ANCHOR) {
                        this.heightDiff = this._sprite.getBounds().height - tile[i].Height;
                    }
                    else {
                        this.heightDiff = this._sprite.getBounds().height + tile[i].Height
                    }

                    this._isGrounded = true;
                    this.Jump = true;
                    this.Y = this.CurrentY = tile[i].Y;
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
        if (this.X >= tile.X - 4 && this.X <= tile.X + tile.Width + 4) {
            if (this.Y >= tile.Y && this.Y < tile.Y + tile.Height) {
                console.log(`landed on a ${tile.Name} tile`);

                // get height diff between tile and anchor to shift tile correctly
                if (tile.Y >= ANCHOR) {
                    this.heightDiff = this._sprite.getBounds().height - tile.Height;
                }
                else {
                    this.heightDiff = this._sprite.getBounds().height + tile.Height
                }

                this._isGrounded = true;
                this.Jump = true;
                this.Y = this.CurrentY = tile.Y;
                this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
                this._jumpSpeed = PLAYER_JUMPSPEED;
            }
        }
        else {
            this._isGrounded = false;
        }
    }

    // flip player sprite
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

    // collision check with a trap (trampoline in test)
    public CollisionCheckWithATrampoline(tile:Trap):void {
        //if player collides with a tile while falling down
        if (this.X >= tile.X - 16 && this.X <= tile.X + tile.Width + 16) {
            if (this.Y >= tile.Y && this.Y < tile.Y + tile.Height) {
                console.log(`landed on a ${tile.Name} tile`);

                this._isGrounded = true;
                this.Jump = true;
                this.Y = this.CurrentY = tile.Y;
                this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
                this._jumpSpeed = PLAYER_JUMPSPEED;
                
                tile.ActivateMe();
                this._jumpHeight = PLAYER_JUMPHEIGHT * 3;
                this._jumpSpeed = PLAYER_JUMPSPEED * 3;
                //tile.ShowMe("Trampoline/Active/Trampoline_Active", true);
                
            }
        }
        else {
            this._isGrounded = false;
            this._jumpHeight = PLAYER_JUMPHEIGHT;
            //this._jumpSpeed = PLAYER_JUMPSPEED;
        }
    }
}

