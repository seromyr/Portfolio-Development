import AssetManager from "../Miscs/AssetManager";
import ScreenManager from "../Screens/ScreenManager";
import { SCREEN_TITLE } from "../Constants";

export default class MainMenu extends ScreenManager {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {

        super(assetManager,stage, SCREEN_TITLE[0]);

    }

    public showMe():void {

        super.showMe();

    }
}