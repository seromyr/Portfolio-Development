import { STAGE_WIDTH, STAGE_HEIGHT } from "../Constants/Constants_General";
import Tile from "./Tiles/Tile";

export default class ProceduralGenerator {

    // constructor() {

    // }

    // Randomize a number
    public RandomBetween(low:number, high:number):number {
        let randomNum:number = 0;
        randomNum = Math.floor(Math.random() * (high - low + 1)) + low;
        return randomNum;
    }

    // Randomize a coordinates inside the gameplaysren
    public RandomCoordinatesOnScreen():number[][] {
        let randomCoords: number [][] = [[],[]];

        randomCoords[0][0] = this.RandomBetween(0, STAGE_WIDTH);
        randomCoords[0][1] = this.RandomBetween(0, STAGE_HEIGHT);

        return randomCoords;
    }

    public GenerateTiles(tileset:Tile[], tileStart:Tile):void {
        // the 1st generated tile should stay close to the starting tile
        tileset[0].X = this.RandomBetween(0, tileStart.X + tileStart.Width * 2);
        tileset[0].Y = this.RandomBetween(tileStart.Y - tileStart.Height * 3, tileStart.Y - tileStart.Height * 4);

        // generate the whole remainings
        for (let i:number = 1; i < tileset.length; i++) {
            tileset[i].X = this.RandomBetween(0,
                                              tileset[i - 1].X + tileset[i - 1].Width * 3);

            tileset[i].Y = this.RandomBetween(tileset[i - 1].Y - tileset[i - 1].Height * 2,
                                              tileset[i - 1].Y - tileset[i - 1].Height * 4);
        }
    }
    
    public GenerateTFollowTiles(tileset:Tile[], tile_Core:Tile[]):void {
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
            tileset[i].Y = this.RandomBetween(tile_Core[n].Y - tile_Core[n].Height * 1,
                                           tile_Core[n].Y + tile_Core[n].Height * 3);
        }        
    }

    public GenerateTAFollowTile(tileset:Tile, tile_Core:Tile[]):void {
        // get a random ID and stay close to it
        let n:number = this.RandomBetween(0, tile_Core.length - 1);
        // put X on the wider part of the screen
        if (tile_Core[n].X < STAGE_WIDTH - tile_Core[n].X) {            
            tileset.X = this.RandomBetween(tile_Core[n].X + tile_Core[n].Width,
                                           STAGE_WIDTH - tile_Core[n].Width);
        }

        else {
            tileset.X = this.RandomBetween(0, tile_Core[n].X - tile_Core[n].Width);
        }

        tileset.Y = this.RandomBetween(tile_Core[n].Y - tile_Core[n].Height * 1.5,
                                       tile_Core[n].Y + tile_Core[n].Height * 3);
    }

    public RandomizeTrueFalse():boolean {
        let value:boolean;
        let i:number = this.RandomBetween(0,1);
        if (i == 0) value = false;
        else value = true;
        return value;
    }
}