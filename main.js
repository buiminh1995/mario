var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render:render});
// var url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
// var plugin;
function preload() {
  game.load.tilemap('objects', 'assets/map1-1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/items2.png');
  game.load.spritesheet('mario', 'assets/marioSmall.png', 34, 34, 7);
  game.load.spritesheet('block', 'assets/block.png', 134, 134);
  game.load.spritesheet('afterHit', 'assets/afterHit.png', 260, 300);
  game.load.image('up', 'assets/up.png')
  game.load.image('right', 'assets/right.png')
  game.load.image('left', 'assets/left.png')
}

var map;
var layer;
var cursors;
var jumpButton;
var runButton;
var result;
var btnUp;
var btnLeft;
var btnRight;

var touch = { up: false, down: false, left: false, right: false };


var mario = {
  sprite: undefined,
  direction: 'right',
  doNothing: true
}

var question = {
  sprite: undefined,
}

var question2 = {
  sprite: undefined,
}

function create() {

  var btnScale = 0.2
  btnUp = game.add.sprite(50, 300, 'up');
  btnUp.scale.setTo(btnScale, btnScale);
  btnLeft = game.add.sprite(1200, 300, 'left');
  btnLeft.scale.setTo(btnScale, btnScale);
  btnRight = game.add.sprite(1300, 300, 'right');
  btnRight.scale.setTo(btnScale, btnScale);

  btnUp.inputEnabled = true;
  btnRight.inputEnabled = true;
  btnLeft.inputEnabled = true;



  btnUp.events.onInputDown.add(function () {
    touch['up'] = true;
  });

  btnUp.events.onInputUp.add(function () {
    touch['up'] = false;
  });

  btnUp.events.onInputOut.add(function () {
    touch['up'] = false;
  });

  //////////////

  //////////////

  btnRight.events.onInputDown.add(function () {
    touch['right'] = true;
  });

  btnRight.events.onInputUp.add(function () {
    touch['right'] = false;
  });

  btnRight.events.onInputOut.add(function () {
    touch['right'] = false;
  });

  //////////////

  btnLeft.events.onInputDown.add(function () {
    touch['left'] = true;
  });

  btnLeft.events.onInputUp.add(function () {
    touch['left'] = false;
  });

  btnLeft.events.onInputOut.add(function () {
    touch['left'] = false;
  });




  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#5C94FC';


  map = game.add.tilemap('objects');
  map.addTilesetImage('items', 'tiles');
  layer = map.createLayer('Capa de Patrones 1');

  layer.resizeWorld();
  layer.wrap = false;
  map.setCollisionBetween(14, 16);
  map.setCollisionBetween(21, 22);
  map.setCollisionBetween(27, 28);
  map.setCollisionByIndex(10);
  map.setCollisionByIndex(13);
  map.setCollisionByIndex(17);
  map.setCollisionByIndex(40);

  //game.physics.p2.convertTilemap(map, layer);
  //game.physics.p2.gravity.y = 300;
  //game.physics.p2.friction = 5;
  mario.sprite = game.add.sprite(50, 50, 'mario');

  
  question.sprite = game.add.sprite(336, 160, 'block')
  question.sprite.scale.setTo(0.12, 0.12);
  game.physics.arcade.enable(question.sprite);
  question.sprite.body.immovable = true;
  question.sprite.body.allowGravity = false;
  question.sprite.hit = false;

  question2.sprite = game.add.sprite(368, 160, 'block')
  question2.sprite.scale.setTo(0.12, 0.12);
  game.physics.arcade.enable(question2.sprite);
  question2.sprite.body.immovable = true;
  question2.sprite.body.allowGravity = false;
  question2.sprite.hit = false;

  mario.sprite.scale.setTo(0.47, 0.47);
  mario.sprite.anchor.x=0.5;
  mario.sprite.anchor.y=0.5;
  mario.sprite.animations.add('walk');

  game.physics.enable(mario.sprite);
  game.physics.arcade.gravity.y = 700;
  mario.sprite.body.bounce.y = 0;
  mario.sprite.body.linearDamping = 1;
  mario.sprite.body.collideWorldBounds = true;
  //mario.sprite.body.acceleration.x = 120;

  mario.sprite.animations.add('left', [2,4,5], 10, true);
  mario.sprite.animations.add('wait', [0], 10, true);
  mario.sprite.animations.add('jump', [6], 10, true);
  
  mario.sprite.body.fixedRotation = true;
  //mario.sprite.body.onBeginContact.add(blockHit, this);
  
  game.camera.follow(mario.sprite);
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  runButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
};

