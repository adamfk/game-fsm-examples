/*
    LittleJS Platformer Example - Objects
    - Base GameObject class for objects with health
    - Crate object collides with player, can be destroyed
    - Weapon is held and fires bullets with some settings
    - Bullet is the projectile launched by a weapon
*/

'use strict';

class BasicGameObject extends EngineObject 
{
    /**
     * @param {string} type
     * @param {{ radius?: number, instanceOfFilter?: any, pos?: Vector2}} params
     */
    emitNoticeEvent(type, params)
    {
        params = params || {};
        const radius = params.radius || 6;
        const pos = (params.pos || this.pos).copy();
        const instanceOfFilter = params.instanceOfFilter || GameObject;

        engineObjectsCallback(pos, radius, (/** @type {GameObject}} */ o) => {
            if (o instanceof instanceOfFilter)
                o.noticeEvent(new NoticeEvent(this, pos, type));
        });
    }
}

class GameObject extends BasicGameObject 
{
    /**
     * @param {Vector2} pos 
     * @param {Vector2} size 
     * @param {TileInfo} tileInfo 
     * @param {number} [angle]
     */
    constructor(pos, size, tileInfo, angle)
    {
        super(pos, size, tileInfo, angle);
        this.health = 0;
        this.isGameObject = 1;
        this.damageTimer = new Timer();
    }

    update()
    {
        super.update();

        // flash white when damaged
        // if (!this.isDead() && this.damageTimer.active())
        // {
        //     const lightness = 0.2;
        //     this.additiveColor = hsl(0,0,lightness,0);
        // }
        // else
        //     this.additiveColor = hsl(0,0,0,0);

        // kill if below level
        if (!this.isDead() && this.pos.y < -9)
            warmup ? this.destroy() : this.kill();
    }

    /**
     * @returns {number|undefined} time since this object was last damaged
     */
    getTimeSinceDamage() {
        if (this.damageTimer.isSet())
            return this.damageTimer.get();
        return undefined;
     }

    /**
     * Returns amount damaged
     * @param {number} damage 
     * @param {GameObject} damagingObject 
     * @returns 
     */
    damage(damage, damagingObject)
    {
        ASSERT(damage >= 0);
        if (this.isDead())
            return 0;
        
        // set damage timer;
        this.damageTimer.set();
        for (const child of this.children)
            child.damageTimer && child.damageTimer.set();

        // apply damage and kill if necessary
        const newHealth = max(this.health - damage, 0);
        if (!newHealth)
            this.kill(damagingObject);

        this.damageEvent(damage, damagingObject);

        // set new health and return amount damaged
        return this.health - (this.health = newHealth);
    }

    /**
     * @param {number} damage
     * @param {GameObject} damagingObject
     */
    damageEvent(damage, damagingObject)
    {

    }

    /**
     * @param {NoticeEvent} noticeEvent 
     */
    noticeEvent(noticeEvent)
    {
        // console.log("notice event", this, noticeEvent);
    }

    isDead()                { return !this.health; }
    
    /**
     * @param {GameObject} [damagingObject]
     */
    kill(damagingObject)    { this.destroy(); }

    normalVecToPlayer() {
        return player.pos.subtract(this.pos).normalize();
    }

    /**
     * @param {Vector2} pos
     */
    normalVecToPos(pos) {
        return pos.subtract(this.pos).normalize();
    }

    /**
     * @param {Vector2} pos
     */
    facePosition(pos) {
        this.mirror = pos.x < this.pos.x;
    }

    /**
     * @param {string} str
     */
    debugTextAboveMe(str) {
        debugText(str, this.pos.add(vec2(0,1)), 0.5);
    }

    /**
     * @param {string} str
     */
    debugTextBelowMe(str) {
        debugText(str, this.pos.add(vec2(0,-1)), 0.5);
    }

    /**
     * @param {number} radius
     */
    debugCircle(radius, color='#FFF3') {
        debugCircle(this.pos, radius, color);
    }

    static debugAreaSize = vec2(30);
    inDebugArea() { return isOverlapping(this.pos, this.size, cameraPos, Enemy.debugAreaSize); }
}

///////////////////////////////////////////////////////////////////////////////

const NoticeIds = 
{
    bulletShot: "bulletShot",
    bulletEnd: "bulletEnd",
    grenadeThrown: "grenadeThrown",
    /** 
     * This is repeated every half second or so. Gives wandering in enemies a chance to notice it. 
     */
    grenadeAlive: "grenadeAlive",
    grenadeExplosion: "grenadeExplosion",
}
Object.freeze(NoticeIds);

class NoticeEvent
{
    /**
     * @param {BasicGameObject} obj
     * @param {Vector2} originalPosition
     * @param {string} type - should be of type NoticeIds
     */
    constructor(obj, originalPosition, type)
    {
        this.obj = obj;
        /** we keep track of starting position because sometimes the object is destroyed and no longer has a position */
        this.originalPosition = originalPosition;
        this.type = type;
    }

