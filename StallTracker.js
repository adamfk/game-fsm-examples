'use strict';

class StallTracker
{
    stallCount;
    startingPos;

    constructor(gameObject)
    {
        this.gameObject = gameObject;
        this.mask = vec2(1,0); // don't care about y for now

        this.reset();
    }

    /**
     * @param {Vector2?} startingPos
     */
    reset(startingPos)
    {
        this.stallCount = 0;
        this.startingPos = startingPos ?? this.getMaskedPosition(this.gameObject);
    }
    
    getMaskedPosition(gameObject) {
        return gameObject.pos.multiply(this.mask);
    }

    update()
    {
        const pos = this.getMaskedPosition(this.gameObject);
        if (pos.distance(this.startingPos) > 0.01)
        {
            this.reset(pos);
        }
        else
        {
            this.stallCount++;
        }
    }
}