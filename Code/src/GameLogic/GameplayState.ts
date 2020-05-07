import { PLAYER_JUMPHEIGHT, PLAYER_JUMPSPEED, PLAYER_MOVESPEED, MAX_TILES, STAGE_WIDTH, STAGE_HEIGHT, SCREEN_TITLE, PLAYER_DEFAULT_X, PLAYER_DEFAULT_Y } from "../Constants";
import ProceduralGenerator from "./ProceduralGenerator";
import AssetManager from "../Miscs/AssetManager";
import Player from "../GameLogic/Player";
import Tile from "../GameLogic/Tile";
import Environment from "./Environment";
import NPC from "./NPC";

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

    // foregrounds
    private water:Environment;

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

        // construcct props
        this.water = new Environment(assetManager, stage);
        
        // activate player controller
        this.PlayerController();
        
        // wire up events
        this._playerHasDied = new createjs.Event(SCREEN_TITLE[3], true, false);   
    }

    // start new game method
    public StartNewGame():void {
        // allow the game to start updating
        this._gameStart = true;

        this.CreateActors();
        
        // spawnn tiles
        this.tile_Start.ShowMe("Golden");
        this.dock.ShowMe("Stone");
        
        this.SpawnOceanFloorTiles();
        this.SpawnTiles(1000, "Clay", this.tiles_common);
        
        this.npc_01.ShowMeJumping();
        this.npc_02.ShowMeIdling();
        this.mainChar.ShowMeJumping();
        
        // spawn props
        this.CreateProps();
        this.water.ShowMe("water");

        // starting score
        this._score = 0
    }

    private CreateActors():void {
        // primary player
        this.mainChar.Alive = true;        
        this.mainChar.X = PLAYER_DEFAULT_X;
        this.mainChar.Y = PLAYER_DEFAULT_Y;
        this.mainChar.CurrentY = this.mainChar.Y;
        
        // NPC
        this.npc_01.Alive = true;
        this.npc_01.X = 132;
        this.npc_01.Y = STAGE_HEIGHT - 96;

        this.npc_02.Alive = true;
        this.npc_02.X = 32;
        this.npc_02.Y = STAGE_HEIGHT - 48;

        // construct tiles
        this.tiles_OceanFloor = [];
        this.tiles_common = [];

        this.tile_Start.Name = "Starting";
        this.tile_Start.X = 128;
        this.tile_Start.Y = STAGE_HEIGHT - 96;

        this.dock.X = - this.dock.Width + 2;
        this.dock.Y = STAGE_HEIGHT / 2;
    }

    private CreateProps():void {
        //water
        this.water.Name = "Water";
        this.water.X = 0;
        this.water.Y = 168;
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

            //update score
            if (this.mainChar.Jump)
            {
                this._score++;
            }

            this.ObjectShifter();
            
            // update sprite and animation
            this.mainChar.Update();

            // update collision check
            if (!this.mainChar.Jump) {
                this.mainChar.CollisionCheckWithTiles(this.tiles_common);
                this.mainChar.CollisionCheckWithTiles(this.tiles_OceanFloor);
                this.mainChar.CollisionCheckWithATile(this.tile_test);
                this.mainChar.CollisionCheckWithATile(this.tile_Start);
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
            let x:number = 0;
            for (let i:number = 0; i < 10; i++) {
                
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
        let h:number = Math.abs(this.mainChar.Y - this.dock.Y);
        //h = 1;

        if (this.mainChar.Y <= this.dock.Y && this.mainChar.Jump) {
            this.npc_01.Y +=h;
            this.npc_02.Y +=h;
            this.tile_Start.Y +=h;
            this.water.Y +=h;
            // shift tiles
            for (let i:number = 0; i < this.tiles_common.length; i++) {               
                this.tiles_common[i].Y +=h;
            }

            for (let i:number = 0; i < this.tiles_OceanFloor.length; i++) {               
                this.tiles_OceanFloor[i].Y +=h;
            }
            
        }

        // let lastShiftedTile:number = 0;
        // for (let i:number = 0; i < this.tiles_common.length; i++) {
        //     if (this.tiles_common[i].Y > STAGE_HEIGHT) {
        //         lastShiftedTile = i;
        //         this.tiles_common[i].Y = - this.tiles_common[i].Height;
        //         this.tiles_common[i].X = this.rng.RandomCoordinatesOnScreen()[0][0];

        //         this.tiles_common[i].X = this.rng.RandomBetween(0, )
                
        //         //tileset[i].X = this.RandomBetween(0, tileset[i - 1].X + tileset[i - 1].Width * 2);
        //         //tileset[i].Y = this.RandomBetween(tileset[i - 1].Y - tileset[i - 1].Height * 2,
        //         //    tileset[i - 1].Y - tileset[i - 1].Height * 3);
        //     }
        // }
        
    }
}