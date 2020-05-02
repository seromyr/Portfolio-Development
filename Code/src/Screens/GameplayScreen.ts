import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "./ScreenManager";
import { SCREEN_TITLE } from "../Constants";

export default class GameplayScreen extends ScreenManager {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager,stage, SCREEN_TITLE[1]);
        
    }

    public showMe():void {

        super.showMe();

    }
}