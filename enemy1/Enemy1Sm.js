// Autogenerated with StateSmith 0.11.2-drawio-improvements+1b3f2e08720b31a8a644454d9213567ddb7f9f6b.
// Algorithm: Balanced1. See https://github.com/StateSmith/StateSmith/wiki/Algorithms

// Generated state machine
class Enemy1Sm
{
    static EventId = 
    {
        DO : 0, // The `do` event is special. State event handlers do not consume this event (ancestors all get it too) unless a transition occurs.
    }
    static { Object.freeze(this.EventId); }
    
    static EventIdCount = 1;
    static { Object.freeze(this.EventIdCount); }
    
    static StateId = 
    {
        ROOT : 0,
        ENEMY_WIN : 1,
        HUNTING : 2,
        SLEEPING : 3,
    }
    static { Object.freeze(this.StateId); }
    
    static StateIdCount = 4;
    static { Object.freeze(this.StateIdCount); }
    
    // Used internally by state machine. Feel free to inspect, but don't modify.
    stateId;
    
    // Used internally by state machine. Don't modify.
    #ancestorEventHandler;
    
    // Used internally by state machine. Don't modify.
    #currentEventHandlers = Array(Enemy1Sm.EventIdCount).fill(undefined);
    
    // Used internally by state machine. Don't modify.
    #currentStateExitHandler;
    
    // Variables. Can be used for inputs, outputs, user variables...
    vars = {
        timer: new Timer(0),
        /** @type{Enemy1|null} */
        e: null, // need to set this to instance of Enemy before calling start()
    };
    
    // Starts the state machine. Must be called before dispatching events. Not thread safe.
    start()
    {
        this.#ROOT_enter();
        // ROOT behavior
        // uml: TransitionTo(ROOT.<InitialState>)
        {
            // Step 1: Exit states until we reach `ROOT` state (Least Common Ancestor for transition). Already at LCA, no exiting required.
            
            // Step 2: Transition action: ``.
            
            // Step 3: Enter/move towards transition target `ROOT.<InitialState>`.
            // ROOT.<InitialState> is a pseudo state and cannot have an `enter` trigger.
            
            // ROOT.<InitialState> behavior
            // uml: TransitionTo(SLEEPING)
            {
                // Step 1: Exit states until we reach `ROOT` state (Least Common Ancestor for transition). Already at LCA, no exiting required.
                
                // Step 2: Transition action: ``.
                
                // Step 3: Enter/move towards transition target `SLEEPING`.
                this.#SLEEPING_enter();
                
                // Step 4: complete transition. Ends event dispatch. No other behaviors are checked.
                this.stateId = Enemy1Sm.StateId.SLEEPING;
                // No ancestor handles event. Can skip nulling `ancestorEventHandler`.
                return;
            } // end of behavior for ROOT.<InitialState>
        } // end of behavior for ROOT
    }
    
    // Dispatches an event to the state machine. Not thread safe.
    dispatchEvent(eventId)
    {
        let behaviorFunc = this.#currentEventHandlers[eventId];
        
        while (behaviorFunc != null)
        {
            this.#ancestorEventHandler = null;
            behaviorFunc.call(this);
            behaviorFunc = this.#ancestorEventHandler;
        }
    }
    
