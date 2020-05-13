// environment manifest for AssetManager

export const ENV_OCEAN:string   = "bkgOceanFloor";
export const ENV_SURFACE:string = "bkgOceanSurface";
export const ENV_SPACE:string   = "bkgSpace";

export const ENV_MANIFEST = [
    // - Ocean floor -
    {
        type:"json",
        src:"./lib/Sprites/Environment/Ocean_Floor_Background.json",
        id:"bkgOceanFloor",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Environment/Ocean_Floor_Background.png",
        id:"bkgOceanFloor",
        data:0
    },
    // - Ocean surface -
    {
        type:"json",
        src:"./lib/Sprites/Environment/Ocean_Surface_Background.json",
        id:"bkgOceanSurface",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Environment/Ocean_Surface_Background.png",
        id:"bkgOceanSurface",
        data:0
    },
    // - Spaaaaaaaaaaaaccceeeeeeeeeeeee -
    {
        type:"json",
        src:"./lib/Sprites/Environment/Space_Background.json",
        id:"bkgSpace",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Environment/Space_Background.png",
        id:"bkgSpace",
        data:0
    },
    // - Foregrounds
    {
        type:"json",
        src:"./lib/Sprites/Environment/Environment.json",
        id:"environment",
        data:0
    },
    {
        type:"image",
        src:"./lib/Sprites/Environment/Environment.png",
        id:"environment",
        data:0
    },
];