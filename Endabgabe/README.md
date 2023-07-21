## Format 
- Include the runtime files of FUDGE used in your repository so they don't outdate.
- Bundle the design documentation in a single well formatted PDF-file.
- Create a README.md file in your PRIMA-Repository on Github including the following
  * Title
  * Author
  * Year and season (Summer, Winter)
  * Curriculum and semester
  * Course this development was created in (PRIMA) 
  * Docent
  - Link to the finished and executable application on Github-Pages
  - Link to the source code
  - Link to the design document
  - Description for users on how to interact
  - Description on how to install, if applicable (additional services, database etc.) 
  - A copy of the catalogue of criteria above, the right column replaced with very brief explanations and descriptions of the fullfullments of these criteria

# Go shopping

## Informationen
* Title: Go shopping
* Author: Lucia Rothweiler 
* Sommersemester 2023
* MKB7
* Course: Prototyping Interaktiver Medien-Apps und Games
* Docent: Prof. Jirka Dell´Oro-Friedl

* ## Links
[Application](#information)

[Source Code](#concept)

[Design Document](#links)

## Interaction 
This game is a little jump and run where you have to collect the groceries on your list. The controls are "w" and "d" to move and "space" to jump. When you have collected all the groceries, bring them to the cash register at the end.


## Links
* [Link to Repository:](https://github.com/LuciaRot/Prima/tree/main/Endabgabe)
* [Link to Game:](https://celinet00.github.io/PRIMA/DDTT/)
* [Link to Design Document:](https://github.com/LuciaRot/Prima/tree/main/Endabgabe/designDoc.pdf)

## Criteria

| Nr | Criterion           | Explanation                                                                                                                                     |
|---:|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
|  1 | Units and Positions |The character starts at x = 0, y = 0. It is 1 unit high and wide. the pivot point of the character is lowered by 0.5 to be able to stand  properly.                                                             |
|  2 | Hierarchy           | The nodes all hang onto a graph called Game, which also holds the ComponentCamera. <br><b>Game:</b><ul><li>character</li><li>floor</li><li>collectables</li><li>shelves</li><li>cashRegister</li><li>backgrounds</li></ul>                                                               |
|  3 | Editor              | I used the Editor to create the Level. The collectables are created in the code, because the order can be changed.                                                           |
|  4 | Scriptcomponents    | I used CustomComponentScript for the different Opponents. If I wanted to make more opponents of 1 type i could to that easier with those.                                                          |
|  5 | Extend              | I used a class for the collectables to make it easier to spawn the collectables in the level.                       |
|  6 | Sound               | I used background music on the level, aswell as "pop" sounds on the collectables, when they are collected. There is also a sound when the player completes the game successfully.                                            |
|  7 | VUI                 |The VUI consists of a grocery list, that tells the player which groceries they still need to collect. It updates based on the groceries the player collects.                                       |
|  8 | Event-System        |I created a custum event for the "checkout" at the end of the game. When the player brings the groceries to the cash register this event triggers.|
|  9 | External Data       | The config.json sets the hearts and the points of the player.      Create a configuration file your application loads and adjusts to the content. Explain your choice of parameters.                 |
|  A | Light               | There is an Ambient Light and all the Textures have a ShaderLitTexture.        If light is required, explain your choice of lights in your graphs (1)                                                               |
|  B | Physics             | With the RigidBody the collision of the opponent and the player is detected. The  pink Opponent is moved with Physics.       Add rigidbody components and work with collisions (1) and/or forces and torques (1) and/or joints (1)                                 |
|  C | Net                 | ---                                                                                               |
|  D | State Machines      | The black Opponent has 2 states. 1 is Idle and if the Player is near it, it goes into its Attack state.          Create autonomous entities using the StateMachine (1) and/or ComponentStateMachine (1) defined in FudgeAid                         |
|  E | Animation           | I used Spritesheets for the Player and the opponents.       Animate using the animation system of FudgeCore (1) and/or Sprites (1) as defined in FudgeAid   
