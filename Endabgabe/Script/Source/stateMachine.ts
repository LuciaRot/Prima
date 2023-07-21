namespace Script {

    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum STATUS {
        STAND,WALK
    }
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
    let isGoingUp: boolean = true;

    export class Ghost extends ƒAid.ComponentStateMachine<STATUS> {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(Ghost);
        private static instructions: ƒAid.StateMachineInstructions<STATUS> = Ghost.get();
        public originNode: ƒ.Node;
        public static pos: number = 5;
        

        constructor() {
            super();
            this.instructions = Ghost.instructions;

            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);

        }
        private static actWalk(_machine: Ghost): void {
            let ghostNode: ƒ.Node = <ƒ.Node>_machine.node;

            if (ghostNode.mtxLocal.translation.x > 15) {
                isGoingUp = false;
                
            }
            else if (ghostNode.mtxLocal.translation.x < -3) {
                isGoingUp =true;
            }

            if (isGoingUp == true) {
                ghostNode.mtxLocal.translateX(0.08);
            }
            else {
                ghostNode.mtxLocal.translateX(-0.08);
            }
          

        }

        private static actStand(): void {
            
        }

        public static get(): ƒAid.StateMachineInstructions<STATUS> {
            let setup: ƒAid.StateMachineInstructions<STATUS> = new ƒAid.StateMachineInstructions();
            setup.transitDefault = Ghost.transitDefault;
            setup.actDefault = Ghost.actDefault;
            setup.setAction(STATUS.WALK, <ƒ.General>this.actWalk);
            setup.setAction(STATUS.STAND, <ƒ.General>this.actStand);
            
            return setup;
        }

        
    

        private static actDefault(): void {
            //dconsole.log("Goomba default");
        }

        private hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                    this.transit(STATUS.WALK);
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                    break;
            }
        }

        private update = (_event: Event): void => {
            this.act();
        }
        private static transitDefault(_machine: Ghost): void {
            //console.log("Transit to", _machine.stateNext);
        }

        public setOrigin(_node: ƒ.Node): void {
            console.log(_node.mtxLocal.translation.y);
            this.originNode = _node;
            
        }
    }
}