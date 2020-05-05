import { PLAYER_JUMPHEIGHT, PLAYER_JUMPSPEED, PLAYER_MOVESPEED, MAX_TILES, STAGE_WIDTH, STAGE_HEIGHT } from "../Constants";
import ProceduralGenerator from "./ProceduralGenerator";
import AssetManager from "../Miscs/AssetManager";
import Player from "../GameLogic/Player";
import Tile from "../GameLogic/Tile";

export default class GameplayState {

    private assetManager:AssetManager;
    private stage:createjs.StageGL;

    // game characters & objects
    private player:Player;
    private player2:Player;
    private tile_Start:Tile;
    private tiles_Golden:Tile[];
    private tiles_temp:Tile[];
    private tile_test:Tile;
    
    // direction variables
    private _isFacingRight:boolean;
    get IsFacingRight():boolean        {return this._isFacingRight;}
    set IsFacingRight(value:boolean)   {this._isFacingRight = value;}

    // game state variable
    private _gameStart:boolean;
    get GameStart():boolean        {return this._gameStart;}
    set GameStart(value:boolean)   {this._gameStart = value;}

    // game logic variables
    private rng:ProceduralGenerator;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        this.stage = stage;
        this.assetManager = assetManager;

        // instantiate actors
        this.player = new Player(assetManager, stage);
        this.player2 = new Player(assetManager, stage);
        this.tile_Start = new Tile(assetManager, stage);
        this.tile_test = new Tile(assetManager, stage);

        // construct an array of golden tiles
        this.tiles_Golden = [];
        this.tiles_temp = [];

        this.player.JumpHeight = PLAYER_JUMPHEIGHT;

        this.rng = new ProceduralGenerator();
        
        // wire up eventListener for keyboard keys only on gameplay screen
        document.onkeydown = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {
                this.player.X -= PLAYER_MOVESPEED;
            }

            else if (e.keyCode == 39 || e.keyCode == 68) {
                this.player.X += PLAYER_MOVESPEED;
            }
        }

        document.onkeyup = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {}

            else if (e.keyCode == 39 || e.keyCode == 68) {}
        }
        

        //listen for predefined events
        stage.on("collided", this.onCollision);
    }

    // start new game method
    public StartNewGame():void {
        this._gameStart = true;

        this.player2.Alive = true;
        this.player2.X = this.rng.RandomCoordinatesOnScreen()[0][0];
        this.player2.Y = this.rng.RandomCoordinatesOnScreen()[0][1];
        this.player2.Jump = false;
        this.player2.ShowMeIdling();
        
        this.player.Alive = true;        
        this.player.X = 130;
        this.player.Y = STAGE_HEIGHT/3;
        this.player.Jump = false;
        this.player.CurrentY = this.player.Y;
        this.player.JumpSpeed = PLAYER_JUMPSPEED;
        this.player.ShowMeJumping();

        this.tile_Start.Name = "Starting";
        this.tile_Start.X = 125;
        this.tile_Start.Y = STAGE_HEIGHT/2;
        this.tile_Start.ShowMe("Brick");

        this.tile_test.Name = "Clay";
        this.tile_test.X = 150;
        this.tile_test.Y = STAGE_HEIGHT/2 - 8 - this.tile_test.Height;
        this.tile_test.ShowMe("Clay");

        this.SpawnTiles(4, "Golden", this.tiles_Golden);
        this.SpawnTiles(MAX_TILES, "Stone", this.tiles_temp);
    }

    // gameplay updater
    public Update():void {       
        
        this.player.Update();
        //this.player.CollisionCheckWithTiles(this.tiles_temp);
        //this.player.CollisionCheckWithTiles(this.tiles_Golden);
        this.player.CollisionCheckWithATile(this.tile_test);
        this.player.CollisionCheckWithATile(this.tile_Start);
    }

    // spawn some tiles on the screen
    private SpawnTiles(quantity:number, type:string = "Clay", tileset:Tile[]):void {
        for (let i:number = 0; i < quantity; i++) {
            
            tileset[i] = new Tile(this.assetManager, this.stage);
            tileset[i].Name = type;
            tileset[i].X = this.rng.RandomCoordinatesOnScreen()[0][0];
            tileset[i].Y = this.rng.RandomCoordinatesOnScreen()[0][1];
            tileset[i].ShowMe(type);
        }
    }

    // collision event handler
    private onCollision(e:Event):void {
        
        //console.log("collided");
    }
}