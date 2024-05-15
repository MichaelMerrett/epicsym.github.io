// Classes
/**
 * Parent class that is base for other classes
*/
class Item {

    /**
     * Initializes new item
     * @param {String} id Item's id
     * @param {Number} x Item's x-cord
     * @param {Number} y Item's y-cord
     * @param {Number} w Item's width
     * @param {Number} h Item's height
    */
    constructor(id, x, y, w, h) {

        this.id = id;
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;

        //index is a unique attribute because no two items can have the same index
        this.index = itemList.length;
        itemList.push(this);

        //Default values
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.gravity = 9.8;
    };

    /**
     * Find direction of motion/desired motion
     * @return {int} 1/-1 returns a positive or negative 1 
     */
    getMotionDir() {
        if (this.vel.x != 0) {
            return (Math.sign(this.vel.x));
        } else {
            return (Math.sign(this.getExcludeFrictionForceX()));
        };
    };

    /**
     * Find the net force in the x direction of this item excluding the friction force
     * @return {Number} Netx in newtons
    */
    getExcludeFrictionForceX() {
        // Find net force in x direction exclude friction
        let netX = 0;
        //Skip friction and normal force
        for (let i = 2; i < this.forces.length; i++) {
            netX += this.forces[i].x
        }
        return netX
    }

    /**
     * Find the net force in y direction
     * @return {Number} Net force in y direction
    */
    getNetForceY() {
        // Find net force in y direction
        var netY = 0;
        for (let force of this.forces) {
            netY += force.y
        }
        return netY
    }

    /**
     * Find the net force in x direction
     * @return {Number} Net force in x direction
    */
    getNetForceX() {
        // Find net force in x direction
        var netX = 0;
        for (let force of this.forces) {
            netX += force.x
        }
        return netX
    }

    /**
     * Print the total balanced net force in both directions
    */
    getNewtons() {
        console.log(this.mass * this.acc.x)
        console.log(this.mass * this.acc.y)
    }
    
    /**
     * Find the kinetic energy in the x direction
     * @return {Number} Ek in x direction
     */
    getKineticX() {
        return (0.5 * this.mass * (this.vel.x ** 2));
    };

    /**
     * Find the momentum in the x direction of this item
     * @return {Number} Momentum in x direction
    */
    getMomentumX() {
        return (this.mass * this.vel.x);
    };

    /**
     * Find the kinetic energy in the y direction
     * @return {Number} Ek in y direction
     */
    getKineticY() {
        return (0.5 * this.mass * (this.vel.y ** 2));
    };

    /**
     * Find the momentum in the y direction of this item
     * @return {Number} Momentum in y direction
    */
    getMomentumY() {
        return (this.mass * this.vel.y);
    };

    /**
     * Calculate both final x velocities for a collision that's completely elastic
     * @param {object} a One of the items involved in the collision
     * @param {object} b Other item involved in the collision
     * @return {array} final vel a, final vel b
    */
    elasticCollisionX(a, b) {
        //Calculate both final x velocities for a collision that's completely elastic
        // @param a: object a(this)
        // @param b: object b(other)
        // @return final vel a, final vel b

        //STEP 1: FIND WHATS UNDER THE ROOT, IT IS SAME FOR BOTH CASES
        var discriminant = b.mass * a.mass * (((a.getMomentumX() ** 2) * -1) - (2 * a.getMomentumX() * b.getMomentumX()) + (2 * a.getKineticX() * b.mass) + (2 * a.getKineticX() * a.mass) + (2 * b.getKineticX() * b.mass) + (2 * b.getKineticX() * a.mass) - (b.getMomentumX() ** 2));

        //STEP 2: SPLIT INTO POSSIBLE CASES
        var endVelA1 = -1 * ((sqrt(discriminant) - (a.mass * a.getMomentumX()) - (a.mass * b.getMomentumX())) / (a.mass * (b.mass + a.mass)));
        var endVelA2 = (sqrt(discriminant) + (a.mass * a.getMomentumX()) + (a.mass * b.getMomentumX())) / (a.mass * (b.mass + a.mass));

        //STEP 3: CALCULATE OTHER END VELOCITY
        var endVelB = (a.getMomentumX() + b.getMomentumX() - (a.mass * endVelA2)) / b.mass;

        return [endVelA2, endVelB];
    };

