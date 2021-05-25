var canvas,
  ctx,
  width = 1080,
  height = 685,
  invincibility,
  themeSound,
  magicSound,
  hitSound,
  continueSound,
  gameoverSound,
  ramSound,
  ouchSound,
  gnomehurtSound,
  powerupSound,
  bossSound,
  bossRoarSound,
  bossroared = false,
  boom,
  burst,
  gnomesplosion,
  poweredUp = false,
  powerups = [],
  powerupTotal = 10,
  powerup_x = 1080,
  powerup_y = 350,
  powerup_w = 100,
  powerup_h = 100,
  powerupTotal = 1,
  powerup,
  enemies = [],
  enemyTotal = 6,
  enemy_x = 1200,
  enemy_y = 30,
  enemy_w = 50,
  enemy_h = 18,
  speed = 3,
  enemy,
  bossenemies = [],
  bossenemyTotal = 3,
  bossenemy_x = 500,
  bossenemy_y = 30,
  bossenemy_w = 150,
  bossenemy_h = 150,
  bossenemy,
  bossenemyHP = 25,
  backup = false,
  bossmagicTotal = 50,
  bossmagics = [],
  bossmagic_w = 80,
  bossmagic_h = 45,
  bossmagic,
  levelboss_x = 765,
  levelboss_y = 230,
  levelboss_w = 150,
  levelboss_h = 150,
  levelbossHP = 200,
  levelboss,
  drama = false,
  victory = false,
  endscreen = true,
  rockTotal = 10,
  rocks = [],
  rock_x = 1200,
  rock_y = 630,
  rock_w = 100,
  rock_h = 100,
  rock,
  stalagtiteTotal = 10,
  stalagtites = [],
  stalagtite_x = 1200,
  stalagtite_y = -175,
  stalagtite_w = 100,
  stalagtite_h = 190,
  stalagtite,
  rightKey = false,
  leftKey = false,
  upKey = false,
  downKey = false,
  gnome,
  gnome_x = 10,
  gnome_y = height / 2,
  gnome_w = 50,
  gnome_h = 65,
  magicTotal = 100,
  magics = [],
  score = 0,
  alive = true,
  lives = 3,
  cavemap,
  caveX = 3000,
  caveY = 0,
  caveY2 = 0,
  caveX2 = 8220,
  bossmap,
  bossmapX = 5200,
  bossmapY = 50,
  gameStarted = false;

//Arr for the enemies on screen spaced by height plus 60
for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_y += enemy_h + 60;
}

for (var i = 0; i < bossenemyTotal; i++) {
  bossenemies.push([
    bossenemy_x,
    bossenemy_y,
    bossenemy_w,
    bossenemy_h,
    speed,
    bossenemyHP,
  ]);
  bossenemy_y += bossenemy_h + 90;
}

//Arr for the rocks on the bot randomly spaced apart and set to random heights
for (var i = 0; i < rockTotal; i++) {
  rocks.push([rock_x, rock_y, rock_w, rock_h, speed]);
  rock_x += rock_w * Math.random() * 5 + 3 * rock_w;
  rock_y = 570;
  if (i % 5 === 0) {
    rock_y -= Math.random() * 50;
  }
  if (i % 7 === 0) {
    rock_y -= 90;
  }
}
//arr for stalagtites
for (var i = 0; i < stalagtiteTotal; i++) {
  stalagtites.push([
    stalagtite_x,
    stalagtite_y,
    stalagtite_w,
    stalagtite_h,
    speed,
  ]);
  stalagtite_x += stalagtite_w * Math.random() * 5 + 3 * stalagtite_w;
  stalagtite_y = -175;
  if (i % 5 === 0) {
    stalagtite_y -= Math.random() * 100;
  }
  if (i % 7 === 0) {
    stalagtite_y += 90;
  }
}

for (var i = 0; i < powerupTotal; i++) {
  powerups.push([powerup_x, powerup_y, powerup_w, powerup_h, speed]);
  powerup_x += powerup_w + 60;
}
//Clear the canvas to update it
function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

//Itterate over the enemy arr and draw new ones
function drawEnemies() {
  if(score >= 600){ enemy.src = "./images/ghost2.gif"}
  for (var i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
  }
}

