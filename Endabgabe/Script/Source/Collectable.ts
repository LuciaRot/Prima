namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class Collectable extends ƒ.Node {

        static collectableMesh: ƒ.MeshQuad = new ƒ.MeshQuad("collectableMesh");
        public textureApple: ƒ.Material;
        public textureBanana: ƒ.Material;
        public textureMilk: ƒ.Material;

        constructor(_name: string, _x: number, _y: number) {
            super("collectable")

            this.textureApple = ƒ.Project.getResourcesByName("MApple")[0] as ƒ.Material;
            this.textureBanana = ƒ.Project.getResourcesByName("MBanana")[0] as ƒ.Material;
            this.textureMilk = ƒ.Project.getResourcesByName("MMilk")[0] as ƒ.Material;

            let vector: ƒ.Vector3 = new ƒ.Vector3(_x, _y, 1);

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

        setName(_name: string): void {
            this.name = _name;
        }

        setPos(_x: number, _y: number) {
            this.mtxLocal.translation.x = _x;
            this.mtxLocal.translation.y = _y;
        }

        delete() {

        }
    }
}