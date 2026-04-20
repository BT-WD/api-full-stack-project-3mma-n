const gameState = {};
const gravStrength = 1000;
var level = 1;
var canSwap = true;
class StartScene extends Phaser.Scene {
  player = 0;
  platforms = 0;
  crates = 0;
  spikes = 0;
  springs = 0;
  exit = 0;

  constructor(key) { 
    super(key);
  }

  preload() {
    this.load.image('crate', 'assets/crate.png');
    this.load.image('spikes', 'assets/spikes.png');
    this.load.image('spring', 'assets/spring.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('exit', 'assets/exit.png');
    this.load.image('pLeft', 'assets/platform_left.png');
    this.load.image('pRight', 'assets/platform_right.png');
    this.load.image('pMid', 'assets/platform_middle.png');
  }

  create() {
    this.scene.start('Level5');
  }

  createBase() {
    gameState.player = this.physics.add.sprite(0, 0, 'player').setFlipX(true)
    this.player = gameState.player
    this.player.body.setSize(30, 46, true);
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(240, 342, 'ground');   
    this.platforms.create(240, 18, 'ground').setFlipY(true); 

    this.crates = this.physics.add.group();

    this.spikes = this.physics.add.staticGroup();

    this.springs = this.physics.add.staticGroup();

    this.exit = this.physics.add.staticSprite(0, 0, 'exit');

    // Add your code below:
    gameState.player.setCollideWorldBounds(true)
    this.physics.add.collider(gameState.player, this.platforms, () => {
      canSwap = true;
    })
    this.physics.add.collider(gameState.player, this.crates)
    this.physics.add.collider(this.crates, this.platforms)

    this.physics.add.overlap(this.spikes, this.player, () => {
      this.scene.restart();
    })

    this.physics.add.overlap(this.springs, this.player, () => {
      this.player.setVelocityY(this.physics.world.gravity.y * -0.5);
    })

    this.physics.add.overlap(this.exit, this.player, () => {
      level += 1;
      this.scene.start(`Level${level}`)
    })

    gameState.cursors = this.input.keyboard.createCursorKeys();
  }

  platformTile(x, y, length) {
    this.platformTile(x, y, length, false)
  }

  platformTile(x, y, length, vertical) {
    x = this.convertX(x);
    y = this.convertY(y);
    length -= 1;
    if (vertical) {
      this.platforms.create(x, y, 'pLeft').setAngle(-90);
      for (let i = 1; i < length; i++) {
        this.platforms.create(x, y - (i * 36), 'pMid').setAngle(-90);  
      }
      this.platforms.create(x, y - (length * 36), 'pRight').setAngle(-90); 
    } else {
      this.platforms.create(x, y, 'pLeft');   
      for (let i = 1; i < length; i++) {
        this.platforms.create(x + (i * 36), y, 'pMid');  
      }
      this.platforms.create(x + (length * 36), y, 'pRight'); 
    } 
  }

    spikeTile(x, y, length) {
      spikeTile(x, y, length, false)
    }

    spikeTile(x, y, length, flip) {
    length -= 1;
    this.placeObject(x, y, 'spikes', flip);
      for (let i = 1; i < length; i++) {
        this.placeObject(x + i, y, 'spikes', flip);  
      }
      this.placeObject(x + length, y, 'spikes', flip); 
  }

  placeObject(x, y, obj) {
    this.placeObject(x, y, obj, false);
  }

  placeObject(x, y, obj, flip) {
    x = this.convertX(x);
    y = this.convertY(y);
    if (obj === 'spikes') {
      if (flip) {
        y -= 9
      } else {
        y += 9;
      }
      const spike = this.spikes.create(x, y, 'spikes').setFlipY(flip);
      spike.body.setSize(30, 18, true);
      if (flip) {
        spike.body.setOffset(3, -8);
      } else {
        spike.body.setOffset(3, 8);
      }
    }
    if (obj === 'crate') {
      this.crates.create(x, y, 'crate').setFlipY(flip).setDragX(20000);
    }
    if (obj === 'spring') {
      if (flip) {
        y -= 8
      } else {
        y += 8;
      }
      this.springs.create(x, y, 'spring').setFlipY(flip);
    }

  }

  placePlayer(x, y) {
    x = this.convertX(x);
    y = this.convertY(y);
    this.player.setPosition(x, y - 10);
  }

  placeExit(x, y) {
    placeExit(x, y, false);
  }

  placeExit(x, y, flip) {
    x = this.convertX(x);
    y = this.convertY(y);
      if (flip) {
        y += 3
      } else {
        y -= 3;
      }
    this.exit.setPosition(x, y).setFlipY(flip);
    this.exit.body.reset(x, y);
  }

  convertX(x) {
    return x * 36 + 18
  }

  convertY(y) {
    return 342 - y * 36
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
    if (gameState.cursors.up.isDown && canSwap) {
      this.physics.world.gravity.y = (gravStrength * -1);
      this.player.setFlipY(true);
      canSwap = false;
    } else if (gameState.cursors.down.isDown && canSwap) {
      this.physics.world.gravity.y = gravStrength;
      this.player.setFlipY(false);
      canSwap = false;
    }
  }
}

class Level1 extends StartScene {
  constructor() { 
    super({ key: 'Level1' });
  }

  create() {
    this.createBase();
    this.placePlayer(1, 1);
    this.placeExit(7,1);
  }

}

class Level2 extends StartScene {
  constructor() { 
    super({ key: 'Level2' });
  }

  create() {
    this.createBase();
    this.placePlayer(1, 1);
    this.placeExit(9,1);
    this.platformTile(5,1,5,true)
  }
}

class Level3 extends StartScene {
  constructor() { 
    super({ key: 'Level3' });
  }

  create() {
    this.createBase();
    this.placePlayer(0, 1);
    this.placeExit(10, 8, true);
    this.spikeTile(2, 1, 3)
    this.spikeTile(7, 8, 2, true)
  }
}

class Level4 extends StartScene {
  constructor() { 
    super({ key: 'Level4' });
  }

  create() {
    this.createBase();
    this.placePlayer(0, 2);
    this.placeExit(10, 1);
    this.spikeTile(5, 1, 2)
    this.spikeTile(0, 8, 12, true)
    this.placeObject(4, 1, 'spring')
  }
}

class Level5 extends StartScene {
  constructor() { 
    super({ key: 'Level5' });
  }

  create() {
    this.createBase();
    this.placePlayer(0, 2);
    this.platformTile(4,1,3)
    this.placeExit(10, 1);
    this.spikeTile(7, 1, 1)
    this.spikeTile(0, 8, 12, true)
    this.placeObject(5,2,'crate')
    this.placeObject(3, 1, 'spring')
  }
}

const config = {
  type: Phaser.AUTO,
  width: 432,
  height: 360,
  backgroundColor: "b9eaff",
  parent: "game-container",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: gravStrength },
      enableBody: true,
    }
  },
  render: {
    pixelArt: true
  },
  scene: [StartScene, Level1, Level2, Level3, Level4, Level5]
}


const game = new Phaser.Game(config);