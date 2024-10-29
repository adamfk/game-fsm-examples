# Tutorial Work In Progress
This tutorial isn't finished, but does show case some useful enemy AI state machine patterns.

The code quality is "game jam" quality :)

<br>

# Example Game Enemy "AI" State Machines
Let's explore enemy "AI" and finite state machines (FSMs) in a simple platformer game.

We are first going to create a very simple AI (`Enemy0`) and then add more capability to it. The final result (`Enemy3`) is pretty fun to play against. It has 15 high level behaviors, calls for help and dodges grenades. 

Sometimes the enemy AI find grenades deeply fascinating and will get up close to study them before the fireworks start 😃.

![shiny-and-dive](https://github.com/user-attachments/assets/26f01e71-9ec5-43c7-b4e0-1ca9c1f47782)


<br>

# Open Source Visual Tool for State Machines
Enemy AI state machines can get pretty complicated, so we are going to use [StateSmith](https://github.com/StateSmith/StateSmith).

StateSmith is a free and open source tool that generates state machine code from diagrams. It currently supports 7 programming languages: `C#`, `C++`, `C`, `Java`, `JavaScript`, `TypeScript`, and `Python` (more coming). 

It also has zero dependencies and can work with any game engine or framework (using one of the above languages).

Full disclosure: I'm the author of StateSmith.

![](docs/langs.png)

With StateSmith, you can visually model your state machines with `draw.io` or `PlantUML` and then generate code for your favorite language. It is super useful for large and/or complex state machines. 

![image](https://github.com/user-attachments/assets/0393e861-ffb2-4b92-852d-79e2532404d8)

I specifically made StateSmith when I was faced with a very large embedded systems design that required 300+ hierarchical states. One of the StateSmith features that allows you to manage large state machines is the ability to collapse states like `IDLE` and `HUNTING` in the above diagram to keep things organized. Without this feature, we would have a design like below. It still works, but it can be challenging to understand as it is too large for a screen. It's also time consuming to maintain as you need to move states around to make room for new states. The above diagram is much easier to follow and maintain.

![](docs/e3-expanded-20p.png)

This example repo focuses on enemy AI, but you can use StateSmith for any state machine you like. It's great for game development, IoT, robotics, and more. It is also handy for smaller state machines that have lots of transitions between states like a game character with many animations. One nice thing about `draw.io` and StateSmith is that you can embed images/gifs in your diagrams if you want.

![mario](https://github.com/user-attachments/assets/f5835d30-88da-4e5e-8085-a8a31d08cd75)


<br>

# Web Based Platformer
Because we are more interested in state machines than a particular game engine/framework, we will use a simple [LittleJS](https://github.com/KilledByAPixel/LittleJS/) demo project. It's super easy to hack and you don't need to download anything other than this example repo.


<br>

# 4 Levels of Enemy "AI"
We are going to start super simple and gradually add more capabilities to our enemy AI.


## Level 0: hunt & sleep
Get too close to the blob and it will chase you. Otherwise, it will sleep.

> **[🕹️ TRY ENEMY 0 ONLINE HERE](https://adamfk.github.io/game-fsm-examples/?enemyId=0)**
> - `WASD` to move
> - left click to shoot (or `z` key)
> - right click to dodge/roll
> - middle click to throw a grenade (or `c` key)
> - debugging keys: `t` = drop test crate, `e` = drop enemy, `b` = make explosion, `m` = move player to mouse, `u` = toggle stadium damage, mouse scroll = zoom

![e0](https://github.com/user-attachments/assets/fccdc8af-ef27-45a1-a34e-6ef21531595a)

In the below diagram the `e` variable is an instance of the `Enemy0` blob class. There are lots of different ways to connect your state machine to your game objects. This is just one way to do it. 

![](docs/e0.png)

The hand written `Enemy0` class has an instance of the `Enemy0Sm` state machine (generated by StateSmith) and the state machine has a reference back to `Enemy0` so it can call methods on it. If your target language supports inheritance, you could have the state machine inherit from `Enemy0` to gain access to its methods. Composition (shown here) is often a good choice though.

```javascript
// This class extends the LittleJS EngineObject class.
class Enemy0 extends EnemyBlob
{
    constructor(position)
    { 
        super(position);
        this.sm = new Enemy0Sm();// create state machine
        this.sm.vars.e = this;   // give state machine access to `this` object
        this.sm.start();         // start the state machine
    }

    // Override LittleJS function (called by engine once each frame).
    // This is where we `update` the EngineObject.
    update() {
        this.sm.dispatchEvent(Enemy0Sm.EventId.DO); // RUN FSM!
        super.update(); // update physics for this object
    }

    // Called by state machine.
    huntPlayer() { /* ... */ }
}
```

<br>

## Level 1: timed hunting & celebration
Get too close and the blob will hunt you for 20 seconds before going back to sleep. The timer is reset while you are too close.

> **[🕹️ TRY ENEMY 1 ONLINE HERE](https://adamfk.github.io/game-fsm-examples/?enemyId=1)**

![e1](https://github.com/user-attachments/assets/749b06cc-1e99-4724-98f8-0c01e4003b8b)

Not too complicated yet. We have 3 states.

![e1](./docs/e1-fsm.png)


<br>

## Level 2: charged attacks
Come inside the red ring and they start hunting. Come inside the yellow ring and they will begin a charge attack.

> **[🕹️ TRY ENEMY 2 ONLINE HERE](https://adamfk.github.io/game-fsm-examples/?enemyId=2)**

![e2](./docs/e2.gif)

We've started nesting states now. Inside of our `HUNTING` parent state, we have 3 sub states:
- `HUNT` - move towards player.
- `CHARGE` - rotate horizontal and then rush towards player.
- `CHARGE_REST` - blobs need a break after charging. They are vulnerable during this time.

![](docs/e2-fsm.png)

> ⭐ One really powerful technique used in the `CHARGE` state is mixing **hand coded** state machines with StateSmith to get the best of both worlds. StateSmith is great for defining and visualizing states & transitions, but you don't have to use it for everything.

<!-- ![](docs/charge-closeup.png) -->

In the `CHARGE` state, we call `e.chargeEnter()`, `e.chargeDo()`, and `e.chargeExit()` methods on the `Enemy2` blob. These methods form a small hand coded state machine.

```javascript
class Enemy2 extends EnemyBlob
{
    // ...

    // store the target normalized vector & start the timer
    chargeEnter() {
        this.targetNormVec = this.normalVecToPlayer();
        this.chargeTimer.set();
    }

    // rotate blob towards horizontal and then charge
    chargeDo() {
        const chargeRatio = this.chargeTimer.get() / this.chargeMaxTime;
        this.angle = chargeRatio * PI/2;

        // fire!
        if (this.isChargeDone()) {
            this.velocity.x = this.targetNormVec.x;

            // slow it down a bit if we are in the air (no friction)
            if (!this.groundObject) {
                this.velocity.x *= 0.3;
            }
        }
    }

    // reset the angle
    chargeExit() {
        this.angle = 0;
    }

    isChargeDone() {
        return this.chargeTimer.get() >= this.chargeMaxTime;
    }
}
```

Why define the `chargeExit()` method? Doesn't the hand coded state machine know when it will exit? It does, but our parent `HUNTING` state machine may still exit to `ENEMY_WIN` on victory or `SLEEPING` on hunt timer expiry.

![](docs/e2-overview.png)

By defining the `exit` behavior for the `CHARGE` state, we can ensure that the blob is in a consistent state no matter how it exits. We don't want to leave a blob stuck in a charging/horizontal pose while sleeping.

![](docs/e2-exit.png)

<br>

## Deeply Customized State Machines
If you have a pattern that you use often, you can leverage advanced StateSmith capabilities that allow you to transform a state machine graph during code generation. This essentially allows you to create your own custom state machine DSL (Domain Specific Language). You can also add/remove states, transitions, and actions.

For example, instead of essentially proxying triggers like `enter` to `e.chargeEnter()`, `do` to `e.chargeDo()`, and `exit` to `e.chargeExit()` you could simply write `EDX / proxy()` and use some custom scripting to accomplish the same thing.

![](docs/charge-dsl-1.png)

Your diagram could look something like this (a few ideas):

![](docs/dsl-bigger.png)

If you were always going to "proxy" events to hand written code, you could just draw your states and relationships. The `EDX / proxy()` would be implied.

If you are interested in this, let me know and I can help you get started.

<br>

## Level 3: high level behaviors
Here is where the blobs start to come to life! They have 15 high level behaviors, call for help, and dodge grenades.

> **[🕹️ TRY ENEMY 3 ONLINE HERE](https://adamfk.github.io/game-fsm-examples/?enemyId=3)**
> - `WASD` to move
> - left click to shoot (or `z` key)
> - right click to dodge/roll
> - middle click to throw a grenade (or `c` key)
> - debugging keys: `t` = drop test crate, `e` = drop enemy, `b` = make explosion, `m` = move player to mouse, `u` = toggle stadium damage, mouse scroll = zoom

![shiny-and-dive](https://github.com/user-attachments/assets/26f01e71-9ec5-43c7-b4e0-1ca9c1f47782)

We build on the previous strategy of mixing simple hand coded behaviors and StateSmith generated states. Many of these simple behaviors are sequences so we can define them simply with some helpers.

```javascript
// A behavior sequence state machine for a blob that is waking up from sleep
class Waking1 extends EnemyBlobSequence {
    /**
     * @param {EnemyBlob} enemyBlob
     */
    constructor(enemyBlob) {
        super(enemyBlob);
        this.addTileAction("groggy", 0.5); // 0.5 seconds
        this.addTileAction("sleeping", 2); // 2 seconds
        this.addTileAction("groggy", 0.5);
        this.addTileAction("sleeping", 1.5);
        this.addTileAction("groggy", 2);
    }
}
```
This sequence is run by the `WAKING` state.

![](docs/e3-waking.png)

To understand `Enemy3Sm`, you'll need to understand exit points and how to work with collapsed states. https://www.youtube.com/watch?v=9Qd6zVCcB_Y

There's a lot going on in the `Enemy3` state machine. I'll add more details as soon as I can.


<br>
<br>

# Acknowledgements
The majority of this code comes from the excellent [LittleJs platformer example](https://github.com/KilledByAPixel/LittleJS/tree/main/examples/platformer).

Some cleanup and modifications were made to fix type issues and add some features.
