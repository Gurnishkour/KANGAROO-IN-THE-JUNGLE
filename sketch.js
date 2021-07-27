/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo=createSprite(50,250,20,50);
  kangaroo.addAnimation("running",kangaroo_running);
  kangaroo.addAnimation("collided",kangaroo_collided);
  kangaroo.scale = 0.15;
  kangaroo.debug = true;
  kangaroo.setCollider("circle" ,0,0,300)

  invisibleGround=createSprite(400,380,1600,10);
  invisibleGround.visible = false;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
kangaroo.x = camera.position.x-270;

if(gameState === PLAY){
jungle.velocityX = -3;

if(jungle.x<100){
  jungle.x = 400;
}

if(keyDown ("space")){
  jumpSound.play();
  kangaroo.velocityY = -10;
}

kangaroo.velocityY += 0.8;
spawnShrubs();
spawnObstacles();
kangaroo.collide(invisibleGround);

if(obstaclesGroup.isTouching(kangaroo)){
  gameState = END;
  collidedSound.play();
}

if(shrubsGroup.isTouching(kangaroo)){
  shrubsGroup.destroyEach();
  score = score + 1;

}
}
else if( gameState === END ){
kangaroo.velocityY = 0;
jungle.velocityX = 0;
obstaclesGroup.setVelocityXEach(0);
shrubsGroup.setVelocityXEach(0);
kangaroo.changeAnimation("collided", kangaroo_collided);
obstaclesGroup.setLifetimeEach (-1);
shrubsGroup.setLifetimeEach (-1);
}

  drawSprites();

  textSize(30);
  fill ("black");
  text("Score: "+ score, width-200,50);

}


function spawnShrubs(){ 
  if(frameCount % 150 === 0) {
    var shrub = createSprite(camera.position.x + 500,330,10,40);
    //obstacle.debug = true;
    shrub.velocityX = -(6 + 3*score/100);
    shrub.scale = 0.1;

    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    shrub.lifetime = 400;
    //add each obstacle to the group
    shrubsGroup.add(shrub);
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2);

  }
}

function spawnObstacles() {
  //write code here to spawn the clouds
  if (frameCount % 120 === 0) {
    var obs = createSprite(camera.position.x + 400,330,40,10);
    obs.addImage(obstacle1);
    obs.scale = 0.15;
    obs.velocityX = -3;
    
     //assign lifetime to the variable
    obs.lifetime = 400;
  
    //add each cloud to the group
    obstaclesGroup.add(obs);
    obs.setCollider("rectangle",0,0,200,200);
  }
  
}