    /**
     * Calculate both final y velocities for a collision that's completely elastic
     * @param {object} a One of the items involved in the collision
     * @param {object} b Other item involved in the collision
     * @return {array} final vel a, final vel b
    */
    elasticCollisionY(a, b) {
        //Calculate both final x velocities for a collision that's completely elastic
        // @param a: object a(this)
        // @param b: object b(other)
        // @return final vel a, final vel b

        //STEP 1: FIND WHATS UNDER THE ROOT, IT IS SAME FOR BOTH CASES
        var discriminant = b.mass * a.mass * (((a.getMomentumY() ** 2) * -1) - (2 * a.getMomentumY() * b.getMomentumY()) + (2 * a.getKineticY() * b.mass) + (2 * a.getKineticY() * a.mass) + (2 * b.getKineticY() * b.mass) + (2 * b.getKineticY() * a.mass) - (b.getMomentumY() ** 2));

        //STEP 2: SPLIT INTO POSSIBLE CASES
        var endVelA1 = -1 * ((sqrt(discriminant) - (a.mass * a.getMomentumY()) - (a.mass * b.getMomentumY())) / (a.mass * (b.mass + a.mass)));
        var endVelA2 = (sqrt(discriminant) + (a.mass * a.getMomentumY()) + (a.mass * b.getMomentumY())) / (a.mass * (b.mass + a.mass));

        //STEP 3: CALCULATE OTHER END VELOCITY
        var endVelB = (a.getMomentumY() + b.getMomentumY() - (a.mass * endVelA2)) / b.mass;

        return [endVelA2, endVelB];
    };
    /**
     * Static method that returns the item with the corresponding ID
     * @param {string} ID of desired item
     * @return {object} item desired item 
    */
    static getItemById(id) {
        for (let item of itemList) {
            if (item.id == id) {
                return (item);
            };
        };
        //If code gets to here, no item has been found
        console.log("No item with id " + id);
    };
};

/**
 * Subclass of item, creates boxes that can have movement
 */
class DynamicBox extends Item {
    // Handle rectangle collisions and forces, including forces on inclines

    /**
     * Initializes new dynamic box
     * @param {String} id Item's id
     * @param {Number} x Item's x-cord
     * @param {Number} y Item's y-cord
     * @param {Number} w Item's width
     * @param {Number} h Item's height
     * @param {Number} mass Item's mass
     * @param {Number} xVel Item's initial x velocity
     * @param {Number} yVel Item's initial y velocity
    */
    constructor(id, x, y, w, h, mass, xVel, yVel) {

        super(id, x, y, w, h);
        this.mass = mass;
        this.grounded = false;
        this.collider = "dynamic";
        if (w == 1 && h == 1) {
            this.sprite = [smallBox1, smallBox2, smallBox3][Math.round(Math.random() * 2)];
        } else if (w == 1 && h == 2) {
            this.sprite = [longBoxVertical1, longBoxVertical2][Math.round(Math.random() * 1)];
        } else if (w == 3 && h == 2) {
            this.sprite = Box3x2;
        } else if (w == 2 && h == 2) {
            this.sprite = largeBox1;
        } else {
            this.sprite = smallBox1;
        };
        this.angle = 0;

        this.rampOffsetY = 0;
        this.angleEase = 0;
        this.rampEaseY = 0;

        //Velocities
        
        this.vel.x = xVel;
        this.vel.y = yVel;

        //Boolean for correct/incorrect collision value
        this.correctCollision = false;

        //Force stuff
        this.normalForce = createVector(0, 0);
        this.frictionForce = createVector(0, 0);
        this.gravityForce = createVector(0, this.mass * this.gravity);
        this.forces = [this.frictionForce, this.normalForce, this.gravityForce];
        this.forceColors = ["blue", "green", "purple", "yellow"];
    };

