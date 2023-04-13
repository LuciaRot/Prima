namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let woman: ƒ.Node; 
  let womanRun: ƒ.Node;
  let womanIdle: ƒ.Node;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  
  

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    woman = viewport.getBranch().getChildrenByName("Woman")[0];
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    womanRun = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanRun")[0];
    womanIdle = viewport.getBranch().getChildrenByName("Woman")[0].getChildrenByName("WomanIdle")[0];
    woman.addEventListener("click", changeAnimation);
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    //woman.mtxLocal.translateX(0.01);
  }
  function changeAnimation(): void {
    console.log("hello");
    womanRun.activate;
    
   
  }

 }