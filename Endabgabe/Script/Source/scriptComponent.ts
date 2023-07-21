namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    let instance: Grocery;

    export class Grocery extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(Grocery);
        public isGoingUp: boolean = true;
        public pos: number;
        public originNode: ƒ.Node;

        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            instance = this;


            // Listen to this component being added to or removed from a node
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);

        }

        public hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    // ƒ.Debug.log(this.message, this.node);
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
                case ƒ.EVENT.NODE_DESERIALIZED:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        }

        public move(): void {
            if (this.originNode.mtxLocal.translation.y > this.pos + 0.2) {
                this.isGoingUp = false;
            }
            else if (this.originNode.mtxLocal.translation.y < this.pos) {
                this.isGoingUp =true;
            }
            if (this.isGoingUp == true) {
                this.originNode.mtxLocal.translateY(0.01);
            }
            else {
                this.originNode.mtxLocal.translateY(-0.01);
            }
            //console.log(instance.pos);
        }

        public setOrigin(_node: ƒ.Node): void {
            console.log(_node.mtxLocal.translation.y);
            this.originNode = _node;
            this.pos = _node.mtxLocal.translation.y;
        }
    }


}