    /**
     * Resets this item's sprite
    */
    refreshSprite() {
        if (this.w == 1 && this.h == 1) {
            this.sprite = [smallBox1, smallBox2, smallBox3][Math.round(Math.random() * 2)];
        } else if (this.w == 1 && this.h == 2) {
            this.sprite = [longBoxVertical1, longBoxVertical2][Math.round(Math.random() * 1)];
        } else if (this.w == 3 && this.h == 2) {
            this.sprite = Box3x2;
        } else if (this.w == 2 && this.h == 2) {
            this.sprite = largeBox1;
        } else {
            this.sprite = smallBox1;
        };
    };

    /**
     * Display all object's forces converted to newtons with directions
     */
    showForces() {
        strokeWeight(unit(0.1))
        drawingContext.setLineDash([])

        //Find largest force to base length of force vector off of
        let largestForce = 0;
        for (let i = 0; i < this.forces.length; i++) {
            if (this.forces[i].mag() > largestForce) {
                largestForce = this.forces[i].mag()
            };
        };
        
        for (let i = 0; i < this.forces.length; i++) {
            if (this.forces[i].mag() > 0) {
                push()
                stroke(this.forceColors[i])
                strokeCap(ROUND)
                line(unit(this.pos.x + (0.5 * this.w)), unit(this.pos.y + (0.5 * this.h)) + unit(this.rampOffsetY) + unit(this.rampEaseY), unit(this.pos.x + (0.5 * this.w) + (this.forces[i].x * 2 / largestForce * (1 + (0.003 * this.mass)))), unit(this.pos.y + (0.5 * this.h) + (this.forces[i].y * 2 / largestForce * (1 + (0.003 * this.mass)))) + unit(this.rampOffsetY) + unit(this.rampEaseY))
                //draw force quantity
                noStroke()
                fill("black")
                // Divide by unit quantity to convert pixels to metres, and divide by frame ^ 2 to convert from frames ^ 2 to seconds squared
                // Multiply and divide by 10 in rounding to show 1 decimal place, increase 0s to increase decimals
                textAlign(CENTER, CENTER);
                text(Math.round(this.forces[i].mag() * 1000) / 1000 + "N", unit(this.pos.x + (0.5 * this.w) + (this.forces[i].x * 2 / largestForce * (1 + (0.003 * this.mass)))), unit(this.pos.y + (0.5 * this.h) + (this.forces[i].y * 2 / largestForce * (1 + (0.003 * this.mass)))) + unit(this.rampOffsetY) + unit(this.rampEaseY))
                pop()
            };
        };
    };

    /**
     * Display the item with its angle if applicable
     */
    show() {
        if (this.angle == 0) {
            image(this.sprite, unit(this.pos.x), unit(this.pos.y), unit(this.w), unit(this.h))
        } else {
            //Draw rotated img
            push(); //save current draw settings
            imageMode(CENTER);
            //Makes the centre of the box the pivot
            translate(unit(this.pos.x + (this.w / 2)), unit(this.pos.y + this.rampOffsetY + this.rampEaseY + this.h));
            rotate(PI / 180 * (this.angle + this.angleEase));
            //Makes the bottom center the pivot
            image(this.sprite, 0, unit(-(this.h / 2)), unit(this.w), unit(this.h));
            pop(); //load saved draw settings
        }
    };

