var caveman, caveman_running;
var scene, invisibleGround, sceneImage;
var log, log1, log2, logsGroup;

var gameOver, gameOverImage;
var restart, restartImage;

var gameOverSound;

var score;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
    caveman_running = loadAnimation("caveman_runcycle.gif");

    sceneImage = loadImage("scene.png");

    log1 = loadImage("log1.png");
    log2 = loadImage("log2.png");

    gameOverImage = loadImage("gameOver.png");
    restartImage = loadImage("restart.png");

    gameOverSound = loadSound("RG8VALN-game-over.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    scene = createSprite(width / 2, height / 2);
    scene.addImage("scene", sceneImage);
    scene.scale = 1.25;

    caveman = createSprite(width - 1450, height - 550);
    caveman.addAnimation("running", caveman_running);
    caveman.scale = 0.4;
    caveman.setCollider("circle", 0, 0, 400);

    gameOver = createSprite(width / 2, height / 2 - 150);
    gameOver.addImage("gameOver", gameOverImage);
    gameOver.scale = 0.7;
    gameOver.visible = false;

    restart = createSprite(width / 2 - 50, height / 2 - 80);
    restart.addImage("restart", restartImage);
    restart.scale = 0.2;
    restart.visible = false;

    invisibleGround = createSprite(width - 1450, height - 300);
    invisibleGround.visible = false;

    score = 0;

    logsGroup = new Group();
}

function draw() {
    background("white");
    drawSprites();

    textSize(30);
    fill("white")
    text("Score: " + score, width - 250, height - 800);

    if (gameState === PLAY) {
        scene.velocityX = -(15 + score / 100);

        score = score + Math.round(getFrameRate() / 60);

        if (scene.x < 600) {
            scene.x = scene.width / 2;
        }

        if (keyDown("space") && caveman.y >= 310) {
            caveman.velocityY = -17;
        }

        caveman.velocityY = caveman.velocityY + 0.8;

        caveman.collide(invisibleGround);
        spawnLog();

        if (logsGroup.isTouching(caveman)) {
            gameState = END;
            gameOverSound.play();
        }
    } else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        scene.velocityX = 0;

        caveman.velocityY = 0;

        caveman.visible = false;

        logsGroup.destroyEach();

        logsGroup.setVelocityXEach(0);

        if (mousePressedOver(restart)) {
            reset();
        }
    }
}

function reset() {
    gameOver.visible = false;
    restart.visible = false;

    gameState = PLAY;

    logsGroup.destroyEach();

    caveman.visible = true;

    score = 0;
}

function spawnLog() {
    if (frameCount % 100 === 0) {
        log = createSprite(width - 50, height - 400);
        log.velocityX = -(15 + score / 100);
        log.scale = 0.3;


        var rand = Math.round(random(1, 2));

        switch (rand) {
            case 1:
                log.addImage("log1", log1);
                break;
            case 2:
                log.addImage("log2", log2);
                break;
            default:
                break;
        }
        logsGroup.add(log);
    }
}