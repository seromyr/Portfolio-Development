import { PLAYER_JUMPSPEED, ANCHOR, STAGE_HEIGHT, PLAYER_DEFAULT_X, PLAYER_DEFAULT_Y } from "../../Constants/Constants_General";
import AssetManager from "../../Miscs/AssetManager";
import Entity from "../Entity";
import Tile from "../Tiles/Tile";
import Trampoline from "../Tiles/Trampoline";
import Breakable from "../Tiles/Breakable";
import JetPack from "../Collectibles/Jetpack";
import ShapeFactory from "../../Miscs/ShapeFactory";

export default class Player extends Entity {

    // player variables    
    private _isGrounded:boolean;

    // jump mechanism variables
    private _jumpVelocity: number;
    get JumpSpeed():number       {return this._jumpVelocity;}
    set JumpSpeed(value:number)  {this._jumpVelocity = value;}
    private _jumpVelocityModifer:number;

    private fader:ShapeFactory;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager, stage, "mainChar");
        this.Jump = false;
        this._jumpVelocity = PLAYER_JUMPSPEED;
        this._jumpVelocityModifer = 1;
        this.fader = new ShapeFactory(stage);
        this.fader.Color = "White";        
    }
    
    // reset character attributes after dead
    public ResetCharacter():void {
        this.fader.Alpha = 0;

        this._sprite.rotation = 0;
        this._sprite.regX = 0;
        this._sprite.regY = 0;

        this._sprite.on("animationend", () => {
            this.ShowMe("Dazzle/Dazzle Jump/Dazzle_Jump");
        }, this, true);        

        this.Alive = true;

        this.X = PLAYER_DEFAULT_X;
        this.Y = PLAYER_DEFAULT_Y;
        this._sprite.scaleX = 1;
        this.CurrentY = this.Y;
    }

    public Update():void {

        // move character
        this._jumpVelocity -= this._jumpVelocityModifer;
        this.Y--;

        //if player touches the ground
        if (this._isGrounded && this.Jump) {
            this._isGrounded = false;
        }

        // if player is in mid-air and jumping
        if (!this._isGrounded && this.Jump) {
            if (this.Y <= this.CurrentY) {

                if (this.Y < ANCHOR) {
                    this.Y = ANCHOR;
                    //console.log(this._jumpVelocity);
                }

                if (this._jumpVelocity < PLAYER_JUMPSPEED * 0.3) {
                    this._jumpVelocityModifer = 0.5;
                } else this._jumpVelocityModifer = 1;

                this.Y -= this._jumpVelocity;
            }

            // when jump velocity reaches minimum, player starts falling down
            if (this._jumpVelocity < 0) {
                //slowly fall down
                this._jumpVelocity = PLAYER_JUMPSPEED * 0.5;
                this._sprite.gotoAndPlay("Dazzle/Dazzle_Fall");
                this.Jump = false;
                this._jumpVelocityModifer = 0.5;
            }
        }

        // if player is in mid-air and falling
        if (!this._isGrounded && !this.Jump){
            //player is constantly falling when not colliding with any tile
            // increase fall velocity acceleration 
            if (this._jumpVelocity > PLAYER_JUMPSPEED * 0.3) {                
                this._jumpVelocityModifer += 0.5;
            } else this._jumpVelocityModifer += 0.3;

            this._jumpVelocity += this._jumpVelocityModifer;
            this.Y += this._jumpVelocity;
        }

        // dead condition
        if (this.Y >= STAGE_HEIGHT) {
            this.Alive = false;
            this._isGrounded = false;
            this.Jump = true;
            this.Y = this.CurrentY = STAGE_HEIGHT;
            this._jumpVelocity = PLAYER_JUMPSPEED;
            this._jumpVelocityModifer = 1;
            
            this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
            this._sprite.on("animationend", () => {
                this._sprite.gotoAndPlay("Dazzle/Dazzle_Up");
            }, this, true);
            
            this.Y -= 64;
        }
    }

    public Dead():void {
        
        // when player is dead, wait for this sequence to end before switching screen
        this._sprite.on("animationend", () => {
            this._sprite.gotoAndPlay("Dazzle/Dazzle Die/Dazzle_Die");
            console.log ("ma");
            
        }, this, true);
        
        // fade screen out
        this.fader.CustomeRect(0, 0, 600, 800, 0.05);
        // push character to the front of draw order
        this.stage.addChild(this._sprite);

        // temporary change characger pivot
        this._sprite.regY = -this._sprite.getBounds().height / 2;

        this._jumpVelocity -= this._jumpVelocityModifer;

        // bounce character towards facing direction
        if (this._sprite.scaleX == 1) {
            this._sprite.x += 5;
        } else { this._sprite.x -= 5;}

        // if player is in mid-air and jumping
        if (!this._isGrounded && this.Jump) {
            if (this.Y <= this.CurrentY) {
                if (this._jumpVelocity < PLAYER_JUMPSPEED * 0.3) {
                    this._jumpVelocityModifer = 0.5;
                } else this._jumpVelocityModifer = 1;
                
                this.Y -= this._jumpVelocity;
            }
            
            // when jump velocity reaches minimum, player starts falling down
            if (this._jumpVelocity < 0) {
                //quickly fall down
                this._jumpVelocity = PLAYER_JUMPSPEED * 0.5;
                this.Jump = false;
                this._jumpVelocityModifer = 0.5;
            }
        }

        // if player is in mid-air and falling
        if (!this._isGrounded && !this.Jump){
            // increase fall velocity acceleration 
            if (this._jumpVelocity > PLAYER_JUMPSPEED * 0.3) {                
                this._jumpVelocityModifer += 0.5;
            } else this._jumpVelocityModifer += 0.3;

            this._jumpVelocity += this._jumpVelocityModifer;
            this.Y += this._jumpVelocity;

            if (this._sprite.scaleX == 1) {
                this._sprite.rotation += 30;
            } else this._sprite.rotation -= 30;
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
                            console.log("dead by trap");
                            this.Y -= 64;
                        }
                        
                        else if (!tile[i].Lethal) {
                            
                            this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
                            this._sprite.on("animationend", () => {
                                console.log("2");
                                this._sprite.gotoAndPlay("Dazzle/Dazzle_Up");
                            }, this, true);
                        }
                        
                        this._isGrounded = true;
                        this.Jump = true;
                        this.Y = this.CurrentY = tile[i].Y;
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
            if (this.X >= trampoline[i].X - 16 && this.X <= trampoline[i].X + trampoline[i].Width + 16) {
                if (this.Y >= trampoline[i].Y && this.Y < trampoline[i].Y + trampoline[i].Height) {
                    //console.log(`landed on a ${trampoline[i].Name}`);

                    this._isGrounded = true;
                    this.Jump = true;
                    this.Y = this.CurrentY = trampoline[i].Y;
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
                    
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
                        this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");
                        
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
                    this._sprite.gotoAndPlay("Dazzle/Dazzle Jump/Dazzle_Jump");

                    this._sprite.on("animationend", () => {
                        this._sprite.gotoAndPlay("Dazzle/Dazzle_Jetpack/Dazzle_Jetpack");
                    }, this, true);
                    
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