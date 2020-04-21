var config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  scene: [Scene1, Scene2, Scene3],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

var game = new Phaser.Game(config);
