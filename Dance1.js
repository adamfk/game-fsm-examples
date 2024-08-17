"use strict";

class Dance1 {

    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        this.gameObject = enemyBlob;
        this.blob = enemyBlob;

        const degrees = -25;

        this.sequence = new ActionSequence();
        // this.sequence.addSimpleAction(() => { enemyBlob.tile("awake") });

        this.addAngleAction(degrees);
        this.addAngleAction(0);
        this.addAngleAction(degrees);
        this.addAngleAction(0);
        this.addHopAction();
        this.addHopAction();
        this.addHopAction();
        this.sequence.addDelayAction(0.5);
        this.sequence.addSimpleAction(() => { enemyBlob.mirror = !enemyBlob.mirror; });
        this.sequence.addDelayAction(0.5);
    }

    enter() {
        this.sequence.reset();
    }

    do() {
        // if (!this.gameObject.inDebugArea()) {
        //     return;
        // }

        if (this.sequence.isDone()) {
            this.sequence.reset();
        }
        this.sequence.update();
    }

    exit() {
        this.gameObject.velocity = vec2();
        this.gameObject.angle = 0;
        // this.gameObject.mirror = false; // leave as is
    }

    isDone() {
        return this.sequence.isDone();
    }

    /**
     * @param {number} degrees
     * @param {number} frameCount
     */
    addAngleAction(degrees, frameCount = 20) {
        let originalDesiredAngle = degrees / 180 * PI;
        let desiredAngle = 0;
        let incPerFrame = 0; // updated in enter

        const action = new ActionHandler();
        action.enter = () => {
            const mirroredSign = this.gameObject.getMirrorSign();
            desiredAngle = mirroredSign * originalDesiredAngle;
            incPerFrame = (desiredAngle - this.gameObject.angle) / frameCount;
        };
        action.update = () => {
            this.gameObject.angle += incPerFrame;
        };
        action.isDone = () => {
            const absDiff = Math.abs(this.gameObject.angle - desiredAngle);
            return absDiff <= Math.abs(incPerFrame);
        };
        this.sequence.add(action);
    }


    addHopAction() {
        const action = new ActionHandler();
        action.enter = () => {
            this.gameObject.velocity.y = 0.1;
            sound_jump.play(this.gameObject.pos, .4, 2);
        };
        action.update = () => {
        };
        action.isDone = () => {
            return this.gameObject.groundObject;
        };
        this.sequence.add(action);
    }


}

class Waking1 {
    /**
 * @param {EnemyBlob} enemyBlob
 */
    constructor(enemyBlob) {
        this.gameObject = enemyBlob;
        this.blob = enemyBlob;

        this.sequence = new ActionSequence();

        this.addTileAction("groggy", 0.5);
        this.addTileAction("sleeping", 2);

        this.addTileAction("groggy", 0.5);
        this.addTileAction("sleeping", 1.5);

        this.addTileAction("groggy", 2);
    }

    /**
     * @param {"groggy" | "sleeping"} tileName
     * @param {number} duration
     */
    addTileAction(tileName, duration) {
        this.sequence.addSimpleAction(() => { this.gameObject.tile(tileName) });
        this.sequence.addDelayAction(duration);
    }

    enter() {
        this.sequence.reset();
    }

    do() {
        // if (!this.gameObject.inDebugArea()) {
        //     return;
        // }
        this.sequence.update();
    }

    exit() {
    }

    isDone() {
        return this.sequence.isDone();
    }
}

class Lulling1 {
    /**
 * @param {EnemyBlob} enemyBlob
 */
    constructor(enemyBlob) {
        this.gameObject = enemyBlob;
        this.blob = enemyBlob;

        this.sequence = new ActionSequence();

        // this.sequence.addSimpleAction(() => { enemyBlob.swellSpeed = 4 });
        this.addTileAction("groggy", 2);

        // this.sequence.addSimpleAction(() => { enemyBlob.swellSpeed = 3 });
        this.addTileAction("sleeping", 0.5);
        this.addTileAction("groggy", 0.5);

        // this.sequence.addSimpleAction(() => { enemyBlob.swellSpeed = 2 });
        this.addTileAction("sleeping", 1);
        this.addTileAction("groggy", 0.2);
    }

    /**
     * @param {"groggy" | "sleeping"} tileName
     * @param {number} duration
     */
    addTileAction(tileName, duration) {
        this.sequence.addSimpleAction(() => { this.gameObject.tile(tileName) });
        this.sequence.addDelayAction(duration);
    }

    enter() {
        this.sequence.reset();
    }

    do() {
        // if (!this.gameObject.inDebugArea()) {
        //     return;
        // }
        this.sequence.update();
    }

    exit() {
    }

    isDone() {
        return this.sequence.isDone();
    }
}