    isObjectAlive() { return !this.obj.destroyed; }
    get pos() { return  this.obj.pos || this.originalPosition; }

    isBulletShot() { return this.type === NoticeIds.bulletShot; }
    isBulletEnd() { return this.type === NoticeIds.bulletEnd; }
    isGrenadeThrown() { return this.type === NoticeIds.grenadeThrown; }
    isGrenadeLive() { return this.type === NoticeIds.grenadeAlive; }
    isGrenadeExplosion() { return this.type === NoticeIds.grenadeExplosion; }
    isGrenade() { return this.isGrenadeThrown() || this.isGrenadeLive() || this.isGrenadeExplosion(); }
    isNotRepeat() { return !this.isGrenadeLive(); }
}


///////////////////////////////////////////////////////////////////////////////

class Crate extends GameObject 
{
    /**
     * @param {Vector2} pos
     */
    constructor(pos) 
    { 
        super(pos, vec2(1), spriteAtlas.crate, (randInt(4))*PI/2);

        this.color = hsl(rand(),1,.8);
        this.health = 5;

        // make it a solid object for collision
        this.setCollision();
    }

    kill()
    {
        if (this.destroyed)
            return;

        sound_destroyObject.play(this.pos);
        makeDebris(this.pos, this.color, 30);
        this.destroy();
    }
}

///////////////////////////////////////////////////////////////////////////////

class Coin extends EngineObject 
{
    /**
     * @param {Vector2} pos
     */
    constructor(pos) 
    { 
        super(pos, vec2(1), spriteAtlas.coin);
        this.color = hsl(.15,1,.5);
    }

    render()
    {
        // make it appear to spin
        const t = time+this.pos.x/4+this.pos.y/4;
        drawTile(this.pos, vec2(.1, .6), 0, this.color); // edge of coin
        drawTile(this.pos, vec2(.5+.5*Math.sin(t*2*PI), 1), this.tileInfo, this.color);
    }

    /**
     * @param {undefined} [o]
     */
    update(o)
    {
        if (!player)
                return;

        // check if player in range
        const d = this.pos.distanceSquared(player.pos);
        if (d > .5)
            return; 
        
        // award points and destroy
        ++score;
        sound_score.play(this.pos);
        this.destroy();
    }
}

///////////////////////////////////////////////////////////////////////////////

class Grenade extends GameObject
{
    /**
     * @param {Vector2} pos
     */
    constructor(pos) 
    {
        super(pos, vec2(.2), spriteAtlas.grenade);

        this.beepTimer = new Timer(1);
        this.noticeTimer = new Timer(0.5);
        this.elasticity   = .3;
        this.friction     = .9;
        this.angleDamping = .96;
        this.renderOrder  = 1e8;
        this.setCollision(true,false);
        this.emitNoticeEvent(NoticeIds.grenadeThrown, { radius: 6, instanceOfFilter: Enemy });
    }

    update()
    {
        super.update();

        if (this.getAliveTime() > 3)
        {
            explosion(this.pos);
            this.destroy();
            this.emitNoticeEvent(NoticeIds.grenadeExplosion, { radius: 20, instanceOfFilter: Enemy });
        }
        else
        {
            if (this.beepTimer.elapsed())
            {
                sound_grenade.play(this.pos)
                this.beepTimer.set(1);
            }

            if (this.noticeTimer.elapsed())
            {
                this.noticeTimer.set(0.5);
                this.emitNoticeEvent(NoticeIds.grenadeAlive, { radius: 6, instanceOfFilter: Enemy });
            }
        }
    }
       
    render()
    {
        drawTile(this.pos, vec2(.5), this.tileInfo, this.color, this.angle);

        // draw additive flash exploding
        setBlendMode(true);
        const flash = Math.cos(this.getAliveTime()*2*PI);
        drawTile(this.pos, vec2(2), spriteAtlas.circle, hsl(0,1,.5,.2-.2*flash));
        setBlendMode(false);
    }
}

///////////////////////////////////////////////////////////////////////////////

class Weapon extends EngineObject 
{
    /**
     * @param {Vector2} pos
     * @param {this} parent
     */
    constructor(pos, parent) 
    { 
        super(pos, vec2(.6), spriteAtlas.gun);

        // weapon settings
        this.fireRate      = 8;
        this.bulletSpeed   = .5;
        this.bulletSpread  = .1;
        this.damage        = 1;

        // prepare to fire
        this.renderOrder = parent.renderOrder + 1;
        this.fireTimeBuffer = this.localAngle = 0;
        this.recoilTimer = new Timer;
        parent.addChild(this, vec2(.6,0));

        // shell effect
        this.addChild(this.shellEmitter = new ParticleEmitter(
            vec2(), 0, 0, 0, 0, .1,  // pos, angle, emitSize, emitTime, emitRate, emiteCone
            0,                       // tileInfo
            rgb(1,.8,.5), rgb(.9,.7,.5), // colorStartA, colorStartB
            rgb(1,.8,.5), rgb(.9,.7,.5), // colorEndA, colorEndB
            3, .1, .1, .15, .1, // time, sizeStart, sizeEnd, speed, angleSpeed
            1, .95, 1, 0, 0,    // damp, angleDamp, gravity, particleCone, fade
            .1, 1               // randomness, collide, additive, colorLinear, renderOrder
        ), vec2(.1,0), -.8);
        this.shellEmitter.elasticity = .5;
        this.shellEmitter.particleDestroyCallback = persistentParticleDestroyCallback;
    }

