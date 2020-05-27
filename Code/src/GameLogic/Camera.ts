import { STAGE_HEIGHT, STAGE_WIDTH } from "../Constants/Constants_General";
import ProceduralGenerator from "./ProceduralGenerator";
import Player from "./Actors/Player";
import Tile from "./Tiles/Tile";
import Trampoline from "./Tiles/Trampoline";
import Spiked from "./Tiles/Spiked";
import Breakable from "./Tiles/Breakable";
import Cloud from "./Tiles/Cloud";
import JetPack from "./Collectibles/Jetpack";

export default class Camera {

    private x:number;
    constructor() {
        this.x = -500;
    }

    public Update(
        _score:number,
        _cameraUpdateSignal:boolean,
        _cameraSpeed:number,
        mainChar:Player,
        tile_Start:Tile[],
        tile_Core:Tile[],
        tile_OceanFloor:Tile[],
        tile_Trampoline:Trampoline[],
        tile_Hollow:Tile[],
        tile_Spiked:Spiked[],
        tile_Breakable:Breakable[],
        tile_Bubble:Breakable[],
        tile_Cloud:Cloud[],
        item_Jetpack:JetPack[],
        rng:ProceduralGenerator,
        occupiedID:boolean[],
        rangeExpander:number
        ):void {
            _score++;
        // if player is on the upper half  of the camera, try to catch up with him
        if (mainChar.Y < STAGE_HEIGHT * 0.5 && mainChar.Jump) {

            // send update signal to other places
            _cameraUpdateSignal = true;

            // update score
            console.log(_score);
            //_score++;
            console.log(_score);

            // set camera speed
            _cameraSpeed = mainChar.JumpSpeed;

            // as player crossed the line, move all objects down with different speed
            tile_Start[0].Y += _cameraSpeed;

            // shift tiles
            for (let i:number = 0; i < tile_Core.length; i++) {
                tile_Core[i].Y +=_cameraSpeed;
            }
            
            for (let i:number = 0; i < tile_OceanFloor.length; i++) {
                tile_OceanFloor[i].Y += _cameraSpeed;
            }
            
            for (let i:number = 0; i < tile_Trampoline.length; i++) {
                tile_Trampoline[i].Y += _cameraSpeed;
            }

            for (let i:number = 0; i < tile_Hollow.length; i++) {
                tile_Hollow[i].Y += _cameraSpeed;
            }

            for (let i:number = 0; i < tile_Spiked.length; i++) {
                tile_Spiked[i].Y += _cameraSpeed;
            }

            for (let i:number = 0; i < tile_Breakable.length; i++) {
                tile_Breakable[i].Y += _cameraSpeed;
            }

            for (let i:number = 0; i < tile_Bubble.length; i++) {
                tile_Bubble[i].Y += _cameraSpeed;
            }

            for (let i:number = 0; i < tile_Cloud.length; i++) {
                tile_Cloud[i].Y += _cameraSpeed;
            }

            // - items
            for (let i:number = 0; i < item_Jetpack.length; i++) {
                item_Jetpack[i].Y += _cameraSpeed;
            }

            // move any tile that falls out of the screen to the top
            // core tiles first
            for (let i:number = 0; i < tile_Core.length; i++) {
                if (tile_Core[i].Y > STAGE_HEIGHT) {
                    // use underwater theme
                    if (_score < 0) {
                        tile_Core[i].ShowMe("Normal/Clams");
                    }
                    // switch to above water theme
                    else if (_score < 500 && _score >= 0) {
                        tile_Core[i].ShowMe("Normal/Shells");
                    }
                    // switch to space theme
                    else {
                        tile_Core[i].ShowMe("Normal/Starfish");
                    }

                    tile_Core[i].X = rng.RandomBetween(0, STAGE_WIDTH - tile_Core[i].Width);

                    // shift this tile and move it to last index 
                    tile_Core.splice(tile_Core.length - 1, 0 ,  tile_Core.shift());
                    occupiedID.splice(tile_Core.length - 1, 0 ,  occupiedID.shift());

                    // this tile now become the highest tile
                    // slowly increase height difference between tiles
                    tile_Core[tile_Core.length - 1].Y = rng.RandomBetween(
                    tile_Core[tile_Core.length - 2].Y - tile_Core[i].Height * rng.MinAltitude,
                    tile_Core[tile_Core.length - 2].Y - tile_Core[i].Height * rng.MaxAltitude);

                    // Randomize patrol mode
                    tile_Core[tile_Core.length - 1].IsMoving = rng.RandomizeTrueFalse(20, 1);
                        if (tile_Core[tile_Core.length - 1].IsMoving) {
                        tile_Core[tile_Core.length - 1].SetPatrolSpeed(rng.RandomBetween(rng.MaxSpeed - 2, rng.MaxSpeed));
                    }
                    
                    //

                    //tile_Core[tile_Core.length - 1].CollisionPermission = false;
                    //if (!tile_Core[tile_Core.length - 1].CollisionPermission) { tile_Core[tile_Core.length - 1].HideMe();}

                    // release this occupied ID
                    occupiedID[occupiedID.length - 1] = false;
                }
            }

            // attached the fell out trampoline to a new core tile
            for (let i:number = 0; i < tile_Trampoline.length; i++) {
                if (tile_Trampoline[i].Y > STAGE_HEIGHT) {

                    // use underwater theme
                    if (_score < 0) {
                        tile_Trampoline[i].ShowMe("Jellyfish/Jellyfish_Idle");
                        tile_Trampoline[i].Type = 1;
                    }
                    // switch to surface theme
                    else if (_score < 500 && _score >= 0) {
                        tile_Trampoline[i].ShowMe("Balloon/Balloon_Idle");
                        tile_Trampoline[i].Type = 2;
                    }
                    // switch to space theme
                    else {
                        tile_Trampoline[i].ShowMe("Alien/Alien_Idle");
                        tile_Trampoline[i].Type = 3;
                    }

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = rng.RandomBetween(tile_Core.length - 4, tile_Core.length - 1);
                    } while (occupiedID[n] != false);

                    if (rng.RandomizeTrueFalse(1,1)) {
                        tile_Trampoline[i].X = tile_Core[n].X;
                        tile_Trampoline[i].Y = tile_Core[n].Y - 6;
                        tile_Core[n].HideMe();
                        
                        // register occupiedID
                        occupiedID[n] = true;
                        
                        // immobile its base tile
                        tile_Core[n].IsMoving = false;
                        tile_Trampoline[i].IsMoving = rng.RandomizeTrueFalse(1,1);
                        tile_Trampoline[i].SetPatrolSpeed(rng.RandomBetween(1, rng.MaxSpeed));
                    }
                }
            }

            // attached the fell out hollow to a new core tile
            for (let i:number = 0; i < tile_Hollow.length; i++) {
                if (tile_Hollow[i].Y > STAGE_HEIGHT) {

                    rng.GenerateALowImpactTile(tile_Hollow[i], tile_Core);

                    // use underwater theme
                    if (_score < 0) {
                        tile_Hollow[i].ShowMe("Hollow/Hollow_Ink");
                    }
                    // switch to surface theme
                    else if (_score < 500 && _score >= 0) {
                        tile_Hollow[i].ShowMe("Hollow/Fog");
                    }
                    // switch to space theme
                    else {
                        tile_Hollow[i].ShowMe("Hollow/Electrofield");
                    }
                }
            }

            // attached the fell out spiked tile to a new core tile
            for (let i:number = 0; i < tile_Spiked.length; i++) {
                if (tile_Spiked[i].Y > STAGE_HEIGHT) {

                    if (_score >= 0) {
                        tile_Spiked[i].ShowMe("Spiked/Star_Cluster");
                    }

                    if (_score > -250) tile_Spiked[1].ShowMe("Spiked/Sea_Urchin");

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = rng.RandomBetween(tile_Core.length - 10, tile_Core.length - 1);
                    } while (occupiedID[n] != false);
                    
                    if (rng.RandomizeTrueFalse(1,1)) {
                        tile_Spiked[i].X = tile_Core[n].X;
                        tile_Spiked[i].Y = tile_Core[n].Y;
                        tile_Core[n].HideMe();
                        
                        // register occupiedID
                        occupiedID[n] = true;

                        // immobile its base tile
                        tile_Core[n].IsMoving = false;
                    }
                }
            }

