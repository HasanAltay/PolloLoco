class World {
  character = new Character();
  chicken = new Chicken();
  // boss = new Endboss();
  // coin = new Coins();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  endbossBar = new EndbossBar();
  coinBar = new CoinBar();
  // bottleBar = new BottleBar();
  throwableObject = [];
  endboss_ambience_sound = new Audio('audio/boss.wav');
  ambience_lvl1 = new Audio('audio/ambience.flac');
  music = new Audio('audio/mexican_music.mp3');
  collectedCoins = [];



  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  
  setWorld() {
    this.character.world = this;  
    this.chicken.world = this;
    // this.coin.world = this;
    this.ambience_lvl1.play();
    this.music.play();  
    this.music.loop = true;
    this.music.volume = 0.1;
    this.ambience_lvl1.loop = true;
    this.endboss_ambience_sound.volume = 0.3;
  }


  run() {
    setInterval(() => {
      this.checkCollisions();
    }, 200);

    setInterval(() => {
      this.checkThrowObjects();
      // setTimeout(() => {}, 4000)
    }, 400); 

    setInterval(() => { 
        this.checkCollisionThrowBottle();
    }, 40);  

    setInterval(() => {
      this.checkCollisionsCharacterWithCoins();
    }, 100);
    
    setInterval(() => {
      this.endboss_ambience();
    }, 100);

    setInterval(() => {
      this.endboss_attack();
    }, 100);

  }


  endboss_attack() {
    if (this.character.x > 3550) {
      this.level.enemies[this.level.enemies.length-1].characterCheckpoint = true;
    }
  }


  // press D and throw bottle
  checkThrowObjects() {
    if (this.keyboard.D && !this.character.walkingLeft) {
      let bottle = new ThrowableObject(this.character.x +79, this.character.y +120);
      this.throwableObject.push(bottle);
        this.character.loadImage('img/2_character_pepe/2_walk/W-23.png');
    }
  }

  // character hit enemy then lose health
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) ) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        console.log('Collision with Enemy, Energy:', this.character.energy);
      }
    });
  }


  // chicken die if hit by bottle and vanish
  checkCollisionThrowBottle() { 
    this.throwableObject.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isCollidingBottle(enemy) ) {
          
          setInterval(() => {
            clearInterval(this.chicken.animate());
            this.chicken.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
          },500)

          this.chicken.animateDying();
          this.chicken.chicken_dead_sound.pause();
          this.chicken.chicken_dead_sound.volume = 0.1;
          this.chicken.chicken_dead_sound.playbackRate = 1.5;
          this.chicken.chicken_dead_sound.play();

          setTimeout(() => {
            enemy.y = 700;
          },300)
          
          this.ThrowableObject.splash();
          
        }
    });
    })
  }


  // coin collect sound and let them vanish 
  checkCollisionsCharacterWithCoins() {
    this.level.coins.forEach((coin) => {
      if (this.character.isCollidingCoin(coin)) {
        this.character.collecting_sound.pause();
        this.character.collecting_sound.playbackRate = 1.7;
        this.character.collecting_sound.play();
        coin.y = 700;
        this.collectedCoins.push(coin);
        console.log(this.collectedCoins);
      }
    });
  }


  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);

    this.addObjectsToMap(this.level.coins); 
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObject); 

      this.ctx.translate(-this.camera_x, 0); // Back
        this.addToMap(this.statusBar);

        if (this.character.x >= 3550) {
        this.addToMap(this.endbossBar);
        } 
        // this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
      this.ctx.translate(this.camera_x, 0); // Forward

    this.ctx.translate(-this.camera_x, 0);
    
    // Draw() wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function() {
      self.draw();
    }); 
  }


  addObjectsToMap(objects) {
    objects.forEach(o => {
      this.addToMap(o);
    });
  }


  addToMap(mo) {
    if (mo.turn) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    mo.drawFrameBottle(this.ctx);
    mo.drawFrameChicken(this.ctx);
    mo.drawFrameCoin(this.ctx);
    mo.drawFrameEndboss(this.ctx);
    // drawNumber(this.num);

    if (mo.turn) {
      this.flipImageBack(mo);
    }
  }


  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }


  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }


  endboss_ambience() {
    if (this.character.x >= 3500) {
      this.endboss_ambience_sound.play();
      this.music.pause();
    }
  }


  // splash() {
  //   // clearInterval(this.throwableObject.intervals.length);
  //   setInterval(() => {
  //     // this.x += 28;
  //     // this.MovableObject.playAnimation(this.throwableObject.IMAGES_BOTTLE_SPLASH);
  //     this.MovableObject.playAnimation(this.ThrowableObject.IMAGES_BOTTLE_SPLASH);
  //   }, 70);
  // }


  // playAnimation(images) {
  //   let i = this.currentImg % images.length; // let i = 0 % 6; 0, rest 0 
  //   let path = images[i];
  //   this.img = this.imgCache[path];
  //   this.currentImg++;
  // }


  // throwSound() {
  //   this.throw_sound.play();
  // }

  gameOver(dead) {
    if (dead == true) {
      document.getElementById('game_over').style.display = 'block';
      document.getElementById('you_lost').style.display = 'none';
      document.getElementById('btn_play_again').style.display = 'block';
      this.world.ambience_lvl1.pause();
      this.world.music.pause();
      this.world.endboss_ambience_sound.pause();
      this.world.keyboard = false;
    }
  }

}