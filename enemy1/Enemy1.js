'use strict';

class Enemy1 extends EnemyBlob
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

        this.sm = new Enemy1Sm();
        this.sm.vars.e = this;
        this.sm.start();
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
        this.sm.dispatchEvent(Enemy1Sm.EventId.DO);
        this.debugTextBelowMe(Enemy1Sm.stateIdToString(this.sm.stateId));

        this.attemptedVelocity = this.velocity.copy();
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

        this.debugTextAboveMe("hunt timer " + (-1 * this.sm.vars.timer.get()).toFixed(1));

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
window["Enemy1"] = Enemy1; // register the class so it can be instantiated by name
