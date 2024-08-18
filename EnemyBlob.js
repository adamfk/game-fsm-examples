'use strict';

class EnemyBlob extends Enemy {
    tileOffsets = { awake: 0, sleeping: 1, groggy: 2, surprised: 3, mad: 4, chomp: 5, hurt: 6, alarm: 7 };

    static baseTileIndex = 6;

    sounds = {
        //zzfx sounds
        hunt: new Sound([1.5, -0.25, , .07, .23, .25, , 4.5, 5, , , .12, .08, , 17.1, , , .97, .18, 1, 505]),
        laugh: new Sound([1.5, -0.25, 440, .07, .31, .44, , 4.5, 5, , , , .08, , 15, , , .97, .12, , 505]),
        mutter: new Sound([1.5, -0.25, 65.40639, .07, .23, .25, , 4.5, 5, , , .12, .08, , 17.1, , , .97, .18, 1, 505]),
    };

    /**
     * @param {Vector2} pos
     */
    constructor(pos) {
        const health = 6;
        const size = vec2(.9, .9);
        super(pos, size, tile(EnemyBlob.baseTileIndex), health);
        this.drawSize = vec2(1);
        this.color = hsl(rand(), 1, .7);
        this.swellSpeed = 6;
        this.swellTimer = new Timer(rand(1e3));
        this.setCollision(true, false);
        this.disableAttack = false;

        /**
         * @type {"awake" | "sleeping" | "mad" | "chomp" | "hurt" | "groggy" | "surprised" | "alarm"}
         */
        this.tileName = "sleeping";
    }

    /**
     * @param {Player} player
     */
    handlePlayerCollision(player) {
        if (!player || player.isDead()) // don't let defeated player kill enemies. It's actually kinda funny watching a defeated player bounce on a stack of enemies and take them out :)
            return;

        if (isOverlapping(this.pos, this.size, player.pos, player.size)) {
            // if player is above enemy, they damage the enemy and bounce up
            if (player.pos.y > this.pos.y + this.size.y / 2) {
                this.damage(1, player.asGameObject());
                player.velocity.y = 0.1; // less camera shake
                this.velocity.y = -0.02; // make enemy bounce back. Important so that high velocity enemy jump doesn't go through the player
                this.jumpedOnEvent(player);
            }
            else {
                this.dealDamageToPlayer(player, 1);
            }
        }
    }

    /**
     * Can be overridden by subclasses to handle damage dealt to player.
     * @param {Player} player
     * @param {number} amountOfDamage
     */
    dealDamageToPlayer(player, amountOfDamage) {
        if (!this.disableAttack){
            player.damage(amountOfDamage, this);
        }
    }

    /**
     * LittleJS engine function.
     */
    update() {
        super.update();

        if (!player)
            return;

        this.handlePlayerCollision(player);
    }

    /**
     * LittleJS engine function.
     * Render the object, automatically called each frame, sorted by renderOrder.
     */
    render() {
        // bounce by changing size
        const swellTime = this.swellTimer.get() * this.swellSpeed;
        this.drawSize = vec2(1 - .1 * Math.sin(swellTime), 1 + .1 * Math.sin(swellTime));

        if (abs(this.velocity.x) > 0.01) {
            this.mirror = this.velocity.x < 0;
        }

        // make bottom flush
        let bodyPos = this.pos;
        bodyPos = bodyPos.add(vec2(0, (this.drawSize.y - this.size.y) / 2));

        let tileInfo = this.tileInfo;

        if (this.getTimeSinceDamage() < 0.3) {
            tileInfo = tile(EnemyBlob.baseTileIndex + this.tileOffsets.hurt);
        }

        drawTile(bodyPos, this.drawSize, tileInfo, this.color, this.angle, this.mirror, this.additiveColor);
        super.render();
    }

    /**
     * Override GameObject function.
     */
    kill() {
        if (this.destroyed)
            return;

        ++score;
        sound_score.play(this.pos);
        makeDebris(this.pos, this.color);
        this.destroy();
    }

    /**
     * @param {string} soundName
     */
    play(soundName) {
        this.sounds[soundName].play(this.pos, .4);
    }

    /**
     * @param {number} damage
     * @param {GameObject} damagingObject
     */
    damage(damage, damagingObject) {
        const damaged = super.damage(damage, damagingObject);
        // this.sm.dispatchEvent(Enemy1Sm.EventId.DAMAGED);
        return damaged;
    }

    /**
     * Called when player jumps on enemy
     * @param {Player} player
     */
    jumpedOnEvent(player) {
    }

    /**
     * @param {"awake" | "sleeping" | "mad" | "chomp" | "hurt" | "groggy" | "surprised" | "alarm"} tileName
     */
    tile(tileName) {
        this.tileName = tileName;
        this.tileInfo = tile(EnemyBlob.baseTileIndex + this.tileOffsets[tileName]);
    }

    /**
     * @param {number} range
     */
    canSeePlayer(range) {
        if (this.tileName === "sleeping")
            return false;

        this.debugCircle(range, "#00F8");

        return super.testSightToPlayer(range);
    }

    jumpTowardsPlayer(jumpBoost = 0) {
        this.jumpTowards(this.normalVecToPlayer(), jumpBoost);
    }

    /**
     * @param {Vector2} target 
     * @param {number} jumpBoost - additional jump speed for when enemy is stuck/stalled
     */
    jumpTowards(target, jumpBoost = 0) {
        const jumpYSpeed = clamp(rand(.4, .2) + jumpBoost, 0, 0.4);
        const jumpXSpeed = rand(.07, .2);
        this.velocity = target.multiply(vec2(jumpXSpeed, 0));
        this.velocity.y = jumpYSpeed;
        sound_jump.play(this.pos, .4, 2);
        // console.log("jumping towards player");
    }

    smallVerticalHop() {
        this.velocity.y = .1;
        this.velocity.x = 0;
        sound_jump.play(this.pos, .4, 2);
    }
}
