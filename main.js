// EpicSym
// ICS4U
// Michael Merrett & Darren Rakos
// This program handles displaying images and accepting user inputs for the canvas.
// History:
// 1/21/2024: Program Creation

//Global lists
var itemList = []; //array that stores all items
var dynamicItemList = [];
var readLevelData = []; //Unprocessed list with every problem data value
var levelData = []; //2d list with problemss and their related stuff
var collision = []; //list with collision attributes
var indicators = []; //list with indicator sprites
var uncheckedBoxes = []; //Boxes that are checked in filters screen
var shownLevels = []; //Levels that meet filter criteria

//Level editor
var newLevelData = []; //2d list with user's new level data
var newGivens = []; //list of givens to be added when creating a level 
var newInputs = []; 
var newGlobalGivens = [];
var newCollisions = [];
var frictionZones = [];
var checkedBoxes = [];  //list of all checked subjects
var previewMode = false; 
var selectedItem = "none"; //Problem creator current selection

//Global values
var unitQuantity; //Conversion amount (Pixels per unit)
var level = 1; //Current screen to show
var menuStep = 0; //For the rotation effect on the menu screen
var pageNum = 1; //Level selector page number
var savedLevel = 1; //Save previous level so user can go back
var selectedProblem = "none"; //Problem select screen
var active = false; //Simulation start/stop
var initalTime;
var problemOrder = 1;
var displayForces = false; //Display the force vectors?
var timeSinceLastMotion = false;
var firstStillness = true; //Used to display problem result only once

//Global p5 button attributes
var menuBoxSizeAdj = [0, 0, 0, 0, 0, 0, 0, 0]; //List of problem selector box size offsets
var menuButtonSizeAdj = [0, 0, 0]; //List of problem selector button size offsets
var boxes; //List of problem selector boxes
var pageButtons; //List of problem selector buttons
var lastPageOffset = 0;
var activeButton;
var timer = 0;
var activeButtonSizeAdj = 0;
var activeAlpha = 255;

//Visuals
var grad1;

/**
 * Draws everything on the canvas
 */
