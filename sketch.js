var bg,bgImg;
var invisibleGround_bottom,invisibleGround_top
var runner,runner_jumping,runner_running_right,runner_running_left;
var platform,platformImg,platformsGroup;
var coin,coinImg,coinsGroup;
var laser,laserImg,lasersGroup;
var rock,rockImg,rocksGroup;
var gem,gemImg,gemsGroup;

var gameState = "play"
var score = 0
var life = 3

function preload(){
 bgImg = loadImage("assets/bg2.png")
 runner_running_right = loadAnimation("assets/chr1.png","assets/chr2.png","assets/chr3.png","assets/chr4.png")
 runner_running_left = loadAnimation("assets/chl1.png","assets/chl2.png","assets/chl3.png","assets/chl4.png")
 runner_jumping = loadImage("assets/chr2.png")
 platformImg = loadImage("assets/platform.png")
 coinImg = loadAnimation("assets/coin1.png","assets/coin2.png","assets/coin3.png","assets/coin4.png","assets/coin5.png","assets/coin6.png")
 laserImg = loadImage("assets/laser.png")
 rockImg = loadImage("assets/rock.png")
 gemImg = loadImage("assets/gem.png")

}

function setup(){
 createCanvas(1000,500)

 bg = createSprite(500,250,1000,500)
 bg.addImage("bg",bgImg)
 
 
  

 runner = createSprite(80,470,60,60)
 runner.addAnimation("runningRight",runner_running_right)
 runner.addAnimation("runningLeft",runner_running_left)
 runner.addImage("runnerJump", runner_jumping)
 runner.scale = 0.4
 runner.debug = true 
 runner.setCollider('rectangle',0,0,150,runner.height)

 

 

 invisibleGround_bottom = createSprite(20,580,30000,20)
 invisibleGround_bottom.visible = false
  
  platformsGroup = new Group()
  coinsGroup = new Group()
  lasersGroup = new Group()
  rocksGroup = new Group()
  gemsGroup = new Group()

}
function draw(){
 background(0)
 
 drawSprites();
 
  if(gameState==="play"){
    bg.velocityX = -2

    camera.position.x = runner.x
    camera.position.y = runner.y

    if(runner.position.y<=0){
      runner.position.y = 0
    }

    if(keyDown("up")){
      runner.velocityY = -10
      runner.changeImage("runnerJump")
    }
    runner.velocityY+=0.8  

    if(keyDown("down")){
      runner.y +=10
      runner.changeImage("runningRight")
    }

    if(keyDown("right")){
      runner.x +=5
      runner.changeImage("runningRight")
    }

    if(keyDown("left")){
      
      runner.x -=5
      runner.changeImage("runningLeft")
    }

     
    

    runner.collide(invisibleGround_bottom)
                                       
    if (bgImg.x < 1000){
      bgImg.x = 0;
    }
   
    if(platformsGroup.isTouching(runner)){
      runner.velocityY = 0
      runner.collide(platformsGroup)
    }

    coinsGroup.isTouching(runner,destroyCoins)

    gemsGroup.isTouching(runner,destroyGems)

    rocksGroup.isTouching(runner,destroyRocks)


    if(lasersGroup.isTouching(runner)|| score <0 || life<0){
      gameState = "end"
    }

    
    
    
    spawnPlatforms()
    spawnLasers()
    spawnGems()
    spawnRocks()
  }
  
  
  if(gameState === "end"){
 
   runner.destroy()
   platformsGroup.setVelocityXEach(0)
   platformsGroup.destroyEach()
  
   coinsGroup.destroyEach()

   lasersGroup.setVelocityXEach(0)
   lasersGroup.destroyEach()

   gemsGroup.setVelocityXEach(0)
   gemsGroup.destroyEach()

   rocksGroup.setVelocityXEach(0)
   rocksGroup.destroyEach()

   bg.velocityX = 0

   /*textSize(20)
   fill("red")
   text("GAME OVER" , 320,200)*/

   

   gameOver()  
  }
  
  textSize(20)
  strokeWeight(2)
  stroke(0)
  fill("black")
  text("SCORE: " + score, runner.x-120,runner.y-120 )
  text("LIFE:" + life, runner.x-100,runner.y-100)
  
  
}

function spawnPlatforms(){
  if(frameCount%100===0){
    platform = createSprite(runner.x + 300,250,60,60)
    platform.y = Math.round(random(100,450))
    platform.addImage("platform",platformImg)
    platform.scale = 0.6
    platform.velocityX = -2
    platform.debug = true
    platform.setCollider('rectangle',0,0,80,40)

    platform.lifetime = 400

    runner.depth = platform.depth
    runner.depth+=1

    coin = createSprite(platform.x,platform.y-50,40,40)
    coin.addAnimation("coin",coinImg)
    coin.scale = 0.15
    coin.x = platform.x
    coin.lifetime = 400
    coin.velocityX = -2
 
    coinsGroup.add(coin)

    platformsGroup.add(platform)
  }
}

function destroyCoins(coin){
  coin.destroy()
  score+=3
}

function spawnGems(){
  if(frameCount%500===0){
     gem = createSprite(runner.x + 600,Math.round(random(100,400)),60,60)
     gem.addImage("gem",gemImg)
     gem.scale = 0.1
     gem.velocityX = -2
  
     gem.lifetime = 400
     gem.debug = true
     gem.setCollider("rectangle",0,0,40,40)

     gemsGroup.collide(platformsGroup)

     gemsGroup.add(gem)
  }
}

function destroyGems(gem){
  gem.destroy()
  //score+=5
}

function spawnRocks(){
  if(frameCount%300===0){
    rock = createSprite(runner.x + 600,Math.round(random(100,400)),60,60)
    rock.addImage("rock",rockImg)
    rock.scale = 0.3
    rock.velocityX = -4
 
    rock.lifetime = 400
    rock.debug = true
    rock.setCollider("rectangle",0,0,40,40)

    rocksGroup.add(rock)
 }
}

function destroyRocks(rock){
  rock.destroy()
  score-=3
  life -=1
}

function spawnLasers(){
  if(frameCount%200===0){
   laser = createSprite(runner.x + 600,Math.round(random(100,400)),60,60)
   laser.addImage("laser",laserImg)
   laser.scale = 0.1
   laser.velocityX = -6

   laser.lifetime = 400
   laser.debug = true
   laser.setCollider("rectangle",0,0,100,100)

   lasersGroup.add(laser)

  }
}

function gameOver(){
gameState = "end"

//gameOver = createSprite(380,200,20,20)
//gameOver.addImage(gameOverImg)
swal(
  {
    title: `Game Over!!!`,
    text: "Thanks for playing!!",
    imageUrl:"assets/gameEnd.png",
    imageSize: "150x150",
    confirmButtonText: "Play Again"
  },
  function(isConfirm) {
    if (isConfirm) {
      location.reload();
    }
  }
);
}

