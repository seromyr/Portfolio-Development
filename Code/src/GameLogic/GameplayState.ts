import { STAGE_HEIGHT, SCREEN_TITLE, STAGE_WIDTH } from "../Constants/Constants_General";
import { TILE_BIG, TILE_NORMAL, TILE_HOLLOW} from "../Constants/Constants_Tiles";
import ProceduralGenerator from "./ProceduralGenerator";
import AssetManager from "../Miscs/AssetManager";
import Player from "./Actors/Player";
import Tile from "./Tiles/Tile";
import Trampoline from "./Tiles/Trampoline";
import Spiked from "./Tiles/Spiked";
import Breakable from "./Tiles/Breakable";
import Cloud from "./Tiles/Cloud";
import PlayerController from "./PlayerController";
import JetPack from "./Collectibles/Jetpack";

export default class GameplayState {

    private assetManager:AssetManager;
    private stage:createjs.StageGL;

    // game characters , tiles, collectibles
    private mainChar:Player;
    // ----------------------
    private tile_Start:Tile[];
    private tile_OceanFloor:Tile[];
    private tile_Core:Tile[];
    private tile_Trampoline:Trampoline[];
    private tile_Hollow:Tile[];
    private tile_Spiked:Spiked[];
    private tile_Breakable:Breakable[];
    private tile_Bubble:Breakable[];
    private tile_Cloud:Cloud[];
    // ----------------------
    private item_Jetpack:JetPack[];

    // game state variable
    private _gameStart:boolean;
    get GameStart():boolean      {return this._gameStart;}
    set GameStart(value:boolean) {this._gameStart = value;}

    // custom event
    private _playerHasDied:createjs.Event;

    // game logic variables
    private rng:ProceduralGenerator;
    private _score:number;
    get Score():number {return this._score;}

    // prevent duplicating tile generation
    private occupiedID:boolean[];

    // camera scrolling speed
    private _cameraSpeed:number;
    get CameraSpeed():number {return this._cameraSpeed;}
    private _cameraUpdateSignal:boolean;
    get GameplaySignal():boolean {return this._cameraUpdateSignal}

    // player controller
    private playerController:PlayerController;

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        // get current stage and asset manager
        this.stage = stage;
        this.assetManager = assetManager;

        // construct Random Number Generator
        this.rng = new ProceduralGenerator();

        // construct actors
        this.mainChar = new Player(assetManager, stage);
        // activate player controller
        this.playerController = new PlayerController();

