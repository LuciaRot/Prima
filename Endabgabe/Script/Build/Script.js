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
    let imgApple;
    let imgBanana;
    let imgMilk;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        cmpCamera = graph.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        player = viewport.getBranch().getChildrenByName("character")[0];
        collectables = viewport.getBranch().getChildrenByName("collectables")[0];
        divGroceries = document.getElementById("shoppinglist");
        imgApple = document.getElementById("apple");
        imgBanana = document.getElementById("banana");
        imgMilk = document.getElementById("milk");
        createCollectables();
        //console.log(player);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        /* console.log(collectables); */
        /* console.log(apple.textureApple, apple.textureBanana, apple.textureMilk); */
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        movement();
        followCamera();
        collectGroceries();
    }
    function movement() {
        let timeFrame = ƒ.Loop.timeFrameGame / 1000;
        // ƒ.Physics.simulate();  // if physics is included and used
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            player.mtxLocal.translateX(2 * timeFrame);
            changeAnimation("ASCharacterRunRight", "MCharacterRunRight");
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            player.mtxLocal.translateX(-2 * timeFrame);
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
    function followCamera() {
        let mutator = player.mtxLocal.getMutator();
        viewport.camera.mtxPivot.mutate({ "translation": { "x": mutator.translation.x, "y": mutator.translation.y + 1 } });
    }
    function createCollectables() {
        let apple = new Script.Collectable("apple", -1.5, 0.8);
        collectables.addChild(apple);
        let banana = new Script.Collectable("banana", 7, 2.6);
        collectables.addChild(banana);
        let milk = new Script.Collectable("milk", 14, 1.9);
        collectables.addChild(milk);
    }
    function collectGroceries() {
        let groceries = collectables.getChildren();
        let playerPos = player.mtxLocal.translation;
        let groceryPos;
        let name;
        let img;
        for (let grocery of groceries) {
            groceryPos = grocery.mtxLocal.translation;
            name = grocery.name;
            if (name == "apple") {
                img = imgApple;
            }
            else if (name == "banana") {
                img = imgBanana;
            }
            else if (name == "milk") {
                img = imgMilk;
            }
            if (playerPos.x > groceryPos.x - 0.5 && playerPos.x < groceryPos.x + 0.5 && playerPos.y < groceryPos.y + 0.5 && playerPos.y > groceryPos.y - 0.5) {
                collectables.removeChild(grocery);
                console.log(name);
                divGroceries.removeChild(img);
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map