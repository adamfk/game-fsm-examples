'use strict';
class Enemy extends GameObject {
    /**
     * if we are moving slower than this, we are considered stalled (bumping into a wall).
     * This value is impacted by enemy elasticity setting. Use 0.001 for enemies with no elasticity.
     */
    stallVelocityThreshold = 0.001;

    /**
     * @param {Vector2} pos
     * @param {Vector2} size
     * @param {TileInfo} tileInfo
     * @param {number} health
     */
    constructor(pos, size, tileInfo, health) {
        super(pos, size, tileInfo);
        this.health = health;
        this.maxHealth = health;
        this.damageTimer = new Timer;
    }

    update() {
        super.update();

        if (player && this.playerDist() < 10) {
            window["debugEnemy"] = this;
        }
    }

    playerDist() {
        if (!player)
            return 1000000; // something big

        return this.pos.distance(player.pos);
    }

    render() {
        this.#renderHealth();
    }

    /**
     * @param {number} visionRange
     * @returns {boolean}
     */
    testSightToPlayer(visionRange)
    {
        // do cheaper tests first

        if (!player || player.isDead())
            return false;

        /** @type {Vector2} */
        const playerVec = player.pos.subtract(this.pos);

        // within vision range?
        if (playerVec.length() > visionRange)
        {
            // debugText("too far", this.pos.add(vec2(0,1)), 0.5);
            return false;
        }

        // facing player?
        const isFacingRight = !this.mirror;
        const playerIsRight = playerVec.x > 0;
        if (isFacingRight != playerIsRight)
        {
            // debugText("wrong way", this.pos.add(vec2(0,1)), 0.5);   
            return false;
        }

        // check if player is in line of sight
        // note! allows seeing through crates. Just call it a feature :)
        const obstacleRayCast = tileCollisionRaycast(this.pos, player.pos, this);
        if (obstacleRayCast !== undefined)
        {
            // debugText("view blocked", this.pos.add(vec2(0,1)), 0.5);   
            return false;
        }

        // debugText("See you!!!", this.pos.add(vec2(0,1)), 0.5);   

        return true;
    }

    #renderHealth() {
        const healthBarSize = vec2(1, .1);
        const healthBarPos = this.pos.add(vec2(0, 0.5));
        const healthBarBgColor = rgb(0, 0, 0, 0.5);
        drawRect(healthBarPos, healthBarSize, healthBarBgColor);

        const healthPercent = this.health / this.maxHealth;
        const healthBarFgColor = healthPercent >= 0.5 ? rgb(0, 200, 0, 0.5) : rgb(200, 0, 0, 0.5);
        const healthBarSize2 = vec2(healthBarSize.x * this.health / this.maxHealth, healthBarSize.y);
        drawRect(healthBarPos, healthBarSize2, healthBarFgColor);
    }
}
