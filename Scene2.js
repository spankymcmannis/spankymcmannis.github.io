class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame');
  }

  preload() {
    this.load.image('background', 'imgs/game_bg.png');
    this.load.spritesheet('player', 'imgs/player.png',
{frameWidth: 32, frameHeight: 32});
    this.load.image('nato', 'imgs/nato.png');
    this.load.spritesheet('explosion', 'imgs/explosion.png',
{frameWidth: 32, frameHeight: 32});
    this.load.image('ball', 'imgs/ball.png');
  }

  create() {
    //keyboard
    this.cursors = this.input.keyboard.createCursorKeys();

    //Background stuff
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0, 0);

    //Scoreboard and timer stuff
    this.scoreboardText = this.add.text(32, 32, 'SCORE:', {
      fontFamily: 'Courier, monospace',
      fontSize: '32px',
      color: '#000'});
    this.score = 0;
    this.scoreboardScore = this.add.text(160, 32, this.score.toString(), {
      fontFamily: 'Courier, monospace',
      fontSize: '32px',
      color: '#000'});
    this.scoreboardTime = this.add.text(224, 32, 'TIME:', {
      fontFamily: 'Courier, monospace',
      fontSize: '32px',
      color: '#000',});
    this.timer = 3600;
    this.timerBar = this.add.rectangle(320, 32, this.timer / 12, 32, 0x00000);
    this.timerBar.setDepth(10);
    this.timerBar.setOrigin(0, 0);
    //CURRENT PROBLEM: GOOGLE FONT WON'T WORK; SEE SCENE 1
    //TRY LOADING VIA CSS TO HTML?

    //Ball's stuff
    this.ball = this.add.image(560, 400, 'ball');
    this.ballThrown = false;
    this.ballHeld = false;

    //Player's stuff
    this.player = this.add.sprite(560, 320, 'player');
    this.anims.create({
        key: 'throw',
        frames: [{key: 'player', frame: 2}, {key: 'player', frame: 0}],
        frameRate: 4,
        repeat: 0
      });
    this.anims.create({
      key: 'hold',
      frames: [{key: 'player', frame: 1}],
      frameRate: 1,
      repeat: -1
    });
    this.playerSpeed = 8;
    this.playerCounter = 0;
    this.playerHasBall = false;
    this.playerThrow = false;
    this.playerDelay = 0;

    //Nato's stuff
    this.nato = this.add.image(80, 320, 'nato');
    this.natoCounter = 0;
    this.natoSpeed = 32;

    //Explosion's stuff
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion'),
      frameRate: 8,
      repeat: 0,
      hideOnComplete: true
    });
  }

  update() {
    this.moveNato(this.nato);
    this.moveBall(this.ball);
    this.updatePlayer(this.player);
    this.pickUpBallCheck();
    this.hitCheck();
    this.updateTimer();
  }

  gameOver() {
    this.scene.start('endGame');
  }

  updateTimer() {
    this.timer -= 1;
    if (this.timer <= 0) {
      this.gameOver();
    } else if (this.timer % 180 == 0) {
      this.timerBar.setSize(this.timer / 12, 32);
    }
  }

  moveNato(thing) {
    this.natoCounter += 1;
    if (this.natoCounter >= 240) {
      thing.y += this.natoSpeed;
      this.natoCounter = 0;
      if (thing.y >= 400 || thing.y <= 208) {
        this.natoSpeed *= -1;
      }
    }
  }

  moveBall(thing) {
    if (this.ballThrown) {
      thing.x -= 5;
      if (thing.x < 0) {
        this.placeBall(thing);
      }
    } else if (this.ballHeld) {
      thing.y = this.player.y;
    }
  }

  placeBall(thing) {
    var randomY = Phaser.Math.Between(200, 440);
    do {
      var randomY = Phaser.Math.Between(200, 440);
    } while (Math.abs(randomY - this.player.y) < 64);
    thing.x = 560;
    thing.y = randomY;
    //commented out for testing
    this.ballHeld = false;
    this.ballThrown = false;
  }

  updatePlayer(thing) {
    this.playerDelay -= 1;
    if (this.playerDelay <= 0) {
      //check for throw
      if (this.cursors.space.isDown && this.ballHeld) {
        this.ball.visible = true;
        this.ballThrown = true;
        this.ball.x -= 5;
        //ballHeld = false;
        thing.play('throw');
      } else if (this.cursors.up.isDown && thing.y > 184) {
        thing.y -= this.playerSpeed;
        this.playerDelay = 15;
      } else if (this.cursors.down.isDown && thing.y < 424) {
        thing.y += this.playerSpeed;
        this.playerDelay = 15;
      }
    }
  }

  pickUpBallCheck() {
    if (!this.ballThrown && !this.ballHeld) {
      if (Math.abs(this.ball.y - this.player.y) < 16) {
        this.ballHeld = true;
        this.ball.visible = false;
        this.player.play('hold');
      }
    }
  }

  hitCheck() {
    if (this.ballThrown) {
      if (Math.abs(this.ball.y - this.nato.y) < 16 &&
Math.abs(this.ball.x - this.nato.x) < 8) {
        //it's a hit
        //play explosion
        this.natoCounter = 0;
        this.placeBall(this.ball);
        this.score += 10;
        this.scoreboardScore.setText(this.score.toString());
      }
    }
  }
}
