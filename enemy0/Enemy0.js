'use strict';

class Enemy0 extends EnemyBlob
{
    /**
     * @param {Vector2} pos
     */
    constructor(pos)
    { 
        super(pos);

        this.sm = new Enemy0Sm();
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
        
        // run state machine
        this.sm.dispatchEvent(Enemy0Sm.EventId.DO);
        this.debugTextBelowMe(Enemy0Sm.stateIdToString(this.sm.stateId));
    }

    huntPlayer()
    {
        const vecToPlayer = this.normalVecToPlayer();

        // if in air, drift towards player
        if (!this.groundObject)
        {
            this.velocity.x += vecToPlayer.x * .001;
        }
        else
        {
            // if on ground, walk towards player
            this.velocity.x += vecToPlayer.x * .01;
        }
    }
}
window["Enemy0"] = Enemy0; // register the class so it can be instantiated by name
