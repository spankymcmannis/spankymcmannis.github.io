class Scene3 extends Phaser.Scene {
  constructor() {
    super('endGame');
  }
  create() {
    //just for testing
    this.testNato = this.add.image(320, 240, 'nato');
    this.add.text(20, 20, 'Game over.');
  }
}
