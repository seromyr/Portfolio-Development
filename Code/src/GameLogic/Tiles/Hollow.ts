import { TILE_HOLLOW } from "../../Constants/Constants_Tiles";
import AssetManager from "../../Miscs/AssetManager";
import Tile from "./Tile";

export default class Hollow extends Tile {

    constructor(assetManager:AssetManager, stage:createjs.StageGL) {
        super(assetManager, stage, TILE_HOLLOW);
    }

    public DissolveMe():void {
        // dissolve the hollow
        this._sprite.gotoAndPlay(`${this.Name}/${this.Name}_Disappear/${this.Name}_Disappear`);

        this._sprite.on("animationend", () => {
            // hide the sprite by reduce the alpha level
            this._sprite.alpha = 0;

            // use window timeout to wait
            window.setTimeout(() => {
                // reset the alpha level to make the sprite visible
                this._sprite.alpha = 1;

                // reastablish hollow
                this._sprite.gotoAndPlay(`${this.Name}/${this.Name}_Reappear/${this.Name}_Reappear`);

                this._sprite.on("animationend", () => {

                    // on animation end, set the animation state to idle
                    this._sprite.gotoAndPlay(`${this.Name}/${this.Name}_Idle`);

                }, this, true);

            }, 500);

        }, this, true);

        // don't forget to clear timeout
        window.clearTimeout();
    }
}