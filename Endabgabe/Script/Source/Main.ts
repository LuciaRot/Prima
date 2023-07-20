namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let cmpCamera: ƒ.ComponentCamera;
  let player: ƒ.Node;
  let graph: ƒ.Graph;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;
  const gravity: number = -9.81;
  let collectables : ƒ.Node;
  let divGroceries: HTMLElement;
  let imgApple: HTMLElement;
  let imgBanana: HTMLElement;
  let imgMilk: HTMLElement;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    
    graph= <ƒ.Graph>viewport.getBranch();

    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    player = viewport.getBranch().getChildrenByName("character")[0];
    collectables = viewport.getBranch().getChildrenByName("collectables")[0];
    divGroceries = document.getElementById("shoppinglist");
    imgApple = document.getElementById("apple");
    imgBanana = document.getElementById("banana");
    imgMilk = document.getElementById("milk");

    createCollectables();
    //console.log(player);
    
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
   
    /* console.log(collectables); */
    /* console.log(apple.textureApple, apple.textureBanana, apple.textureMilk); */

  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();

   
    movement();
    followCamera();
    collectGroceries();
  }

  function movement():void {
    let timeFrame: number = ƒ.Loop.timeFrameGame/ 1000;
    // ƒ.Physics.simulate();  // if physics is included and used
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])){
      player.mtxLocal.translateX(2 * timeFrame);
      changeAnimation("ASCharacterRunRight", "MCharacterRunRight");     
    } 
    else if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
      player.mtxLocal.translateX(-2 * timeFrame);
      changeAnimation("ASCharacterRunLeft", "MCharacterRunLeft");     
    } else{
      changeAnimation("ASCharacterIdle", "MCharacterIdle");
    }

    if(isGrounded == true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      ySpeed = 5;
      isGrounded = false;
    }

    ySpeed += gravity * timeFrame;
    let pos: ƒ.Vector3 = player.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;

    let tileCollided: ƒ.Node = CollisionFloor(pos);
    if (tileCollided) {
      ySpeed = 0;
      pos.y = tileCollided.mtxWorld.translation.y + 0.48;
      isGrounded = true;
    }
    player.mtxLocal.translation = pos;

    let shelfCollided: ƒ.Node = CollisionShelf(pos);
    if (shelfCollided && pos.y >= shelfCollided.mtxWorld.translation.y) {
      ySpeed = 0;
      pos.y = shelfCollided.mtxWorld.translation.y + 0.48;
      isGrounded = true;
    }
    player.mtxLocal.translation = pos;

    let upperShelfCollided: ƒ.Node = CollisionUpperShelf(pos);
    if (upperShelfCollided && pos.y >= upperShelfCollided.mtxWorld.translation.y) {
      ySpeed = 0;
      pos.y = upperShelfCollided.mtxWorld.translation.y + 0.18;
      isGrounded = true;
      /* console.log("grounded"); */
    }
    player.mtxLocal.translation = pos;

    let bottomBigShelfCollided: ƒ.Node = CollisionBottomBigShelf(pos);
    if (bottomBigShelfCollided && pos.y >= bottomBigShelfCollided.mtxWorld.translation.y) {
      ySpeed = 0;
      pos.y = bottomBigShelfCollided.mtxWorld.translation.y + 0.98;
      isGrounded = true;
     
    }
    player.mtxLocal.translation = pos;
  }

  function changeAnimation(_status: string, _material: string): void {
    let playerCompAnimator: ƒ.ComponentAnimator = player.getComponent(ƒ.ComponentAnimator);
    let playerSprite: ƒ.AnimationSprite = ƒ.Project.getResourcesByName(_status)[0] as ƒ.AnimationSprite;
    let playerCompMaterial: ƒ.ComponentMaterial = player.getComponent(ƒ.ComponentMaterial);
    let playerTexture: ƒ.Material = ƒ.Project.getResourcesByName(_material)[0] as ƒ.Material;
    // console.log(womanAnimation);
    // console.log(womanSprite);
    playerCompAnimator.animation = playerSprite;
    playerCompMaterial.material = playerTexture;
    
   
  }

  function CollisionFloor(_posWorld: ƒ.Vector3): ƒ.Node {
    let tile: ƒ.Node = viewport.getBranch().getChildrenByName("floor")[0];
    //console.log(tiles);
    
      let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5){
        return tile;
    }
  }

  function CollisionShelf(_posWorld: ƒ.Vector3): ƒ.Node {
    let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("shelves")[0].getChildrenByName("bottomShelves")[0].getChildrenByName("shelf");
    //console.log(tiles);
    for (let tile of tiles) {
      let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
        return tile;
  }}

  function CollisionUpperShelf(_posWorld: ƒ.Vector3): ƒ.Node {
    let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("shelves")[0].getChildrenByName("upperShelves")[0].getChildrenByName("shelf");
    //console.log(tiles);
    for (let tile of tiles) {
      let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
        return tile;
  }}

  function CollisionBottomBigShelf(_posWorld: ƒ.Vector3): ƒ.Node {
    let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("shelves")[0].getChildrenByName("bottomBigShelves")[0].getChildrenByName("shelf");
    //console.log(tiles);
    for (let tile of tiles) {
      let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
        return tile;
  }}

    function followCamera(): void{
      let mutator: ƒ.Mutator = player.mtxLocal.getMutator();
      viewport.camera.mtxPivot.mutate(
        { "translation": { "x": mutator.translation.x, "y": mutator.translation.y + 1 } }
      );
    }

    function createCollectables(): void {
      let apple : Collectable = new Collectable("apple", -1.5, 0.8);
      collectables.addChild(apple);

      let banana: Collectable = new Collectable("banana", 7, 2.6);
      collectables.addChild(banana);
    
      let milk: Collectable = new Collectable("milk", 14, 1.9);
      collectables.addChild(milk);
    }

    function collectGroceries(): void {
      let groceries: ƒ.Node[] = collectables.getChildren();
      let playerPos: ƒ.Vector3 = player.mtxLocal.translation;
      let groceryPos: ƒ.Vector3;
      let name: string;
      let img: HTMLElement;
      for (let grocery of groceries) {
        groceryPos = grocery.mtxLocal.translation;
        name = grocery.name;
        if (name == "apple") {
          img = imgApple;
        }
        else if (name == "banana") {
          img = imgBanana;
        }
        else if (name == "milk") {
          img = imgMilk;
        }
        
        if (playerPos.x > groceryPos.x - 0.5 && playerPos.x < groceryPos.x + 0.5 && playerPos.y < groceryPos.y + 0.5 && playerPos.y > groceryPos.y - 0.5) {
        collectables.removeChild(grocery);
        console.log(name);
        divGroceries.removeChild(img);
        }

      }
    }
  
}