    /**
     * Calculate the changes that this item should process during a certain time interval, also processes collisions
     * @param {Number} cappedDeltaTime Time between p5.js frames
     */
    update(cappedDeltaTime = Math.min(deltaTime, 100)) {
        let prevPosX = this.pos.x
        let prevPosY = this.pos.y
        
        this.pos.x += this.vel.x * (cappedDeltaTime / 1000);
        this.pos.y += this.vel.y * (cappedDeltaTime / 1000);

        //This variable is set to true if the item ever detects something beneathe it
        var groundCheck = false;
        var rampCheck = false;
        var collidedRamp;
        var collidedSurf = false;

        //Collisions
        for (let other of itemList) {
            if (this.index != other.index) {
                if (other.collider == "ramp") {
                    if (collideRectPoly(this.pos.x, this.pos.y, this.w, this.h, other.poly, true) == true) {
                        rampCheck = true;
                        collidedRamp = other;
                        //If this is first contact with ramp, set this item's y position to that of the ramp's
                        if (collideRectPoly(prevPosX, prevPosY, this.w, this.h, other.poly, true) == false) {
                            //Rebound this if hits back of ramp
                            if (collideLineRect(other.p2x, other.p2y, other.p3x, other.p3y, this.pos.x, this.pos.y, this.w, this.h)) {
                                this.vel.x *= -1;
                                rampCheck = false;
                                collidedRamp = 0;
                            } else {
                                this.pos.y = other.p1y - this.h - 0.001;
                            }
                        };
                    };
                } else if (other.collider == "pulley") {
                    this.vel.x *= -1
                    this.vel.y *= -1
                } else {
                    if (collideRectRect(this.pos.x, this.pos.y, this.w, this.h, other.pos.x, other.pos.y, other.w, other.h) == true) {
                        //If a collision got to here, it means a collision is occuring, its not with itself, this is a dynamic collider, and the item that the collision is happening with has not already calculated a collision with this item

                        if (this.pos.y + this.h >= other.pos.y && prevPosY + this.h < other.pos.y - (other.vel.y * (cappedDeltaTime / 1000))) {
                            //collision from above (this lands on something)
                            this.pos.y = other.pos.y - this.h - 0.001;
                            this.vel.y = other.vel.y;
                            this.acc.y = 0;
                            this.grounded = true;
                        };

                        if (this.pos.y <= other.pos.y + other.h && prevPosY > other.pos.y - (other.vel.y * (cappedDeltaTime / 1000)) + other.h) {
                            //collision from below (this hits the bottom of something)
                            other.pos.y = this.pos.y - other.h - 0.001;
                            other.vel.y = this.vel.y;
                            other.acc.y = 0;
                            other.grounded = true;
                        };

                        if (this.pos.x + this.w >= other.pos.x && prevPosX + this.w < other.pos.x - (other.vel.x * (cappedDeltaTime / 1000))) {
                            //collision from right (this hits right)
                            if (other.collider == "dynamic") {

                                if (collision.length > 0 && this.correctCollision) {
                                    if (this.id == collision[0] && other.id == collision[1]) {
                                        //This is first box
                                        this.vel.x = collision[2]
                                        other.vel.x = collision[3]
                                        this.correctCollision = false
                                    } else if (this.id == collision[1] && other.id == collision[0]) {
                                        //This is second box
                                        this.vel.x = collision[3]
                                        other.vel.x = collision[2]
                                        this.correctCollision = false
                                    };
                                } else {
                                    var endVels = this.elasticCollisionX(this, other);
                                    this.vel.x = endVels[0];
                                    other.vel.x = endVels[1];
                                };
                                
                            } else {
                                this.vel.x *= -1;
                                this.pos.x = other.pos.x - this.w - 0.001;
                            };
                        };

                        if (this.pos.x <= other.pos.x + other.w && prevPosX > other.pos.x - (other.vel.x * (cappedDeltaTime / 1000)) + other.w) {
                            //collision from left
                            if (other.collider == "dynamic") {

                                if (collision.length > 0 && this.correctCollision) {
                                    if (this.id == collision[0] && other.id == collision[1]) {
                                        //This is first box
                                        this.vel.x = collision[2];
                                        other.vel.x = collision[3];
                                        this.correctCollision = false;
                                    } else if (this.id == collision[1] && other.id == collision[0]) {
                                        //This is second box
                                        this.vel.x = collision[3];
                                        other.vel.x = collision[2];
                                        this.correctCollision = false;
                                    };
                                } else {
                                    var endVels = this.elasticCollisionX(this, other);
                                    this.vel.x = endVels[0];
                                    other.vel.x = endVels[1];
                                };
                            } else {
                                this.vel.x *= -1;
                                this.pos.x = other.pos.x + other.w + 0.001;
                            };
                        };
                    };

                    if (this.grounded == true || cappedDeltaTime == 0) {
                        if (collideRectRect(this.pos.x, this.pos.y + 0.002, this.w, this.h, other.pos.x, other.pos.y, other.w, other.h)) {
                            //This item is not touching anything, check if a normal force should be applied
                            //Since a grounded item does not actually collide with the ground, we need to check if it WOULD be touching something if it were a little bit lower.
                            groundCheck = true;
                            if (other.collider == "static") {
                                collidedSurf = other;
                            };
                        };
                    };
                };
            };
        };

        //-------------FORCES----------------------
        if (groundCheck == true) {
            //Item is grounded
            this.normalForce.y = this.mass * this.gravity * -1;
            if (rampCheck == false) {
                this.normalForce.x = 0;
            };
        } else {
            this.grounded = false;
            this.acc.y = this.gravityForce.y / this.mass;
            if (rampCheck == false) {
                this.normalForce.set(0, 0);
            };
        };

        //Ramp----------------------------------------
        if (rampCheck == true) {

            //-------VISUAL ONLY----------

            //Set offset angles and Y positions, visual only
            this.angle = collidedRamp.angle * collidedRamp.dir * -1;
            let rampRelativeX = this.pos.x + (this.w / 2) - collidedRamp.p1x
            this.rampOffsetY = -rampRelativeX / collidedRamp.length * (collidedRamp.p2y - collidedRamp.p3y)

            let distX;
            //Smooth the angle transition
            if (collidedRamp.dir == 1) {
                distX = collidedRamp.p1x - this.pos.x
            } else {
                distX = this.pos.x + this.w - collidedRamp.p1x
            };
            if (distX > 0) {
                //Create a multiplier that is 1 when fully on ramp and is anywhere between 1 and 0 depending on how much of this is on ramp
                let multi = distX / this.w;
                this.angleEase = multi * this.angle * -1;
                this.rampEaseY = multi * this.rampOffsetY * -1;
            } else {
                this.angleEase = 0;
                this.rampEaseY = 0;
            };

            //----------NOT VISUAL---------------

            //Calculate using tilted positive directions
            let tempGravX = this.gravityForce.y * Math.sin(PI/ 180 * abs(this.angle)) * collidedRamp.dir * -1;

            //Find the direction that friction should act in
            let frictionDirection;
            if (this.getExcludeFrictionForceX() == 0) {
                if (Math.sign(this.vel.x) == 0) {
                    frictionDirection = Math.sign(tempGravX) * -1;
                } else {
                    frictionDirection = Math.sign(this.vel.x) * -1;
                };
            } else {
                frictionDirection = this.getMotionDir * -1;
            };
            
            let tempFricH = this.gravityForce.y * Math.cos(PI/ 180 * abs(this.angle)) * collidedRamp.frictionCoefficient * frictionDirection;
            this.normalForce.x = this.normalForce.y * Math.tan(PI/180 * abs(this.angle)) * collidedRamp.dir;

            if (abs(this.vel.x) < 0.05) {
                //Item is not moving
                if (abs(tempFricH) > abs(tempGravX)) {
                    tempFricH = -tempGravX;
                };
                this.vel.x = 0;
            };
        

            this.acc.x = (tempFricH + tempGravX) / this.mass;

            //Untilt values (For displaying the forces)
            this.frictionForce.x = tempFricH * Math.cos(PI/ 180 * abs(this.angle))
            this.frictionForce.y = tempFricH * Math.sin(PI/ 180 * abs(this.angle)) * collidedRamp.dir * -1
            


        } else { //Not on ramp-------------------------------------

            this.rampOffsetY = 0;
            this.angleEase = 0;
            this.rampEaseY = 0;
            
            this.frictionForce.y = 0
            this.frictionForce.x = 0
            this.gravityForce.y = this.gravity * this.mass
            if (groundCheck == true) {
                this.normalForce.y = this.mass * this.gravity * -1;
                if (collidedSurf != false) {
                    this.frictionForce.x = abs(collidedSurf.frictionCoefficient * this.normalForce.y) * this.getMotionDir() * -1;
                };
            };
            
            //Reset variables
            this.angle = 0;
            this.gravityForce.x = 0;

            //Friction
            //Create velocity threshold, this is kind of a patch job fix for completely stopping friction force when item is barely moving
            if (abs(this.vel.x) < 0.05) {
                this.frictionForce.x = 0;
                this.vel.x = 0;
            };
            this.acc.x = this.getNetForceX() / this.mass;
        };

        //Collisions with edges
        if (this.pos.x < 0) {
            this.vel.x *= -1;
            this.pos.x = 0;
        } else if (this.pos.x + this.w > 18) {
            this.vel.x *= -1;
            this.pos.x = 18 - this.w;
        };
        if (this.pos.y < 0) {
            this.vel.y *= -1;
            this.pos.y = 0;
        } else if (this.pos.y + this.h > 11) {
            this.vel.y *= -1;
            this.pos.y = 11 - this.h;
        };

        //Menu collision with ground
        if (level == 1 && this.pos.y > 11 - this.h - 1) {
            this.vel.y *= -1;
            this.pos.y = 11 - this.h - 1;
        };


        //Adjust velocities by accelerations
        this.vel.x += this.acc.x * (cappedDeltaTime / 1000);
        this.vel.y += this.acc.y * (cappedDeltaTime / 1000);
    };

