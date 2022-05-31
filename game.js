var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('bulletp2', 'assets/bulletp2.png');
    game.load.image('enemyBullet', 'assets/enemy-bullet.png');
    game.load.spritesheet('invader', 'assets/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'assets/player.png');
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    game.load.image('starfield', 'assets/starfield.png');
    //game.load.image('background', 'assets/games/starstruck/background2.png');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    bullets2 = game.add.group();
    bullets2.enableBody = true;
    bullets2.physicsBodyType = Phaser.Physics.ARCADE;
    bullets2.createMultiple(30, 'bulletp2');
    bullets2.setAll('anchor.x', 0.5);
    bullets2.setAll('anchor.y', 1);
    bullets2.setAll('outOfBoundsKill', true);
    bullets2.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(300, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.body.bounds = true;


    //  The hero2!
    player2 = game.add.sprite(500, 500, 'ship');
    player2.anchor.setTo(0.5, 0.5);
    game.physics.enable(player2, Phaser.Physics.ARCADE);
    player2.body.collideWorldBounds = true;
    player2.body.bounds = true;
    




    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '16px Arial', fill: '#fff' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 75, 10, 'Lives : ', { font: '16px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', { font: '16px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 5; i++) {
        var ship = lives.create(game.world.width - 100 + (30 * i), 50, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton2 = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    zK = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    sK = game.input.keyboard.addKey(Phaser.Keyboard.S);
    qK = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    dK = game.input.keyboard.addKey(Phaser.Keyboard.D);



}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;

    game.physics.arcade.collide(player, player2);

    if (player.alive) {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (qK.isDown) {
            player.body.velocity.x = -200;
        }


        if (dK.isDown) {
            player.body.velocity.x = 200;
        }



        if (zK.isDown) {
            player.body.velocity.y = -200;
        }


        if (sK.isDown) {
            player.body.velocity.y = 200;
        }


        //  Firing?
        if (fireButton.isDown) {
            fireBullet();
        }


        if (game.time.now > firingTimer) {
            enemyFires();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    }

    if (player2.alive) {
        player2.body.velocity.setTo(0, 0);

        if (cursors.left.isDown) {
            player2.body.velocity.x = -200;
        }


        if (cursors.right.isDown) {
            player2.body.velocity.x = 200;
        }



        if (cursors.up.isDown) {
            player2.body.velocity.y = -200;
        }


        if (cursors.down.isDown) {
            player2.body.velocity.y = 200;
        }

        if (fireButton2.isDown) {
            fireBullet2();
        }

        game.physics.arcade.overlap(bullets2, aliens, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player2, enemyHitsPlayer, null, this);
    }
    


}

