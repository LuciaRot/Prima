namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let woman: ƒ.Node; 
  let womanAnimation: ƒ.ComponentAnimator;
  let womanMaterial: ƒ.ComponentMaterial;
  let womanRunMaterial: ƒ.Material;
  let womanRunAnimation: ƒ.AnimationSprite;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  
  

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    woman = viewport.getBranch().getChildrenByName("Woman")[0];
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    womanAnimation = viewport.getBranch().getChildrenByName("Woman")[0].getComponent(ƒ.ComponentAnimator);
    womanMaterial = viewport.getBranch().getChildrenByName("Woman")[0].getComponent(ƒ.ComponentMaterial);
    womanRunAnimation = ƒ.Project.getResourcesByName("WomanRun")[0] as ƒ.AnimationSprite;
    womanRunMaterial = ƒ.Project.getResourcesByName("WomanRun")[0] as ƒ.Material;
    changeAnimation();
    }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    //woman.mtxLocal.translateX(0.01);
  }

  function changeAnimation(): void {
    womanAnimation.animation = womanRunAnimation;
    womanMaterial.material = womanRunMaterial;
    console.log(womanMaterial);
  }
}