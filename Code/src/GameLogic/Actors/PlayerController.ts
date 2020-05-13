import Player from "./Player";
import { PLAYER_MOVESPEED, STAGE_WIDTH } from "../../Constants/Constants_General";

export default class PlayerController {
    constructor(player:Player) {
        // wire up eventListener for keyboard keys only on gameplay screen
        document.onkeydown = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {
                player.X -= PLAYER_MOVESPEED;
                player.FlipMeOver("left");
                if (player.X <  player.Width / 2) {
                    player.X =  player.Width / 2;
                }
            }
            
            else if (e.keyCode == 39 || e.keyCode == 68) {
                player.X += PLAYER_MOVESPEED;
                player.FlipMeOver("right");
                if (player.X > STAGE_WIDTH - player.Width / 2) {
                    player.X = STAGE_WIDTH - player.Width / 2;
                }
            }
        }

        document.onkeyup = (e:KeyboardEvent) => {
            if (e.keyCode == 37 || e.keyCode == 65) {}

            else if (e.keyCode == 39 || e.keyCode == 68) {}
        }
    }
}