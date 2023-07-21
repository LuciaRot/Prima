# Go shopping

## Informationen
* Title: Go shopping
* Author: Lucia Rothweiler 
* Sommersemester 2023
* MKB7
* Course: Prototyping Interaktiver Medien-Apps und Games
* Docent: Prof. Jirka Dell´Oro-Friedl

## Interaction 
This game is a little jump and run where you have to collect the groceries on your list. The controls are "w" and "d" to move and "space" to jump. As soon as you have collected all the groceries, bring them to the cash register at the end. Be careful not to touch the little ghost and loose all your lives. You'll also loose a life if you go to the cash register too soon.


## Links
* [Link to Repository:](https://github.com/LuciaRot/Prima/tree/main/Endabgabe)
* [Link to Game:](https://luciarot.github.io/Prima/Endabgabe/index.html)
* [Link to Design Document:](https://github.com/LuciaRot/Prima/blob/main/Endabgabe/DesignDocumentGoShopping.pdf)

## Criteria

| Nr | Criterion           | Explanation                                                                                                                                     |
|---:|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
|  1 | Units and Positions |The character starts at x = 0, y = 0. It is 1 unit high and wide. The pivot point of the character is lowered by 0.5 for it to be able to stand  properly.                                                             |
|  2 | Hierarchy           | The nodes all hang onto a graph called Game, which also holds the ComponentCamera. <br><b>Game:</b><ul><li>character</li><li>floor</li><li>collectables</li><li>shelves</li><li>cashRegister</li><li>backgrounds</li></li><li>enemies</li></ul>                                                               |
|  3 | Editor              | I used the Editor to create the Level. The collectables and lives are created in the code, because the order can be changed easier.                                                           |
|  4 | Scriptcomponents    | A script component is used to make the collectables move.                                                        |
|  5 | Extend              | I used a class for the collectables to make it easier to spawn the collectables in the level.                       |
|  6 | Sound               | I used background music on the level, aswell as "pop" sounds on the collectables, when they are collected. There is also a sound when the player completes the game successfully.                                            |
|  7 | VUI                 |The VUI consists of a grocery list, that tells the player which groceries they still need to collect. It updates based on the groceries the player collects. It also shows the lives a player has left, indicated by hearts at the top right of the viewport.                                      |
|  8 | Event-System        |I created a custom event for the "checkout" at the end of the game. When the player brings the groceries to the cash register this event triggers.|
|  9 | External Data       | The config.json sets the lives of the player.                      |
|  A | Light               | There is an Ambient Light and all the Textures have a ShaderLitTexture.                                                                      |
|  B | Physics             | ---                                |
|  C | Net                 | ---                                                                                               |
|  D | State Machines      | The ghost has 2 states. It switches between walking and hovering in a specific time frame.                         |
|  E | Animation           | I used Spritesheets for the Player. The ghost is animated by using the animation system of FudgeCore.   
