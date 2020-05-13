import { PLAYER_JUMPSPEED, ANCHOR } from "../../Constants/Constants_General";
import AssetManager from "../../Miscs/AssetManager";
import Entity from "../Entity";
import Tile from "../Tiles/Tile";
import Trampoline from "../Tiles/Trampoline";
import Breakable from "../Tiles/Breakable";
import JetPack from "../Collectibles/Jetpack";

export default class Player extends Entity {

    // player variables    
    private _isGrounded:boolean;

    // jump mechanism variables
    private _jumpVelocity: number;
    get JumpSpeed():number       {return this._jumpVelocity;}
    set JumpSpeed(value:number)  {this._jumpVelocity = value;}
    private _jumpVelocityModifer:number;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {        
        super(assetManager, stage, "mainChar");
        this.Jump = false;
        this._jumpVelocity = PLAYER_JUMPSPEED;
        this._jumpVelocityModifer = 1;
    }

    public Update():void {
        console.log(this.Y);
        console.log("velocity: " + this._jumpVelocity);
        console.log("velo mod: " + this._jumpVelocityModifer);
        this._jumpVelocity -= this._jumpVelocityModifer;
        //this.Y -= this._jumpVelocity;
        this.Y--;
        //if player touches the ground
        if (this._isGrounded && this.Jump) {
            this._isGrounded = false;

        }

        else if (this._isGrounded && !this.Jump) {

        }

        // if player is in mid-air and jumping
        else if (!this._isGrounded && this.Jump) {
            if (this.Y <= this.CurrentY) {

                if (this.Y < ANCHOR) {
                    this.Y = ANCHOR;
                    //console.log(this._jumpVelocity);
                }

                if (this._jumpVelocity < PLAYER_JUMPSPEED * 0.3) {
                    this._jumpVelocityModifer = 0.5;
                }

                else  {
                    this._jumpVelocityModifer = 1;
                }

                //this._jumpVelocity -= this._jumpVelocityModifer;
                this.Y -= this._jumpVelocity;

                
                // when jump velocity reaches minimum, player starts falling down
                if (this._jumpVelocity <= 0) {
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
            this._jumpVelocityModifer = 0.5;
            this._jumpVelocity += this._jumpVelocityModifer;
            // increase jump velocity acceleration 
            // if (this._jumpVelocity > PLAYER_JUMPSPEED * 0.5) {
            //     this._jumpVelocity += 0.5;
            //     //this._jumpVelocityModifer = 0.5;
            // }
            
            this.Y += this._jumpVelocity;
        }
    }

    public CollisionCheckWithTiles(tile:Tile[]):void {        
        for (let i:number = 0; i < tile.length; i++) {
           if (tile[i].CollisionPermission) {
                //if player collides with a tile
                if (this.X >= tile[i].X - 16 && this.X <= tile[i].X + tile[i].Width + 16) {
                    if (this.Y >= tile[i].Y && this.Y < tile[i].Y + tile[i].Height) {

                        //console.log(`landed on a ${tile[i].Name} tile`);

                        if (tile[i].Lethal) {
                            this.Alive = false;
                        }

                        this._isGrounded = true;
                        this.Jump = true;
                        this.Y = this.CurrentY = tile[i].Y;
                        this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Up");
                        this._jumpVelocity = PLAYER_JUMPSPEED;
                        this._jumpVelocityModifer = 1;
                    }
                }
                else {
                    this._isGrounded = false;
                }
            }
        }
    }
    
    // collision check with a trampoline
    public CollisionCheckWithTrampolines(trampoline:Trampoline[]):void {
        for (let i:number = 0; i < trampoline.length; i++) {
            //if player collides with a tile while falling down
            if (this.X >= trampoline[i].X - 52 && this.X <= trampoline[i].X + 52) {
                if (this.Y >= trampoline[i].Y && this.Y < trampoline[i].Y + trampoline[i].Height) {
                    //console.log(`landed on a ${trampoline[i].Name}`);

                    this._isGrounded = true;
                    this.Jump = true;
                    this.Y = this.CurrentY = trampoline[i].Y;
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Up");
                    
                    trampoline[i].ActivateMe();
                    this._jumpVelocity = trampoline[i].JumpVelocityBoost;
                    this._jumpVelocityModifer = 1;
                }
            }
            else {
                this._isGrounded = false;
            }
        }
    }

    // collision check with a trampoline
    public CollisionCheckWithBreakables(tileset:Breakable[]):void {
        for (let i:number = 0; i < tileset.length; i++) {
            if (tileset[i].CollisionPermission) {
                //if player collides with a tile while falling down
                if (this.X >= tileset[i].X - 16 && this.X <= tileset[i].X + tileset[i].Width + 16) {
                    if (this.Y >= tileset[i].Y && this.Y < tileset[i].Y + tileset[i].Height) {

                        //console.log(`landed on a ${tileset[i].Name}`);
    
                        this._isGrounded = true;
                        this.Jump = true;
                        this.Y = this.CurrentY = tileset[i].Y;
                        this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Up");
                        
                        if (tileset[i].Once) tileset[i].BreakMeNow();
                        else tileset[i].BreakMe();

                        this._jumpVelocity = tileset[i].JumpVelocityBoost;
                        this._jumpVelocityModifer = 1;
                    }
                }
                else {
                    this._isGrounded = false;
                }
            }
        }
    }

    // collision check with a trampoline
    public CollisionCheckWithCollectibles(collectible:JetPack[]):void {
        for (let i:number = 0; i < collectible.length; i++) {
            //if player collides with a tile while falling down
            if (this.X >= collectible[i].X - 52 && this.X <= collectible[i].X + 52) {
                if (this.Y >= collectible[i].Y && this.Y < collectible[i].Y + collectible[i].Height) {

                    this._isGrounded = true;
                    this.Jump = true;
                    this.Y = this.CurrentY = collectible[i].Y;
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Up");
                    
                    collectible[i].FlyMe();
                    this._jumpVelocity = collectible[i].JumpVelocityBoost;
                    this._jumpVelocityModifer = 1;
                }
            }
            else {
                this._isGrounded = false;
            }
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
    
}

