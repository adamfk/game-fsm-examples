"use strict";

class EnemyBlobSequence extends ActionSequence {
    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        super();
        this.enemyBlob = enemyBlob;
    }

    /**
     * @param {"groggy" | "sleeping" | "surprised" | "alarm"} tileName
     * @param {number} duration
     */
    addTileAction(tileName, duration) {
        this.addSimpleAction(() => { this.enemyBlob.tile(tileName) });
        this.addDelayAction(duration);
    }
}

class Charge1 extends EnemyBlobSequence {
    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        super(enemyBlob);
        this.timer = new Timer();
        this.chargeMaxTime = 0.5;

        /** @type {Vector2} */
        this.targetVec = null;

        // charge up and then launch at player's position
        {
            const action = new ActionHandler();
            action.enter = () => {
                this.enemyBlob.angle = 0;
                this.targetVec = this.enemyBlob.normalVecToPlayer();
                this.timer.set();
            };
            action.isDone = () => {
                return this.timer.get() >= this.chargeMaxTime + 0.01;
            };
            action.do = () => {
                const chargeRatio = this.timer.get() / this.chargeMaxTime;
                this.enemyBlob.angle = chargeRatio * PI/2;
        
                // launch towards player!
                if (chargeRatio >= 1) {
                    // this.velocity = this.normalVecToPlayer(); // THIS IS INSANE!!! YEET MODE!
                    this.enemyBlob.velocity.x = this.targetVec.x;
        
                    // slow it down a bit if we are in the air (no friction)
                    if (!this.enemyBlob.groundObject) {
                        this.enemyBlob.velocity.x *= 0.3;
                    }
                }
            }
            action.exit = () => {
                // this.enemyBlob.velocity.x = 0;
                this.enemyBlob.angle = 0;
            }
            this.add(action);
        }

        // rest post charge
        this.addSimpleAction(() => {
            this.enemyBlob.tile("groggy");
        }, 1.5);
    }
}

class Dance1 extends EnemyBlobSequence {

    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        super(enemyBlob);

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

        this.enemyBlob.velocity = vec2();
        this.enemyBlob.angle = 0;
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
            const mirroredSign = this.enemyBlob.getMirrorSign();
            desiredAngle = mirroredSign * originalDesiredAngle;
            incPerFrame = (desiredAngle - this.enemyBlob.angle) / frameCount;
        };
        action.do = () => {
            this.enemyBlob.angle += incPerFrame;
        };
        action.isDone = () => {
            const absDiff = Math.abs(this.enemyBlob.angle - desiredAngle);
            return absDiff <= Math.abs(incPerFrame);
        };
        this.add(action);
    }


    addHopAction() {
        const action = new ActionHandler();
        action.enter = () => {
            this.enemyBlob.velocity.y = 0.1;
            sound_jump.play(this.enemyBlob.pos, .4, 2);
        };
        action.do = () => {
        };
        action.isDone = () => {
            return this.enemyBlob.groundObject;
        };
        this.add(action);
    }


}

class Waking1 extends EnemyBlobSequence {
    /**
 * @param {EnemyBlob} enemyBlob
 */
    constructor(enemyBlob) {
        super(enemyBlob);

        this.addTileAction("groggy", 0.5);
        this.addTileAction("sleeping", 2);

        this.addTileAction("groggy", 0.5);
        this.addTileAction("sleeping", 1.5);

        this.addTileAction("groggy", 2);
    }
}

class Lulling1 extends EnemyBlobSequence {
    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        super(enemyBlob);

        this.addTileAction("groggy", 2);

        this.addTileAction("sleeping", 0.5);
        this.addTileAction("groggy", 0.5);

        this.addTileAction("sleeping", 1);
        this.addTileAction("groggy", 0.2);
    }
}


class Surprised1 extends EnemyBlobSequence {

    textOptions = ["OH !@%@??!", "!@#$!!@#$!!@#$!", "WHAT THE !@#$!?", "WHOA!", "YIKES!", "OH NO!", "ZUT ALORS!!!",];

    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        super(enemyBlob);
        this.text = this.getText();

        this.addSimpleAction(() => {
            enemyBlob.swellSpeed = 70;
            enemyBlob.smallVerticalHop();
            enemyBlob.tile("surprised");
        });
        this.addDelayAction(rand(0.5,2));
    }

    getText() {
        return this.textOptions[randInt(0, this.textOptions.length)];
    }

    do() {
        if (this.isDone())
            return;

        super.do();
        this.enemyBlob.debugTextAboveMe(this.text);
    }
}


class Alarm1 extends EnemyBlobSequence {

    evadeTextOptions = ["ALERT!", "HELP!", "INTRUDER!", "ALARM!", "DANGER!",];
    attackTextOptions = ["TO ARMS!", "ATTACK!", "GET THEM!", "HUNT!"];

    evade = true;
    minCalls = 3;
    maxCalls = 8;

    /**
     * @param {Enemy3} enemyBlob
     */
    constructor(enemyBlob) {
        super(enemyBlob);
        this.enemyBlob = enemyBlob;
        this.text = this.getText();

        this.addSimpleAction(() => {
            enemyBlob.swellSpeed = 10;
            enemyBlob.tile("alarm");
            if (this.evade) {
                this.text = "[must warn others]";
            } else {
                this.text = "[i need backup]";
            }
        }, rand(0.5,1.5));

        for (let i = 0; i < rand(3,8); i++) {
            this.addSimpleAction(() => {
                this.text = this.getText();
                enemyBlob.alertComrades();
            }, 1);
        }
    }