    /**
     * Gets the height of an object
     * @return {Number} Height of an object off the ground
     */
    getHeight() {
        return 10 - Number(deUnit(this.h)) - Number(deUnit(this.pos.y));
    };
};

/**
 * Subclass of item, creates a box without movement
 */
class StaticBox extends Item {

    /**
     * Initializes new static box
     * @param {String} id Item's id
     * @param {Number} x Item's x-cord
     * @param {Number} y Item's y-cord
     * @param {Number} w Item's width
     * @param {Number} h Item's height
     * @param {Number} frictionCoefficient Item's friction coefficient
     */
    constructor(id, x, y, w, h, frictionCoefficient) {
        super(id, x, y, w, h);
        this.collider = "static";
        this.frictionCoefficient = frictionCoefficient;
        if (this.w == 5 && this.h == 2) {
            this.sprite = tableImg
        } else if (this.w == 3 && this.h == 0.5) {
            this.sprite = targetImg
        }
    };

    /**
     * Resets this item's sprite
    */
    refreshSprite() {
        if (this.w == 5 && this.h == 2) {
            this.sprite = tableImg;
        } else if (this.w == 3 && this.h == 0.5) {
            this.sprite = targetImg;
        };
    };

    /**
     * Display the item with its angle if applicable
     */
    show() {
        if (this.sprite != undefined) {
            image(this.sprite, unit(this.pos.x), unit(this.pos.y), unit(this.w), unit(this.h))
        } else {
            push()
            fill(0, 0, 0, Math.max(255 * this.frictionCoefficient / 4, 0))
            rect(unit(this.pos.x), unit(this.pos.y), unit(this.w), unit(this.h))
            pop()
        }
    };

