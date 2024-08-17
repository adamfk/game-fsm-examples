'use strict';

/**
 * An example of an external (to StateSmith) state machine state.
 */
class ActionHandler {
    vars = { };
    
    enter() { }
    
    /** this is like update() */
    do() { }

    isDone() { return true; }
    
    exit(){ };
}
