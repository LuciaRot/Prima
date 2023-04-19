namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let woman: ƒ.Node; 
  let womanRun: ƒ.Node;
  let womanIdle: ƒ.Node;
  // let womanIdleMaterial: ƒ.ComponentMaterial;
  // let womanRunMaterial: ƒ.ComponentMaterial;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;
  let materialRotation: number;
  // let womanRunTexture: ƒ.Material;
  // let womanAnimation: ƒ.ComponentAnimator;
  // let womanRunAnimation: ƒ.AnimationSprite;


  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  
  

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    woman = viewport.getBranch().getChildrenByName("Woman")[0];
    // womanRun = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanRun")[0];
    womanIdle = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0];
    // womanRunMaterial = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanRun")[0].getComponent(ƒ.ComponentMaterial);
    // womanIdleMaterial = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0].getComponent(ƒ.ComponentMaterial);
    // womanRunTexture = ƒ.Project.getResourcesByName("WomanRun")[0] as ƒ.Material;
    // womanAnimation = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0].getComponent(ƒ.ComponentAnimator);
    // womanRunAnimation = ƒ.Project.getResourcesByName("WomanRun")[0] as ƒ.AnimationSprite;
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    //woman.mtxLocal.translateX(0.01);
    movement();
  }

  function movement():void {
    let timeFrame: number = ƒ.Loop.timeFrameGame/ 1000;
    // ƒ.Physics.simulate();  // if physics is included and used
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])){
      // woman.mtxLocal.rotation = ƒ.Vector3.Y(0);
      woman.mtxLocal.translateX(2 * timeFrame);
      changeAnimation("WomanRun");
      
    } else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
      // woman.mtxLocal.rotation = ƒ.Vector3.Y(180);
      woman.mtxLocal.translateX(-2 * timeFrame);
      // womanIdleMaterial.mtxPivot.rotation = ƒ.Vector3.Y(180);
      materialRotation = womanIdle.getComponent(ƒ.ComponentMaterial).mtxPivot.scaling.x;
      // console.log(materialRotation);
      materialRotation = materialRotation * -1;
      // console.log(materialRotation);
      changeAnimation("WomanRun");
    } else{
      changeAnimation("WomanIdle");
    }

    if(isGrounded = true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      ySpeed = 3;
      isGrounded = false;
    }}
  
  function changeAnimation(_status: string): void {
    // let womanAnimation: ƒ.ComponentAnimator = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName(_status)[0].getComponent(ƒ.ComponentAnimator);
    // let womanSprite: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_status)[0] as ƒ.AnimationSprite;
    let womanMaterial: ƒ.ComponentMaterial = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0].getComponent(ƒ.ComponentMaterial);
    let womanTexture: ƒ.Material = ƒ.Project.getResourcesByName(_status)[0] as ƒ.Material;

    // womanAnimation.animation = womanSprite;
    womanMaterial.material = womanTexture;
    
   
  }

 }