import Player from "./Actors/Player";
import { PLAYER_MOVESPEED, STAGE_WIDTH } from "../Constants/Constants_General";

export default class PlayerController {
    
    constructor() {}

    public EnableInput(player:Player):void {
        // wire up eventListener for keyboard keys only on gameplay screen
        document.onkeydown = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {
                player.FlipMeOver("left");
                player.DragSpeed = -PLAYER_MOVESPEED;
            }
            
            else if (e.keyCode == 39 || e.keyCode == 68) {
                player.FlipMeOver("right");
                player.DragSpeed = PLAYER_MOVESPEED;
            }
        }

        document.onkeyup = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65 || e.keyCode == 39 || e.keyCode == 68) {
                player.DragSpeed = 0;
            }
        }
    }

    // Input disabler
    public DisableInput():void {
        document.onkeydown = function () {}
    }

    // Update movement to avoid keyboard clipping
    public UpdateInput(player:Player):void {
        console.log(player.DragSpeed);
        player.X += player.DragSpeed;

        // avoid falling off the screen sides
        if (player.X <  player.Width / 2) {
            player.X =  player.Width / 2;
        } else if (player.X > STAGE_WIDTH - player.Width / 2) {
            player.X = STAGE_WIDTH - player.Width / 2;
        }
    }
}