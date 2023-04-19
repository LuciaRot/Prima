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
    let womanRun;
    let womanIdle;
    // let womanIdleMaterial: ƒ.ComponentMaterial;
    // let womanRunMaterial: ƒ.ComponentMaterial;
    let ySpeed = 0;
    let isGrounded = true;
    let materialRotation;
    // let womanRunTexture: ƒ.Material;
    // let womanAnimation: ƒ.ComponentAnimator;
    // let womanRunAnimation: ƒ.AnimationSprite;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        woman = viewport.getBranch().getChildrenByName("Woman")[0];
        womanIdle = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        //woman.mtxLocal.translateX(0.01);
        movement();
    }
    function movement() {
        let timeFrame = ƒ.Loop.timeFrameGame / 1000;
        // ƒ.Physics.simulate();  // if physics is included and used
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            // woman.mtxLocal.rotation = ƒ.Vector3.Y(0);
            woman.mtxLocal.translateX(2 * timeFrame);
            changeAnimation("WomanRun");
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            // woman.mtxLocal.rotation = ƒ.Vector3.Y(180);
            woman.mtxLocal.translateX(-2 * timeFrame);
            // womanIdleMaterial.mtxPivot.rotation = ƒ.Vector3.Y(180);
            materialRotation = womanIdle.getComponent(ƒ.ComponentMaterial).mtxPivot.scaling.x;
            // console.log(materialRotation);
            materialRotation = materialRotation * -1;
            // console.log(materialRotation);
            changeAnimation("WomanRun");
        }
        else {
            changeAnimation("WomanIdle");
        }
        if (isGrounded = true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            ySpeed = 3;
            isGrounded = false;
        }
    }
    function changeAnimation(_status) {
        // let womanAnimation: ƒ.ComponentAnimator = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0].getComponent(ƒ.ComponentAnimator);
        // let womanSprite: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_status)[0] as ƒ.AnimationSprite;
        let womanMaterial = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0].getComponent(ƒ.ComponentMaterial);
        let womanTexture = ƒ.Project.getResourcesByName(_status)[0];
        // womanAnimation.animation = womanSprite;
        womanMaterial.material = womanTexture;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map