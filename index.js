function preload() {
  this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png');
  this.load.image('bug2', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png');
  this.load.image('bug3', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png');
  this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
  this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/physics/codey.png');
}

const gameState = {};

const gravStrength = 2000;

function create() {
    gameState.player = this.physics.add.sprite(225, 300, 'codey').setScale(.5);
    
    const platforms = this.physics.add.staticGroup();
    platforms.create(225, 360, 'platform');
    platforms.create(225, -10, 'platform');
    platforms.create(100, 200, 'platform');

    const crates = this.physics.add.group();
    crates.create(50, 300, 'bug1')
    crates.create(300, 300, 'bug1')

    // Add your code below:
    gameState.player.setCollideWorldBounds(true)
    this.physics.add.collider(gameState.player, platforms)
    this.physics.add.collider(gameState.player, crates)
    this.physics.add.collider(crates, platforms)

    gameState.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (gameState.cursors.left.isDown) {
  	gameState.player.setVelocityX(-160);
	} else if (gameState.cursors.right.isDown) {
 		gameState.player.setVelocityX(160);
	} else {
    gameState.player.setVelocityX(0);
  }
  if (gameState.cursors.up.isDown) {
    this.physics.world.gravity.y = (gravStrength * -1);
  } else if (gameState.cursors.down.isDown) {
    this.physics.world.gravity.y = gravStrength;
  }
}

const config = {
  type: Phaser.AUTO,
  width: 450,
  height: 350,
  backgroundColor: "b9eaff",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: gravStrength },
      enableBody: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);