function hitBlock (player, block) {
  if(player.body.velocity.y == 0 && player.body.bottom - player.body.y <= block.body.bottom){
    console.log('hello')
      if(!block.hit){
        block.hit = true
        let tweenUp = game.add.tween(block).to({y: block.y - 20}, 100, Phaser.Easing.Quadratic.Out, true)

        tweenUp.onComplete.add(() => {
          game.add.tween(block).to({y: block.y + 20}, 100, Phaser.Easing.Quadratic.In, true);
        
          block.loadTexture('afterHit')
        })
      }
    }
}


function update(){
  game.physics.arcade.collide(mario.sprite, layer);
  game.physics.arcade.collide(mario.sprite, question.sprite, hitBlock);
  game.physics.arcade.collide(mario.sprite, question2.sprite, hitBlock);


  mario.doNothing = true;
  if (cursors.left.isDown || touch['left']){
    //mario.sprite.body.acceleration.x = -120;
    if(mario.direction!='left'){
      mario.sprite.scale.x *= -1;
      mario.direction = 'left';
    }
    if(mario.sprite.body.velocity.x==0 ||
      (mario.sprite.animations.currentAnim.name!='left' && mario.sprite.body.onFloor())){
      mario.sprite.animations.play('left', 10, true);
    }

    mario.sprite.body.velocity.x -= 5;
    if(runButton.isDown){
      if(mario.sprite.body.velocity.x<-200){
        mario.sprite.body.velocity.x = -200;
      }
    }else{
      if(mario.sprite.body.velocity.x<-120){
        mario.sprite.body.velocity.x = -120;
      }
    }
    mario.doNothing = false;
  }else if (cursors.right.isDown || touch['right']){
    if(mario.direction!='right'){
      mario.sprite.scale.x *= -1;
      mario.direction = 'right';
    }
    if(mario.sprite.body.velocity.x==0 ||
      (mario.sprite.animations.currentAnim.name!='left' && mario.sprite.body.onFloor())){
      mario.sprite.animations.play('left', 10, true);
    }
    mario.sprite.body.velocity.x += 5;
    if(runButton.isDown){
      if(mario.sprite.body.velocity.x>200){
        mario.sprite.body.velocity.x = 200;
      }
    }else{
      if(mario.sprite.body.velocity.x>120){
        mario.sprite.body.velocity.x = 120;
      }
    }
    mario.doNothing = false;
  }
  if (cursors.up.justDown || touch['up']){
    if(mario.sprite.body.onFloor()){
      mario.sprite.body.velocity.y = -310;
      mario.sprite.animations.play('jump', 20, true);
      mario.doNothing = false;
    }
  }
  if(mario.doNothing){
    if(mario.sprite.body.velocity.x>10){
      //mario.sprite.body.acceleration.x = 10;
      mario.sprite.body.velocity.x -= 10;
    }else if(mario.sprite.body.velocity.x<-10){
      //mario.sprite.body.acceleration.x = -10;
      mario.sprite.body.velocity.x += 10;
    }else{
      //mario.sprite.body.acceleration.x = 0;
      mario.sprite.body.velocity.x = 0;
    }
    if(mario.sprite.body.onFloor()){
      mario.sprite.animations.play('wait', 20, true);
    }
  }

}

function render() {
  game.debug.bodyInfo(mario.sprite, 32, 32);
}