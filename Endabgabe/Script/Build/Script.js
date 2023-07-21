"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class Collectable extends ƒ.Node {
        constructor(_name, _x, _y) {
            super("collectable");
            this.textureApple = ƒ.Project.getResourcesByName("MApple")[0];
            this.textureBanana = ƒ.Project.getResourcesByName("MBanana")[0];
            this.textureMilk = ƒ.Project.getResourcesByName("MMilk")[0];
            let vector = new ƒ.Vector3(_x, _y, 1);
            this.setName(_name);
            this.addComponent(new ƒ.ComponentMesh(Collectable.collectableMesh));
            if (this.name == "apple") {
                this.addComponent(new ƒ.ComponentMaterial(this.textureApple));
            }
            else if (this.name == "banana") {
                this.addComponent(new ƒ.ComponentMaterial(this.textureBanana));
            }
            else if (this.name == "milk") {
                this.addComponent(new ƒ.ComponentMaterial(this.textureMilk));
            }
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(vector)));
            this.mtxLocal.scaleX(0.5);
            this.mtxLocal.scaleY(0.5);
        }
        setName(_name) {
            this.name = _name;
        }
        setPos(_x, _y) {
            this.mtxLocal.translation.x = _x;
            this.mtxLocal.translation.y = _y;
        }
        delete() {
        }
    }
    Collectable.collectableMesh = new ƒ.MeshQuad("collectableMesh");
    Script.Collectable = Collectable;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let cmpCamera;
    let player;
    let graph;
    let ySpeed = 0;
    let isGrounded = true;
    const gravity = -9.81;
    let collectables;
    let divGroceries;
    let cashRegister;
    let payEvent = new CustomEvent("pay", { bubbles: true });
    let groceries = ["apple", "banana", "milk"];
    let groceryList = [];
    let img = [];
    let sound;
    let win = true;
    let hearts;
    let ghost;
    let animCom;
    let heartsDiv;
    let grocery1;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.AudioManager.default.listenTo(graph);
        cmpCamera = graph.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        player = viewport.getBranch().getChildrenByName("character")[0];
        collectables = viewport.getBranch().getChildrenByName("collectables")[0];
        divGroceries = document.getElementById("shoppinglist");
        cashRegister = viewport.getBranch().getChildrenByName("cashRegister")[0].getChildrenByName("register")[0];
        ghost = viewport.getBranch().getChildrenByName("enemies")[0].getChildrenByName("enemy")[0];
        animCom = ghost.getComponent(ƒ.ComponentAnimator);
        heartsDiv = document.getElementById("hearts");
        heartsDiv.style.left = viewport.canvas.width - 300 + "px";
        ghost.addComponent(new Script.Ghost());
        ghost.getComponent(Script.Ghost).setOrigin(ghost);
        ghost.getComponent(Script.Ghost).transit(Script.STATUS.WALK);
        fetchJson();
        createGroceryList();
        createCollectables();
        addAudio();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        cashRegister.addEventListener("pay", handlePay);
    }
    function update(_event) {
        //ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        movement();
        followCamera();
        collectGroceries();
        CollisionCashRegister();
        grocery1.getComponent(Script.Grocery).move();
    }
    function movement() {
        let timeFrame = ƒ.Loop.timeFrameGame / 1000;
        // ƒ.Physics.simulate();  // if physics is included and used
        //--checking for keyboard input--
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && player.mtxLocal.translation.x < 18.4) {
            player.mtxLocal.translateX(2 * timeFrame);
            changeAnimation("ASCharacterRunRight", "MCharacterRunRight");
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            changeAnimation("ASCharacterRunRight", "MCharacterRunRight");
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && player.mtxLocal.translation.x > -4.3) {
            player.mtxLocal.translateX(-2 * timeFrame);
            changeAnimation("ASCharacterRunLeft", "MCharacterRunLeft");
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            changeAnimation("ASCharacterRunLeft", "MCharacterRunLeft");
        }
        else {
            changeAnimation("ASCharacterIdle", "MCharacterIdle");
        }
        if (isGrounded == true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            ySpeed = 5;
            isGrounded = false;
        }
        ySpeed += gravity * timeFrame;
        let pos = player.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        let tileCollided = CollisionFloor(pos);
        if (tileCollided) {
            ySpeed = 0;
            pos.y = tileCollided.mtxWorld.translation.y + 0.48;
            isGrounded = true;
        }
        player.mtxLocal.translation = pos;
        let shelfCollided = CollisionShelf(pos);
        if (shelfCollided && pos.y >= shelfCollided.mtxWorld.translation.y) {
            ySpeed = 0;
            pos.y = shelfCollided.mtxWorld.translation.y + 0.48;
            isGrounded = true;
        }
        player.mtxLocal.translation = pos;
        let upperShelfCollided = CollisionUpperShelf(pos);
        if (upperShelfCollided && pos.y >= upperShelfCollided.mtxWorld.translation.y) {
            ySpeed = 0;
            pos.y = upperShelfCollided.mtxWorld.translation.y + 0.18;
            isGrounded = true;
            /* console.log("grounded"); */
        }
        player.mtxLocal.translation = pos;
        let bottomBigShelfCollided = CollisionBottomBigShelf(pos);
        if (bottomBigShelfCollided && pos.y >= bottomBigShelfCollided.mtxWorld.translation.y) {
            ySpeed = 0;
            pos.y = bottomBigShelfCollided.mtxWorld.translation.y + 0.98;
            isGrounded = true;
        }
        player.mtxLocal.translation = pos;
    }
    function changeAnimation(_status, _material) {
        let playerCompAnimator = player.getComponent(ƒ.ComponentAnimator);
        let playerSprite = ƒ.Project.getResourcesByName(_status)[0];
        let playerCompMaterial = player.getComponent(ƒ.ComponentMaterial);
        let playerTexture = ƒ.Project.getResourcesByName(_material)[0];
        // console.log(womanAnimation);
        // console.log(womanSprite);
        playerCompAnimator.animation = playerSprite;
        playerCompMaterial.material = playerTexture;
    }
    function CollisionFloor(_posWorld) {
        let tile = viewport.getBranch().getChildrenByName("floor")[0];
        //console.log(tiles);
        let pos = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
        if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5) {
            return tile;
        }
    }
    function CollisionShelf(_posWorld) {
        let tiles = viewport.getBranch().getChildrenByName("shelves")[0].getChildrenByName("bottomShelves")[0].getChildrenByName("shelf");
        //console.log(tiles);
        for (let tile of tiles) {
            let pos = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
            if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
                return tile;
        }
    }
    function CollisionUpperShelf(_posWorld) {
        let tiles = viewport.getBranch().getChildrenByName("shelves")[0].getChildrenByName("upperShelves")[0].getChildrenByName("shelf");
        //console.log(tiles);
        for (let tile of tiles) {
            let pos = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
            if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
                return tile;
        }
    }
    function CollisionBottomBigShelf(_posWorld) {
        let tiles = viewport.getBranch().getChildrenByName("shelves")[0].getChildrenByName("bottomBigShelves")[0].getChildrenByName("shelf");
        //console.log(tiles);
        for (let tile of tiles) {
            let pos = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
            if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
                return tile;
        }
    }
    function CollisionCashRegister() {
        let playerPosX = player.mtxLocal.translation.x;
        let playerPosY = player.mtxLocal.translation.y;
        let registerPosX = cashRegister.mtxLocal.translation.x;
        let registerPosY = cashRegister.mtxLocal.translation.y;
        if (playerPosX > registerPosX - 1 && playerPosX < registerPosX + 1 && playerPosY < registerPosY + 0.5) {
            cashRegister.dispatchEvent(payEvent);
        }
    }
    function followCamera() {
        let mutator = player.mtxLocal.getMutator();
        if (player.mtxLocal.translation.x < 16 && player.mtxLocal.translation.x > -2) {
            viewport.camera.mtxPivot.mutate({ "translation": { "x": mutator.translation.x, "y": mutator.translation.y + 1 } });
        }
    }
    function createCollectables() {
        grocery1 = new Script.Collectable(groceryList[0], -1.5, 0.8);
        collectables.addChild(grocery1);
        grocery1.addComponent(new Script.Grocery());
        grocery1.getComponent(Script.Grocery).setOrigin(grocery1);
        let grocery2 = new Script.Collectable(groceryList[1], 7, 2.6);
        collectables.addChild(grocery2);
        let grocery3 = new Script.Collectable(groceryList[2], 14, 1.9);
        collectables.addChild(grocery3);
        //--create shopping list in div--
        for (let i = 0; i < groceryList.length; i++) {
            let createImg = document.createElement("img");
            createImg.src = "http://127.0.0.1:5500/Endabgabe/collectables/" + groceryList[i] + ".png";
            createImg.id = groceryList[i];
            divGroceries.appendChild(createImg);
            img.push(createImg);
        }
    }
    function createHearts() {
        for (let i = 0; i < hearts; i++) {
            let createImg = document.createElement("img");
            createImg.src = "graphics/heart.png";
            heartsDiv.appendChild(createImg);
        }
    }
    function collectGroceries() {
        let groceries = collectables.getChildren();
        let playerPos = player.mtxLocal.translation;
        let groceryPos;
        let name;
        for (let grocery of groceries) {
            groceryPos = grocery.mtxLocal.translation;
            name = grocery.name;
            if (playerPos.x > groceryPos.x - 0.3 && playerPos.x < groceryPos.x + 0.3 && playerPos.y < groceryPos.y + 0.3 && playerPos.y > groceryPos.y - 0.5) {
                collectables.removeChild(grocery);
                let img = document.getElementById(name);
                divGroceries.removeChild(img);
                checkGrocery(name);
                addSound("pop");
            }
        }
    }
    function handlePay(_event) {
        if (groceryList.length == 0 && win == true) {
            console.log("wuhuuuu");
            addSoundRegister("win");
            win = false;
        }
        else {
            console.log("notyet");
        }
    }
    function createGroceryList() {
        for (let i = 0; i < 3; i++) {
            let n = Math.floor(Math.random() * 3);
            groceryList.push(groceries[n]);
            console.log(groceryList);
        }
    }
    function checkGrocery(_grocery) {
        let grocery = _grocery;
        for (let i = 0; i < groceryList.length; i++) {
            if (grocery = groceryList[i])
                groceryList.splice(i, 1);
            console.log(groceryList);
            break;
        }
    }
    function addAudio() {
        let audioListener = viewport.getBranch().getComponent(ƒ.ComponentAudioListener);
        ƒ.AudioManager.default.listenWith(audioListener);
        ƒ.AudioManager.default.listenTo(viewport.getBranch());
    }
    function addSound(_sound) {
        let audio = collectables.getComponent(ƒ.ComponentAudio);
        sound = ƒ.Project.getResourcesByName(_sound)[0];
        console.log(sound);
        audio.setAudio(sound);
        audio.play(true);
    }
    function addSoundRegister(_sound) {
        let audio = viewport.getBranch().getChildrenByName("cashRegister")[0].getComponent(ƒ.ComponentAudio);
        sound = ƒ.Project.getResourcesByName(_sound)[0];
        console.log(sound);
        console.log(audio);
        //audio.setAudio(sound);
        audio.play(true);
    }
    async function fetchJson() {
        let table = await fetch("hearts.json");
        let textTable = await table.text();
        let data = JSON.parse(textTable);
        hearts = Number(data["hearts"]);
        console.log(hearts);
        createHearts();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let instance;
    class Grocery extends ƒ.ComponentScript {
        constructor() {
            super();
            this.isGoingUp = true;
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        // ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            instance = this;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        move() {
            if (this.originNode.mtxLocal.translation.y > this.pos + 0.2) {
                this.isGoingUp = false;
            }
            else if (this.originNode.mtxLocal.translation.y < this.pos) {
                this.isGoingUp = true;
            }
            if (this.isGoingUp == true) {
                this.originNode.mtxLocal.translateY(0.01);
            }
            else {
                this.originNode.mtxLocal.translateY(-0.01);
            }
            //console.log(instance.pos);
        }
        setOrigin(_node) {
            console.log(_node.mtxLocal.translation.y);
            this.originNode = _node;
            this.pos = _node.mtxLocal.translation.y;
        }
    }
    // Register the script as component for use in the editor via drag&drop
    Grocery.iSubclass = ƒ.Component.registerSubclass(Grocery);
    Script.Grocery = Grocery;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let STATUS;
    (function (STATUS) {
        STATUS[STATUS["STAND"] = 0] = "STAND";
        STATUS[STATUS["WALK"] = 1] = "WALK";
    })(STATUS = Script.STATUS || (Script.STATUS = {}));
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let isGoingUp = true;
    class Ghost extends ƒAid.ComponentStateMachine {
        constructor() {
            super();
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        this.transit(STATUS.WALK);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        break;
                }
            };
            this.update = (_event) => {
                this.act();
            };
            this.instructions = Ghost.instructions;
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        static actWalk(_machine) {
            let ghostNode = _machine.node;
            if (ghostNode.mtxLocal.translation.x > 15) {
                isGoingUp = false;
            }
            else if (ghostNode.mtxLocal.translation.x < -3) {
                isGoingUp = true;
            }
            if (isGoingUp == true) {
                ghostNode.mtxLocal.translateX(0.08);
            }
            else {
                ghostNode.mtxLocal.translateX(-0.08);
            }
        }
        static actStand() {
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = Ghost.transitDefault;
            setup.actDefault = Ghost.actDefault;
            setup.setAction(STATUS.WALK, this.actWalk);
            setup.setAction(STATUS.STAND, this.actStand);
            return setup;
        }
        static actDefault() {
            //dconsole.log("Goomba default");
        }
        static transitDefault(_machine) {
            //console.log("Transit to", _machine.stateNext);
        }
        setOrigin(_node) {
            console.log(_node.mtxLocal.translation.y);
            this.originNode = _node;
        }
    }
    Ghost.iSubclass = ƒ.Component.registerSubclass(Ghost);
    Ghost.instructions = Ghost.get();
    Ghost.pos = 5;
    Script.Ghost = Ghost;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map