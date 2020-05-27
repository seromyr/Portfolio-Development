import { STAGE_WIDTH, STAGE_HEIGHT } from "../Constants/Constants_General";
import Tile from "./Tiles/Tile";

export default class ProceduralGenerator {

    private _altMin:number;
    get MinAltitude():number {return this._altMin;}
    set MinAltitude(value:number) {this._altMin = value;}

    private _altMax:number;
    get MaxAltitude():number {return this._altMax;}
    set MaxAltitude(value:number) {this._altMax = value;}

    private _tileMaxSpeed:number;
    get MaxSpeed():number {return this._tileMaxSpeed;}
    set MaxSpeed(value:number) {this._tileMaxSpeed = value;}

    // constructor() {}

    // Randomize a number
    public RandomBetween(low:number, high:number):number {
        let randomNum:number = 0;
        randomNum = Math.floor(Math.random() * (high - low + 1)) + low;
        return randomNum;
    }

    public GenerateCoreTiles(tileset:Tile[], tileStart:Tile):void {
        // the 1st generated tile should stay close to the starting tile
        tileset[0].X = this.RandomBetween(0, STAGE_WIDTH - tileStart.Width);
        tileset[0].Y = this.RandomBetween(tileStart.Y - tileStart.Height * 1, tileStart.Y - tileStart.Height * 4);

        // generate the whole remainings
        for (let i:number = 1; i < tileset.length; i++) {
            tileset[i].X = this.RandomBetween(0,
                                              STAGE_WIDTH -  tileset[i - 1].Width);

            tileset[i].Y = this.RandomBetween(tileset[i - 1].Y - tileset[i - 1].Height * 1.5,
                                              tileset[i - 1].Y - tileset[i - 1].Height * 2);
        }
    }

    public GenerateTLowImpactTiles(tileset:Tile[], tile_Core:Tile[]):void {
        // get a random ID and stay close to it
        for (let i:number = 0; i < tileset.length; i++) {

            let n:number = this.RandomBetween(0, tile_Core.length - 1);

            // put X on the wider part of the screen
            if (tile_Core[n].X < STAGE_WIDTH - tile_Core[n].X) {
                tileset[i].X = this.RandomBetween(tile_Core[n].X + tile_Core[n].Width,
                                                  STAGE_WIDTH - tile_Core[n].Width);
            }

            else {
                tileset[i].X = this.RandomBetween(0, tile_Core[n].X - tile_Core[n].Width);
            }

            tileset[i].Y = tile_Core[n].Y;
        }
    }

    public GenerateALowImpactTile(tile:Tile, tile_Core:Tile[]):void {

        let n:number = tile_Core.length - 1;

        // put X on the wider part of the screen
        if (tile_Core[n].X < STAGE_WIDTH - tile_Core[n].X) {
            tile.X = this.RandomBetween(tile_Core[n].X + tile_Core[n].Width,
                                        STAGE_WIDTH - tile_Core[n].Width);
        } else {
            tile.X = this.RandomBetween(0, tile_Core[n].X - tile_Core[n].Width);
        }

        // put Y higher than the highest tile of the core tile array array
        tile.Y = tile_Core[n].Y;
    }

    public RandomizeTrueFalse(trueRatio:number, falseRatio:number):boolean {
        let value:boolean;

        let i:number = this.RandomBetween(0,trueRatio + falseRatio);

        if (trueRatio > falseRatio) {
            if (i < trueRatio) value = false;
            else value = true;
        }

        else if (trueRatio == falseRatio) {
            if (i <= falseRatio) value = false;
            else value = true;
        }

        else {
            if (i < falseRatio) value = true;
            else value = false;
        }

        return value;
    }
}