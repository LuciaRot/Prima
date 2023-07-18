namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let woman: ƒ.Node; 
  let womanIdle: ƒ.Node;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;
  let materialRotation: number;
  const gravity: number = -9.81;
  let cmpCamera: ƒ.ComponentCamera;
  
 


  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  
  

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    woman = viewport.getBranch().getChildrenByName("Woman")[0];
    womanIdle = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0];
    let graph: ƒ.Graph = <ƒ.Graph>viewport.getBranch();

    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.AudioManager.default.listenTo(graph);

    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    followCamera();
    movement();
  }

  function movement():void {
    let timeFrame: number = ƒ.Loop.timeFrameGame/ 1000;
    // ƒ.Physics.simulate();  // if physics is included and used
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])){
      // woman.mtxLocal.rotation = ƒ.Vector3.Y(0);
      woman.mtxLocal.translateX(2 * timeFrame);
      changeAnimation("ASWomanRun", "MWomanRun");
      
    } else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
      // woman.mtxLocal.rotation = ƒ.Vector3.Y(180);
      woman.mtxLocal.translateX(-2 * timeFrame);
      // womanIdleMaterial.mtxPivot.rotation = ƒ.Vector3.Y(180);
      materialRotation = womanIdle.getComponent(ƒ.ComponentMaterial).mtxPivot.scaling.x;
      // console.log(materialRotation);
      materialRotation = materialRotation * -1;
      // console.log(materialRotation);
      changeAnimation("ASWomanRun", "MWomanRun");
    } else{
      changeAnimation("ASWomanIdle", "MWomanIdle");
    }

    if(isGrounded == true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      ySpeed = 3;
      isGrounded = false;
    }

    ySpeed += gravity * timeFrame;
    let pos: ƒ.Vector3 = womanIdle.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;

    let tileCollided: ƒ.Node = checkCollision(pos);
    if (tileCollided) {
      ySpeed = 0;
      pos.y = tileCollided.mtxWorld.translation.y + 0.5;
      isGrounded = true;
    }
    womanIdle.mtxLocal.translation = pos;
  }
  
  function changeAnimation(_status: string, _material: string): void {
    let womanAnimation: ƒ.ComponentAnimator = woman.getChildrenByName("WomanIdle")[0].getComponent(ƒ.ComponentAnimator);
    let womanSprite: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_status)[0] as ƒ.AnimationSprite;
    let womanMaterial: ƒ.ComponentMaterial = woman.getChildrenByName("WomanIdle")[0].getComponent(ƒ.ComponentMaterial);
    let womanTexture: ƒ.Material = ƒ.Project.getResourcesByName(_material)[0] as ƒ.Material;
    // console.log(womanAnimation);
    // console.log(womanSprite);
    womanAnimation.animation = womanSprite;
    womanMaterial.material = womanTexture;
    
   
  }

  function checkCollision(_posWorld: ƒ.Vector3): ƒ.Node {
    let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("Platforms")[0].getChildrenByName("Platform_2")[0].getChildrenByName("Grass");
    //console.log(tiles);
    for (let tile of tiles) {
      let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
        return tile;
  }}

  function followCamera(): void{
    let mutator: ƒ.Mutator = womanIdle.mtxLocal.getMutator();
    viewport.camera.mtxPivot.mutate(
      { "translation": { "x": mutator.translation.x, "y": mutator.translation.y } }
    );
  }

 }