function drawBossEnemies() {
  if (bossroared === true && score >= 1000 && bossenemies.length && !victory) {
    for (var i = 0; i < bossenemies.length; i++) {
      ctx.drawImage(bossenemy, bossenemies[i][0] - 100, bossenemies[i][1]);
    }
    //  bossroared = true;
  }
}
function drawLevelBoss(now) {
  if (bossroared === true && score >= 1000 && !bossenemies.length && !victory) {
    bossSound.stop();
    if (!drama) {
      bossRoarSound.play();
      levelbossSound.play();
      drama = true;
    } else {
      ctx.drawImage(levelboss, levelboss_x, levelboss_y);
      if (now % 100 === 0 && !victory) {
        bossmagic.src = "./images/evilball.png";
        moveLevelBoss(now);
      }
    }
  }
}

//Itterate over the rocks arr and draw new rocks
function drawRocks() {
  if (!victory) {
    if (score < 1000) {
      rock.src = "rocks.png";
      for (var i = 0; i < rocks.length; i++) {
        ctx.drawImage(rock, rocks[i][0], rocks[i][1]);
      }
      for (var i = 0; i < stalagtites.length; i++) {
        ctx.drawImage(stalagtite, stalagtites[i][0], stalagtites[i][1]);
      }
    } else {
      for (var i = 0; i < rocks.length; i++) {
        rock.src = "tentaclefloor.gif";
        ctx.drawImage(rock, rocks[i][0], rocks[i][1]);
      }
    }
  }
}

//When key is down moves the gnome
function drawgnome() {
  if (rightKey) gnome_x += 15;
  else if (leftKey) gnome_x -= 15;
  if (upKey) gnome_y -= 15;
  else if (downKey) gnome_y += 15;
  if (gnome_x <= 0) gnome_x = 0;
  if (gnome_x + gnome_w >= width) gnome_x = width - gnome_w;
  if (gnome_y <= 0) gnome_y = 0;
  if (gnome_y + gnome_h >= height) gnome_y = height - gnome_h;
  ctx.drawImage(gnome, gnome_x, gnome_y);
}

//Move enemy left on the canvas and if one passes the left of the canvas, it moves it to right of the canvas
function moveEnemies() {
  
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i][0] >= -80) {
      enemies[i][0] -= 18 + Math.floor(Math.random()*15);
      if(i%2 === 0){
      enemies[i][1] -= 1 + Math.floor(Math.random()*5)}
    }


    if (enemies[i][0] <= -50 || enemies[i][1] <= 0 || enemies[i][1] > 850) {
      enemies[i][0] = 2300;
      enemies[i][1] = 450;
    }
  }
}

function moveBossEnemies() {
  if (bossroared === true && score >= 1000 && bossenemies.length) {
    for (var i = 0; i < bossenemies.length; i++) {
      if (bossenemies[i][0] > 400 && !backup) {
        bossenemies[i][0] -= 3;
      }

      if (bossenemies[i][0] <= 400) {
        backup = true;
        if (bossenemies[0]) {
          bossenemies[0][1] += 53;
          blastSound.play();
          bossmagics.push([
            bossenemies[0][0] - 25,
            bossenemies[0][1] - 20,
            bossmagic_w,
            bossmagic_h,
          ]);
        }
        if (bossenemies[1]) {
          bossenemies[1][1] += 53;
        }
        if (bossenemies[2]) {
          bossenemies[2][1] += 13;
          blastSound.play();
          bossmagics.push([
            bossenemies[2][0] - 25,
            bossenemies[2][1] - 20,
            bossmagic_w,
            bossmagic_h,
          ]);
        }
      }
      if (backup) {
        bossenemies[i][0] += 3;
        if (
          bossenemies[1] &&
          bossenemies[1][0] > 500 &&
          bossenemies[1][0] < 505
        ) {
          blastSound.play();
          bossmagics.push([
            bossenemies[1][0] - 25,
            bossenemies[1][1] - 20,
            bossmagic_w,
            bossmagic_h,
          ]);
        }
      }

      if (bossenemies[i][0] >= 599) {
        backup = false;
        if (bossenemies[0]) {
          bossenemies[0][1] -= 53;
          blastSound.play();
          bossmagics.push([
            bossenemies[0][0] - 25,
            bossenemies[0][1] - 20,
            bossmagic_w,
            bossmagic_h,
          ]);
        }
        if (bossenemies[1]) {
          bossenemies[1][1] -= 53;
        }
        if (bossenemies[2]) {
          bossenemies[2][1] -= 13;
          blastSound.play();
          bossmagics.push([
            bossenemies[2][0] - 25,
            bossenemies[2][1] - 20,
            bossmagic_w,
            bossmagic_h,
          ]);
        }
      }
    }
  }
}