    // This function is used when StateSmith doesn't know what the active leaf state is at
    // compile time due to sub states or when multiple states need to be exited.
    #exitUpToStateHandler(desiredStateExitHandler)
    {
        while (this.#currentStateExitHandler != desiredStateExitHandler)
        {
            this.#currentStateExitHandler.call(this);
        }
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////
    // event handlers for state ROOT
    ////////////////////////////////////////////////////////////////////////////////
    
    #ROOT_enter()
    {
        // setup trigger/event handlers
        this.#currentStateExitHandler = this.#ROOT_exit;
    }
    
    #ROOT_exit()
    {
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////
    // event handlers for state ENEMY_WIN
    ////////////////////////////////////////////////////////////////////////////////
    
    #ENEMY_WIN_enter()
    {
        // setup trigger/event handlers
        this.#currentStateExitHandler = this.#ENEMY_WIN_exit;
        this.#currentEventHandlers[Enemy1Sm.EventId.DO] = this.#ENEMY_WIN_do;
        
        // ENEMY_WIN behavior
        // uml: enter / { e.tile("chomp");\ne.swellSpeed = 60;\ne.play("laugh");\ntimer.set(3); }
        {
            // Step 1: execute action `e.tile("chomp");\ne.swellSpeed = 60;\ne.play("laugh");\ntimer.set(3);`
            this.vars.e.tile("chomp");
            this.vars.e.swellSpeed = 60;
            this.vars.e.play("laugh");
            this.vars.timer.set(3);
        } // end of behavior for ENEMY_WIN
    }
    
    #ENEMY_WIN_exit()
    {
        // ENEMY_WIN behavior
        // uml: exit
        {
            // Step 1: execute action ``
        } // end of behavior for ENEMY_WIN
        
        // adjust function pointers for this state's exit
        this.#currentStateExitHandler = this.#ROOT_exit;
        this.#currentEventHandlers[Enemy1Sm.EventId.DO] = null;  // no ancestor listens to this event
    }
    
    #ENEMY_WIN_do()
    {
        // No ancestor state handles `do` event.
        
        // ENEMY_WIN behavior
        // uml: do
        {
            // Step 1: execute action ``
            // Step 2: determine if ancestor gets to handle event next.
            // Don't consume special `do` event.
        } // end of behavior for ENEMY_WIN
        
        // ENEMY_WIN behavior
        // uml: do [timer.elapsed()] TransitionTo(HUNTING)
        if (this.vars.timer.elapsed())
        {
            // Step 1: Exit states until we reach `ROOT` state (Least Common Ancestor for transition).
            this.#ENEMY_WIN_exit();
            
            // Step 2: Transition action: ``.
            
            // Step 3: Enter/move towards transition target `HUNTING`.
            this.#HUNTING_enter();
            
            // Step 4: complete transition. Ends event dispatch. No other behaviors are checked.
            this.stateId = Enemy1Sm.StateId.HUNTING;
            // No ancestor handles event. Can skip nulling `ancestorEventHandler`.
            return;
        } // end of behavior for ENEMY_WIN
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////
    // event handlers for state HUNTING
    ////////////////////////////////////////////////////////////////////////////////
    
    #HUNTING_enter()
    {
        // setup trigger/event handlers
        this.#currentStateExitHandler = this.#HUNTING_exit;
        this.#currentEventHandlers[Enemy1Sm.EventId.DO] = this.#HUNTING_do;
        
        // HUNTING behavior
        // uml: enter / { e.tile("mad");\ne.swellSpeed = 20;\ntimer.set(20); }
        {
            // Step 1: execute action `e.tile("mad");\ne.swellSpeed = 20;\ntimer.set(20);`
            this.vars.e.tile("mad");
            this.vars.e.swellSpeed = 20;
            this.vars.timer.set(20);
        } // end of behavior for HUNTING
    }
    
    #HUNTING_exit()
    {
        // HUNTING behavior
        // uml: exit
        {
            // Step 1: execute action ``
        } // end of behavior for HUNTING
        
        // adjust function pointers for this state's exit
        this.#currentStateExitHandler = this.#ROOT_exit;
        this.#currentEventHandlers[Enemy1Sm.EventId.DO] = null;  // no ancestor listens to this event
    }
    
    #HUNTING_do()
    {
        // No ancestor state handles `do` event.
        
        // HUNTING behavior
        // uml: do / { e.huntPlayer();\ne.debugCircle(6, "#F008"); }
        {
            // Step 1: execute action `e.huntPlayer();\ne.debugCircle(6, "#F008");`
            this.vars.e.huntPlayer();
            this.vars.e.debugCircle(6, "#F008");
            
            // Step 2: determine if ancestor gets to handle event next.
            // Don't consume special `do` event.
        } // end of behavior for HUNTING
        
        // HUNTING behavior
        // uml: do [e.playerDist() < 6] / { timer.set(20); }
        if (this.vars.e.playerDist() < 6)
        {
            // Step 1: execute action `timer.set(20);`
            this.vars.timer.set(20);
            
            // Step 2: determine if ancestor gets to handle event next.
            // Don't consume special `do` event.
        } // end of behavior for HUNTING
        
        // HUNTING behavior
        // uml: do [timer.elapsed()] TransitionTo(SLEEPING)
        if (this.vars.timer.elapsed())
        {
            // Step 1: Exit states until we reach `ROOT` state (Least Common Ancestor for transition).
            this.#HUNTING_exit();
            
            // Step 2: Transition action: ``.
            
            // Step 3: Enter/move towards transition target `SLEEPING`.
            this.#SLEEPING_enter();
            
            // Step 4: complete transition. Ends event dispatch. No other behaviors are checked.
            this.stateId = Enemy1Sm.StateId.SLEEPING;
            // No ancestor handles event. Can skip nulling `ancestorEventHandler`.
            return;
        } // end of behavior for HUNTING
        
        // HUNTING behavior
        // uml: do [player.isDead()] TransitionTo(ENEMY_WIN)
        if (player.isDead())
        {
            // Step 1: Exit states until we reach `ROOT` state (Least Common Ancestor for transition).
            this.#HUNTING_exit();
            
            // Step 2: Transition action: ``.
            
            // Step 3: Enter/move towards transition target `ENEMY_WIN`.
            this.#ENEMY_WIN_enter();
            
            // Step 4: complete transition. Ends event dispatch. No other behaviors are checked.
            this.stateId = Enemy1Sm.StateId.ENEMY_WIN;
            // No ancestor handles event. Can skip nulling `ancestorEventHandler`.
            return;
        } // end of behavior for HUNTING
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////
    // event handlers for state SLEEPING
    ////////////////////////////////////////////////////////////////////////////////
    
    #SLEEPING_enter()
    {
        // setup trigger/event handlers
        this.#currentStateExitHandler = this.#SLEEPING_exit;
        this.#currentEventHandlers[Enemy1Sm.EventId.DO] = this.#SLEEPING_do;
        
        // SLEEPING behavior
        // uml: enter / { e.tile("sleeping");\ne.swellSpeed = 1; }
        {
            // Step 1: execute action `e.tile("sleeping");\ne.swellSpeed = 1;`
            this.vars.e.tile("sleeping");
            this.vars.e.swellSpeed = 1;
        } // end of behavior for SLEEPING
    }
    
    #SLEEPING_exit()
    {
        // SLEEPING behavior
        // uml: exit
        {
            // Step 1: execute action ``
        } // end of behavior for SLEEPING
        
        // adjust function pointers for this state's exit
        this.#currentStateExitHandler = this.#ROOT_exit;
        this.#currentEventHandlers[Enemy1Sm.EventId.DO] = null;  // no ancestor listens to this event
    }
    
    #SLEEPING_do()
    {
        // No ancestor state handles `do` event.
        
        // SLEEPING behavior
        // uml: do / { e.debugCircle(6, "#0F08"); }
        {
            // Step 1: execute action `e.debugCircle(6, "#0F08");`
            this.vars.e.debugCircle(6, "#0F08");
            
            // Step 2: determine if ancestor gets to handle event next.
            // Don't consume special `do` event.
        } // end of behavior for SLEEPING
        
        // SLEEPING behavior
        // uml: do [e.playerDist() < 6] TransitionTo(HUNTING)
        if (this.vars.e.playerDist() < 6)
        {
            // Step 1: Exit states until we reach `ROOT` state (Least Common Ancestor for transition).
            this.#SLEEPING_exit();
            
            // Step 2: Transition action: ``.
            
            // Step 3: Enter/move towards transition target `HUNTING`.
            this.#HUNTING_enter();
            
            // Step 4: complete transition. Ends event dispatch. No other behaviors are checked.
            this.stateId = Enemy1Sm.StateId.HUNTING;
            // No ancestor handles event. Can skip nulling `ancestorEventHandler`.
            return;
        } // end of behavior for SLEEPING
    }
    
    // Thread safe.
    static stateIdToString(id)
    {
        switch (id)
        {
            case Enemy1Sm.StateId.ROOT: return "ROOT";
            case Enemy1Sm.StateId.ENEMY_WIN: return "ENEMY_WIN";
            case Enemy1Sm.StateId.HUNTING: return "HUNTING";
            case Enemy1Sm.StateId.SLEEPING: return "SLEEPING";
            default: return "?";
        }
    }
    
    // Thread safe.
    static eventIdToString(id)
    {
        switch (id)
        {
            case Enemy1Sm.EventId.DO: return "DO";
            default: return "?";
        }
    }
}
