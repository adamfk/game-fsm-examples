'use strict';
class ActionSequence extends ActionHandler {
    constructor() {
        super();

        /** @type {ActionHandler[]} */
        this.sequence = [];
        this.index = 0;
    }

    /**
     * @param {ActionHandler} handler
     */
    add(handler) {
        this.sequence.push(handler);
    }

    /**
     * @param {() => void} func
     * @param {number} [postDelay]
     */
    addSimpleAction(func, postDelay) {
        const action = new ActionHandler();
        action.enter = () => {
            func();
        };
        action.isDone = () => {
            return true;
        };
        this.add(action);

        if (postDelay) {
            this.addDelayAction(postDelay);
        }
    }

    /**
     * @param {number} delayTime
     */
    addDelayAction(delayTime) {
        const action = new ActionHandler();
        const vars = action.vars;
        vars.delayTime = delayTime;
        action.enter = () => {
            vars.timer = new Timer();
            vars.timer.set();
        };
        action.isDone = () => {
            return vars.timer.get() >= vars.delayTime;
        };
        this.add(action);
    }

    enter() {
        this.index = 0;
        if (!this.isDone()) {
            this.sequence[this.index].enter();
        }
    }

    do() {
        if (this.isDone())
            return;

        const current = this.sequence[this.index];
        current.do();
        if (current.isDone()) {
            current.exit();
            this.index++
            if (!this.isDone()) {
                this.sequence[this.index].enter();
            }
        }
    }

    isDone() {
        return this.index >= this.sequence.length;
    }
}