function moveLevelBoss(now) {
  if (!victory) {
    bossmagics.push([levelboss_x + 100, width / 2, bossmagic_w, bossmagic_h]);
    if (Math.floor(Math.random() * 100) % 2 === 0) {
      bossblastSound.play();
      bossmagics.push([levelboss_x - 100, 150, bossmagic_w, bossmagic_h]);
      // bossmagics.push([levelboss_x + 300, 400, bossmagic_w, bossmagic_h]);
    }
    if (Math.floor(Math.random() * 100) % 2 === 1) {
      bossblastSound.play();
      bossmagics.push([levelboss_x - 100, 500, bossmagic_w, bossmagic_h]);
      bossmagics.push([levelboss_x + 300, -10, bossmagic_w, bossmagic_h]);
    }
    if (now % 300 === 0) {
      bossRoarSound.play();
      bossblastSound.play();
      bossmagics.push([levelboss_x - 100, 500, bossmagic_w, bossmagic_h]);
      bossmagics.push([levelboss_x + 300, -10, bossmagic_w, bossmagic_h]);
      bossmagics.push([levelboss_x - 100, 150, bossmagic_w, bossmagic_h]);
      // bossmagics.push([levelboss_x + 300, 400, bossmagic_w, bossmagic_h]);
    }
  }
}

function moveRocks() {
  if (!victory) {
    for (var i = 0; i < rocks.length; i++) {
      if (rocks[i][0] >= -800) {
        rocks[i][0] -= 15;
      } else {
        rocks[i][0] = 1600;
        rocks[i][1] = 570 + Math.random() * 60;
      }
    }
    for (var i = 0; i < stalagtites.length; i++) {
      if (stalagtites[i][0] >= -800) {
        stalagtites[i][0] -= 15;
      } else {
        stalagtites[i][0] = 1600;
        stalagtites[i][1] = -175 - Math.random() * 90;
      }
    }
  }
}

//If there are magics in the magics array, then this will draw them on the canvas
function drawmagic() {
  if (magics.length)
    for (var i = 0; i < magics.length; i++) {
      ctx.fillStyle = "#g00";
      ctx.drawImage(magic, magics[i][0] + 60, magics[i][1] + 50);
      ctx.drawImage(burst, gnome_x + 100, gnome_y + 10);

      if (poweredUp) {
        ctx.drawImage(magic, magics[i][0] + 60, magics[i][1] + 100);
        ctx.drawImage(magic, magics[i][0] + 60, magics[i][1] + 0);
      }
    }
}

//If we're drawing magic on the canvas, this moves them right on the canvas
function movemagic() {
  for (var i = 0; i < magics.length; i++) {
    if (magics[i][0] > 0) {
      magics[i][0] += 40;
    }
    if (magics[i][0] > 1080) {
      magics.splice(i, 1);
    }
  }
}

//If there are bossmagics in the bossmagics array, then this will draw them on the canvas
function drawBossMagic() {
  if (bossmagics.length && !victory)
    for (var i = 0; i < bossmagics.length; i++) {
      ctx.drawImage(bossmagic, bossmagics[i][0], bossmagics[i][1]);
    }
}

//If we're drawing bossmagic on the canvas, this moves them left on the canvas
function moveBossMagic() {
  for (var i = 0; i < bossmagics.length; i++) {
    if (bossmagics[i][0] > -500) {
      bossmagics[i][0] -= 8;
    }
    if (bossmagics[i][0] <= -500) {
      bossmagics.splice(i, 1);
    }
    if (bossroared === false) {
      bossmagics.splice(i, 1);
    }
  }
}

function drawpowerup() {
  for (var i = 0; i < powerups.length; i++) {
    ctx.fillStyle = "#g00";
    ctx.drawImage(
      powerup,
      powerups[i][0] + powerups[i][2],
      powerups[i][1],
      100,
      100
    );
  }
}

function movepowerup() {
  for (let i = 0; i < powerups.length; i++) {
    if (score > 50) {
      if (powerups[i][0] > 0) {
        powerups[i][0] -= 5;
      } else if (powerups[i][0] <= 0) {
        powerups.push(powerup_x, powerup_y, powerup_w, powerup_h);
        powerups.splice(i, 1);
      }
    }
  }
}

