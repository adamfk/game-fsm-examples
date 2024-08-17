"use strict";

class Dance1 extends ActionSequence {

    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        super();
        this.gameObject = enemyBlob;
        this.blob = enemyBlob;

        const degrees = -25;

        this.addAngleAction(degrees);
        this.addAngleAction(0);
        this.addAngleAction(degrees);
        this.addAngleAction(0);
        this.addHopAction();
        this.addHopAction();
        this.addHopAction();
        this.addDelayAction(0.5);
        this.addSimpleAction(() => { enemyBlob.mirror = !enemyBlob.mirror; });
        this.addDelayAction(0.5);
    }

    do() {
        // if (!this.gameObject.inDebugArea()) {
        //     return;
        // }

        if (this.isDone()) {
            this.enter();
        }
        super.do();
    }

    exit() {
        super.exit();

        this.gameObject.velocity = vec2();
        this.gameObject.angle = 0;
        // this.gameObject.mirror = false; // leave as is
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
        action.do = () => {
            this.gameObject.angle += incPerFrame;
        };
        action.isDone = () => {
            const absDiff = Math.abs(this.gameObject.angle - desiredAngle);
            return absDiff <= Math.abs(incPerFrame);
        };
        this.add(action);
    }


    addHopAction() {
        const action = new ActionHandler();
        action.enter = () => {
            this.gameObject.velocity.y = 0.1;
            sound_jump.play(this.gameObject.pos, .4, 2);
        };
        action.do = () => {
        };
        action.isDone = () => {
            return this.gameObject.groundObject;
        };
        this.add(action);
    }


}

class Waking1 extends ActionSequence {
    /**
 * @param {EnemyBlob} enemyBlob
 */
    constructor(enemyBlob) {
        super();
        this.gameObject = enemyBlob;
        this.blob = enemyBlob;

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
        this.addSimpleAction(() => { this.gameObject.tile(tileName) });
        this.addDelayAction(duration);
    }
}

class Lulling1 extends ActionSequence {
    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        super();
        this.gameObject = enemyBlob;
        this.blob = enemyBlob;

        // this.addSimpleAction(() => { enemyBlob.swellSpeed = 4 });
        this.addTileAction("groggy", 2);

        // this.addSimpleAction(() => { enemyBlob.swellSpeed = 3 });
        this.addTileAction("sleeping", 0.5);
        this.addTileAction("groggy", 0.5);

        // this.addSimpleAction(() => { enemyBlob.swellSpeed = 2 });
        this.addTileAction("sleeping", 1);
        this.addTileAction("groggy", 0.2);
    }

    /**
     * @param {"groggy" | "sleeping"} tileName
     * @param {number} duration
     */
    addTileAction(tileName, duration) {
        this.addSimpleAction(() => { this.gameObject.tile(tileName) });
        this.addDelayAction(duration);
    }
}


class Surprised1 extends ActionSequence {

    static textOptions = ["OH !@%@??!", "!@#$!!@#$!!@#$!", "WHAT THE !@#$!?", "WHOA!", "YIKES!", "OH NO!", "ZUT ALORS!!!", ];

    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        super();
        this.gameObject = enemyBlob;
        this.blob = enemyBlob;
        this.text = this.getText();

        this.addSimpleAction(() => { 
            enemyBlob.swellSpeed = 70;
            enemyBlob.smallVerticalHop();
            enemyBlob.tile("surprised");
        });
        this.addDelayAction(1);
    }

    getText() {
        return Surprised1.textOptions[randInt(0, Surprised1.textOptions.length)];
    }

    do() {
        if (this.isDone())
            return;

        super.do();
        this.gameObject.debugTextAboveMe(this.text);
    }

    /**
     * @param {"groggy" | "sleeping" | "surprised"} tileName
     * @param {number} duration
     */
    addTileAction(tileName, duration) {
        this.addSimpleAction(() => { this.gameObject.tile(tileName) });
        this.addDelayAction(duration);
    }
}