    /**
     * For debugging (Don't remove)
     */
    update() {
        fill("white")
    }
    
};

/**
 * Creates ramp objects
 */
class Ramp {

    /**
     * Initializes new ramp
     * @param {String} id Ramp's id
     * @param {Number} x Ramp's x-cord of ramp's origin (closest point to ground where the ramp begins)
     * @param {Number} y Ramp's y-cord of ramp's origin (closest point to ground where the ramp begins)
     * @param {Number} length Length of the ramp
     * @param {Number} angle Ramp's angle
     * @param {Number} friction Ramp's friction coefficient
     */
    constructor(id, x, y, length, angle, friction) {
        this.id = id
        this.dir = Math.sign(length);
        this.length = length;
        this.angle = angle;
        this.p1x = x;
        this.p1y = y;
        this.p2x = this.p1x + this.length;
        this.p2y = this.p1y;
        this.p3x = this.p1x + this.length;
        this.p3y = this.p1y - (Math.tan(PI / 180 * this.angle) * abs(this.length));
        this.poly = [createVector(this.p1x, this.p1y), createVector(this.p2x, this.p2y), createVector(this.p3x, this.p3y)];
        this.frictionCoefficient = friction;

        this.collider = "ramp";
        this.index = itemList.length;
        itemList.push(this);

        this.sprite = rampImg;

        //For drawing the item indicators
        this.pos = createVector((this.p1x + this.p2x) / 2, this.p3y);
    };