//Runs a couple of loops to see if any of the magics have hit any of the enemies
function hitTest() {
  var remove = false;
  for (var i = 0; i < magics.length; i++) {
    for (var j = 0; j < enemies.length; j++) {
      if (
        !poweredUp &&
        magics[i][0] >= enemies[j][0] &&
        magics[i][1] >= enemies[j][1] - 3 * enemies[j][3] &&
        magics[i][1] <= enemies[j][1] + 4 * enemies[j][3]
      ) {
        hitSound.play();
        // ctx.fillRect( (enemies[j][0]), (enemies[j][1])  + 10,50,50);
        ctx.drawImage(boom, enemies[j][0], enemies[j][1] + 0, 130, 130);

        remove = true;
        enemies.splice(j, 1);
        score += 10;
        enemies.push([1300, Math.random() * 400, enemy_w, enemy_h, speed]);
      }
      if (
        poweredUp &&
        magics[i][0] >= enemies[j][0] &&
        magics[i][1] >= enemies[j][1] - 6 * enemies[j][3] &&
        magics[i][1] <= enemies[j][1] + 8 * enemies[j][3]
      ) {
        hitSound.play();
        // ctx.fillRect( (enemies[j][0]), (enemies[j][1])  + 10,50,50);
        ctx.drawImage(boom, enemies[j][0], enemies[j][1] + 0, 130, 130);

        remove = true;
        enemies.splice(j, 1);
        score += 10;
        enemies.push([1300, Math.random() * 400, enemy_w, enemy_h, speed]);
      }
    }
    if (remove === true) {
      magics.splice(i, 1);
      remove = false;
    }
  }
  // boss enemy hit test
  if (bossroared === true && bossenemies.length) {
    for (var i = 0; i < magics.length; i++) {
      for (var j = 0; j < bossenemies.length; j++) {
        if (
          !poweredUp &&
          magics[i][0] >= bossenemies[j][0] &&
          magics[i][1] >= bossenemies[j][1] - (bossenemies[j][3]/2) &&
          magics[i][1] <= bossenemies[j][1] + (bossenemies[j][3]/2)
        ) {
          hitSound.play();
          ctx.drawImage(
            boom,
            bossenemies[j][0] - 50,
            bossenemies[j][1] + 0,
            130,
            130
          );
          remove = true;
          bossenemies[j][5] -= 1;
          if (bossenemies[j][5] <= 0) {
            bossenemies.splice(j, 1);
            score += 100;
          }
        }
        if (
          poweredUp &&
          magics[i][0] >= bossenemies[j][0] &&
          magics[i][1] >= bossenemies[j][1] - bossenemies[j][3] &&
          magics[i][1] <= bossenemies[j][1] + bossenemies[j][3]
        ) {
          hitSound.play();
          ctx.drawImage(
            boom,
            bossenemies[j][0] - 50,
            bossenemies[j][1] + 0,
            130,
            130
          );
          remove = true;
          bossenemies[j][5] -= 1;
          if (bossenemies[j][5] <= 0) {
            bossenemies.splice(j, 1);
            score += 100;
          }
        }
      }
      if (remove === true) {
        magics.splice(i, 1);
        remove = false;
      }
    }
  }
  

  //levelboss hit test
  if (bossroared === true && !bossenemies.length && score > 1000 && !victory) {
    for (var i = 0; i < magics.length; i++) {
      if (
        magics[i][0] >= levelboss_x &&
        magics[i][1] >= levelboss_y - levelboss_h &&
        magics[i][1] <= levelboss_y
      ) {
        hitSound.play();
        ctx.drawImage(boom, levelboss_x - 100, levelboss_y - 200, 430, 430);
        remove = true;
        levelbossHP -= 1;
        levelboss.src = "./images/levelbossHit.gif";
        setTimeout(() => (levelboss.src = "./images/levelboss.gif"), 100);
        if (levelbossHP <= 0) {
          levelbossSound.stop();
          bossScreamSound.play();
          deadbossSound.play();
          victory = true;
        }
      }
      if (remove === true) {
        magics.splice(i, 1);
        remove = false;
      }
    }
  }
}