        // wire up event
        this._playerHasDied = new createjs.Event(SCREEN_TITLE[3], true, false);
    }

    // start new game method
    public StartNewGame():void {
        // allow the game to start updating
        this._gameStart = true;

        // enanble keyboard input
        this.playerController.EnableInput(this.mainChar);

        this.CreateActors();
        
        // spawn core tiles
        this.SpawnCoreTiles(40);
        
        // prepare the occupied ID range
        this.occupiedID = new Array(this.tile_Core.length);
        for (let i:number = 0; i < this.occupiedID.length; i++) {
            this.occupiedID[i] = false;
        }
        
        // spawn gameplay tiles
        this.SpawnOceanFloorTiles();
        this.SpawnTrampolines(2);
        this.SpawnHollowTiles(4);
        this.SpawnSpikes(3);
        this.SpawnBreakables("Breakable", this.tile_Breakable, 5, false);
        this.SpawnBreakables("Bubble", this.tile_Bubble, 5, true);
        this.SpawnClouds(4);

        // spawn collectibles
        this.SpawnJetpacks(2);

        this.mainChar.ShowMe("Dazzle/Dazzle_Fall");

        // starting score
        this._score = -500;
    }

    private CreateActors():void {
        // primary player
        this.mainChar.ResetCharacter();

        // construct tiles
        this.tile_Core       = [];
        this.tile_OceanFloor = [];
        this.tile_Hollow     = [];
        this.tile_Trampoline = [];
        this.tile_Spiked     = [];
        this.tile_Breakable  = [];
        this.tile_Bubble     = [];
        this.tile_Cloud      = [];

        //construct collectibles
        this.item_Jetpack    = [];

        // starting tile is the base to construct other tileset
        this.tile_Start      = [];
        this.tile_Start[0]   = new Tile(this.assetManager, this.stage, TILE_NORMAL);
        this.tile_Start[0].Name = "Start";
        this.tile_Start[0].X = this.rng.RandomBetween(this.tile_Start[0].Width, STAGE_WIDTH - this.tile_Start[0].Width);
        this.tile_Start[0].Y = STAGE_HEIGHT - 256;
        this.tile_Start[0].ShowMe("Normal/Shells");
    }

    // gameplay updater
    public Update():void {
        // only update when player is alive
        if (this.mainChar.Alive) {

            // update player movement based on inputs
            this.playerController.UpdateInput(this.mainChar);

            // update tile motion
            this.Camera();
            for (let i:number = 0; i < this.tile_Core.length; i++) {
                this.tile_Core[i].MoveMe();
            }
            
            // update sprite and animation
            this.mainChar.Update();

            // update collision check
            if (!this.mainChar.Jump) {
                this.mainChar.CollisionCheckWithTiles(this.tile_OceanFloor);
                this.mainChar.CollisionCheckWithTiles(this.tile_Core);
                this.mainChar.CollisionCheckWithTiles(this.tile_Start);
                this.mainChar.CollisionCheckWithTiles(this.tile_Spiked);
                this.mainChar.CollisionCheckWithTrampolines(this.tile_Trampoline);
                this.mainChar.CollisionCheckWithBreakables(this.tile_Breakable);
                this.mainChar.CollisionCheckWithBreakables(this.tile_Bubble);

                if (this._score > 100) {
                    // clouds only appear above 100 meters
                    this.mainChar.CollisionCheckWithTiles(this.tile_Cloud);
                }

                this.mainChar.CollisionCheckWithCollectibles(this.item_Jetpack);
            }

            // make sure the main character is always on the top of draw order
            this.mainChar.BringMeToFrontDrawOrder();
        }
        
        if (!this.mainChar.Alive)
        {
            this.playerController.DisableInput();
            this.mainChar.Dead();
            
            if (this.mainChar.Y >= STAGE_HEIGHT + 32) {
                this.stage.dispatchEvent(this._playerHasDied);
                //console.log("dead");
            }
        }
    }

    public Terminate():void {
        this._gameStart = false;
        this.stage.removeAllChildren();
    }

    // spawn core tiles on the screen
    private SpawnCoreTiles(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Core[i] = new Tile(this.assetManager, this.stage, TILE_NORMAL);
            this.tile_Core[i].Name = "Core";
            this.tile_Core[i].ShowMe("Normal/Shells");

            // Randomize patrol mode
            this.tile_Core[i].IsMoving = this.rng.RandomizeTrueFalse();
            if (this.tile_Core[i].IsMoving) {
                this.tile_Core[i].SetMotion(this.rng.RandomBetween(1, 5));
            }
        }

        // Generate tiles based on the starting tile
        this.rng.GenerateTiles(this.tile_Core, this.tile_Start[0]);
    }

    // spawn hollow tiles on the screen
    private SpawnHollowTiles(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Hollow[i] = new Tile(this.assetManager, this.stage, TILE_HOLLOW);
            this.tile_Hollow[i].Name = "Hollow Ink";
            this.tile_Hollow[i].ShowMe("Hollow/Hollow_Ink");
        }

        // Generate tiles based on the core tiles
        this.rng.GenerateTFollowTiles(this.tile_Hollow, this.tile_Core);
    }

    // spawn trampolines on the screen, attached to some core tiles
    private SpawnTrampolines(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Trampoline[i] = new Trampoline(this.assetManager, this.stage);
            this.tile_Trampoline[i].Name = "trampoline";

            let n:number;
            do {
                // make sure n does not get inside an occupied ID
                n = this.rng.RandomBetween(2, this.tile_Core.length - 1);
            } while (this.occupiedID[n] != false);


            this.tile_Trampoline[i].X = this.tile_Core[n].X + this.tile_Core[n].Width / 2;
            this.tile_Trampoline[i].Y = this.tile_Core[n].Y;
            this.tile_Core[n].HideMe();
            this.tile_Trampoline[i].ShowMe("Jellyfish/Jellyfish_Idle");

            // register occupiedID
            this.occupiedID[n] = true;

            // immobile this core tile
            this.tile_Core[n].IsMoving = false;
        }
    }

    // spawn spikes on the screen, attached to some core tiles
    private SpawnSpikes(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Spiked[i] = new Spiked(this.assetManager, this.stage);
            this.tile_Spiked[i].Name = "spikes";

            let n:number;
            do {
                // make sure n does not get inside an occupied ID
                n = this.rng.RandomBetween(2, this.tile_Core.length - 1);
            } while (this.occupiedID[n] != false);

            this.tile_Spiked[i].X = this.tile_Core[n].X;
            this.tile_Spiked[i].Y = this.tile_Core[n].Y;
            this.tile_Core[n].HideMe();
            this.tile_Spiked[i].ShowMe("Spiked/Sea_Urchin");

            // register occupiedID
            this.occupiedID[n] = true;

            // immobile its base tile
            this.tile_Core[n].IsMoving = false;
        }
    }

    // spawn ocean floor tiles on the screen
    private SpawnOceanFloorTiles():void {
        let x:number = 0;
        for (let i:number = 0; i < 10; i++) {
            
            this.tile_OceanFloor[i] = new Tile(this.assetManager, this.stage, TILE_BIG);
            this.tile_OceanFloor[i].Name = "OceanFloor";
            this.tile_OceanFloor[i].X = x;
            this.tile_OceanFloor[i].Y = STAGE_HEIGHT - this.tile_OceanFloor[i].Height;
            this.tile_OceanFloor[i].ShowMe("OceanFloor");
            x += this.tile_OceanFloor[i].Width;
        }
    }

    // spawn breakables on the screen
    private SpawnBreakables(type:string, tileset:Breakable[], quantity:number, once:boolean):void {
        for (let i:number = 0; i < quantity; i++) {
            tileset[i] = new Breakable(this.assetManager, this.stage, once);
            tileset[i].Name = type;
            if (type == "Bubble") tileset[i].ShowMe("Bubbles/Bubbles_Idle");
            else tileset[i].ShowMe("Coral/Coral_Idle 01");
        }

        this.rng.GenerateTFollowTiles(tileset, this.tile_Core);
    }

    // spawn cloud on the screen
    private SpawnClouds(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Cloud[i] = new Cloud(this.assetManager, this.stage, this.rng.RandomBetween(3000, 5000));
            this.tile_Cloud[i].Name = "Cloud";
        }

        this.rng.GenerateTFollowTiles(this.tile_Cloud, this.tile_Core);
    }

    // spawn jetpacks on the screen, attached to some core tiles
    private SpawnJetpacks(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.item_Jetpack[i] = new JetPack(this.assetManager, this.stage);
            this.item_Jetpack[i].Name = "Jetpack";

            let n:number;
            do {
                // make sure n does not get inside an occupied ID
                n = this.rng.RandomBetween(2, this.tile_Core.length - 1);
            } while (this.occupiedID[n] != false);


            this.item_Jetpack[i].X = this.tile_Core[n].X + this.tile_Core[n].Width / 2;
            this.item_Jetpack[i].Y = this.tile_Core[n].Y;
            this.item_Jetpack[i].ShowMe("Jetpack_Idle");

            // register occupiedID
            this.occupiedID[n] = true;

            // immobile this core tile
            this.tile_Core[n].IsMoving = false;
        }
    }

    // Objects mover
    private Camera():void {
        // if player is on the upper half  of the camera, try to catch up with him
        if (this.mainChar.Y < STAGE_HEIGHT * 0.5 && this.mainChar.Jump) {

            // send update signal to other places
            this._cameraUpdateSignal = true;

            // update score
            this._score++;

            // set camera speed
            this._cameraSpeed = this.mainChar.JumpSpeed;

            // as player crossed the line, move all objects down with different speed
            this.tile_Start[0].Y += this._cameraSpeed;

            // shift tiles
            for (let i:number = 0; i < this.tile_Core.length; i++) {
                this.tile_Core[i].Y +=this._cameraSpeed;
            }
            
            for (let i:number = 0; i < this.tile_OceanFloor.length; i++) {
                this.tile_OceanFloor[i].Y += this._cameraSpeed;
            }
            
            for (let i:number = 0; i < this.tile_Trampoline.length; i++) {
                this.tile_Trampoline[i].Y += this._cameraSpeed;
            }

            for (let i:number = 0; i < this.tile_Hollow.length; i++) {
                this.tile_Hollow[i].Y += this._cameraSpeed;
            }

            for (let i:number = 0; i < this.tile_Spiked.length; i++) {
                this.tile_Spiked[i].Y += this._cameraSpeed;
            }

            for (let i:number = 0; i < this.tile_Breakable.length; i++) {
                this.tile_Breakable[i].Y += this._cameraSpeed;
            }

            for (let i:number = 0; i < this.tile_Bubble.length; i++) {
                this.tile_Bubble[i].Y += this._cameraSpeed;
            }

            for (let i:number = 0; i < this.tile_Cloud.length; i++) {
                this.tile_Cloud[i].Y += this._cameraSpeed;
            }

            // - items
            for (let i:number = 0; i < this.item_Jetpack.length; i++) {
                this.item_Jetpack[i].Y += this._cameraSpeed;
            }

            // move any tile that falls out of the screen to the top
            // core tiles first
            for (let i:number = 0; i < this.tile_Core.length; i++) {
                if (this.tile_Core[i].Y > STAGE_HEIGHT) {
                    // use underwater theme
                    if (this._score < 0) {
                        this.tile_Core[i].ShowMe("Normal/Shells");
                    }
                    // switch to above water theme
                    else if (this._score < 500 && this._score >= 0) {
                        
                        this.tile_Core[i].ShowMe("Normal/Clams");
                    }
                    // switch to space theme
                    else {
                        
                        this.tile_Core[i].ShowMe("Normal/Starfish");
                    }

                    this.tile_Core[i].X = this.rng.RandomBetween(0, STAGE_WIDTH - this.tile_Core[i].Width);

                    // shift this tile and move it to last index 
                    this.tile_Core.splice(this.tile_Core.length - 1, 0 ,  this.tile_Core.shift());
                    this.occupiedID.splice(this.tile_Core.length - 1, 0 ,  this.occupiedID.shift());

                    // this tile now become the highest tile
                    this.tile_Core[this.tile_Core.length - 1].Y = this.rng.RandomBetween(
                    this.tile_Core[this.tile_Core.length - 2].Y - this.tile_Core[i].Height * 3,
                    this.tile_Core[this.tile_Core.length - 2].Y - this.tile_Core[i].Height * 4);

                    // Randomize patrol mode
                    this.tile_Core[this.tile_Core.length - 1].IsMoving = this.rng.RandomizeTrueFalse();
                        if (this.tile_Core[this.tile_Core.length - 1].IsMoving) {
                        this.tile_Core[this.tile_Core.length - 1].SetMotion(this.rng.RandomBetween(1, 5));
                    }    

                    // release this occupied ID
                    this.occupiedID[this.occupiedID.length - 1] = false;
                }
            }

            // attached the fell out trampoline to a new core tile
            for (let i:number = 0; i < this.tile_Trampoline.length; i++) {
                if (this.tile_Trampoline[i].Y > STAGE_HEIGHT) {

                    let n:number;                    
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 17, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] != false);

                    this.tile_Trampoline[i].X = this.tile_Core[n].X + this.tile_Core[n].Width / 2;
                    this.tile_Trampoline[i].Y = this.tile_Core[n].Y;
                    this.tile_Core[n].HideMe();

                    // use underwater theme
                    if (this._score < 0) {
                        this.tile_Trampoline[i].ShowMe("Jellyfish/Jellyfish_Idle");
                        this.tile_Trampoline[i].Type = 1;
                    }
                    // switch to surface theme
                    else if (this._score < 500 && this._score >= 0) {
                        this.tile_Trampoline[i].ShowMe("Balloon/Balloon_Idle");
                        this.tile_Trampoline[i].Type = 2;
                    }
                    // switch to space theme
                    else {
                        this.tile_Trampoline[i].ShowMe("Alien/Alien_Idle");
                        this.tile_Trampoline[i].Type = 3;
                    }

                    // register occupiedID
                    this.occupiedID[n] = true;

                    // immobile its base tile
                    this.tile_Core[n].IsMoving = false;
                }
            }

            // attached the fell out hollow to a new core tile
            for (let i:number = 0; i < this.tile_Hollow.length; i++) {
                if (this.tile_Hollow[i].Y > STAGE_HEIGHT) {
                    this.rng.GenerateTAFollowTile(this.tile_Hollow[i], this.tile_Core);
                    // use underwater theme
                    if (this._score < 0) {
                        this.tile_Hollow[i].ShowMe("Hollow/Hollow_Ink");
                    }
                    // switch to surface theme
                    else if (this._score < 500 && this._score >= 0) {
                        this.tile_Hollow[i].ShowMe("Hollow/Fog");
                    }
                    // switch to space theme
                    else {
                        this.tile_Hollow[i].ShowMe("Hollow/Electrofield");
                    }
                }
            }

            // attached the fell out spiked tile to a new core tile
            for (let i:number = 0; i < this.tile_Spiked.length; i++) {
                if (this.tile_Spiked[i].Y > STAGE_HEIGHT) {

                    if (this._score >= 0) {
                        this.tile_Spiked[i].ShowMe("Spiked/Star_Cluster");
                    }

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 17, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] != false);
                    
                    this.tile_Spiked[i].X = this.tile_Core[n].X;
                    this.tile_Spiked[i].Y = this.tile_Core[n].Y;
                    this.tile_Core[n].HideMe();
                    

                    // register occupiedID
                    this.occupiedID[n] = true;

                    // immobile its base tile
                    this.tile_Core[n].IsMoving = false;
                }
            }

            // attached the fell out breakable tile to a new core tile
            for (let i:number = 0; i < this.tile_Breakable.length; i++) {
                if (this.tile_Breakable[i].Y > STAGE_HEIGHT) {
                    this.rng.GenerateTAFollowTile(this.tile_Breakable[i], this.tile_Core);
                    // use underwater theme
                    if (this._score < 0) {
                        this.tile_Breakable[i].Name = "Coral/Coral_Idle" ;
                        this.tile_Breakable[i].ShowMe("Coral/Coral_Idle 01");
                    }
                    
                    else if (this._score >= 500) {
                        this.tile_Breakable[i].Name = "Forcefield/Forcefield_Idle";
                        this.tile_Breakable[i].ShowMe("Forcefield/Forcefield_Idle 01");
                    }

                    this.tile_Breakable[i].Hit = 3;
                    this.tile_Breakable[i].ReActivateMe();
                }
            }

            // attached the fell out bubble tile to a new core tile
            for (let i:number = 0; i < this.tile_Bubble.length; i++) {
                if (this.tile_Bubble[i].Y > STAGE_HEIGHT) {
                    this.rng.GenerateTAFollowTile(this.tile_Bubble[i], this.tile_Core);
                    this.tile_Bubble[i].ShowMe("Bubbles/Bubbles_Idle");
                    this.tile_Bubble[i].ReActivateMe();
                }
            }

            // attached the fell out cloud tile to a new core tile
            for (let i:number = 0; i < this.tile_Cloud.length; i++) {
                if (this.tile_Cloud[i].Y > STAGE_HEIGHT) {
                    this.rng.GenerateTAFollowTile(this.tile_Cloud[i], this.tile_Core);
                    
                    if (this._score > 100) {
                        this.tile_Cloud[i].ShowMe("Idle/Cloud_Idle");
                        this.tile_Cloud[i].ActivateMe();
                    }
                }
            }

            // attached the fell out jetpack to a new core tile
            for (let i:number = 0; i < this.item_Jetpack.length; i++) {
                if (this.item_Jetpack[i].Y > STAGE_HEIGHT) {

                    let n:number;                    
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 17, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] != false);

                    this.item_Jetpack[i].X = this.tile_Core[n].X + this.tile_Core[n].Width / 2;
                    this.item_Jetpack[i].Y = this.tile_Core[n].Y;
                    this.item_Jetpack[i].ReEnableMe();

                    // register occupiedID
                    this.occupiedID[n] = true;

                    // immobile its base tile
                    this.tile_Core[n].IsMoving = false;
                }
            }
        }

        else this._cameraUpdateSignal = false;
    }
}