    /**
     * Display the ramp
     */
    show() {
        push();
        beginClip({ invert: true });
        rect(0, 0, unit(18), unit(10));
        triangle(unit(this.p1x), unit(this.p1y), unit(this.p2x), unit(this.p2y), unit(this.p3x), unit(this.p3y));
        endClip();
        image(this.sprite, 0, 0, unit(18), unit(10));
        pop();

        //Draw caution tape
        push();
        drawingContext.setLineDash([unit(0.25), unit(0.25)]);
        drawingContext.lineDashOffset = unit(0.125);
        strokeWeight(unit(0.1));
        stroke(255, 233, 51);
        line(unit(this.p1x), unit(this.p1y), unit(this.p3x), unit(this.p3y));
        drawingContext.lineDashOffset = unit(-0.125);
        stroke("black");
        line(unit(this.p1x), unit(this.p1y), unit(this.p3x), unit(this.p3y));
        pop();
    };

    /**
     * for debugging
     */
    update() {
        fill("white");
    };
};

/**
 * WIP Creates pulley objects
 */
class Pulley {

    /**
     * Initializes new pulley
     * @param {Number} x Pulley's x cord
     * @param {Number} y Pulley's y cord
     * @param {String} attachedItem1 Id of first item attached
     * @param {String} attachedItem2 Id of second item attached
     */
    constructor(x, y, attachedItem1, attachedItem2) {
        this.pos = createVector(unit(x), unit(y));
        this.sprite = pulleyImg
        this.index = itemList.length;
        this.angle = 0
        this.attachedItem1 = false;
        this.attachedItem2 = false;


        //Loop through all items to find the item with the correct ID
        for (let i of itemList) {
            if (i.id == attachedItem1) {
                this.attachedItem1 = i.index;
            } else if (i.id == attachedItem2) {
                this.attachedItem2 = i.index;
            };
        };
        console.log(this.attachedItem1, this.attachedItem2);

        if (this.attachedItem1 == false || this.attachedItem2 == false) {
            console.log("Error, no item with id " + attachedItem1 + " or/and " + attachedItem2)
        }
        itemList.push(this);
    }

    /**
     * Display the pulley
     */
    show() {
        drawRope(this.pos.x + unit(0.1), this.pos.y + unit(0.5), unit(itemList[this.attachedItem1].pos.x + itemList[this.attachedItem1].w / 2), unit(itemList[this.attachedItem1].pos.y))
        drawRope(this.pos.x + unit(0.1), this.pos.y + unit(0.5), unit(itemList[this.attachedItem2].pos.x + itemList[this.attachedItem2].w / 2), unit(itemList[this.attachedItem2].pos.y))
        
        push()
        imageMode(CENTER);
        translate(this.pos.x + unit(1 / 2), this.pos.y + unit(1 / 2));
        rotate(PI / 180 * this.angle);
        image(this.sprite, 0, 0, unit(1), unit(1));
        pop()
    }

    /**
     * For debugging
     */
    update() {
        this.angle += 1
    }
};