//Similar to the magic hit test, this function checks to see if the player's gnome collides with any of the enemies or rocks
function gnomeCollision() {
  if (invincibility !== true && !victory) {
    var gnome_xw = gnome_x + gnome_w,
      gnome_yh = gnome_y + gnome_h;
    for (var i = 0; i < enemies.length; i++) {
      if (
        gnome_xw > enemies[i][0] &&
        gnome_x < enemies[i][0] + enemy_w &&
        gnome_yh > enemies[i][1] &&
        gnome_y < enemies[i][1] + enemy_h
      ) {
        //  ouchSound.play();
        checkLives();
      }
      if (
        gnome_xw < enemies[i][0] + enemy_w &&
        gnome_xw > enemies[i][0] &&
        gnome_y > enemies[i][1] &&
        gnome_y < enemies[i][1] + enemy_h
      ) {
        // ouchSound.play();
        checkLives();
      }
      if (
        gnome_yh > enemies[i][1] &&
        gnome_y < enemies[i][1] + enemy_h &&
        gnome_x > enemies[i][0] &&
        gnome_x < enemies[i][0] + enemy_w
      ) {
        // ouchSound.play();
        checkLives();
      }
      if (
        gnome_yh > enemies[i][1] &&
        gnome_yh < enemies[i][1] + enemy_h &&
        gnome_xw < enemies[i][0] + enemy_w &&
        gnome_xw > enemies[i][0]
      ) {
        // ouchSound.play();
        checkLives();
      }
    }
    if (score >= 1000 && bossroared === true) {
      for (var i = 0; i < bossenemies.length; i++) {
        if (
          gnome_xw > bossenemies[i][0] &&
          gnome_x < bossenemies[i][0] + bossenemy_w &&
          gnome_yh > bossenemies[i][1] &&
          gnome_y < bossenemies[i][1] + bossenemy_h
        ) {
          //  ouchSound.play();
          checkLives();
        }
        if (
          gnome_xw < bossenemies[i][0] + bossenemy_w &&
          gnome_xw > bossenemies[i][0] &&
          gnome_y > bossenemies[i][1] &&
          gnome_y < bossenemies[i][1] + bossenemy_h
        ) {
          // ouchSound.play();
          checkLives();
        }
        if (
          gnome_yh > bossenemies[i][1] &&
          gnome_y < bossenemies[i][1] + bossenemy_h &&
          gnome_x > bossenemies[i][0] &&
          gnome_x < bossenemies[i][0] + bossenemy_w
        ) {
          // ouchSound.play();
          checkLives();
        }
        if (
          gnome_yh > bossenemies[i][1] &&
          gnome_yh < bossenemies[i][1] + bossenemy_h &&
          gnome_xw < bossenemies[i][0] + bossenemy_w &&
          gnome_xw > bossenemies[i][0]
        ) {
          // ouchSound.play();
          checkLives();
        }
      }
      if(score >= 1300){bossmagic_h = 135} else {bossmagic_h = 45}
      for (var i = 0; i < bossmagics.length; i++) {
        if (
          gnome_xw > bossmagics[i][0] &&
          gnome_x < bossmagics[i][0] + bossmagic_w &&
          gnome_yh > bossmagics[i][1] &&
          gnome_y < bossmagics[i][1] + bossmagic_h
        ) {
          checkLives();
        }
        if (
          gnome_xw < bossmagics[i][0] + bossmagic_w &&
          gnome_xw > bossmagics[i][0]- 8 &&
          gnome_y > bossmagics[i][1] &&
          gnome_y < bossmagics[i][1] + bossmagic_h
        ) {
          checkLives();
        }
        if (
          gnome_yh > bossmagics[i][1] &&
          gnome_y < bossmagics[i][1] + bossmagic_h &&
          gnome_x > bossmagics[i][0] &&
          gnome_x < bossmagics[i][0] + bossmagic_w
        ) {
          checkLives();
        }
        if (
          gnome_yh > bossmagics[i][1] &&
          gnome_yh < bossmagics[i][1] + bossmagic_h &&
          gnome_xw < bossmagics[i][0] + bossmagic_w &&
          gnome_xw > bossmagics[i][0]
        ) {
          checkLives();
        }
      }
    }

    for (var i = 0; i < rocks.length; i++) {
      if (
        gnome_x > rocks[i][0] &&
        gnome_x < rocks[i][0] + rock_w &&
        gnome_y > rocks[i][1] &&
        gnome_y < rocks[i][1] + rock_h
      ) {
        ramSound.play();
        checkLives();
      }
      if (
        gnome_xw < rocks[i][0] + rock_w &&
        gnome_xw > rocks[i][0] &&
        gnome_y > rocks[i][1] &&
        gnome_y < rocks[i][1] + rock_h
      ) {
        ramSound.play();
        checkLives();
      }
      if (
        gnome_yh > rocks[i][1] &&
        gnome_yh < rocks[i][1] + rock_h &&
        gnome_x > rocks[i][0] &&
        gnome_x < rocks[i][0] + rock_w
      ) {
        ramSound.play();
        checkLives();
      }
      if (
        gnome_yh > rocks[i][1] &&
        gnome_yh < rocks[i][1] + rock_h &&
        gnome_xw < rocks[i][0] + rock_w &&
        gnome_xw > rocks[i][0]
      ) {
        ramSound.play();
        checkLives();
      }
    }
    if(score < 1000){

      for (var i = 0; i < stalagtites.length; i++) {
        if (
          gnome_x > stalagtites[i][0] &&
          gnome_x < stalagtites[i][0] + stalagtite_w &&
          gnome_y < stalagtites[i][1] &&
          gnome_y < stalagtites[i][1] + stalagtite_h
          ) {
            ramSound.play();
            checkLives();
          }
          if (
            gnome_xw < stalagtites[i][0] + stalagtite_w &&
            gnome_xw > stalagtites[i][0] &&
            gnome_y < stalagtites[i][1] &&
            gnome_y < stalagtites[i][1] + stalagtite_h
            ) {
              ramSound.play();
              checkLives();
            }
            if (
              gnome_y < stalagtites[i][1] + stalagtite_h &&
              gnome_x > stalagtites[i][0] &&
              gnome_x < stalagtites[i][0] + stalagtite_w
              ) {
                ramSound.play();
                checkLives();
              }
              if (
                gnome_y < stalagtites[i][1] + stalagtite_h &&
                gnome_xw < stalagtites[i][0] + stalagtite_w &&
                gnome_xw > stalagtites[i][0]
                ) {
                  ramSound.play();
                  checkLives();
                }
              }
            }
              for (var i = 0; i < powerups.length; i++) {
                if (poweredUp) {
        powerups.splice(i, 1);
      } else {
        if (
          gnome_xw > powerups[i][0] &&
          gnome_x < powerups[i][0] + powerup_w &&
          gnome_yh > powerups[i][1] &&
          gnome_y < powerups[i][1] + powerup_h
        ) {
          powerupSound.play();
          poweredUp = true;
        }
        if (
          gnome_xw < powerups[i][0] + powerup_w &&
          gnome_xw > powerups[i][0] &&
          gnome_y > powerups[i][1] &&
          gnome_y < powerups[i][1] + powerup_h
        ) {
          powerupSound.play();
          poweredUp = true;
        }
        if (
          gnome_yh > powerups[i][1] &&
          gnome_y < powerups[i][1] + powerup_h &&
          gnome_x > powerups[i][0] &&
          gnome_x < powerups[i][0] + powerup_w
        ) {
          powerupSound.play();
          poweredUp = true;
        }
        if (
          gnome_yh > powerups[i][1] &&
          gnome_yh < powerups[i][1] + powerup_h &&
          gnome_xw < powerups[i][0] + powerup_w &&
          gnome_xw > powerups[i][0]
        ) {
          powerupSound.play();
          poweredUp = true;
        }
      }
    }
  }
}

