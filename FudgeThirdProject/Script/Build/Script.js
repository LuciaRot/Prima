"use strict";
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
    let woman;
    let womanIdle;
    let ySpeed = 0;
    let isGrounded = true;
    let materialRotation;
    const gravity = -9.81;
    let cmpCamera;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        woman = viewport.getBranch().getChildrenByName("Woman")[0];
        womanIdle = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0];
        let graph = viewport.getBranch();
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.AudioManager.default.listenTo(graph);
        cmpCamera = graph.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        followCamera();
        movement();
    }
    function movement() {
        let timeFrame = ƒ.Loop.timeFrameGame / 1000;
        // ƒ.Physics.simulate();  // if physics is included and used
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            // woman.mtxLocal.rotation = ƒ.Vector3.Y(0);
            woman.mtxLocal.translateX(2 * timeFrame);
            changeAnimation("ASWomanRun", "MWomanRun");
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            // woman.mtxLocal.rotation = ƒ.Vector3.Y(180);
            woman.mtxLocal.translateX(-2 * timeFrame);
            // womanIdleMaterial.mtxPivot.rotation = ƒ.Vector3.Y(180);
            materialRotation = womanIdle.getComponent(ƒ.ComponentMaterial).mtxPivot.scaling.x;
            // console.log(materialRotation);
            materialRotation = materialRotation * -1;
            // console.log(materialRotation);
            changeAnimation("ASWomanRun", "MWomanRun");
        }
        else {
            changeAnimation("ASWomanIdle", "MWomanIdle");
        }
        if (isGrounded == true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            ySpeed = 3;
            isGrounded = false;
        }
        ySpeed += gravity * timeFrame;
        let pos = womanIdle.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        let tileCollided = checkCollision(pos);
        if (tileCollided) {
            ySpeed = 0;
            pos.y = tileCollided.mtxWorld.translation.y + 0.5;
            isGrounded = true;
        }
        womanIdle.mtxLocal.translation = pos;
    }
    function changeAnimation(_status, _material) {
        let womanAnimation = woman.getChildrenByName("WomanIdle")[0].getComponent(ƒ.ComponentAnimator);
        let womanSprite = ƒ.Project.getResourcesByName(_status)[0];
        let womanMaterial = woman.getChildrenByName("WomanIdle")[0].getComponent(ƒ.ComponentMaterial);
        let womanTexture = ƒ.Project.getResourcesByName(_material)[0];
        // console.log(womanAnimation);
        // console.log(womanSprite);
        womanAnimation.animation = womanSprite;
        womanMaterial.material = womanTexture;
    }
    function checkCollision(_posWorld) {
        let tiles = viewport.getBranch().getChildrenByName("Platforms")[0].getChildrenByName("Platform_2")[0].getChildrenByName("Grass");
        //console.log(tiles);
        for (let tile of tiles) {
            let pos = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
            if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
                return tile;
        }
    }
    function followCamera() {
        let mutator = womanIdle.mtxLocal.getMutator();
        viewport.camera.mtxPivot.mutate({ "translation": { "x": mutator.translation.x, "y": mutator.translation.y } });
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map