            // attached the fell out breakable tile to a new core tile
            for (let i:number = 0; i < tile_Breakable.length; i++) {
                if (tile_Breakable[i].Y > STAGE_HEIGHT) {
                    rng.GenerateTAFollowTile(tile_Breakable[i], tile_Core);
                    // use underwater theme
                    if (_score < 0) {
                        tile_Breakable[i].Name = "Coral/Coral_Idle" ;
                        tile_Breakable[i].ShowMe("Coral/Coral_Idle 01");
                    }
                    
                    else if (_score >= 500) {
                        tile_Breakable[i].Name = "Forcefield/Forcefield_Idle";
                        tile_Breakable[i].ShowMe("Forcefield/Forcefield_Idle 01");
                    }

                    tile_Breakable[i].Hit = 3;
                    tile_Breakable[i].ReActivateMe();
                }
            }

            // attached the fell out bubble tile to a new core tile
            for (let i:number = 0; i < tile_Bubble.length; i++) {
                if (tile_Bubble[i].Y > STAGE_HEIGHT) {
                    // rng.GenerateTAFollowTile(tile_Bubble[i], tile_Core);
                    // tile_Bubble[i].ShowMe("Bubbles/Bubbles_Idle");
                    // tile_Bubble[i].ReActivateMe();

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = rng.RandomBetween(tile_Core.length - rangeExpander, tile_Core.length - 1);
                    } while (occupiedID[n] != false);

                    if (rng.RandomizeTrueFalse(1,1)) {
                        tile_Bubble[i].X = tile_Core[n].X;
                        tile_Bubble[i].Y = tile_Core[n].Y;
                        tile_Bubble[i].ShowMe("Bubbles/Bubbles_Idle");
                        tile_Bubble[i].ReActivateMe();

                        tile_Core[n].HideMe();
                        
                        // register occupiedID
                        occupiedID[n] = true;
                        
                        // immobile its base tile
                        tile_Core[n].IsMoving = false;
                        tile_Bubble[i].IsMoving = rng.RandomizeTrueFalse(1,1);
                        tile_Bubble[i].SetPatrolSpeed(rng.RandomBetween(1, rng.MaxSpeed));
                    }
                }
            }

            // attached the fell out cloud tile to a new core tile
            for (let i:number = 0; i < tile_Cloud.length; i++) {
                if (tile_Cloud[i].Y > STAGE_HEIGHT) {
                    rng.GenerateTAFollowTile(tile_Cloud[i], tile_Core);
                    
                    if (_score > 100) {
                        tile_Cloud[i].ShowMe("Idle/Cloud_Idle");
                        tile_Cloud[i].ActivateMe();
                    }
                }
            }

            // attached the fell out jetpack to a new core tile
            for (let i:number = 0; i < item_Jetpack.length; i++) {
                if (item_Jetpack[i].Y > STAGE_HEIGHT) {

                    let n:number;                    
                    do {
                        // make sure n does not get inside an occupied ID
                        n = rng.RandomBetween(tile_Core.length - 17, tile_Core.length - 1);
                    } while (occupiedID[n] != false);

                    item_Jetpack[i].X = tile_Core[n].X + tile_Core[n].Width / 2;
                    item_Jetpack[i].Y = tile_Core[n].Y;
                    item_Jetpack[i].ReEnableMe();

                    // register occupiedID
                    occupiedID[n] = true;

                    // immobile its base tile
                    tile_Core[n].IsMoving = false;
                }
            }
        }

        else _cameraUpdateSignal = false;
    }
}

