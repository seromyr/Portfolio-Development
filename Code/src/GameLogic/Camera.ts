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
         
    }
}