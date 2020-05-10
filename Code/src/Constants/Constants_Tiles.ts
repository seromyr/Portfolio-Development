// tile manifest for AssetManager

export const TILE_NORMAL:string = "tileNormal";
export const TILE_BIG:string    = "tileBig";
export const TILE_TRAMPOLINE:string = "tileTrampoline";

export const TILE_MANIFEST = [
    // - Normal with different skins -
    {
        type:"json",
        src:"./lib/Sprites/Tiles_Normal.json",
        id:"tileNormal",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Tiles_Normal.png",
        id:"tileNormal",
        data:0
    },
    // - Big with different skins -
    {
        type:"json",
        src:"./lib/Sprites/Tiles_Big.json",
        id:"tileBig",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Tiles_Big.png",
        id:"tileBig",
        data:0
    },
    // - Breakables -
    {
        type:"json",
        src:"./lib/Sprites/Tiles_Breakable.json",
        id:"tileBreakable",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Tiles_Breakable.png",
        id:"tileBreakable",
        data:0
    },
    // - Trampoline -
    {
        type:"json",
        src:"./lib/Sprites/Tiles_Trampoline.json",
        id:"tileTrampoline",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Tiles_Trampoline.png",
        id:"tileTrampoline",
        data:0
    },
];