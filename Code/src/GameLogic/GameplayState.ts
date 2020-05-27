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
import Camera from "./Camera";
import Hollow from "./Tiles/Hollow";

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
    private tile_Hollow:Hollow[];
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

    // variable used to expand array range of custom tiles which will gradually replace core tiles
    private lastUpdatedScore:number;
    private spikeLimit:number;
    private bubbleLimit:number;
    private breakableLimit:number;

    // prevent duplicating tile generation
    private occupiedID:boolean[];

    // camera scrolling speed
    private _cameraSpeed:number;
    get CameraSpeed():number {return this._cameraSpeed;}
    private _cameraUpdateSignal:boolean;
    get GameplaySignal():boolean {return this._cameraUpdateSignal}
    get PlayerPosX():number {return this.mainChar.X;}
    get PlayerPosY():number {return this.mainChar.Y;}

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
        
        // height modifier
        this.rng.MinAltitude = 1.5;
        this.rng.MaxAltitude = this.rng.MinAltitude + 1;

        // patrol speed
        this.rng.MaxSpeed = 4;

        // enanble keyboard input
        this.playerController.EnableInput(this.mainChar);

        this.CreateActors();
        
        // spawn core tiles
        this.SpawnCoreTiles(60);
        
        // prepare the occupied ID range
        this.occupiedID = new Array(this.tile_Core.length);
        for (let i:number = 0; i < this.occupiedID.length; i++) {
            this.occupiedID[i] = false;
        }
        
        // spawn gameplay tiles
        this.SpawnOceanFloorTiles();

        // spawn collectibles first
        this.SpawnJetpacks(1);

        // spawn gameplay tile
        {
            this.SpawnTrampolines(3);
            
            this.SpawnHollowTiles(20);
            
            this.SpawnSpikes(6);
            
            this.SpawnBubbles(10);
            
            this.SpawnBreakables(10);
            
            this.SpawnClouds(4);
        }

        // show main character falling when spawned
        this.mainChar.ShowMe("Dazzle/Dazzle_Fall");

        // starting score
        this.lastUpdatedScore = this._score = -600;
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
        this.tile_Start[0].ShowMe("Normal/Clams");
    }

    // gameplay updater
    public Update():void {

        // only update when player is alive
        if (this.mainChar.Alive) {

            // increase distance modifer based on current score
            if (this._score == this.lastUpdatedScore + 100) {
                this.lastUpdatedScore = this._score;
                this.rng.MinAltitude += 0.1;
                this.rng.MaxAltitude = this.rng.MinAltitude + 0.5;
                // console.log(this.rng.MaxAltitude);

                this.rng.MaxSpeed += 1;

                // slowly increase number of concurent spikes displayed on screen
                if (!this.rng.RandomizeTrueFalse(1,4) && this.spikeLimit < this.tile_Spiked.length) {
                    this.spikeLimit++;
                }

                // slowly increase number of concurent bubbles displayed on screen
                if (!this.rng.RandomizeTrueFalse(2,1) && this.bubbleLimit < this.tile_Bubble.length) {
                    this.bubbleLimit++;
                }

                // slowly increase number of concurent  breakables displayed on screen
                if (!this.rng.RandomizeTrueFalse(2,1) && this.breakableLimit < this.tile_Breakable.length) {
                    this.breakableLimit++;
                }
            }

            // update player movement based on inputs
            this.playerController.UpdateInput(this.mainChar);

            // update Camera
            // this.camera.Update(
            //     this._score,
            //     this._cameraUpdateSignal,
            //     this._cameraSpeed,
            //     this.mainChar,
            //     this.tile_Start,
            //     this.tile_Core,
            //     this.tile_OceanFloor,
            //     this.tile_Trampoline,
            //     this.tile_Hollow, this.tile_Spiked,
            //     this.tile_Breakable,
            //     this.tile_Bubble,
            //     this.tile_Cloud,
            //     this.item_Jetpack,
            //     this.rng,
            //     this.occupiedID,
            //     this.rangeExpander);
            this.Watcher();

            // allow patrol mode on some tiles
            {
                for (let i:number = 0; i < this.tile_Core.length; i++) {
                    this.tile_Core[i].MoveMe();
                }
                
                for (let i:number = 0; i < this.tile_Trampoline.length; i++) {
                    this.tile_Trampoline[i].MoveMe();
                }
                
                for (let i:number = 0; i < this.tile_Bubble.length; i++) {
                    this.tile_Bubble[i].MoveMe();
                }
                
                for (let i:number = 0; i < this.tile_Cloud.length; i++) {
                    this.tile_Cloud[i].MoveMe();
                }
            }

            // update sprite and animation
            this.mainChar.Update();

            // update collision check
            if (!this.mainChar.Jump) {
                this.mainChar.CollisionCheckWithTiles(this.tile_OceanFloor);
                this.mainChar.CollisionCheckWithTiles(this.tile_Start);
                this.mainChar.CollisionCheckWithHollows(this.tile_Hollow);
                this.mainChar.CollisionCheckWithTiles(this.tile_Core);
                this.mainChar.CollisionCheckWithTiles(this.tile_Spiked);
                this.mainChar.CollisionCheckWithTrampolines(this.tile_Trampoline);
                this.mainChar.CollisionCheckWithBreakables(this.tile_Breakable);
                this.mainChar.CollisionCheckWithBreakables(this.tile_Bubble);
                this.mainChar.CollisionCheckWithTiles(this.tile_Cloud);
                this.mainChar.CollisionCheckWithCollectibles(this.item_Jetpack);
            }

            // make sure the main character is always on the top of draw order
            this.mainChar.BringMeToFrontDrawOrder();
        }
        
        // when player is not alive
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

    // gameplay terminator
    public Terminate():void {
        this._gameStart = false;
        this.stage.removeAllChildren();
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

    // spawn core tiles on the screen
    private SpawnCoreTiles(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Core[i] = new Tile(this.assetManager, this.stage, TILE_NORMAL);
            this.tile_Core[i].Name = "Core";
            this.tile_Core[i].ShowMe("Normal/Clams");
        }

        // Generate tiles based on the starting tile
        this.rng.GenerateCoreTiles(this.tile_Core, this.tile_Start[0]);
    }

    // spawn hollow tiles on the screen
    private SpawnHollowTiles(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Hollow[i] = new Hollow(this.assetManager, this.stage);
            this.tile_Hollow[i].Name = "Ink";
            this.tile_Hollow[i].ShowMe("Ink/Ink_Idle");
        }

        // Generate tiles based on the core tiles
        this.rng.GenerateTLowImpactTiles(this.tile_Hollow, this.tile_Core);
    }

    // spawn trampolines on the screen, take some core tiles spaces
    private SpawnTrampolines(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Trampoline[i] = new Trampoline(this.assetManager, this.stage);
            this.tile_Trampoline[i].Name = "trampoline";

            let n:number;
            do {
                // make sure n does not get inside an occupied ID
                n = this.rng.RandomBetween(this.tile_Core.length - 45, this.tile_Core.length - 1);
            } while (this.occupiedID[n] != false);

            // console.log("trampoline spawn at start " + n + " " + this.occupiedID[n]);

            this.tile_Trampoline[i].X = this.tile_Core[n].X;
            this.tile_Trampoline[i].Y = this.tile_Core[n].Y;
            this.tile_Trampoline[i].ShowMe("Jellyfish/Jellyfish_Idle");
            this.tile_Core[n].IsMoving = false;
            this.tile_Core[n].CollisionPermission = false;
            this.tile_Core[n].HideMe();

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
            this.spikeLimit = 1;

            let n:number;
            do {
                // make sure n does not get inside an occupied ID
                // spikes spawned outside the screen at start
                n = this.rng.RandomBetween(this.tile_Core.length - 45, this.tile_Core.length - 1);
            } while (this.occupiedID[n] != false);

            // console.log("spikes spawn at start " + n + " " + this.occupiedID[n]);

            this.tile_Spiked[i].X = this.tile_Core[n].X;
            this.tile_Spiked[i].Y = this.tile_Core[n].Y;
            this.tile_Spiked[i].ShowMe("Spiked/Sea_Urchin");

            // hide some spikes at start
            if (i > 0) {
                this.tile_Spiked[i].CollisionPermission = false;
                this.tile_Spiked[i].HideMe();
                this.tile_Core[n].ShowMe("Normal/Clams");
                this.tile_Core[n].CollisionPermission = true;
            } else {
                this.tile_Spiked[0].ShowMe("Spiked/Sea_Urchin");
                this.tile_Core[n].HideMe();
                this.tile_Core[n].CollisionPermission = false;
            }

            // register occupiedID
            this.occupiedID[n] = true;

            // immobile its base tile
            this.tile_Core[n].IsMoving = false;
        }
    }

    // spawn breakables on the screen
    private SpawnBubbles(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Bubble[i] = new Breakable(this.assetManager, this.stage, true);
            this.tile_Bubble[i].Name = "Bubble";
            this.bubbleLimit = 1;
            
            let n:number;
            do {
                // make sure n does not get inside an occupied ID
                // bubbles spawned outside the screen at start
                n = this.rng.RandomBetween(this.tile_Core.length - 45, this.tile_Core.length - 1);
            } while (this.occupiedID[n] == true);
            
            // console.log("bubble spawn at start " + n + " " + this.occupiedID[n]);

            this.tile_Bubble[i].X = this.tile_Core[n].X;
            this.tile_Bubble[i].Y = this.tile_Core[n].Y;
            this.tile_Bubble[i].ShowMe("Bubbles/Bubbles_Idle");

            // hide some bubbles at start
            if (i > 3) {
                this.tile_Bubble[i].CollisionPermission = false;
                this.tile_Bubble[i].HideMe();
                this.tile_Core[n].ShowMe("Normal/Clams");
                this.tile_Core[n].CollisionPermission = true;
            } else {
                this.tile_Bubble[0].ShowMe("Bubbles/Bubbles_Idle");
                this.tile_Core[n].HideMe();
                this.tile_Core[n].CollisionPermission = false;
            }

            // register occupiedID
            this.occupiedID[n] = true;

            // immobile its base tile
            this.tile_Core[n].IsMoving = false;
        }
    }

    private SpawnBreakables(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Breakable[i] = new Breakable(this.assetManager, this.stage, false);
            this.tile_Breakable[i].Name = "Coral/Coral_Idle";
            this.breakableLimit = 1;
            
            let n:number;
            do {
                // make sure n does not get inside an occupied ID
                // bubbles spawned outside the screen at start
                n = this.rng.RandomBetween(this.tile_Core.length - 45, this.tile_Core.length - 1);
            } while (this.occupiedID[n] == true);
            
            // console.log("breakable spawn at start " + n + " " + this.occupiedID[n]);

            this.tile_Breakable[i].X = this.tile_Core[n].X;
            this.tile_Breakable[i].Y = this.tile_Core[n].Y;
            this.tile_Breakable[i].ShowMe("Coral/Coral_Idle 01");

            // hide some bubbles at start
            if (i > 2) {
                this.tile_Breakable[i].CollisionPermission = false;
                this.tile_Breakable[i].HideMe();
                this.tile_Core[n].ShowMe("Normal/Clams");
                this.tile_Core[n].CollisionPermission = true;
            } else {
                this.tile_Breakable[0].ShowMe("Coral/Coral_Idle 01");
                this.tile_Core[n].HideMe();
                this.tile_Core[n].CollisionPermission = false;
            }

            // register occupiedID
            this.occupiedID[n] = true;

            // immobile its base tile
            this.tile_Core[n].IsMoving = false;
        }
    }

    // spawn cloud off the screen
    private SpawnClouds(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.tile_Cloud[i] = new Cloud(this.assetManager, this.stage, this.rng.RandomBetween(4000, 6000));
            this.tile_Cloud[i].Name = "Cloud";

            // clouds spawn far below at the bottom
            this.tile_Cloud[i].CollisionPermission = false;
            this.tile_Cloud[i].X = 0;
            this.tile_Cloud[i].Y = STAGE_HEIGHT * 1.2;
        }
    }

    // spawn jetpacks on the screen, attached to some core tiles
    private SpawnJetpacks(quantity:number):void {
        for (let i:number = 0; i < quantity; i++) {
            this.item_Jetpack[i] = new JetPack(this.assetManager, this.stage);
            this.item_Jetpack[i].Name = "Jetpack";

            let n:number;
            do {
                // make sure n does not get inside an occupied ID
                n = this.rng.RandomBetween(this.tile_Core.length - 10, this.tile_Core.length - 1);
            } while (this.occupiedID[n] == true);

            this.item_Jetpack[i].X = this.tile_Core[n].X + this.tile_Core[n].Width / 2;
            this.item_Jetpack[i].Y = this.tile_Core[n].Y;
            this.item_Jetpack[i].ShowMe("Jetpack_Idle");

            // register occupiedID
            this.occupiedID[n] = true;

            // immobile this core tile
            this.tile_Core[n].IsMoving = false;
        }
    }
    
    // Move objects and increase game difficulty
    private Watcher():void {
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
            {
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
            }

            // move any tile that falls out of the screen to the top
            // core tiles first
            for (let i:number = 0; i < this.tile_Core.length; i++) {
                if (this.tile_Core[i].Y > STAGE_HEIGHT) {
                    // use underwater theme
                    if (this._score < 0) {
                        this.tile_Core[i].ShowMe("Normal/Clams");
                    }
                    // switch to above water theme
                    else if (this._score < 1500 && this._score >= 0) {
                        this.tile_Core[i].ShowMe("Normal/Shells");
                    }
                    // switch to space theme
                    else {
                        this.tile_Core[i].ShowMe("Normal/Starfish");
                    }

                    this.tile_Core[i].CollisionPermission = true;
                    this.tile_Core[i].IsMoving = false;

                    this.tile_Core[i].X = this.rng.RandomBetween(0, STAGE_WIDTH - this.tile_Core[i].Width);

                    // shift this tile and move it to last index 
                    this.tile_Core.splice(this.tile_Core.length - 1, 0 ,  this.tile_Core.shift());
                    this.occupiedID.splice(this.tile_Core.length - 1, 0 ,  this.occupiedID.shift());

                    // this tile now become the highest tile
                    // slowly increase height difference between tiles
                    this.tile_Core[this.tile_Core.length - 1].Y = this.rng.RandomBetween(
                    this.tile_Core[this.tile_Core.length - 2].Y - this.tile_Core[i].Height * this.rng.MinAltitude,
                    this.tile_Core[this.tile_Core.length - 2].Y - this.tile_Core[i].Height * this.rng.MaxAltitude);

                    // Randomize patrol mode
                    this.tile_Core[this.tile_Core.length - 1].IsMoving = this.rng.RandomizeTrueFalse(20, 1);
                        if (this.tile_Core[this.tile_Core.length - 1].IsMoving) {
                        this.tile_Core[this.tile_Core.length - 1].SetPatrolSpeed(this.rng.RandomBetween(this.rng.MaxSpeed - 2, this.rng.MaxSpeed));
                    }

                    this.tile_Core[this.tile_Core.length - 1].CollisionPermission = true;

                    // release this occupied ID
                    this.occupiedID[this.occupiedID.length - 1] = false;
                }
            }

            // attached the fell out trampoline to a new core tile
            for (let i:number = 0; i < this.tile_Trampoline.length; i++) {
                if (this.tile_Trampoline[i].Y > STAGE_HEIGHT) {

                    // reset patrol mode
                    this.tile_Trampoline[i].IsMoving = false;

                    // use underwater theme
                    if (this._score < 0) {
                        this.tile_Trampoline[i].ShowMe("Jellyfish/Jellyfish_Idle");
                        this.tile_Trampoline[i].Type = 1;
                    }
                    // switch to surface theme
                    else if (this._score < 1500 && this._score >= 0) {
                        this.tile_Trampoline[i].ShowMe("Balloon/Balloon_Idle");
                        this.tile_Trampoline[i].Type = 2;
                    }
                    // switch to space theme
                    else {
                        this.tile_Trampoline[i].ShowMe("Alien/Alien_Idle");
                        this.tile_Trampoline[i].Type = 3;
                    }

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 35, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] == true);

                    // console.log("trampoline spawn at " + n + " " + this.occupiedID[n]);

                    if (!this.rng.RandomizeTrueFalse(1,99)) {
                        this.tile_Trampoline[i].X = this.tile_Core[n].X;
                        this.tile_Trampoline[i].Y = this.tile_Core[n].Y;
                        this.tile_Core[n].HideMe();
                        
                        // register occupiedID
                        this.occupiedID[n] = true;
                        
                        // immobile its base tile
                        this.tile_Core[n].IsMoving = false;
                        this.tile_Trampoline[i].IsMoving = this.rng.RandomizeTrueFalse(1,1);
                        this.tile_Trampoline[i].SetPatrolSpeed(this.rng.RandomBetween(1, this.rng.MaxSpeed));
                    }
                }
            }

            // attached the fell out hollow to a new core tile
            for (let i:number = 0; i < this.tile_Hollow.length; i++) {
                if (this.tile_Hollow[i].Y > STAGE_HEIGHT) {

                    this.rng.GenerateALowImpactTile(this.tile_Hollow[i], this.tile_Core);

                    // use underwater theme
                    if (this._score < 0) {
                        this.tile_Hollow[i].ShowMe("Ink/Ink_Idle");
                        this.tile_Hollow[i].Name = "Ink";
                    }
                    // switch to surface theme
                    else if (this._score < 1000 && this._score >= 0) {
                        this.tile_Hollow[i].ShowMe("Fog/Fog_Idle");
                        this.tile_Hollow[i].Name = "Fog";
                    }
                    // switch to space theme
                    else {
                        this.tile_Hollow[i].ShowMe("Electrofield/Electrofield_Idle");
                        this.tile_Hollow[i].Name = "Electrofield";
                    }

                    if (this.rng.RandomizeTrueFalse(9,1) ||
                        this.tile_Core[this.tile_Core.length - 1].IsMoving) this.tile_Hollow[i].HideMe();
                }
            }

            // attached the fell out spiked tile to a new core tile
            for (let i:number = 0; i < this.spikeLimit; i++) {
                if (this.tile_Spiked[i].Y > STAGE_HEIGHT) {
                    // console.log("spike limit: " + this.spikeLimit);
                    if (this._score > -250) this.tile_Spiked[i].ShowMe("Spiked/Sea_Urchin");
                    if (this._score >= 100) this.tile_Spiked[i].ShowMe("Spiked/Star_Cluster");

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 35, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] == true);

                    // console.log("spikes spawn at " + n + " " + this.occupiedID[n]);

                    if (!this.rng.RandomizeTrueFalse(1,8)) {
                        this.tile_Spiked[i].X = this.tile_Core[n].X;
                        this.tile_Spiked[i].Y = this.tile_Core[n].Y;
                        this.tile_Spiked[i].CollisionPermission = true;
                        this.tile_Core[n].HideMe();
                        this.tile_Core[n].CollisionPermission = false;

                        // register occupiedID
                        this.occupiedID[n] = true;
    
                        // immobile its base tile
                        this.tile_Core[n].IsMoving = false;
                    }
                }
            }

            // attached the fell out breakable tile to a new core tile
            for (let i:number = 0; i < this.breakableLimit; i++) {
                if (this.tile_Breakable[i].Y > STAGE_HEIGHT) {
                    // console.log("breakables limit: " + this.breakableLimit);

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 35, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] == true);

                    // console.log("breakable spawn at " + n + " " + this.occupiedID[n]);

                    if (!this.rng.RandomizeTrueFalse(1,8)) {
                        this.tile_Breakable[i].X = this.tile_Core[n].X;
                        this.tile_Breakable[i].Y = this.tile_Core[n].Y;

                        if (this._score < 0) {
                            this.tile_Breakable[i].Name = "Coral/Coral_Idle" ;
                            this.tile_Breakable[i].ShowMe("Coral/Coral_Idle 01");
                        }
                        
                        else if (this._score >= 1500) {
                            this.tile_Breakable[i].Name = "Forcefield/Forcefield_Idle";
                            this.tile_Breakable[i].ShowMe("Forcefield/Forcefield_Idle 01");
                        }
    
                        this.tile_Breakable[i].Hit = 3;
                        this.tile_Breakable[i].ReActivateMe();

                        this.tile_Core[n].HideMe();
                        this.tile_Core[n].CollisionPermission = false;

                        // register occupiedID
                        this.occupiedID[n] = true;
    
                        // immobile its base tile
                        this.tile_Core[n].IsMoving = false;
                        this.tile_Breakable[i].IsMoving = this.rng.RandomizeTrueFalse(4,1);
                        this.tile_Breakable[i].SetPatrolSpeed(this.rng.RandomBetween(1, this.rng.MaxSpeed));
                    }
                }
            }

            for (let i:number = 0; i < this.bubbleLimit; i++) {
                if (this.tile_Bubble[i].Y > STAGE_HEIGHT) {
                    // console.log("bubble limit: " + this.bubbleLimit);

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 35, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] == true);

                    // console.log("bubble spawn at " + n + " " + this.occupiedID[n]);

                    if (!this.rng.RandomizeTrueFalse(1,8)) {
                        this.tile_Bubble[i].X = this.tile_Core[n].X;
                        this.tile_Bubble[i].Y = this.tile_Core[n].Y;
                        this.tile_Bubble[i].ShowMe("Bubbles/Bubbles_Idle");
                        this.tile_Bubble[i].ReActivateMe();
                        this.tile_Core[n].HideMe();
                        this.tile_Core[n].CollisionPermission = false;

                        // register occupiedID
                        this.occupiedID[n] = true;
    
                        // immobile its base tile
                        this.tile_Core[n].IsMoving = false;
                        this.tile_Bubble[i].IsMoving = this.rng.RandomizeTrueFalse(4,1);
                        this.tile_Bubble[i].SetPatrolSpeed(this.rng.RandomBetween(1, this.rng.MaxSpeed));
                    }
                }
            }

            // attached the fell out cloud tile to a new core tile
            for (let i:number = 0; i < this.tile_Cloud.length; i++) {
                if (this.tile_Cloud[i].Y > STAGE_HEIGHT) {

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 35, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] == true);

                    // console.log("cloud spawn at " + n + " " + this.occupiedID[n]);

                    if (!this.rng.RandomizeTrueFalse(1,8) && this._score > 200) {
                        this.tile_Cloud[i].X = this.tile_Core[n].X;
                        this.tile_Cloud[i].Y = this.tile_Core[n].Y;
                        this.tile_Cloud[i].ShowMe("Idle/Cloud_Idle");
                        this.tile_Cloud[i].ActivateMe();
                        this.tile_Core[n].HideMe();
                        this.tile_Core[n].CollisionPermission = false;

                        // register occupiedID
                        this.occupiedID[n] = true;
    
                        // immobile its base tile
                        this.tile_Core[n].IsMoving = false;
                        this.tile_Cloud[i].IsMoving = this.rng.RandomizeTrueFalse(4,1);
                        this.tile_Cloud[i].SetPatrolSpeed(this.rng.RandomBetween(1, this.rng.MaxSpeed));
                    }
                }
            }

            // attached the fell out jetpack to a new core tile
            for (let i:number = 0; i < this.item_Jetpack.length; i++) {
                if (this.item_Jetpack[i].Y > STAGE_HEIGHT) {
                    
                    let n:number;                    
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 35, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] != false);
                    
                    this.item_Jetpack[i].X = this.tile_Core[n].X + this.tile_Core[n].Width / 2;
                    this.item_Jetpack[i].Y = this.tile_Core[n].Y;
                    this.item_Jetpack[i].CollisionPermission = true;
                    this.item_Jetpack[i].ReEnableMe();
                    
                    // register occupiedID
                    this.occupiedID[n] = true;
                    
                    // immobile its base tile
                    this.tile_Core[n].IsMoving = false;
                    
                    if (!this.rng.RandomizeTrueFalse(1,4)) {
                        this.item_Jetpack[i].FlyMe();
                        this.item_Jetpack[i].CollisionPermission = false;
                    }
                }
            }
        }

        else this._cameraUpdateSignal = false;
    }
    
}