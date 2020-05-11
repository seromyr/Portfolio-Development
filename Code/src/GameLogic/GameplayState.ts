import { PLAYER_MOVESPEED, STAGE_HEIGHT, SCREEN_TITLE, PLAYER_DEFAULT_X, PLAYER_DEFAULT_Y, ANCHOR, STAGE_WIDTH } from "../Constants/Constants_General";
import { TILE_BIG, TILE_NORMAL, TILE_HOLLOW } from "../Constants/Constants_Tiles";
import ProceduralGenerator from "./ProceduralGenerator";
import AssetManager from "../Miscs/AssetManager";
import Player from "../GameLogic/Player";
import Environment from "./Environment";
import Tile from "../GameLogic/Tile";
import Trampoline from "./Trampoline";
import NPC from "./NPC";

export default class GameplayState {

    private assetManager:AssetManager;
    private stage:createjs.StageGL;

    // game characters & objects
    private mainChar:Player;
    private npc_01:NPC;
    private npc_02:NPC;
    private tile_Start:Tile[];
    private tile_OceanFloor:Tile[];
    private tile_Core:Tile[];
    private tile_Trampoline:Trampoline[];
    private tile_Hollow:Tile[];
    
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
        this.SpawnOceanFloorTiles();
        this.SpawnCoreTiles(30);
        this.SpawnTrampolines(2);
        this.SpawnHollowTiles(4);
        
        this.npc_01.ShowMeJumping();
        this.npc_02.ShowMeIdling();
        this.mainChar.ShowMe("Dazzle/Dazzle Jump/Dazzle_Fall");
        
        this.water.ShowMe("water");
        this.land.ShowMe("land");
        this.air.ShowMe("air");
        this.space.ShowMe("space");

        // starting score
        this._score = -25;
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
        this.npc_01.X = 96;
        this.npc_01.Y = STAGE_HEIGHT - 96;

        this.npc_02.Alive = true;
        this.npc_02.X = 54;
        this.npc_02.Y = STAGE_HEIGHT - 48;

        // construct tiles
        this.tile_OceanFloor = [];
        this.tile_Core = [];
        this.tile_Hollow = [];

        this.tile_Start = [];
        this.tile_Start[0] = new Tile(this.assetManager, this.stage, TILE_NORMAL);
        this.tile_Start[0].Name = "Start";
        this.tile_Start[0].X = 128;
        this.tile_Start[0].Y = STAGE_HEIGHT - 96;
        this.tile_Start[0].ShowMe("Clay");

        // -- trampolines
        this.tile_Trampoline = [];
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
            this.Camera();
            
            // update sprite and animation
            this.mainChar.Update();

