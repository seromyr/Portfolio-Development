import { STAGE_WIDTH, STAGE_HEIGHT } from "../Constants";
import Tile from "./Tile";

export default class ProceduralGenerator {

    // constructor() {

    // }

    // Randomize a number
    private RandomBetween(low:number, high:number):number {
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

    public RandomGameObjectsInsideStage(tileset:Tile[]) {

        // randomize first
        for (let i:number = 0; i < tileset.length; i++) {
            tileset[i].X = this.RandomBetween(0, STAGE_WIDTH);
            tileset[i].Y = this.RandomBetween(0, STAGE_HEIGHT);
        }

        // check and adjust any tile that too close
        // for (let i:number = 0; i < tileset.length; i++) {
        //     if ( tileset[i].X) {

        //     }
        //     tileset[i].X = this.RandomBetween(0, STAGE_WIDTH);
        //     tileset[i].Y = this.RandomBetween(0, STAGE_HEIGHT);
        // }
    }
}