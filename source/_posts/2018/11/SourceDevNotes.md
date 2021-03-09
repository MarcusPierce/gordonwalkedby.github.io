---
title: 我的起源开发笔记
date: 2018-11-26 19:14:51
tags: [研究笔记,起源]
---

其实是方便我自己复制粘贴用的（（（ 
各位如果有需要就请自便吧 

VMT 语句：
```c++
UnLitGeneric
VertexlitGeneric
LightmappedGeneric

$basetexture "aaa/bbb"

$surfaceprop brick
$surfaceprop metal
$surfaceprop wood
$surfaceprop grass
$surfaceprop flesh
$surfaceprop rubber

$bumpmap 

$alphatest 1

$halflambert 1

$translucent 1

$nocull 1

$decal 1
$decalscale 0.25

$nodecal 1

$phong 1
$phongboost 1
$PhongFresnelRanges "[0 0.5 1]"
$PhongExponent 5
$lightwarptexture "models/xxx/shader"

$rimlight 1
$rimlightexponent 2
$rimlightboost .2

Proxies
{
    AnimatedTexture
    {
        animatedtexturevar $basetexture
        animatedtextureframenumvar $frame
        animatedtextureframerate 25
    }
}

//随机贴图 https://steamcommunity.com/sharedfiles/filedetails/?id=668958242
Proxies
{
    EntityRandom
    {
        scale 27.99 //这里写动态贴图的帧数减去0.01
        resultVar $frame
    }
}
```

QC 语句：
```c++
$texturegroup a
{
    { "r1" }
    { "r2" }
}

$bodygroup glasses
{
    studio "glasses1.smd"
    blank
}

$modelname "prop_test.mdl"
$scale 1.0
$BodyGroup "body"
{
    studio "r.smd"
}
$staticprop
$surfaceprop wood
$cdmaterials "models/mytextures"
$sequence idle "r.smd"
$collisionmodel "phy.smd"
{
    $mass 10
    $concave
}

$IncludeModel "humans/male_shared.mdl"
$IncludeModel "humans/male_ss.mdl"
$IncludeModel "humans/male_gestures.mdl"
$IncludeModel "humans/male_postures.mdl"

$includemodel "humans/female_shared.mdl"
$includemodel "humans/female_ss.mdl"
$includemodel "humans/female_gestures.mdl"
$includemodel "humans/female_postures.mdl"

$IncludeModel "m_anm.mdl"
$includemodel "f_anm.mdl"

$IncludeModel "combine_soldier_anims.mdl"

//油桶爆炸 models/props_c17/oildrum001_explosive.mdl
$CollisionText
{
    break 
    {
        "model" "props_c17/oildrumchunk01a"
        "health" "10"
        "fadetime" "10"
        "burst" "100"
    }
    break 
    {
        "model" "props_c17/oildrumchunk01b"
        "health" "10"
        "fadetime" "10"
        "burst" "100"
    }
    break 
    {
        "model" "props_c17/oildrumchunk01c"
        "health" "10"
        "fadetime" "10"
        "burst" "100"
    }
    break 
    {
        "model" "props_c17/oildrumchunk01d"
        "health" "10"
        "fadetime" "10"
        "burst" "100"
    }
    break 
    {
        "model" "props_c17/oildrumchunk01e"
        "health" "10"
        "fadetime" "10"
        "burst" "100"
    }
    $KeyValues
    {
        prop_data 
        {
            "dmg.bullets" "1.0"
            "dmg.club" "1.0"
            "dmg.explosive" "1.0"
            "health" "20"
            "explosive_damage" "120"
            "explosive_radius" "256"
        }
        physgun_interactions 
        {
            "onfirstimpact" "break"
        }
        fire_interactions 
        {
            "flammable" "yes"
            "explosive_resist" "yes"
            "ignite" "halfhealth"
        }
    }
}

```

求生之路对应人物模型：
```
Ellis    survivor_mechanic
Nick    survivor_gambler
Coach    survivor_coach
Rochelle    survivor_producer
Bill    survivor_namvet
Francis    survivor_biker
Zoey    survivor_teenangst
Louis    survivor_manager
```

玩家模型、NPC的GMOD LUA：
```lua
local name = "角色名字"
player_manager.AddValidModel(name, "models/模型路径.mdl")
player_manager.AddValidHands(name, "models/模型路径.mdl", 0, "0000000")
list.Set("PlayerOptionsModel", name, "")

list.Set("NPC", "npc_" .. name .. "1", {
    Name = "好NPC名字",
    Class = "npc_citizen",
    Weapons = {"weapon_smg1", "weapon_ar2"},
    Model = "models/模型路径.mdl",
    Category = name,
    KeyValues = {citizentype = 4}
})

list.Set("NPC", "npc_" .. name .. "2", {
    Name = "坏NPC名字",
    Class = "npc_combine_s",
    Weapons = {"weapon_smg1", "weapon_ar2"},
    Model = "models/模型路径.mdl",
    Category = name,
    KeyValues = {SquadName = "overwatch", Numgrenades = 5}
})
```
