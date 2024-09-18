/*
    Little JS Platforming Game
    - A basic platforming starter project
    - Platforming phyics and controls
    - Includes destructibe terrain
    - Control with keyboard, mouse, touch, or gamepad
*/

'use strict';

// show the LittleJS splash screen
setShowSplashScreen(false);

let spriteAtlas, score, deaths;

let stadiumDamage = false;

// we can't use keyWasPressed() because it doesn't work when paused
document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyP') {
        paused = !paused;
    }
});


///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // create a table of all sprites
    spriteAtlas =
    {
        // large tiles
        circle:  tile(0),
        crate:   tile(2),
        player:  tile(3),
        enemy:   tile(6),
        coin:    tile(16),

        // small tiles
        gun:     tile(2,8),
        grenade: tile(3,8),
    };

    // enable touch gamepad on touch devices
    touchGamepadEnable = true;

    // setup level
    buildLevel();

    // init game
    score = deaths = 0;
    gravity = -.01;
    objectDefaultDamping = .99;
    objectDefaultAngleDamping = .99;
    cameraScale = 4*16;
    cameraPos = getCameraTarget();
    
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    // respawn player
    if (player.deadTimer.get() > 1)
    {
        player = new Player(playerStartPos);
        player.velocity = vec2(0,.1);
        sound_jump.play();
    }
    
    // mouse wheel = zoom
    cameraScale = clamp(cameraScale*(1-mouseWheel/10), 1, 1e3);
    
    // T = drop test crate
    if (keyWasPressed('KeyT'))
        new Crate(mousePos);
    
    // E = drop enemy
    if (keyWasPressed('KeyE'))
        new enemyCtor(mousePos);

    // B = make explosion
    if (keyWasPressed('KeyB'))
        explosion(mousePos);

    // M = move player to mouse
    if (keyWasPressed('KeyM'))
        player.pos = mousePos;

    // U = toggle stadium damage
    if (keyWasPressed('KeyU'))
        stadiumDamage = !stadiumDamage;
}

///////////////////////////////////////////////////////////////////////////////
function getCameraTarget()
{
    // camera is above player
    const offset = percent(mainCanvasSize.y, 300, 600);
    return player.pos.add(vec2(0, offset));
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
    // update camera
    cameraPos = cameraPos.lerp(getCameraTarget(), clamp(player.getAliveTime()/2));
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // draw to overlay canvas for hud rendering
    const drawText = (text, x, y, size=40) =>
    {
        overlayContext.textAlign = 'center';
        overlayContext.textBaseline = 'top';
        overlayContext.font = size + 'px arial';
        overlayContext.fillStyle = '#fff';
        overlayContext.lineWidth = 3;
        overlayContext.strokeText(text, x, y);
        overlayContext.fillText(text, x, y);
    }
    drawText('Score: ' + (score - deaths*2),   overlayCanvas.width*1/4, 20);
    drawText('Attempt: ' + (deaths + 1), overlayCanvas.width*3/4, 20);
    drawText('Time: ' + time.toFixed(1), overlayCanvas.width/2, 20);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png', 'tilesLevel.png']);