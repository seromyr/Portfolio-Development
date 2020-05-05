import { STAGE_WIDTH, STAGE_HEIGHT } from "../Constants";

export default class ProceduralGenerator {

    constructor() {

    }

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
}