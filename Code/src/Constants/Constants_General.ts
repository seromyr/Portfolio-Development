// game constants
export const STAGE_WIDTH:number = 600;
export const STAGE_HEIGHT:number = 800;
export const BACKGROUND_COLOR:string = "#333333";
export const FRAME_RATE:number = 30;
export const SCREEN_TITLE:string[] = 
    [
        "MainMenu",
        "Gameplay",
        "Shop",
        "GameOver",
        "Credits"
    ];
export const PLAYER_MOVESPEED:number = 10;
export const PLAYER_JUMPSPEED:number = 22;
export const PLAYER_DEFAULT_X:number = 350;
export const PLAYER_DEFAULT_Y:number = STAGE_HEIGHT * 0.6;
export const ANCHOR:number = STAGE_HEIGHT / 2

// manifest for AssetManager
export const ASSET_MANIFEST = [
    // - Background -
    {
        type:"json",
        src:"./lib/Sprites/GameUI.json",
        id:"gameUI",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/GameUI.png",
        id:"gameUI",
        data:0
    },
    // - Playable character -
    {
        type:"json",
        src:"./lib/Sprites/Actors/VirtualGuy.json",
        id:"npc01",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Actors/VirtualGuy.png",
        id:"npc01",
        data:0
    },
    {
        type:"json",
        src:"./lib/Sprites/Actors/Dazzle.json",
        id:"mainChar",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Actors/Dazzle.png",
        id:"mainChar",
        data:0
    },
    // - Fonts
    {
        type:"json",
        src:"./lib/Sprites/Fonts/glyphs_Pixeled.json",
        id:"pixeled",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Fonts/glyphs_Pixeled.png",
        id:"pixeled",
        data:0
    },
];