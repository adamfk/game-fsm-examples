'use strict';

class Enemy3 extends EnemyBlob
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

        // todo_low - we could construct these only when we need them. We don't need them all at the same time.
        this.charge = new Charge1(this);
        this.dance = new Dance1(this);
        this.waking = new Waking1(this);
        this.lulling = new Lulling1(this);
        this.surprised = new Surprised1(this);
        this.alarm = new Alarm1(this);

        /** @type {NoticeSeq1?} */
        this.noticeSeq = null;

        /** @type {Dive1?} */
        this.dive = null;

        this.targetVec = vec2();

        this.sm = new Enemy3Sm();
        this.sm.vars.e = this;
        this.sm.start();
    }

    /**
     * LittleJS engine function.
     * Update the object transform and physics, called automatically by engine once each frame.
     */
    update()
    {
        // if (!this.inDebugArea())
        //     return;

        super.update();
        this.updateStallCount();

        // run state machine
        this.sm.dispatchEvent(Enemy3Sm.EventId.DO);
        this.debugTextBelowMe(Enemy3Sm.stateIdToString(this.sm.stateId));

        this.attemptedVelocity = this.velocity.copy();
    }

    damageEvent() {
        this.sm.dispatchEvent(Enemy3Sm.EventId.DAMAGED);
    }

    /**
     * Override
     * @param {NoticeEvent} noticeEvent
     */
    noticeEvent(noticeEvent) {
        this.sm.vars.noticeEvent = noticeEvent;
        this.sm.dispatchEvent(Enemy3Sm.EventId.NOTICE);
        super.noticeEvent(noticeEvent);
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
        this.walkOrJumpTowardsTarget(vecToPlayer);
    }

    alarmEvent() {
        this.sm.dispatchEvent(Enemy3Sm.EventId.ALARM);
    }

    alertComrades(radius = 30) {
        engineObjectsCallback(this.pos, radius, (/** @type {this} */ o)=>
        {
            if (o instanceof Enemy3 && o !== this) {
                // console.log("alerting comrade", this, o);
                o.alarmEvent();
            }
        });
    }

    /**
     * @param {Vector2} normalTargetVec
     */
    walkOrJumpTowardsTarget(normalTargetVec) {
        if (!normalTargetVec) {
            return;
        }

        if (!this.groundObject) {
            this.velocity.x += normalTargetVec.x * .001;
        }

        else {
            const scaledStallCount = this.stallFrameCount / 60 / 2 * 0.1;

            // this.debugTextAboveMe("stall count " + this.stallFrameCount);
            // on ground. randomly jump towards player
            if (rand() < 0.01 + scaledStallCount) {
                this.jumpTowards(normalTargetVec, scaledStallCount);
            }

            else {
                // if not jumping, march towards player
                this.velocity = normalTargetVec.multiply(vec2(.07, .0));
            }
        }
    }
}
window["Enemy3"] = Enemy3; // register the class so it can be instantiated by name