/*
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
                        this.tile_Core[i].ShowMe("Normal/Clams");
                    }
                    // switch to above water theme
                    else if (this._score < 500 && this._score >= 0) {
                        this.tile_Core[i].ShowMe("Normal/Shells");
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
                    // slowly increase height difference between tiles
                    this.tile_Core[this.tile_Core.length - 1].Y = this.rng.RandomBetween(
                    this.tile_Core[this.tile_Core.length - 2].Y - this.tile_Core[i].Height * this.rng.MinAltitude,
                    this.tile_Core[this.tile_Core.length - 2].Y - this.tile_Core[i].Height * this.rng.MaxAltitude);

                    // Randomize patrol mode
                    this.tile_Core[this.tile_Core.length - 1].IsMoving = this.rng.RandomizeTrueFalse(20, 1);
                        if (this.tile_Core[this.tile_Core.length - 1].IsMoving) {
                        this.tile_Core[this.tile_Core.length - 1].SetPatrolSpeed(this.rng.RandomBetween(this.rng.MaxSpeed - 2, this.rng.MaxSpeed));
                    }
                    
                    //

                    //this.tile_Core[this.tile_Core.length - 1].CollisionPermission = false;
                    //if (!this.tile_Core[this.tile_Core.length - 1].CollisionPermission) { this.tile_Core[this.tile_Core.length - 1].HideMe();}

                    // release this occupied ID
                    this.occupiedID[this.occupiedID.length - 1] = false;
                }
            }

            // attached the fell out trampoline to a new core tile
            for (let i:number = 0; i < this.tile_Trampoline.length; i++) {
                if (this.tile_Trampoline[i].Y > STAGE_HEIGHT) {

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

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 4, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] != false);

                    if (this.rng.RandomizeTrueFalse(1,1)) {
                        this.tile_Trampoline[i].X = this.tile_Core[n].X;
                        this.tile_Trampoline[i].Y = this.tile_Core[n].Y - 6;
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

                    if (this._score > -250) this.tile_Spiked[1].ShowMe("Spiked/Sea_Urchin");

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - 10, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] != false);
                    
                    if (this.rng.RandomizeTrueFalse(1,1)) {
                        this.tile_Spiked[i].X = this.tile_Core[n].X;
                        this.tile_Spiked[i].Y = this.tile_Core[n].Y;
                        this.tile_Core[n].HideMe();
                        
                        // register occupiedID
                        this.occupiedID[n] = true;
    
                        // immobile its base tile
                        this.tile_Core[n].IsMoving = false;
                    }
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
                    // this.rng.GenerateTAFollowTile(this.tile_Bubble[i], this.tile_Core);
                    // this.tile_Bubble[i].ShowMe("Bubbles/Bubbles_Idle");
                    // this.tile_Bubble[i].ReActivateMe();

                    let n:number;
                    do {
                        // make sure n does not get inside an occupied ID
                        n = this.rng.RandomBetween(this.tile_Core.length - this.rangeExpander, this.tile_Core.length - 1);
                    } while (this.occupiedID[n] != false);

                    if (this.rng.RandomizeTrueFalse(1,1)) {
                        this.tile_Bubble[i].X = this.tile_Core[n].X;
                        this.tile_Bubble[i].Y = this.tile_Core[n].Y;
                        this.tile_Bubble[i].ShowMe("Bubbles/Bubbles_Idle");
                        this.tile_Bubble[i].ReActivateMe();

                        this.tile_Core[n].HideMe();
                        
                        // register occupiedID
                        this.occupiedID[n] = true;
                        
                        // immobile its base tile
                        this.tile_Core[n].IsMoving = false;
                        this.tile_Bubble[i].IsMoving = this.rng.RandomizeTrueFalse(1,1);
                        this.tile_Bubble[i].SetPatrolSpeed(this.rng.RandomBetween(1, this.rng.MaxSpeed));
                    }
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
    */