//This function runs whenever the player's gnome hits an enemy or rock and either subtracts a life or sets the alive variable to false if the player runs out of lives
function checkLives() {
  ctx.drawImage(gnomesplosion, gnome_x - 30, gnome_y - 60, 200, 200);
  gnomehurtSound.play();
  setTimeout(function () {
    invincibility = false;
  }, 1000);
  lives -= 1;
  invincibility = true;
  if (lives > 0) {
    reset();
  } else if (lives === 0) {
    themeSound.stop();
    gameoverSound.play();
    alive = false;
  }
}

//This simply resets the gnome and enemies to their starting positions
function reset() {
  var enemy_reset_y = 50;
  for (var i = 0; i < enemies.length; i++) {
    enemies[i][0] = 1920;
    enemies[i][1] = enemy_reset_y;
    enemy_reset_y = enemy_reset_y + enemy_w + 60;
  }
}

//After the player loses all their lives, the continue button is shown and if clicked, it resets the game and removes the event listener for the continue button
function continueButton(e) {
  var cursorPos = getCursorPos(e);
  if (
    cursorPos.x > width / 2 - 86 &&
    cursorPos.x < width / 2 + 67 &&
    cursorPos.y > height / 2 - 10 &&
    cursorPos.y < height / 2 + 70
  ) {
    continueSound.play();
    alive = true;
    lives = 3;
    score = 0;
    (gnome_x = 10), (gnome_y = height / 2), (gnome_w = 50), (gnome_h = 57);
    bossSound.stop();
    levelbossSound.stop();
    drama = false;
    bossroared = false;
    bossmapX = 5200;
    themeSound.play();
    for (var i = 0; i < bossmagics.length; i++) {
      bossmagics[i].splice(i, 1);
    }
    if (bossenemies.length) {
      for (var i = 0; i < bossenemies.length; i++) {
        bossenemies.splice(i, 1);
      }
    }
    bossenemyTotal = 3;
    bossenemy_x = 500;
    bossenemy_y = 30;
    bossmagic.src = "./images/cthulufire.png";
    for (var i = 0; i < bossenemyTotal; i++) {
      bossenemies.push([bossenemy_x, bossenemy_y, 150, 150, 3, 50]);
      bossenemy_y += bossenemy_h + 90;
    }
  }
  reset();
  canvas.removeEventListener("click", continueButton, false);
}

