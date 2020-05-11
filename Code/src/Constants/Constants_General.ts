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
        "Leaderboard"
    ];
export const PLAYER_MOVESPEED:number = 10;
export const PLAYER_JUMPSPEED:number = 20;
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
        src:"./lib/Sprites/VirtualGuy.json",
        id:"npc01",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/VirtualGuy.png",
        id:"npc01",
        data:0
    },
    {
        type:"json",
        src:"./lib/Sprites/Dazzle.json",
        id:"mainChar",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Dazzle.png",
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
    {
        type:"json",
        src:"./lib/Sprites/Trampoline.json",
        id:"trampoline",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Trampoline.png",
        id:"trampoline",
        data:0
    },
    // - Foregrounds
    {
        type:"json",
        src:"./lib/Sprites/Environment.json",
        id:"environment",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Environment.png",
        id:"environment",
        data:0
    },
    // - Fonts
    {
        type:"json",
        src:"./lib/Sprites/glyphs_Pixeled.json",
        id:"pixeled",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/glyphs_Pixeled.png",
        id:"pixeled",
        data:0
    },
];