    setForEvade() {
        this.evade = true;
        this.minCalls = 3;
        this.maxCalls = 8;
    }

    setForHunt() {
        this.evade = false;
        this.minCalls = 1;
        this.maxCalls = 2;
    }

    getText() {
        if (this.evade) {
            return this.evadeTextOptions[randInt(0, this.evadeTextOptions.length)];
        }
        return this.attackTextOptions[randInt(0, this.attackTextOptions.length)];
    }

    do() {
        if (this.isDone())
            return;

        super.do();
        this.enemyBlob.debugTextAboveMe(this.text);
        const normalVecToPlayer = this.enemyBlob.normalVecToPlayer();
        const target = this.evade ? normalVecToPlayer.scale(-1) : normalVecToPlayer;
        this.enemyBlob.walkOrJumpTowardsTarget(target);
    }
}

class Notice1 extends EnemyBlobSequence {

    noticeTextOptions = ["huh?", "da heck?", "hmm?"];
    curiousTextOptions = ["neat!", "I wonder..."];

    /**
     * @param {Enemy3} enemyBlob
     * @param {GameObject} noticeSource
     */
    constructor(enemyBlob, noticeSource) {
        super(enemyBlob);
        this.enemyBlob = enemyBlob;
        this.text = "";
        this.shouldIdle = false;

        // if no notice source, use player
        if (!noticeSource || !noticeSource.pos) {
            noticeSource = player;
        }

        /** @type {GameObject?} */
        this.source = noticeSource;
        this.timer = new Timer(5);

        this.addSimpleAction(() => {
            this.enemyBlob.swellSpeed = 5;
            this.enemyBlob.tile("groggy");
            this.text = "huh?";
        }, rand(0.25, 1));

        this.addSimpleAction(() => {
            // face in direction of notice source
            if (this.source) {
                this.enemyBlob.facePosition(this.source.pos);
            }
        }, rand(0.2, 0.8));

        if (this.source instanceof Grenade) {
            if (rand() < 0.25)
            {
                // move towards target and study item for x seconds
                {
                    const action = new ActionHandler();
                    action.enter = () => {
                        this.timer.set(5);
                        this.text = "I wonder...";
                        this.enemyBlob.tile("study");
                    };
                    action.isDone = () => {
                        return this.timer.elapsed() || this.enemyBlob.pos.distance(this.source.pos) < 0.5;
                    };
                    action.do = () => {
                        this.enemyBlob.facePosition(this.source.pos);
                        this.enemyBlob.velocity.x = this.enemyBlob.normalVecToPos(this.source.pos).x * 0.03;
                    }
                    this.add(action);
                }
    
                this.addSimpleAction(() => {
                    this.text = "so shiny..."; // "blinky", "shiny", "so pretty", "what could it be?"
                }, rand(2, 3));
            }
        } else {
            this.addSimpleAction(() => {
                this.enemyBlob.swellSpeed = 5;
                this.enemyBlob.tile("groggy");
                this.text = "weird...";
            }, rand(2, 5));
        }
    }

    /**
     * @param {GameObject} noticeSource
     */
    notice(noticeSource) {
        // we could modify it to notice something new if we wanted, but for now, just ignore
        if (!this.source) {
            this.source = noticeSource;
        }
    }

    isGrenade() {
        return this.source instanceof Grenade;
    }

    do() {
        if (this.isDone())
            return;

        super.do();
        this.enemyBlob.debugTextAboveMe(this.text);
    }
}


class Dive1 extends EnemyBlobSequence {

    /**
     * @param {Enemy3} enemyBlob
     * @param {GameObject} grenadeSource
     */
    constructor(enemyBlob, grenadeSource) {
        const e = enemyBlob;
        super(enemyBlob);
        this.text = "";
        this.grenadeSource = grenadeSource;
        this.crawlSpeed = rand(0.002, 0.005);

        this.timer = new Timer(0);

        {
            const action = new ActionHandler();
            action.enter = () => {
                enemyBlob.tile("alarm");
                this.timer.set();
                e.angle = PI/2;
                e.velocity.y = rand(0.1, 0.2);
                let xVel = rand(0.1, 0.2);

                if (e.pos.x < grenadeSource.pos.x) {
                    xVel *= -1;
                    e.mirror = true;
                    e.angle *= -1;
                }

                // Slow it down a bit if we are in the air (no friction)
                // Unfortunately, LittleJS platformer bug (?) makes blob randomly look like it is in the air.
                // Maybe due to the swelling animation?
                // if (!e.groundObject) {
                //     xVel *= 0.2;
                // }

                e.velocity.x += xVel;
            };
            action.isDone = () => {
                const elapsedTime = this.timer.get();
                return elapsedTime >= 2.5 || grenadeSource.destroyed;
            };
            action.do = () => {
                if (this.timer.get() < 1.0) {
                    e.debugTextAboveMe("GRENADE!");
                } else {
                    e.tile("mortified");
                }

                // crawl away from grenade
                if (e.groundObject) {
                    let xVel = this.crawlSpeed;
                    
                    if (e.pos.x < grenadeSource.pos.x) {
                        xVel *= -1;
                    }
                    e.velocity.x += xVel;
                }
            }
            this.add(action);
        }

        // rest post dive
        this.addSimpleAction(() => {
            e.tile("sleeping");
        }, rand(0.25, 0.75));
    }

    exit() {
        this.enemyBlob.angle = 0; // just to make sure
        super.exit();
    }
}