    update()
    {
        super.update();

        // update recoil
        if (this.recoilTimer.active())
            this.localAngle = lerp(this.recoilTimer.getPercent(), this.localAngle, 0);

        this.mirror = this.parent.mirror;
        this.fireTimeBuffer += timeDelta;
        if (this.triggerIsDown)
        {
            // try to fire
            for (; this.fireTimeBuffer > 0; this.fireTimeBuffer -= 1/this.fireRate)
            {
                // create bullet
                sound_shoot.play(this.pos);
                this.localAngle = -rand(.2,.25);
                this.recoilTimer.set(.1);
                const direction = vec2(this.bulletSpeed*this.getMirrorSign(), 0);
                const velocity = direction.rotate(rand(-1,1)*this.bulletSpread);
                new Bullet(this.pos, this.parent, velocity, this.damage);

                // spawn shell particle
                this.shellEmitter.emitParticle();
            }
        }
        else
            this.fireTimeBuffer = min(this.fireTimeBuffer, 0);
    }
}

///////////////////////////////////////////////////////////////////////////////

class Bullet extends BasicGameObject 
{
    /**
     * @param {Vector2} pos
     * @param {any} attacker
     * @param {Vector2} velocity
     * @param {number} damage
     */
    constructor(pos, attacker, velocity, damage) 
    { 
        super(pos, vec2());
        this.color = rgb(1,1,0);
        this.velocity = velocity;
        this.attacker = attacker;
        this.damage = damage;
        this.damping = 1;
        this.gravityScale = 0;
        this.renderOrder = 100;
        this.drawSize = vec2(.2,.5);
        this.range = 5;
        this.setCollision(true, false);

        // notify any nearby objects of the shot
        this.emitNoticeEvent(NoticeIds.bulletEnd, { radius: 10, instanceOfFilter: Enemy });
    }

    update()
    {
        // check if hit someone
        engineObjectsCallback(this.pos, this.size, (/** @type {{ isGameObject: any; }} */ o)=>
        {
            if (o.isGameObject)
                this.collideWithObject(o)
        });
          
        super.update();

        this.angle = this.velocity.angle();
        this.range -= this.velocity.length();
        if (this.range < 0)
        {
            new ParticleEmitter(
                this.pos, 0, .2, .1, 50, PI, spriteAtlas.circle, // pos, emit info, tileInfo
                rgb(1,1,.1), rgb(1,1,1),    // colorStartA, colorStartB
                rgb(1,1,.1,0), rgb(1,1,1,0),// colorEndA, colorEndB
                .1, .5, .1, .05, 0, // particleTime, sizeStart, sizeEnd, speed, angleSpeed
                1, 1, .5, PI, .1,   // damping, angleDamping, gravityScale, cone, fadeRate, 
                .5, 0, 1            // randomness, collide, additive, randomColorLinear
            );

            // notify any nearby objects of the shot
            this.emitNoticeEvent(NoticeIds.bulletEnd, { radius: 3, instanceOfFilter: Enemy });
            this.destroy();
        }
    }

    /**
     * @param {{ isGameObject: any; damage?: any; applyForce?: any; }} o
     */
    collideWithObject(o)
    {
        if (o.isGameObject && o != this.attacker)
        {
            o.damage(this.damage, this);
            o.applyForce(this.velocity.scale(.1));
        }
    
        this.kill();
        return true; 
    }

    /**
     * @param {number} data
     * @param {Vector2} pos
     */
    collideWithTile(data, pos)
    {
        if (data <= 0)
            return false;
        
        if (stadiumDamage) {
            destroyTile(pos);
        }

        this.kill();
        return true;
    }

    kill()
    {
        if (this.destroyed)
            return;
        this.destroy();

        // spark effects
        const emitter = new ParticleEmitter(
            this.pos, 0, 0, .1, 100, .5, // pos, angle, emitSize, emitTime, emitRate, emiteCone
            0,                      // tileInfo
            rgb(1,1,0), rgb(1,0,0), // colorStartA, colorStartB
            rgb(1,1,0), rgb(1,0,0), // colorEndA, colorEndB
            .2, .2, 0, .1, .1, // time, sizeStart, sizeEnd, speed, angleSpeed
            1, 1, .5, PI, .1,  // damp, angleDamp, gravityScale, particleCone, fade, 
            .5, 1, 1           // randomness, collide, additive, colorLinear, renderOrder
        );
        emitter.trailScale = 1;
        emitter.elasticity = .3;
        emitter.angle = this.velocity.angle() + PI;
    }
}