//holds the cursors position
function cursorPosition(x, y) {
  this.x = x;
  this.y = y;
}

//finds the cursor's position after the mouse is clicked
function getCursorPos(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    y =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  var cursorPos = new cursorPosition(x, y);
  return cursorPos;
}

//Draws the text for the score and lives on the canvas and if the player runs out of lives, it's draws the game over text and continue button as well as adding the event listener for the continue button
function scoreTotal() {
  ctx.font = "bold 30px VT323";
  ctx.fillStyle = "#f10";
  ctx.fillText("Score: ", 10, 55);
  ctx.fillText(score, 82, 55);
  ctx.fillText("Lives:", 10, 30);
  ctx.fillText(lives, 82, 30);
  if (!gameStarted) {
    ctx.font = "bold 100px VT323";
    ctx.fillText("-^-GNOME SQUADRON-^-", width / 2 - 400, height / 2);
    ctx.font = "bold 50px VT323";
    ctx.fillText("-x Click to Play x-", width / 2 - 200, height / 2 + 60);
    ctx.fillText("Use  W A S D to move", width / 2 - 200, height / 2 + 120);
    ctx.fillText("Press spacebar to shoot", width / 2 - 220, height / 2 + 180);

    var sounds = document.getElementsByTagName("audio");
    for (i = 0; i < sounds.length; i++) {
      if (sounds[i].muted === false) {
        openingthemeSound.play();
      }
    }
  }
  if (!alive) {
    themeSound.stop();
    bossSound.stop();
    levelbossSound.stop();
    ctx.font = "bold 30px VT323";
    ctx.fillText("Game Over!", 465, height / 2 - 20);
    ctx.fillRect(width / 2 - 84, height / 2 + 10, 150, 50);
    ctx.fillStyle = "#000";
    ctx.fillText("Continue?", 475, height / 2 + 40);
    canvas.addEventListener("click", continueButton, false);
  }
}

//Draws and animates the background cavemap
function drawcaveMap() {
  if (!victory) {
    ctx.drawImage(cavemap, caveX, caveY);
    ctx.drawImage(cavemap, caveX2, caveY);
    if (caveX < -5220) {
      caveX = 5220;
    }
    if (caveX2 < -5220) {
      caveX2 = 5220;
    }
    if (!victory) {
      caveX -= 8;
      caveX2 -= 8;
    }
  }
  if (victory) {
    if (endscreen) {
      caveX = 2000;
      caveX2 = 7200;
      endscreen = false;
    }
    cavemap.src = "./images/victoryMap.png";
    ctx.drawImage(cavemap, caveX, caveY);
    ctx.drawImage(cavemap, caveX2, caveY);
    if (caveX < -5220) {
      caveX = 5220;
    }
    if (caveX2 < -5220) {
      caveX2 = 5220;
    }
    if (caveX <= -4150) {
      caveX -= 0;
      caveX2 -= 0;
    } else {
      caveX -= 3;
      caveX2 -= 3;
    }
  }
}

function drawbossMap() {
  if (score >= 1000) {
    ctx.drawImage(bossmap, bossmapX, bossmapY, 600, 600);
    if (bossmapX < 601) {
      bossmapX += 0;
      bossRoar();
    } else {
      bossmapX -= 8;
    }
    if (victory) {
      bossmap.src = "./images/cthulufacedeath.jpg";
      bossmapY += 2;
    }
  }
}

function bossRoar() {
  if (bossmapX < 601 && bossroared !== true) {
    bossRoarSound.play();
    bossroared = true;
  }
}

