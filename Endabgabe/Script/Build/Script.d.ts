declare namespace Script {
    import ƒ = FudgeCore;
    class Collectable extends ƒ.Node {
        static collectableMesh: ƒ.MeshQuad;
        textureApple: ƒ.Material;
        textureBanana: ƒ.Material;
        textureMilk: ƒ.Material;
        constructor(_name: string, _x: number, _y: number);
        setName(_name: string): void;
        setPos(_x: number, _y: number): void;
        delete(): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Grocery extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        isGoingUp: boolean;
        pos: number;
        originNode: ƒ.Node;
        constructor();
        hndEvent: (_event: Event) => void;
        move(): void;
        setOrigin(_node: ƒ.Node): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    enum STATUS {
        STAND = 0,
        WALK = 1
    }
    class Ghost extends ƒAid.ComponentStateMachine<STATUS> {
        static readonly iSubclass: number;
        private static instructions;
        originNode: ƒ.Node;
        static pos: number;
        constructor();
        private static actWalk;
        private static actStand;
        static get(): ƒAid.StateMachineInstructions<STATUS>;
        private static actDefault;
        private hndEvent;
        private update;
        private static transitDefault;
        setOrigin(_node: ƒ.Node): void;
    }
}
