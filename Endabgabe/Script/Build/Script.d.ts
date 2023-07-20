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