//The initial function called when the page first loads. Loads the gnome, enemy and cavemap images and adds the event listeners for the arrow keys. It then calls the gameLoop function.
function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  enemy = new Image();
  enemy.src = "./images/ghost.gif";
  gnome = new Image();
  gnome.src = "./images/supergnome2.gif";
  cavemap = new Image();
  cavemap.src = "cavebackground.png";
  magic = new Image();
  magic.src = "magic.png";
  rock = new Image();
  rock.src = "rocks.png";
  stalagtite = new Image();
  stalagtite.src = "stalagtites.png";
  boom = new Image();
  boom.src = "purplesmoke.png";
  burst = new Image();
  burst.src = "burst.png";
  gnomesplosion = new Image();
  gnomesplosion.src = "gnomehit.png";
  powerup = new Image();
  powerup.src = "./images/powerup.png";
  bossmap = new Image();
  bossmap.src = "cthuluface.jpg";
  bossenemy = new Image();
  bossenemy.src = "./images/cthuluminion.png";
  bossmagic = new Image();
  bossmagic.src = "./images/cthulufire.png";
  levelboss = new Image();
  levelboss.src = "./images/levelboss.gif";
  magicSound = new sound("magic.mp3");
  hitSound = new sound("hit.mp3");
  continueSound = new sound("continue.mp3");
  gameoverSound = new sound("gameover.mp3");
  ramSound = new sound("ram.wav");
  ouchSound = new sound("ouch.wav");
  gnomehurtSound = new sound("gnomehurt.wav");
  themeSound = new sound("gametheme2.mp3");
  openingthemeSound = new sound("openingtheme.mp3");
  powerupSound = new sound("powerupSound.wav");
  bossSound = new sound("bossfight.mp3");
  bossRoarSound = new sound("tyranoroar.wav");
  blastSound = new sound("./sounds/minionblast2.wav");
  levelbossSound = new sound("./sounds/levelboss.mp3");
  victorythemeSound = new sound("./sounds/victory.mp3");
  deadbossSound = new sound("./sounds/deadboss.wav");
  bossScreamSound = new sound("./sounds/deadnoise.wav");
  bossblastSound = new sound("./sounds/bossblast.wav");
  invincibility = false;
  document.addEventListener("keydown", keyDown, false);
  document.addEventListener("keyup", keyUp, false);
  canvas.addEventListener("click", gameStart, false);
  gameLoop();
}

function gameStart() {
  openingthemeSound.stop();
  gameStarted = true;
  canvas.removeEventListener("click", gameStart, false);
  themeSound.play();
}

var last = new Date();
//The main function of the game, it calls all the other functions needed to make the game run
function gameLoop() {
  var now = new Date();
  last = now;
  clearCanvas();
  if (score < 1000) {
    drawcaveMap();
  }
  if (alive && gameStarted && lives > 0) {
    if (score >= 1000 && !victory) {
      themeSound.stop();
      if (bossenemies.length) {
        bossSound.play();
      }
      drawbossMap();
      drawBossEnemies();
      moveBossEnemies();
      drawBossMagic();
      moveBossMagic();
      drawLevelBoss(now);
    }
    if (score < 1000) {
      moveEnemies();
      drawEnemies();
    }
    hitTest();
    gnomeCollision();
    movemagic();
    drawRocks();
    moveRocks();
    drawgnome();
    drawmagic();
    drawpowerup();
    movepowerup();
  }
  if (victory === true) {
    drawbossMap();
    levelbossSound.stop();
    victorythemeSound.play();
    drawcaveMap();
    drawmagic();
    movemagic();
    drawgnome();
  }
  scoreTotal();
  game = setTimeout(gameLoop, 1000 / 60);
}

//Checks to see which key has been pressed and either to move the gnome or fire a magic
function keyDown(e) {
  let nope = false;
  if(score >= 1000 && !bossroared){
    leftKey = true;
    nope = true;
  }
  if(bossroared){nope = false}
  if (e.keyCode === 68 && !nope) rightKey = true;
  else if (e.keyCode === 65) {
    leftKey = true;
    gnome.src = "./images/supergnomeidle3.gif";
  }
  if (e.keyCode === 87) upKey = true;
  else if (e.keyCode === 83) downKey = true;
  if (
    e.keyCode === 32 &&
    magics.length <= magicTotal &&
    alive &&
    gameStarted &&
    lives > 0
  ) {
    magicSound.play();
    magics.push([gnome_x + 25, gnome_y - 20, 4, 20]);
  }
}

//Checks to see if a pressed key has been released and stops the gnomes movement if it has
function keyUp(e) {
  if (e.keyCode === 68) rightKey = false;
  else if (e.keyCode === 65) {
    gnome.src = "./images/supergnome2.gif";
    leftKey = false;
  }
  if (e.keyCode === 87) upKey = false;
  else if (e.keyCode === 83) {
    downKey = false;
  }
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.muted = true;
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

window.onload = init;
