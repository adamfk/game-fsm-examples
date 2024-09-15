'use strict';

class Enemy2 extends EnemyBlob
{
    /**
     * @param {Vector2} pos
     */
    constructor(pos)
    { 
        super(pos);
        this.stallFrameCount = 0;

        /** The velocity we commanded last time before physics calculations */
        this.attemptedVelocity = vec2();

        this.sm = new Enemy2Sm();
        this.sm.vars.e = this;
        this.sm.start();
        this.chargeTimer = new Timer();
        this.chargeMaxTime = 0.5;
        this.targetVec = vec2();
    }

    /**
     * LittleJS engine function.
     * Update the object transform and physics, called automatically by engine once each frame.
     */
    update()
    {
        super.update();
        this.updateStallCount();

        // run state machine
        this.sm.dispatchEvent(Enemy2Sm.EventId.DO);
        this.debugTextBelowMe(Enemy2Sm.stateIdToString(this.sm.stateId));

        this.attemptedVelocity = this.velocity.copy();
    }

    chargeEnter() {
        this.targetVec = this.normalVecToPlayer();
        this.chargeTimer.set();
    }

    chargeDo() {
        // this.huntPlayer();
        const chargeRatio = this.chargeTimer.get() / this.chargeMaxTime;
        this.angle = chargeRatio * PI/2;

        // fire!
        if (this.isChargeDone()) {
            // this.velocity = this.normalVecToPlayer(); // THIS IS INSANE!!! YEET MODE!
            // this.velocity.x = this.normalVecToPlayer().x; // this one keeps updating with the player's position
            this.velocity.x = this.targetVec.x;

            // slow it down a bit if we are in the air (no friction)
            if (!this.groundObject) {
                this.velocity.x *= 0.3;
            }
        }
    }

    chargeExit() {
        this.angle = 0;
    }

    isChargeDone() {
        return this.chargeTimer.get() >= this.chargeMaxTime;
    }


    updateStallCount() {
        // if we are moving, zero stall count
        if (abs(this.velocity.x) > 0.001) {
            this.stallFrameCount = 0;
        } else {
            // we aren't moving.
            // Increase stall count if we tried to
            if (abs(this.attemptedVelocity.x) > 0.001) {
                this.stallFrameCount++;
            }
        }
    }

    huntPlayer()
    {
        const vecToPlayer = this.normalVecToPlayer();

        // this.debugTextAboveMe("hunt timer " + (-1 * this.sm.vars.timer.get()).toFixed(1));

        // if in air, drift towards player
        if (!this.groundObject)
        {
            this.velocity.x += vecToPlayer.x * .001;
        }
        else
        {
            const scaledStallCount = this.stallFrameCount / 60 / 2 * 0.1;

            // this.debugTextAboveMe("stall count " + this.stallFrameCount);
            // on ground. randomly jump towards player
            if (rand() < 0.01 + scaledStallCount)
            {
                this.jumpTowards(vecToPlayer, scaledStallCount);
            }
            else
            {
                // if not jumping, march towards player
                this.velocity = vecToPlayer.multiply(vec2(.07, .0));
            }
        }
    }
}
window["Enemy2"] = Enemy2; // register the class so it can be instantiated by name