            // update collision check
            if (!this.mainChar.Jump) {
                this.mainChar.CollisionCheckWithTiles(this.tile_Core);
                this.mainChar.CollisionCheckWithTiles(this.tile_OceanFloor);
                this.mainChar.CollisionCheckWithTiles(this.tile_Start);
                this.mainChar.CollisionCheckWithTrampolines(this.tile_Trampoline);
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
                this.npc_01.CollisionCheckWithTiles(this.tile_OceanFloor);
            }
        }
    }

    public Terminate():void {
        this._gameStart = false;
        //this.mainChar.JumpSpeed = PLAYER_JUMPSPEED;
        //this.npc_01.JumpSpeed = PLAYER_JUMPSPEED;
        this.stage.removeAllChildren();
    }

    // spawn core tiles on the screen
    private SpawnCoreTiles(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {            
            this.tile_Core[i] = new Tile(this.assetManager, this.stage, TILE_NORMAL);
            this.tile_Core[i].Name = "Core";
            this.tile_Core[i].ShowMe("Clay");
        }

        // Generate tiles based on the starting tile
        this.rng.GenerateTiles(this.tile_Core, this.tile_Start[0]);

    }

       // spawn hollow tiles on the screen
       private SpawnHollowTiles(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {            
            this.tile_Hollow[i] = new Tile(this.assetManager, this.stage, TILE_HOLLOW);
            this.tile_Hollow[i].Name = "Hollow";
            this.tile_Hollow[i].ShowMe("Hollow");
        }

        // Generate tiles based on the starting tile
        this.rng.GenerateTiles(this.tile_Hollow, this.tile_Start[0]);

    }

    // spawn trampolines on the screen, attached to some core tiles
    private SpawnTrampolines(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Trampoline[i] = new Trampoline(this.assetManager, this.stage);
            this.tile_Trampoline[i].Name = "Trampoline";
            let n:number = this.rng.RandomBetween(2, this.tile_Core.length - 1);
            this.tile_Trampoline[i].X = this.tile_Core[n].X + this.tile_Core[n].Width / 2;
            this.tile_Trampoline[i].Y = this.tile_Core[n].Y;
            this.tile_Trampoline[i].ShowMe("Trampoline/Idle/Trampoline_Idle");
            //this.trampoline[i]
        }
    }

    // spawn ocean floor tiles on the screen
    private SpawnOceanFloorTiles():void {
        let x:number = 48;
        for (let i:number = 0; i < 8; i++) {
            
            this.tile_OceanFloor[i] = new Tile(this.assetManager, this.stage, TILE_BIG);
            this.tile_OceanFloor[i].Name = "OceanFloor";
            this.tile_OceanFloor[i].X = x;
            this.tile_OceanFloor[i].Y = STAGE_HEIGHT - this.tile_OceanFloor[i].Height;
            this.tile_OceanFloor[i].ShowMe("OceanFloor");
            x += this.tile_OceanFloor[i].Width;
        }
    }

    // Objects mover
    private Camera():void {
        // if player is on the upper half  of the camera, try to catch up with him
        if (this.mainChar.Y < STAGE_HEIGHT * .5 && this.mainChar.Jump) {
            // update score
            this._score++;

            // set camera speed
            let h:number = this.mainChar.JumpSpeed;

            // as player crossed the line, move all objects down with different speed
            // to create parallax effect
            this.water.Y         += h;
            this.land.Y          += h / 3;
            this.air.Y           += h / 3;
            this.space.Y         += h / 3;
            this.land_bg_00.Y    += h / 1.3;

            this.tile_Start[0].Y += h;
            this.npc_01.Y        += h;
            this.npc_02.Y        += h;

            // shift tiles
            for (let i:number = 0; i < this.tile_Core.length; i++) {
                this.tile_Core[i].Y +=h;
            }
            
            for (let i:number = 0; i < this.tile_OceanFloor.length; i++) {               
                this.tile_OceanFloor[i].Y += h;
            }
            
            for (let i:number = 0; i < this.tile_Trampoline.length; i++) {               
                this.tile_Trampoline[i].Y += h;
            }

            for (let i:number = 0; i < this.tile_Hollow.length; i++) {               
                this.tile_Hollow[i].Y += h;
            }
            
            // move any tile that falls out of the screen to the top            
            // core tiles first
            for (let i:number = 0; i < this.tile_Core.length; i++) {
                if (this.tile_Core[i].Y > STAGE_HEIGHT) {
                    this.tile_Core[i].X = this.rng.RandomBetween(0, STAGE_WIDTH - this.tile_Core[i].Width);

                    // shift this tile and move it to last index 
                    this.tile_Core.splice(this.tile_Core.length - 1, 0 ,  this.tile_Core.shift());

                    // this tile now become the highest tile
                    this.tile_Core[this.tile_Core.length - 1].Y = this.rng.RandomBetween(
                        this.tile_Core[this.tile_Core.length - 2].Y - this.tile_Core[i].Height * 3,
                        this.tile_Core[this.tile_Core.length - 2].Y - this.tile_Core[i].Height * 4);
                }
            }

            // attached the fell out trampoline to a new core tile
            for (let i:number = 0; i < this.tile_Trampoline.length; i++) {
                if (this.tile_Trampoline[i].Y > STAGE_HEIGHT) {

                    let n:number = this.rng.RandomBetween(this.tile_Core.length - 17, this.tile_Core.length - 1);
                    this.tile_Trampoline[i].X = this.tile_Core[n].X + this.tile_Core[n].Width / 2;
                    this.tile_Trampoline[i].Y = this.tile_Core[n].Y;
                }
            }

            for (let i:number = 0; i < this.tile_Hollow.length; i++) {
                if (this.tile_Hollow[i].Y > STAGE_HEIGHT) {
                    this.tile_Hollow[i].X = this.rng.RandomBetween(0, STAGE_WIDTH - this.tile_Hollow[i].Width);

                    // shift this tile and move it to last index 
                    this.tile_Hollow.splice(this.tile_Hollow.length - 1, 0 ,  this.tile_Hollow.shift());

                    // this tile now become the highest tile
                    this.tile_Hollow[this.tile_Hollow.length - 1].Y = this.rng.RandomBetween(
                        this.tile_Hollow[this.tile_Hollow.length - 2].Y - this.tile_Hollow[i].Height * 3,
                        this.tile_Hollow[this.tile_Hollow.length - 2].Y - this.tile_Hollow[i].Height * 4);
                }
            }
        }
    }
}