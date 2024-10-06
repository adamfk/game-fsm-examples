'use strict';

class Enemy0 extends EnemyBlob
{
    /**
     * @param {Vector2} position
     */
    constructor(position)
    { 
        super(position);
        this.sm = new Enemy0Sm(); // create state machine
        this.sm.vars.e = this; // set state machine variable to this object
        this.sm.start(); // start the state machine
    }

    /**
     * LittleJS engine function.
     * Update the object transform and physics, called automatically by engine once each frame.
     */
    update()
    {
        // run state machine and show state
        this.sm.dispatchEvent(Enemy0Sm.EventId.DO);
        this.debugTextBelowMe(Enemy0Sm.stateIdToString(this.sm.stateId));

        super.update();  // call parent to update physics
    }

    /**
     * Called by state machine.
     */
    huntPlayer()
    {
        const normVecToPlayer = this.normalVecToPlayer(); // get normalized vector to player
        let velocityScale = 0.01;

        if (!this.groundObject)
        {
            // there's no friction in the air to counteract the velocity
            // so we need to scale it down to prevent the enemy from flying right at the player
            velocityScale /= 10;
        }

        this.velocity.x += normVecToPlayer.x * velocityScale;
    }
}
window["Enemy0"] = Enemy0; // register the class so it can be instantiated by name
