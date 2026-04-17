const gameState = {};
const gravStrength = 2000;
var level = 1;
class StartScene extends Phaser.Scene {
  player = 0;
  platforms = 0;
  crates = 0;
  spikes = 0;
  springs = 0;

  constructor(key) { 
    super(key);
  }

  preload() {
    this.load.image('crate', 'assets/crate.png');
    this.load.image('spikes', 'assets/spikes.png');
    this.load.image('spring', 'assets/spring.png');
    this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('exit', 'assets/exit.png');
  }

  create() {
    this.scene.start('Level1');
  }

  createBase() {
    gameState.player = this.physics.add.sprite(225, 300, 'player');
    this.player = gameState.player
    
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(225, 360, 'platform');   
    this.platforms.create(225, -10, 'platform'); 

    this.crates = this.physics.add.group();

    this.spikes = this.physics.add.staticGroup();

    this.springs = this.physics.add.staticGroup();

    const exit = this.physics.add.staticSprite(50, 100, 'exit');

    // Add your code below:
    gameState.player.setCollideWorldBounds(true)
    this.physics.add.collider(gameState.player, this.platforms)
    this.physics.add.collider(gameState.player, this.crates)
    this.physics.add.collider(this.crates, this.platforms)

    this.physics.add.overlap(this.spikes, this.player, () => {
      this.scene.restart();
    })

    this.physics.add.overlap(this.springs, this.player, () => {
      this.player.setVelocityY(this.physics.world.gravity.y * -0.25);
      console.log("hello")
    })

    this.physics.add.overlap(exit, this.player, () => {
      level += 1;
      this.scene.start(`Level${level}`)
    })

    gameState.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (gameState.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.setFlipX(false);
    } else if (gameState.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.setFlipX(true);
    } else {
      this.player.setVelocityX(0);
    }
    if (gameState.cursors.up.isDown) {
      this.physics.world.gravity.y = (gravStrength * -1);
    } else if (gameState.cursors.down.isDown) {
      this.physics.world.gravity.y = gravStrength;
    }
  }
}

class Level1 extends StartScene {
  constructor() { 
    super({ key: 'Level1' });
  }

  create() {
    this.createBase();
    this.platforms.create(100, 200, 'platform');
    this.crates.create(50, 300, 'crate').setDragX(20000);
    this.crates.create(300, 300, 'crate').setDragX(20000);
    this.spikes.create(170, 319, 'spikes');
    this.springs.create(350, 315, 'spring');
    this.springs.create(380, 20, 'spring');
  }

}

class Level2 extends StartScene {
  constructor() { 
    super({ key: 'Level2' });
  }

  create() {
    this.createBase();
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
  scene: [StartScene, Level1, Level2]
}


const game = new Phaser.Game(config);