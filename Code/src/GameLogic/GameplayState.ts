import { PLAYER_JUMPSPEED, PLAYER_MOVESPEED, STAGE_HEIGHT, SCREEN_TITLE, PLAYER_DEFAULT_X, PLAYER_DEFAULT_Y, ANCHOR } from "../Constants";
import ProceduralGenerator from "./ProceduralGenerator";
import AssetManager from "../Miscs/AssetManager";
import Player from "../GameLogic/Player";
import Environment from "./Environment";
import Tile from "../GameLogic/Tile";
import NPC from "./NPC";
import Trap from "./Trap";

export default class GameplayState {

    private assetManager:AssetManager;
    private stage:createjs.StageGL;

    // game characters & objects
    private mainChar:Player;
    private npc_01:NPC;
    private npc_02:NPC;
    private tile_Start:Tile;
    private tiles_OceanFloor:Tile[];
    private tiles_common:Tile[];
    private tile_test:Tile;
    private trampoline:Trap;
    
    // foregrounds
    private water:Environment;
    private land:Environment;
    private air:Environment;
    private space:Environment;
    private land_bg_00:Environment;

    // game state variable
    private _gameStart:boolean;
    get GameStart():boolean        {return this._gameStart;}
    set GameStart(value:boolean)   {this._gameStart = value;}

    // custom event
    private _playerHasDied:createjs.Event;

    // game logic variables
    private rng:ProceduralGenerator;
    private dock:Tile;
    private _score:number;
    get Score():number {return this._score;}

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        // get current stage and asset manager
        this.stage = stage;
        this.assetManager = assetManager;

        // construct Random Number Generator
        this.rng = new ProceduralGenerator();

        // construct actors
        this.mainChar = new Player(assetManager, stage);
        this.npc_01 = new NPC(assetManager, stage);
        this.npc_02 = new NPC(assetManager, stage);
        this.tile_Start = new Tile(assetManager, stage);
        this.tile_test = new Tile(assetManager, stage);
        this.dock = new Tile(assetManager, stage);
        this.trampoline = new Trap(assetManager, stage);

        // construcct props
        this.water = new Environment(assetManager, stage);
        this.land = new Environment(assetManager, stage);
        this.air = new Environment(assetManager, stage);
        this.space = new Environment(assetManager, stage);
        this.land_bg_00 = new Environment(assetManager, stage);
        
        // activate player controller
        this.PlayerController();
        