function draw() {
    
    //rotate screen
    
    if (level == 0) {
        background("Gray");
        fill("black")
        noStroke()
        text("Please rotate your device", width / 2, height / 2)

    } else if (level == 1) {

        //Menu
        
        //counter
        menuStep += 1;
        
        background("FloralWhite");
        
        //Grid
        push()
        strokeWeight(unit(0.01));
        stroke("LightSkyBlue")
        drawingContext.setLineDash([unit(0.125), unit(0.125)]);
        drawingContext.lineDashOffset = unit(0.0625);
        for (let i = 1; i < 18; i++) {
            line(unit(i), 0, unit(i), height)
        }
        for (let i = 1; i < 10; i++) {
            line(0, unit(i), width, unit(i))
        }
        pop()

        //update and show objects
        for (let item of itemList) {
            item.update();
            item.show();
        };

        //Draw Menu letter objects
        rotateImg(letterE, unit(0.1), unit(0.5), unit(4), unit(4), Math.sin((1 / 12 * menuStep) - 500) + 4)
        rotateImg(letterP, unit(3.5), unit(2), unit(2), unit(2), Math.sin((1 / 8 * menuStep) + 800) - 3)
        rotateImg(letterI, unit(4.2), unit(0.65), unit(4), unit(4), Math.sin((1 / 10 * menuStep) - 300) + 1)
        rotateImg(letterC, unit(7), unit(2), unit(2), unit(2), Math.sin((1 / 9 * menuStep) + 1000) - 8)

        rotateImg(letterS, unit(9), unit(0.5), unit(4), unit(4), Math.sin((1 / 13 * menuStep) - 1500) + 2)
        rotateImg(letterY, unit(12), unit(2.5), unit(3), unit(3), Math.sin((1 / 7 * menuStep) + 2250) - 7)
        rotateImg(letterM, unit(14.5), unit(2), unit(2.5), unit(2.5), Math.sin((1 / 10.5 * menuStep) - 3000) + 3)

        //ground 
        image(groundImg, unit(0), unit(10), unit(18), unit(1))

        //add random velocity to objects every 900 frames so they don't stop moving
        if (menuStep % 900 == 0) {
            menuBox1.vel.x = random(-4, 4);
            menuBox2.vel.x = random(-4, 4);
            menuBox3.vel.x = random(-4, 4);
            menuBox4.vel.x = random(-4, 4);
            menuBox1.vel.y = random(0, 4);
            menuBox2.vel.y = random(0, 4);
            menuBox3.vel.y = random(0, 4);
            menuBox4.vel.y = random(0, 4);
        };
        
    } else if (level == 2) {

        //Level selector

        backgroundGradient(grad1);

        fill("#bababa");
        rect(0, 0, unit(18), unit(1.5));
        
        //all possible boxe positions per level selection screen
        boxes = [
            [unit(1.5) - (menuBoxSizeAdj[0] / 2), unit(2.5) - (menuBoxSizeAdj[0] / 2), unit(3) + menuBoxSizeAdj[0], unit(3) + menuBoxSizeAdj[0]],
            [unit(5.5) - (menuBoxSizeAdj[1] / 2), unit(2.5) - (menuBoxSizeAdj[1] / 2), unit(3) + menuBoxSizeAdj[1], unit(3) + menuBoxSizeAdj[1]],
            [unit(9.5) - (menuBoxSizeAdj[2] / 2), unit(2.5) - (menuBoxSizeAdj[2] / 2), unit(3) + menuBoxSizeAdj[2], unit(3) + menuBoxSizeAdj[2]],
            [unit(13.5) - (menuBoxSizeAdj[3] / 2), unit(2.5) - (menuBoxSizeAdj[3] / 2), unit(3) + menuBoxSizeAdj[3], unit(3) + menuBoxSizeAdj[3]],
            [unit(1.5) - (menuBoxSizeAdj[4] / 2), unit(6.5) - (menuBoxSizeAdj[4] / 2), unit(3) + menuBoxSizeAdj[4], unit(3) + menuBoxSizeAdj[4]],
            [unit(5.5) - (menuBoxSizeAdj[5] / 2), unit(6.5) - (menuBoxSizeAdj[5] / 2), unit(3) + menuBoxSizeAdj[5], unit(3) + menuBoxSizeAdj[5]],
            [unit(9.5) - (menuBoxSizeAdj[6] / 2), unit(6.5) - (menuBoxSizeAdj[6] / 2), unit(3) + menuBoxSizeAdj[6], unit(3) + menuBoxSizeAdj[6]],
            [unit(13.5) - (menuBoxSizeAdj[7] / 2), unit(6.5) - (menuBoxSizeAdj[7] / 2), unit(3) + menuBoxSizeAdj[7], unit(3) + menuBoxSizeAdj[7]]
        ];
        //all possible page buttons
        pageButtons = [
            [unit(1.75) - (menuButtonSizeAdj[0] / 2), unit(9.75) - (menuButtonSizeAdj[0] / 2), unit(2.5) + menuButtonSizeAdj[0], unit(1) + menuButtonSizeAdj[0]],
            [unit(13.75) - (menuButtonSizeAdj[1] / 2), unit(9.75) - (menuButtonSizeAdj[1] / 2), unit(2.5) + menuButtonSizeAdj[1], unit(1) + menuButtonSizeAdj[1]],
            [unit(7.5) - (menuButtonSizeAdj[2] / 2), unit(7.25) - (menuButtonSizeAdj[2] / 2), unit(3) + menuButtonSizeAdj[2], unit(1) + menuButtonSizeAdj[2]]
        ];

        //base selection screen
        if (selectedProblem == "none") {
            //enlarges boxes if mouse hovers over 
            for (let i = 0; i < 8; i++) {
                if (collidePointRect(mouseX, mouseY, ...boxes[i])) {
                    menuBoxSizeAdj[i] = unit(0.15);
                } else {
                    menuBoxSizeAdj[i] = 0;
                };
            };
            //enlarges page butons if mouse hovers over
            for (let i = 0; i < 2; i++) {
                if (collidePointRect(mouseX, mouseY, ...pageButtons[i])) {
                    menuButtonSizeAdj[i] = unit(0.1);
                } else {
                    menuButtonSizeAdj[i] = 0;
                };
            };
            menuButtonSizeAdj[2] = 0;
        //if a problem is selected
        } else {
            //make boxes normal size
            for (let i = 0; i < 8; i++) {
                menuBoxSizeAdj[i] = 0;
            };
            //make page buttons normal size
            for (let i = 0; i < 2; i++) {
                menuButtonSizeAdj[i] = 0;
            };
            //enlarge start button if hovered over
            if (collidePointRect(mouseX, mouseY, ...pageButtons[2])) {
                menuButtonSizeAdj[2] = unit(0.1);
            } else {
                menuButtonSizeAdj[2] = 0;
            };
        };

        lastPageOffset = 0;
        //determines the # of boxes on the last level selector screen
        if (pageNum == Math.ceil(shownLevels.length / 8)) {
            lastPageOffset = 8 - (shownLevels.length % 8)
            //if screen would be full
            if (lastPageOffset == 8) {
                lastPageOffset = 0
            }
        }

        //Draw a problem box for each loaded problem
        if (shownLevels.length != 0) {
            strokeWeight(unit(0.05));
            stroke("#adadad");
            for (let i = 0; i < 8 - lastPageOffset; i++) {
                rect(...boxes[i], unit(0.3));
            };
        }

        strokeWeight(unit(0.05));
        stroke("#adadad");
        //Page buttons
        rect(...pageButtons[0], unit(0.2));
        rect(...pageButtons[1], unit(0.2));

        rect(unit(7), unit(10.25), unit(4), unit(2), unit(1));
        noStroke();

        //put text on the boxes
        noStroke();
        fill("black");
        textAlign(CENTER, TOP);
        textSize(unit(0.4));
        let o = 0;
        //draw level data text on each created box
        if (shownLevels.length != 0) {
            for (let i = (pageNum - 1) * 8; i < (pageNum * 8) - lastPageOffset; i++) {
                text(shownLevels[i][0], boxes[o][0] + (boxes[o][2] / 2), boxes[o][1] + unit(0.5));
                text(shownLevels[i][1][0], boxes[o][0] + (boxes[o][2] / 2), boxes[o][1] + unit(1.3));
                text(shownLevels[i][2][0], boxes[o][0] + (boxes[o][2] / 2), boxes[o][1] + unit(2.1));
                o++;
            };
        };

        //extra text on screen other than level data
        //page buttons and page numbers
        fill("#404040");
        textAlign(CENTER, CENTER);
        textSize(unit(0.4));
        text(pageNum + " / " + Math.ceil(shownLevels.length / 8), unit(9), unit(10.625));
        textSize(unit(0.5));
        text("Previous", unit(3), unit(10.25) - (menuButtonSizeAdj[0] / 2));
        text("Next", unit(15), unit(10.25) - (menuButtonSizeAdj[1] / 2));

        //title
        fill("black");
        textAlign(LEFT, CENTER);
        textSize(unit(0.8));
        text("Problem Selector", unit(1), unit(0.75));

        textAlign(CENTER, TOP);
        textSize(unit(0.35));

        //if a problem is selected
        if (selectedProblem != "none") {
            //level selected box
            background(0, 0, 0, 127);
            fill("#d1d1d1");
            strokeWeight(unit(0.1));
            stroke("#bababa");
            rect(unit(2), unit(2), unit(14), unit(7), unit(0.8));

            noStroke();
            fill("black");
            textSize(unit(0.8));

            //selected level advanced data
            //title
            text(levelData[selectedProblem][0][0], unit(9), unit(2.5));
            textSize(unit(0.6));
            textAlign(LEFT, TOP);
            //subjects
            text("Subjects:", unit(2.7), unit(4));
            textSize(unit(0.5));
            for (let i = 0; i < levelData[selectedProblem][1].length; i++) {
                text("> " + (levelData[selectedProblem][1][i]), unit(3.2), unit(5 + (i / 1.3)));
            }
            textSize(unit(0.6))
            textAlign(RIGHT, TOP);
            //difficulty
            text(levelData[selectedProblem][2][0], unit(15), unit(7.5))
            textSize(unit(0.3))
            textAlign(LEFT, TOP);
            //description
            text(levelData[selectedProblem][3], unit(7), unit(4), unit(8), unit(3.4))
            fill("#bababa")
            strokeWeight(unit(0.05));
            stroke("#adadad");
            //start button
            rect(...pageButtons[2], unit(0.2));
            
            fill("#404040");
            textAlign(CENTER, CENTER);
            noStroke();
            textSize(unit(0.5));
            text("Start", unit(9), unit(7.75) - (menuButtonSizeAdj[2] / 2));
        };
        
    } else if (level == 3) {

        //Problems Screen
        
        background("FloralWhite");
        //Grid
        push();
        strokeWeight(unit(0.01));
        stroke("LightSkyBlue");
        drawingContext.setLineDash([unit(0.125), unit(0.125)]);
        drawingContext.lineDashOffset = unit(0.0625);
        for (let i = 1; i < 18; i++) {
            line(unit(i), 0, unit(i), height);
        };
        for (let i = 1; i < 10; i++) {
            line(0, unit(i), width, unit(i));
        };
        pop();

        image(groundImg, 0, unit(10), unit(18), unit(1))

        //Update items, update time
        if (active) {

            //Update time
            let tempTime = ("" + Math.round((new Date() - initalTime) / 100))
            tempTime.slice(0, -1) + "." + tempTime.slice(-1);
            time = tempTime.slice(0, -1) + "." + tempTime.slice(-1);

            //Update items
            for (let item of itemList) {
                item.update();
            };

            //Check for moving items
            for (let i = 0; i < dynamicItemList.length; i++) {
                if (abs(mag(dynamicItemList[i].vel.x, dynamicItemList[i].vel.y)) > 0.05) {
                    timeSinceLastMotion = false
                    break
                } else if (i == dynamicItemList.length - 1) {
                    if (timeSinceLastMotion == false) {
                        timeSinceLastMotion = new Date();
                        
                        //Validate the user inputed data once a moment without motion occurs
                        if (firstStillness) {
                            let inputs1 = document.getElementById("inputs");
                            for (let child of inputs1.children) {
                                if (child.nodeName == "INPUT") {
                                    if (parseFloat(child.value) >= parseFloat(child.id) - parseFloat(child.name) && parseFloat(child.value) <= parseFloat(child.id) + parseFloat(child.name) && parseFloat(child.value) != NaN) {
                                        console.log("Correct");
                                        confetti1.addConfetti();
                                    } else {
                                        console.log("Incorrect");
                                    };
                                };
                            };
                            firstStillness = false;
                        };
                    } else if (timeSinceLastMotion <= new Date() - 5000) {
                        //RESET after 5 seconds of no movement
                        unloadLevel();
                        loadLevel(selectedProblem);
                    };
                };
            };
        };

        //Show items
        for (let item of itemList) {
            item.show();
        };

        //Add item indicators
        if (active == false) {
            let tempPicker = 0;
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i].collider == "dynamic") {
                    image(indicators[tempPicker], unit(itemList[i].pos.x + (itemList[i].w / 2) - 0.5), unit(itemList[i].pos.y - 1.5) + unit(itemList[i].rampOffsetY) + unit(itemList[i].rampEaseY), unit(1), unit(1.5));
                    fill("black");
                    textAlign(CENTER, CENTER);
                    textSize(unit(0.5));
                    text(itemList[i].id, unit(itemList[i].pos.x + (itemList[i].w / 2)), unit(itemList[i].pos.y - 1) + unit(itemList[i].rampOffsetY) + unit(itemList[i].rampEaseY));
                } else if (itemList[i].collider == "static") {
                    image(indicators[tempPicker], unit(itemList[i].pos.x + (itemList[i].w / 2) - 0.5), unit(itemList[i].pos.y - 1.5), unit(1), unit(1.5));
                    fill("black");
                    textAlign(CENTER, CENTER);
                    textSize(unit(0.5));
                    text(itemList[i].id, unit(itemList[i].pos.x + (itemList[i].w / 2)), unit(itemList[i].pos.y - 1));
                } else if (itemList[i].collider == "ramp") {
                    image(indicators[tempPicker], unit(itemList[i].p1x + (itemList[i].length / 2) - 0.5), unit(((itemList[i].p2y + itemList[i].p3y) / 2) - 1.5), unit(1), unit(1.5));
                    fill("black");
                    textAlign(CENTER, CENTER);
                    textSize(unit(0.5));
                    text(itemList[i].id, unit(itemList[i].p1x + (itemList[i].length / 2)), unit(((itemList[i].p2y + itemList[i].p3y) / 2) - 1));
                };
                tempPicker ++;
                if (tempPicker == indicators.length) {
                    tempPicker = 0;
                };
            };
        };

        //Show Forces
        for (let item of itemList) {
            if (item.collider == "dynamic" && displayForces) {
                item.showForces();
            };
        };

        //Draw buttons
        activeButton = [unit(14.5) - (activeButtonSizeAdj / 2), unit(9.5) - (activeButtonSizeAdj / 2), unit(3) + activeButtonSizeAdj, unit(1) + activeButtonSizeAdj];
        if (collidePointRect(mouseX, mouseY, ...activeButton)) {
            activeButtonSizeAdj = unit(0.15);

        } else {
            activeButtonSizeAdj = 0;
        };

        //Start button
        if (activeAlpha > 0) {
            fill(59, 156, 82, activeAlpha);
            stroke(48, 128, 67, activeAlpha);
            strokeWeight(unit(0.08));
            rect(...activeButton, unit(0.2));
            noStroke();
            fill(222, 255, 230, activeAlpha);
            textAlign(CENTER, CENTER);
            text("Start", unit(16), unit(10) - (activeButtonSizeAdj / 2));

            if (active) {
                activeAlpha -= 5;
            };
        } else {
            fill(140, 140, 140, -activeAlpha);
            stroke(94, 94, 94, -activeAlpha);
            strokeWeight(unit(0.08));
            rect(...activeButton, unit(0.2));
            noStroke();
            fill(227, 227, 227, -activeAlpha);
            textAlign(CENTER, CENTER);
            text("Reset", unit(16), unit(10) - (activeButtonSizeAdj / 2));

            if (Number(time) >= 2 && activeAlpha > -255) {
                activeAlpha -= 5;
            };
        };

        //Back to menu button
        if (collidePointCircle(mouseX, mouseY, unit(1.25), unit(1.25), unit(2))) {
            image(returnImg, unit(0.2), unit(0.2), unit(2.1), unit(2.1));
        } else {
            image(returnImg, unit(0.25), unit(0.25), unit(2), unit(2));
        }

        //Timer
        image(clockImg, unit(15.5), unit(0.5), unit(2), unit(2))
        if (active) {
            fill(156, 156, 156, 140)
            let value1 = ((Number(time) % 1) * 2*PI) - (PI/2)
            let value2 = -PI/2
            let temp1 = time.split(".")
            if (temp1[0][temp1.length - 1] % 2) {
                let temp = value2;
                value2 = value1;
                value1 = temp;
            }
            arc(unit(16.5), unit(1.6), unit(1.5), unit(1.5), value1, value2)
            fill("black")
            text(time, unit(16.5), unit(1.55))
        }

    } else if (level == 4) {
       
        //Level maker
        
        background("FloralWhite");
        //Grid
        push();
        strokeWeight(unit(0.01));
        stroke("LightSkyBlue");
        drawingContext.setLineDash([unit(0.125), unit(0.125)]);
        drawingContext.lineDashOffset = unit(0.0625);
        for (let i = 1; i < 18; i++) {
            line(unit(i), 0, unit(i), height);
        };
        for (let i = 1; i < 10; i++) {
            line(0, unit(i), width, unit(i));
        };
        pop();

        image(groundImg, 0, unit(10), unit(18), unit(1))

        //Update items, update time, and draw indicators
        if (active) {

            //Update time
            let tempTime = ("" + Math.round((new Date() - initalTime) / 100))
            tempTime.slice(0, -1) + "." + tempTime.slice(-1);
            time = tempTime.slice(0, -1) + "." + tempTime.slice(-1);

            //Update items
            for (let item of itemList) {
                item.update();
            };
        };

        //Show items
        for (let item of itemList) {
            item.show();
            if (item.collider == "dynamic" && displayForces) {
                item.showForces();
            };
        };

        //Show selected item outline
        if (selectedItem != "none") {
            fill(84, 227, 108, 100)
            if (selectedItem.collider == "dynamic" || selectedItem.collider == "static") {
                rect(unit(selectedItem.pos.x), unit(selectedItem.pos.y), unit(selectedItem.w), unit(selectedItem.h))
            } else if (selectedItem.collider == "ramp") {
                triangle(unit(selectedItem.p1x), unit(selectedItem.p1y), unit(selectedItem.p2x), unit(selectedItem.p2y), unit(selectedItem.p3x), unit(selectedItem.p3y))
            }
        }

        //add indicators for each item
        if (active == false) {
            let tempPicker = 0;
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i].collider == "dynamic") {
                    image(indicators[tempPicker], unit(itemList[i].pos.x + (itemList[i].w / 2) - 0.5), unit(itemList[i].pos.y - 1.5) + unit(itemList[i].rampOffsetY) + unit(itemList[i].rampEaseY), unit(1), unit(1.5));
                    fill("black");
                    textAlign(CENTER, CENTER);
                    textSize(unit(0.5));
                    text(itemList[i].id, unit(itemList[i].pos.x + (itemList[i].w / 2)), unit(itemList[i].pos.y - 1) + unit(itemList[i].rampOffsetY) + unit(itemList[i].rampEaseY));
                } else if (itemList[i].collider == "static") {
                    image(indicators[tempPicker], unit(itemList[i].pos.x + (itemList[i].w / 2) - 0.5), unit(itemList[i].pos.y - 1.5), unit(1), unit(1.5));
                    fill("black");
                    textAlign(CENTER, CENTER);
                    textSize(unit(0.5));
                    text(itemList[i].id, unit(itemList[i].pos.x + (itemList[i].w / 2)), unit(itemList[i].pos.y - 1));
                } else if (itemList[i].collider == "ramp") {
                    image(indicators[tempPicker], unit(itemList[i].p1x + (itemList[i].length / 2) - 0.5), unit(((itemList[i].p2y + itemList[i].p3y) / 2) - 1.5), unit(1), unit(1.5));
                    fill("black");
                    textAlign(CENTER, CENTER);
                    textSize(unit(0.5));
                    text(itemList[i].id, unit(itemList[i].p1x + (itemList[i].length / 2)), unit(((itemList[i].p2y + itemList[i].p3y) / 2) - 1));
                };
                tempPicker ++;
                if (tempPicker == indicators.length) {
                    tempPicker = 0;
                };
            };
        };

        //Back to menu button
        if (collidePointCircle(mouseX, mouseY, unit(1.25), unit(1.25), unit(2))) {
            image(returnImg, unit(0.2), unit(0.2), unit(2.1), unit(2.1));
        } else {
            image(returnImg, unit(0.25), unit(0.25), unit(2), unit(2));
        }

        //let users preview their current created level
        if (previewMode) {
            //Draw buttons
            activeButton = [unit(14.5) - (activeButtonSizeAdj / 2), unit(9.5) - (activeButtonSizeAdj / 2), unit(3) + activeButtonSizeAdj, unit(1) + activeButtonSizeAdj];
            if (collidePointRect(mouseX, mouseY, ...activeButton)) {
                activeButtonSizeAdj = unit(0.15);
    
            } else {
                activeButtonSizeAdj = 0;
            };
    
            //Start button
            if (activeAlpha > 0) {
                fill(59, 156, 82, activeAlpha);
                stroke(48, 128, 67, activeAlpha);
                strokeWeight(unit(0.08));
                rect(...activeButton, unit(0.2));
                noStroke();
                fill(222, 255, 230, activeAlpha);
                textAlign(CENTER, CENTER);
                text("Start", unit(16), unit(10) - (activeButtonSizeAdj / 2));
    
                if (active) {
                    activeAlpha -= 5;
                };
            //reset button
            } else {
                fill(140, 140, 140, -activeAlpha);
                stroke(94, 94, 94, -activeAlpha);
                strokeWeight(unit(0.08));
                rect(...activeButton, unit(0.2));
                noStroke();
                fill(227, 227, 227, -activeAlpha);
                textAlign(CENTER, CENTER);
                text("Reset", unit(16), unit(10) - (activeButtonSizeAdj / 2));
    
                if (Number(time) >= 2 && activeAlpha > -255) {
                    activeAlpha -= 5;
                };
            };
        };
    };
};