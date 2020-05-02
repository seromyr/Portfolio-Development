// game constants
export const STAGE_WIDTH:number = 600;
export const STAGE_HEIGHT:number = 800;
export const BACKGROUND_COLOR:string = "#333333";
export const FRAME_RATE:number = 30;
export const SCREEN_TITLE:string[] = 
    [
        "MainMenu",
        "Gameplay",
        "GameOver",
        "Leaderboard"
    ];
export const PLAYER_MOVESPEED:number = 5;
export const PLAYER_JUMPSPEED:number = 1;
export const PLAYER_JUMPHEIGHT:number = 64;


// manifest for AssetManager
export const ASSET_MANIFEST = [
    // - Background -
    {
        type:"json",
        src:"./lib/Sprites/ScreenBackgrounds.json",
        id:"bkgImages",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/ScreenBackgrounds.png",
        id:"bkgImages",
        data:0
    },
    // - Playable character -
    {
        type:"json",
        src:"./lib/Sprites/VirtualGuy.json",
        id:"mainChar",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/VirtualGuy.png",
        id:"mainChar",
        data:0
    },
    // - Tiles -
    {
        type:"json",
        src:"./lib/Sprites/Tiles.json",
        id:"tiles",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Tiles.png",
        id:"tiles",
        data:0
    },
];