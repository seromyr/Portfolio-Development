import { PLAYER_JUMPSPEED, ANCHOR } from "../Constants/Constants_General";
import AssetManager from "../Miscs/AssetManager";
import Character from "./Entity";
import Tile from "./Tile";
import Trampoline from "./Trampoline";

export default class Player extends Character {

    // player variables    
    private _isGrounded:boolean;

    // new jump mechanism
    private _jumpVelocity: number;
    get JumpSpeed():number       {return this._jumpVelocity;}
    set JumpSpeed(value:number)  {this._jumpVelocity = value;}
    //private _jumpMaxVelocity:number;


    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        
        super(assetManager, stage, "mainChar");
        this.Jump = false;

        //new jump
        this._jumpVelocity = PLAYER_JUMPSPEED;
        //this._jumpMaxVelocity = 7;
    }

    public Update():void {
        //if player touches the ground
        if (this._isGrounded && this.Jump) {
            this._isGrounded = false;
        }

        // if player is in mid-air and jumping
        else if (!this._isGrounded && this.Jump) {
            if (this.Y <= this.CurrentY) {

                // if the distance difference between player CurrentY and MiddleScreen < Max Jump Height
                // let player jump normal

                this._jumpVelocity -= 0.2;
                // decrease jump velocity deacceleration 
                if (this._jumpVelocity < PLAYER_JUMPSPEED * 0.5) {
                    this._jumpVelocity -= 0.1;
                }
                
                this.Y -= this._jumpVelocity;                

                // when jump velocity reaches 0, player starts falling down
                if (this._jumpVelocity < 0) {
                    //slowly fall down
                    this._jumpVelocity = PLAYER_JUMPSPEED * 0.5;
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Fall");
                    this.Jump = false;
                }
            }
        }

        // if player is in mid-air and falling
        else if (!this._isGrounded && !this.Jump){            
            //player is constantly falling when not colliding with any tile
            this._jumpVelocity += 0.1;
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
            if (this.X >= tile[i].X - 4 && this.X <= tile[i].X + tile[i].Width + 4) {
                if (this.Y >= tile[i].Y && this.Y < tile[i].Y + tile[i].Height) {
                    console.log(`landed on a ${tile[i].Name} tile`);

                    this._isGrounded = true;
                    this.Jump = true;
                    this.Y = this.CurrentY = tile[i].Y;
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Up");
                    this._jumpVelocity = PLAYER_JUMPSPEED;
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

                this._isGrounded = true;
                this.Jump = true;
                this.Y = this.CurrentY = tile.Y;
                this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Up");
                this._jumpVelocity = PLAYER_JUMPSPEED;
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
    public CollisionCheckWithTrampolines(trampoline:Trampoline[]):void {
        for (let i:number = 0; i < trampoline.length; i++) {
            //if player collides with a tile while falling down
            if (this.X >= trampoline[i].X - 24 && this.X <= trampoline[i].X + 24) {
                if (this.Y >= trampoline[i].Y && this.Y < trampoline[i].Y + trampoline[i].Height) {
                    console.log(`landed on a ${trampoline[i].Name}`);

                    this._isGrounded = true;
                    this.Jump = true;
                    this.Y = this.CurrentY = trampoline[i].Y;
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Up");
                    
                    trampoline[i].ActivateMe();
                    this._jumpVelocity = trampoline[i].JumpVelocityBoost;
                }
            }
            else {
                this._isGrounded = false;
            }
        }        
    }
}

