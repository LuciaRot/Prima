namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class Collectable extends ƒ.Node {

        static collectableMesh: ƒ.MeshQuad = new ƒ.MeshQuad("collectableMesh");
        static textureApple: ƒ.Material = ƒ.Project.getResourcesByName("MApple")[0] as ƒ.Material;
        static textureBanana: ƒ.Material = ƒ.Project.getResourcesByName("MBanana")[0] as ƒ.Material;
        static textureMilk: ƒ.Material = ƒ.Project.getResourcesByName("MMilk")[0] as ƒ.Material;

        constructor(_name: string, _x: number, _y: number) {
            super("collectable")

            this.addComponent(new ƒ.ComponentMesh(Collectable.collectableMesh));

             if (_name = "apple") {
                this.addComponent(new ƒ.ComponentMaterial(Collectable.textureApple));
             }
             else if (_name = "banana") {
                this.addComponent(new ƒ.ComponentMaterial(Collectable.textureBanana));
             }
             else if (_name = "milk") {
                this.addComponent(new ƒ.ComponentMaterial(Collectable.textureMilk));
             }     
        

            this.setName(_name);
            this.setPos(_x, _y);
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxWorld.translation.z = 2;
        }

        setName(_name: string): void {
            this.name = _name;
        }

        setPos(_x: number, _y: number) {
            this.mtxWorld.translation.x = _x;
            this.mtxWorld.translation.y = _y;
        }

       delete() {
          
        }
    }
}