        // wire up events
        this._playerHasDied = new createjs.Event(SCREEN_TITLE[3], true, false);   
    }

    // start new game method
    public StartNewGame():void {
        // allow the game to start updating
        this._gameStart = true;

        // spawn props
        this.CreateProps();
        this.land_bg_00.ShowMe("land_bg_00");

        this.CreateActors();
        
        // spawnn tiles
        this.tile_Start.ShowMe("Golden");
        this.dock.ShowMe("Stone");
        this.trampoline.ShowMe("Trampoline/Idle/Trampoline_Idle");
        
        this.SpawnOceanFloorTiles();
        this.SpawnTiles(1000, "Clay", this.tiles_common);
        
        this.npc_01.ShowMeJumping();
        this.npc_02.ShowMeIdling();
        this.mainChar.ShowMeJumping();
        
        this.water.ShowMe("water");
        this.land.ShowMe("land");
        this.air.ShowMe("air");
        this.space.ShowMe("space");

        // starting score
        this._score = -19;

        // construct traps
        this.trampoline.Name = "Trampoline";
        this.trampoline.X = this.tiles_common[2].X + this.tiles_common[2].Width / 2;
        this.trampoline.Y = this.tiles_common[2].Y;
    }

    private CreateActors():void {
        // primary player
        this.mainChar.Alive = true;        
        this.mainChar.X = PLAYER_DEFAULT_X;
        this.mainChar.Y = PLAYER_DEFAULT_Y;
        this.mainChar.FlipMeOver("left");
        this.mainChar.CurrentY = this.mainChar.Y;
        
        // construct NPCs
        this.npc_01.Alive = true;
        this.npc_01.X = 132;
        this.npc_01.Y = STAGE_HEIGHT - 96;

        this.npc_02.Alive = true;
        this.npc_02.X = 54;
        this.npc_02.Y = STAGE_HEIGHT - 48;

        // construct tiles
        this.tiles_OceanFloor = [];
        this.tiles_common = [];

        this.tile_Start.Name = "Starting";
        this.tile_Start.X = 128;
        this.tile_Start.Y = STAGE_HEIGHT - 96;

        this.dock.X = - this.dock.Width + 2;
        this.dock.Y = ANCHOR;
    }

    private CreateProps():void {
        // water
        this.water.Name = "Water";
        this.water.X = 0;
        this.water.Y = 168;

        // land
        this.land.Name = "Land";
        this.land.X = 0;
        this.land.Y =  - STAGE_HEIGHT / 2;
        
        // air
        this.air.Name = "Air";
        this.air.X = 0;
        this.air.Y =  this.land.Y - STAGE_HEIGHT;

        // space
        this.space.Name = "Space";
        this.space.X = 0;
        this.space.Y =  this.air.Y - STAGE_HEIGHT;

        // underwater bg
        this.land_bg_00.Name = "UnderwaterBG";
        this.land_bg_00.X = 0;
        this.land_bg_00.Y = 128;
    }

    private PlayerController():void {
        // wire up eventListener for keyboard keys only on gameplay screen
        document.onkeydown = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {
                this.mainChar.X -= PLAYER_MOVESPEED;
                this.mainChar.FlipMeOver("left");
            }
            
            else if (e.keyCode == 39 || e.keyCode == 68) {
                this.mainChar.X += PLAYER_MOVESPEED;
                this.mainChar.FlipMeOver("right");
            }
        }

        document.onkeyup = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {}

            else if (e.keyCode == 39 || e.keyCode == 68) {}
        }
    }

    // gameplay updater
    public Update():void {       

        // only update when player is alive
        if (this.mainChar.Alive) {
            this.ObjectShifter();
            
            // update sprite and animation
            this.mainChar.Update();

            // update collision check
            if (!this.mainChar.Jump) {
                this.mainChar.CollisionCheckWithTiles(this.tiles_common);
                this.mainChar.CollisionCheckWithTiles(this.tiles_OceanFloor);
                this.mainChar.CollisionCheckWithATile(this.tile_test);
                this.mainChar.CollisionCheckWithATile(this.tile_Start);

                this.mainChar.CollisionCheckWithATrampoline(this.trampoline);
            }

            // one of conditions where player has to die
            if ((this.mainChar.Y) >= STAGE_HEIGHT) {
                this.stage.dispatchEvent(this._playerHasDied);
                this.mainChar.Alive = false;
            }
        }

        // only update when this NPC is alive
        if (this.npc_01.Alive) {            
            // update sprite and animation
            this.npc_01.Update();

            // update collision check
            if (!this.npc_01.Jump) {
                this.npc_01.CollisionCheckWithATile(this.tile_Start);
            }
        }
    }

    public Terminate():void {
        this._gameStart = false;
        this.mainChar.JumpSpeed = PLAYER_JUMPSPEED;
        this.npc_01.JumpSpeed = PLAYER_JUMPSPEED;
        this.stage.removeAllChildren();
    }

    // spawn some tiles on the screen
    private SpawnTiles(quantity:number, type:string = "Clay", tileset:Tile[]):void {
        for (let i:number = 0; i < quantity; i++) {
            
            tileset[i] = new Tile(this.assetManager, this.stage);
            tileset[i].Name = type;
            tileset[i].ShowMe(type);
        }

        //this.rng.RandomGameObjectsInsideStage(tileset);
        this.rng.GenerateTiles(tileset, this.tile_Start);
    }

    // spawn ocean floor tiles on the screen
    private SpawnOceanFloorTiles():void {
        let x:number = 48;
        for (let i:number = 0; i < 8; i++) {
            
            this.tiles_OceanFloor[i] = new Tile(this.assetManager, this.stage);
            this.tiles_OceanFloor[i].Name = "OceanFloor";
            this.tiles_OceanFloor[i].X = x;
            this.tiles_OceanFloor[i].Y = STAGE_HEIGHT - this.tiles_OceanFloor[i].Height * 3;
            this.tiles_OceanFloor[i].ShowMe("OceanFloor");
            x += this.tiles_OceanFloor[i].Width;
        }
    }

    // Tile shifter
    private ObjectShifter():void {
        let h:number = 16;
        //this.mainChar.HeightDiff;
        // Math.abs(this.mainChar.Y - this.dock.Y);
        if (this.mainChar.Y <= this.dock.Y && this.mainChar.Jump) {
            //update score
            this._score++;

            // parallax effect
            this.tile_Start.Y += h;
            this.npc_01.Y     += h;
            this.npc_02.Y     += h;
            this.water.Y      += h;
            this.land.Y       += h / 3;
            this.air.Y        += h / 3;
            this.space.Y      += h / 3;
            this.land_bg_00.Y += h / 1.3;
            this.trampoline.Y += h;


            // shift tiles
            for (let i:number = 0; i < this.tiles_common.length; i++) {               
                this.tiles_common[i].Y +=h;
            }

            for (let i:number = 0; i < this.tiles_OceanFloor.length; i++) {               
                this.tiles_OceanFloor[i].Y +=h;
            }
            
        }

        // remove unused backgrounds

        // for (let i:number = 0; i < this.tiles_common.length; i++) {
        //     if (this.tiles_common[i].Y > STAGE_HEIGHT) {

        //         this.tiles_common[i].Y = - this.tiles_common[i].Height;
        //         this.tiles_common[i].X = this.rng.GenerateNextTile(this.mainChar.X, 64);
        //     }
        // }
        
    }
}