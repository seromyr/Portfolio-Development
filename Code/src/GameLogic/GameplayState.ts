import { PLAYER_JUMPHEIGHT, PLAYER_JUMPSPEED, PLAYER_MOVESPEED, MAX_TILES, STAGE_WIDTH, STAGE_HEIGHT, SCREEN_TITLE, PLAYER_DEFAULT_X, PLAYER_DEFAULT_Y } from "../Constants";
import ProceduralGenerator from "./ProceduralGenerator";
import AssetManager from "../Miscs/AssetManager";
import Player from "../GameLogic/Player";
import Tile from "../GameLogic/Tile";

export default class GameplayState {

    private assetManager:AssetManager;
    private stage:createjs.StageGL;

    // game characters & objects
    private mainChar:Player;
    private npc_01:Player;
    private tile_Start:Tile;
    //private tiles_Golden:Tile[];
    private tiles_common:Tile[];
    private tile_test:Tile;

    // game state variable
    private _gameStart:boolean;
    get GameStart():boolean        {return this._gameStart;}
    set GameStart(value:boolean)   {this._gameStart = value;}

    // custome event
    private _playerHasDied:createjs.Event;

    // game logic variables
    private rng:ProceduralGenerator;
    private dock:Tile;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        // get current stage and asset manager
        this.stage = stage;
        this.assetManager = assetManager;

        // construct Random Number Generator
        this.rng = new ProceduralGenerator();

        // construct actors
        this.mainChar = new Player(assetManager, stage);
        this.npc_01 = new Player(assetManager, stage);
        this.tile_Start = new Tile(assetManager, stage);
        this.tile_test = new Tile(assetManager, stage);
        this.dock = new Tile(assetManager, stage);

        
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
        this.mainChar.ShowMeJumping();
        this.npc_01.ShowMeIdling();
        
        // spawnn tiles
        this.tile_Start.ShowMe("Golden");
        this.dock.ShowMe("Stone");

        //this.SpawnTiles(4, "Golden", this.tiles_Golden);
        this.SpawnTiles(MAX_TILES, "Clay", this.tiles_common);
    }

    private CreateActors():void {
        // primary player
        this.mainChar.Alive = true;        
        this.mainChar.X = PLAYER_DEFAULT_X;
        this.mainChar.Y = PLAYER_DEFAULT_Y;
        this.mainChar.CurrentY = this.mainChar.Y;
        
        // NPC
        this.npc_01.Alive = true;
        this.npc_01.X = 125;
        this.npc_01.Y = STAGE_HEIGHT * 0.75;        

        // construct tiles
        //this.tiles_Golden = [];
        this.tiles_common = [];

        this.tile_Start.Name = "Starting";
        this.tile_Start.X = 120;
        this.tile_Start.Y = STAGE_HEIGHT * 0.75;

        this.dock.X = - this.dock.Width;
        this.dock.Y = STAGE_HEIGHT / 2;
    }

    private PlayerController():void {
        // wire up eventListener for keyboard keys only on gameplay screen
        document.onkeydown = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {
                this.mainChar.X -= PLAYER_MOVESPEED;
            }

            else if (e.keyCode == 39 || e.keyCode == 68) {
                this.mainChar.X += PLAYER_MOVESPEED;
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
            this.mainChar.CollisionCheckWithTiles(this.tiles_common);
            //this.mainChar.CollisionCheckWithTiles(this.tiles_Golden);
            this.mainChar.CollisionCheckWithATile(this.tile_test);
            this.mainChar.CollisionCheckWithATile(this.tile_Start);


            // one of conditions where player has to die
            if ((this.mainChar.Y) >= STAGE_HEIGHT) {
                this.stage.dispatchEvent(this._playerHasDied);
                this.mainChar.Alive = false;
            }
        }
    }

    public Terminate():void {
        this._gameStart = false;
        this.stage.removeAllChildren();
    }

    // spawn some tiles on the screen
    private SpawnTiles(quantity:number, type:string = "Clay", tileset:Tile[]):void {
        for (let i:number = 0; i < quantity; i++) {
            
            tileset[i] = new Tile(this.assetManager, this.stage);
            tileset[i].Name = type;
            tileset[i].ShowMe(type);
        }

        this.rng.RandomGameObjectsInsideStage(tileset);
    }

    // Tile shifter
    private ObjectShifter():void {
        if (this.mainChar.Y <= this.dock.Y) {
            this.npc_01.Y++;
            this.tile_Start.Y++;
            for (let i:number = 0; i < this.tiles_common.length; i++) {               
                this.tiles_common[i].Y++;
            }
        }

        for (let i:number = 0; i < this.tiles_common.length; i++) {
            if (this.tiles_common[i].Y > STAGE_HEIGHT) {
                this.tiles_common[i].Y = - this.tiles_common[i].Height;
                this.tiles_common[i].X = this.rng.RandomCoordinatesOnScreen()[0][0];
            }
        }
    }
}