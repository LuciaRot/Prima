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
  let collectables: ƒ.Node;
  let divGroceries: HTMLElement;
  let cashRegister: ƒ.Node;
  let payEvent: CustomEvent = new CustomEvent("pay", { bubbles: true });
  let groceries: string[] = ["apple", "banana", "milk"];
  let groceryList: string[] = [];
  let img: HTMLElement[] = [];
  let sound: ƒ.Audio;
  let win: boolean = true;
  let hearts: number;
  let ghost: ƒ.Node;
  let animCom: ƒ.Component;
  let heartsDiv: HTMLElement;
  let grocery1: Collectable;



  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;


    graph = <ƒ.Graph>viewport.getBranch();

    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.AudioManager.default.listenTo(graph);

    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    player = viewport.getBranch().getChildrenByName("character")[0];
    collectables = viewport.getBranch().getChildrenByName("collectables")[0];
    divGroceries = document.getElementById("shoppinglist");
    cashRegister = viewport.getBranch().getChildrenByName("cashRegister")[0].getChildrenByName("register")[0];
    ghost = viewport.getBranch().getChildrenByName("enemies")[0].getChildrenByName("enemy")[0];
    animCom = ghost.getComponent(ƒ.ComponentAnimator);
    heartsDiv = document.getElementById("hearts");
    heartsDiv.style.left = viewport.canvas.width - 300 + "px";

    ghost.addComponent(new Ghost());
    ghost.getComponent(Ghost).setOrigin(ghost);
    ghost.getComponent(Ghost).transit(STATUS.WALK);
    window.setInterval(function () {
      if (ghost.getComponent(Ghost).stateCurrent == STATUS.WALK) {
        ghost.getComponent(Ghost).transit(STATUS.STAND);
      }
      else if (ghost.getComponent(Ghost).stateCurrent == STATUS.STAND) {
        ghost.getComponent(Ghost).transit(STATUS.WALK);
      }
    }, 5000)


    fetchJson();
    createGroceryList();
    createCollectables();
    addAudio();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    cashRegister.addEventListener("pay", handlePay);

  }

  function update(_event: Event): void {
    //ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();


    movement();
    followCamera();
    collectGroceries();
    CollisionCashRegister();
    grocery1.getComponent(Grocery).move();




  }

  function movement(): void {
    let timeFrame: number = ƒ.Loop.timeFrameGame / 1000;
    // ƒ.Physics.simulate();  // if physics is included and used

    //--checking for keyboard input--
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && player.mtxLocal.translation.x < 18.4) {
      player.mtxLocal.translateX(2 * timeFrame);
      changeAnimation("ASCharacterRunRight", "MCharacterRunRight");

    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
      changeAnimation("ASCharacterRunRight", "MCharacterRunRight");
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && player.mtxLocal.translation.x > - 4.3) {
      player.mtxLocal.translateX(-2 * timeFrame);
      changeAnimation("ASCharacterRunLeft", "MCharacterRunLeft");
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
      changeAnimation("ASCharacterRunLeft", "MCharacterRunLeft");


    } else {
      changeAnimation("ASCharacterIdle", "MCharacterIdle");
    }

    if (isGrounded == true && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
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
    if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5) {
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
    }
  }

  function CollisionUpperShelf(_posWorld: ƒ.Vector3): ƒ.Node {
    let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("shelves")[0].getChildrenByName("upperShelves")[0].getChildrenByName("shelf");
    //console.log(tiles);
    for (let tile of tiles) {
      let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
        return tile;
    }
  }

  function CollisionBottomBigShelf(_posWorld: ƒ.Vector3): ƒ.Node {
    let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("shelves")[0].getChildrenByName("bottomBigShelves")[0].getChildrenByName("shelf");
    //console.log(tiles);
    for (let tile of tiles) {
      let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
        return tile;
    }
  }
  function CollisionCashRegister(): void {
    let playerPosX: number = player.mtxLocal.translation.x;
    let playerPosY: number = player.mtxLocal.translation.y;
    let registerPosX: number = cashRegister.mtxLocal.translation.x;
    let registerPosY: number = cashRegister.mtxLocal.translation.y;
    if (playerPosX > registerPosX - 1 && playerPosX < registerPosX + 1 && playerPosY < registerPosY + 0.5) {
      cashRegister.dispatchEvent(payEvent);
    }
  }


  function followCamera(): void {
    let mutator: ƒ.Mutator = player.mtxLocal.getMutator();

    if (player.mtxLocal.translation.x < 16 && player.mtxLocal.translation.x > - 2) {
      viewport.camera.mtxPivot.mutate(
        { "translation": { "x": mutator.translation.x, "y": mutator.translation.y + 1 } }
      );
    }


  }

  function createCollectables(): void {
    grocery1 = new Collectable(groceryList[0], -1.5, 0.8);
    collectables.addChild(grocery1);
    grocery1.addComponent(new Grocery());
    grocery1.getComponent(Grocery).setOrigin(grocery1);


    let grocery2: Collectable = new Collectable(groceryList[1], 7, 2.6);
    collectables.addChild(grocery2);

    let grocery3: Collectable = new Collectable(groceryList[2], 14, 1.9);
    collectables.addChild(grocery3);

    //--create shopping list in div--
    for (let i: number = 0; i < groceryList.length; i++) {
      let createImg = document.createElement("img");
      createImg.src = "http://127.0.0.1:5500/Endabgabe/collectables/" + groceryList[i] + ".png";
      createImg.id = groceryList[i];
      divGroceries.appendChild(createImg);
      img.push(createImg);
    }
  }

  function createHearts(): void {
    for (let i: number = 0; i < hearts; i++) {
      let createImg = document.createElement("img");
      createImg.src = "graphics/heart.png";
      heartsDiv.appendChild(createImg);
    }
  }

  function collectGroceries(): void {
    let groceries: ƒ.Node[] = collectables.getChildren();
    let playerPos: ƒ.Vector3 = player.mtxLocal.translation;
    let groceryPos: ƒ.Vector3;
    let name: string;

    for (let grocery of groceries) {
      groceryPos = grocery.mtxLocal.translation;
      name = grocery.name;


      if (playerPos.x > groceryPos.x - 0.3 && playerPos.x < groceryPos.x + 0.3 && playerPos.y < groceryPos.y + 0.3 && playerPos.y > groceryPos.y - 0.5) {
        collectables.removeChild(grocery);
        let img: HTMLElement = document.getElementById(name);
        divGroceries.removeChild(img);
        checkGrocery(name);
        addSound("pop");
      }

    }


  }
  function handlePay(_event: CustomEvent): void {
    if (groceryList.length == 0 && win == true) {
      console.log("wuhuuuu");
      addSoundRegister("win");
      win = false;
    }
    else {
      console.log("notyet");
    }
  }

  function createGroceryList(): void {
    for (let i: number = 0; i < 3; i++) {
      let n: number = Math.floor(Math.random() * 3);

      groceryList.push(groceries[n]);
      console.log(groceryList);
    }
  }

  function checkGrocery(_grocery: string): void {
    let grocery: string = _grocery;

    for (let i: number = 0; i < groceryList.length; i++) {
      if (grocery = groceryList[i])
        groceryList.splice(i, 1);
      console.log(groceryList);
      break;
    }
  }

  function addAudio() {
    let audioListener: ƒ.ComponentAudioListener = viewport.getBranch().getComponent(ƒ.ComponentAudioListener);
    ƒ.AudioManager.default.listenWith(audioListener);
    ƒ.AudioManager.default.listenTo(viewport.getBranch());

  }
  function addSound(_sound: string): void {
    let audio: ƒ.ComponentAudio = collectables.getComponent(ƒ.ComponentAudio);
    sound = ƒ.Project.getResourcesByName(_sound)[0] as ƒ.Audio;
    console.log(sound);
    audio.setAudio(sound);
    audio.play(true);
  }

  function addSoundRegister(_sound: string): void {
    let audio: ƒ.ComponentAudio = viewport.getBranch().getChildrenByName("cashRegister")[0].getComponent(ƒ.ComponentAudio);
    sound = ƒ.Project.getResourcesByName(_sound)[0] as ƒ.Audio;
    console.log(sound);
    console.log(audio);
    //audio.setAudio(sound);
    audio.play(true);
  }

  async function fetchJson(): Promise<void> {
    let table: Response = await fetch("hearts.json");
    let textTable: string = await table.text();
    let data = JSON.parse(textTable);
    hearts = Number(data["hearts"]);
    console.log(hearts);
    createHearts();
  }


}