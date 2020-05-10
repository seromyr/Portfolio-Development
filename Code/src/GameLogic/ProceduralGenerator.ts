import { STAGE_WIDTH, STAGE_HEIGHT } from "../Constants/Constants_General";
import Tile from "./Tile";

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

    public RandomGameObjectsInsideStage(tileset:Tile[]):void {

        // randomize first
        for (let i:number = 0; i < tileset.length; i++) {
            tileset[i].X = this.RandomBetween(0, STAGE_WIDTH);
            tileset[i].Y = this.RandomBetween(0, STAGE_HEIGHT - tileset[i].Height * 6);
        }

        // // check and adjust any tile that too close
        // for (let i:number = 0; i < tileset.length; i++) {
        //     if ( tileset[i].X) {

        //     }
        //     tileset[i].X = this.RandomBetween(0, STAGE_WIDTH);
        //     tileset[i].Y = this.RandomBetween(0, STAGE_HEIGHT);
        // }
    }

    public GenerateTiles(tileset:Tile[], tileStart:Tile):void {
        // the 1st generated tile should stay close to the starting tile
        tileset[0].X = this.RandomBetween(0, tileStart.X + tileStart.Width * 2);
        tileset[0].Y = this.RandomBetween(tileStart.Y - tileStart.Height * 3, tileStart.Y - tileStart.Height * 4);

        // generate the whole remainings
        for (let i:number = 1; i < tileset.length; i++) {
            tileset[i].X = this.RandomBetween(0,
                                              tileset[i - 1].X + tileset[i - 1].Width * 3);

            tileset[i].Y = this.RandomBetween(tileset[i - 1].Y - tileset[i - 1].Height * 4,
                                              tileset[i - 1].Y - tileset[i - 1].Height * 4);
        }
    }

    // generate the next tile that avoid being to close to the main character
    public GenerateNextTile(playerX:number, playerW:number):number {
        let leftOrRight:number = this.RandomBetween(0,1);

        // if left but the space is not wide enough, then generate on the right
        if (leftOrRight == 0 && playerX < playerW) {
            leftOrRight = this.RandomBetween(playerX + playerW * 2, playerX + playerW * 3);
        }

        // if right but the space is not wide enough, then generate on the left
        else if (leftOrRight == 1 && playerX > playerW) {
            leftOrRight = this.RandomBetween(playerX - playerW * 3, playerX - playerW * 2);
        }

        // if left and the space is wide enough
        else if (leftOrRight == 0 && playerX > playerW) {
            leftOrRight = this.RandomBetween(playerX - playerW * 3, playerX - playerW * 2);
        }

        // if right and the space is wide enough
        else if (leftOrRight == 1 && playerX < playerW) {
            leftOrRight = this.RandomBetween(playerX + playerW * 2, playerX + playerW * 3);
        }

        return leftOrRight;
    }
}