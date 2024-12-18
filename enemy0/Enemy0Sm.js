// Autogenerated with StateSmith 0.17.1+3dba8261f1470ff8db4b6e247bff1948d68b9351.
// Algorithm: Balanced2. See https://github.com/StateSmith/StateSmith/wiki/Algorithms

// Generated state machine
class Enemy0Sm
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
        HUNTING : 1,
        SLEEPING : 2,
    }
    static { Object.freeze(this.StateId); }
    
    static StateIdCount = 3;
    static { Object.freeze(this.StateIdCount); }
    
    // Used internally by state machine. Feel free to inspect, but don't modify.
    stateId;
    
    // Variables. Can be used for inputs, outputs, user variables...
    vars = {
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
                return;
            } // end of behavior for ROOT.<InitialState>
        } // end of behavior for ROOT
    }
    
    // Dispatches an event to the state machine. Not thread safe.
    // Note! This function assumes that the `eventId` parameter is valid.
    dispatchEvent(eventId)
    {
        
        switch (this.stateId)
        {
            // STATE: Enemy0Sm
            case Enemy0Sm.StateId.ROOT:
                // state and ancestors have no handler for `do` event.
                break;
            
            // STATE: HUNTING
            case Enemy0Sm.StateId.HUNTING:
                this.#HUNTING_do(); 
                break;
            
            // STATE: SLEEPING
            case Enemy0Sm.StateId.SLEEPING:
                this.#SLEEPING_do(); 
                break;
        }
        
    }
    
    // This function is used when StateSmith doesn't know what the active leaf state is at
    // compile time due to sub states or when multiple states need to be exited.
    #exitUpToStateHandler(desiredState)
    {
        while (this.stateId != desiredState)
        {
            switch (this.stateId)
            {
                case Enemy0Sm.StateId.HUNTING: this.#HUNTING_exit(); break;
                
                case Enemy0Sm.StateId.SLEEPING: this.#SLEEPING_exit(); break;
                
                default: return;  // Just to be safe. Prevents infinite loop if state ID memory is somehow corrupted.
            }
        }
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////
    // event handlers for state ROOT
    ////////////////////////////////////////////////////////////////////////////////
    
    #ROOT_enter()
    {
        this.stateId = Enemy0Sm.StateId.ROOT;
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////
    // event handlers for state HUNTING
    ////////////////////////////////////////////////////////////////////////////////
    
    #HUNTING_enter()
    {
        this.stateId = Enemy0Sm.StateId.HUNTING;
        
        // HUNTING behavior
        // uml: enter / { e.tile("mad");\ne.swellSpeed = 20; }
        {
            // Step 1: execute action `e.tile("mad");\ne.swellSpeed = 20;`
            this.vars.e.tile("mad");
            this.vars.e.swellSpeed = 20;
        } // end of behavior for HUNTING
    }
    
    #HUNTING_exit()
    {
        // HUNTING behavior
        // uml: exit
        {
            // Step 1: execute action ``
        } // end of behavior for HUNTING
        
        this.stateId = Enemy0Sm.StateId.ROOT;
    }
    
    #HUNTING_do()
    {
        // HUNTING behavior
        // uml: do / { e.huntPlayer();\ne.debugCircle(9, "#F008"); }
        {
            // Step 1: execute action `e.huntPlayer();\ne.debugCircle(9, "#F008");`
            this.vars.e.huntPlayer();
            this.vars.e.debugCircle(9, "#F008");
        } // end of behavior for HUNTING
        
        // HUNTING behavior
        // uml: do [e.playerDist() > 9] TransitionTo(SLEEPING)
        if (this.vars.e.playerDist() > 9)
        {
            // Step 1: Exit states until we reach `ROOT` state (Least Common Ancestor for transition).
            this.#HUNTING_exit();
            
            // Step 2: Transition action: ``.
            
            // Step 3: Enter/move towards transition target `SLEEPING`.
            this.#SLEEPING_enter();
            
            // Step 4: complete transition. Ends event dispatch. No other behaviors are checked.
            return;
        } // end of behavior for HUNTING
        
        // No ancestor handles this event.
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////
    // event handlers for state SLEEPING
    ////////////////////////////////////////////////////////////////////////////////
    
    #SLEEPING_enter()
    {
        this.stateId = Enemy0Sm.StateId.SLEEPING;
        
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
        
        this.stateId = Enemy0Sm.StateId.ROOT;
    }
    
    #SLEEPING_do()
    {
        // SLEEPING behavior
        // uml: do / { e.debugCircle(6, "#0F08"); }
        {
            // Step 1: execute action `e.debugCircle(6, "#0F08");`
            this.vars.e.debugCircle(6, "#0F08");
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
            return;
        } // end of behavior for SLEEPING
        
        // No ancestor handles this event.
    }
    
    // Thread safe.
    static stateIdToString(id)
    {
        switch (id)
        {
            case Enemy0Sm.StateId.ROOT: return "ROOT";
            case Enemy0Sm.StateId.HUNTING: return "HUNTING";
            case Enemy0Sm.StateId.SLEEPING: return "SLEEPING";
            default: return "?";
        }
    }
    
    // Thread safe.
    static eventIdToString(id)
    {
        switch (id)
        {
            case Enemy0Sm.EventId.DO: return "DO";
            default: return "?";
        }
    }
}
