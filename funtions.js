/**
 * Runs at the start of the program, loads all images and reads CSV file 
 */
function preload() {
    //Load level data

    let levelFile = new XMLHttpRequest();
    levelFile.onload = function() {
        allText = levelFile.responseText;
        allTextLines = allText.split(/\r\n|\n/); // removing new lines
        if (allTextLines[allTextLines.length - 1] == "") {
            allTextLines.pop()
        };

        for (let i = 0; i < allTextLines.length; i++) {
            singleLine = allTextLines[i].split(", ");
            readLevelData.push(singleLine);
        };
    };

    levelFile.open("get", "levels.csv", true);
    levelFile.send();

    //Load assets
    smallBox1 = loadImage('Assets/Images/DiagBox.png');
    smallBox2 = loadImage('Assets/Images/Box.png');
    smallBox3 = loadImage('Assets/Images/CardboardBox.png');
    longBoxVertical1 = loadImage('Assets/Images/tallBox.png');
    longBoxVertical2 = loadImage('Assets/Images/DoubleBox.png');
    Box3x2 = loadImage('Assets/Images/shippingContainer.png');
    tableImg = loadImage('Assets/Images/table.png');
    targetImg = loadImage('Assets/Images/target.png');
    largeBox1 = loadImage('Assets/Images/largeBox.png');

    groundImg = loadImage('Assets/Images/Floor.png');
    rampImg = loadImage('Assets/Images/RampBack.png');

    indicators = [loadImage('Assets/Images/GreenIndicator.png'), loadImage('Assets/Images/PinkIndicator.png'), loadImage('Assets/Images/BlueIndicator.png')]

    letterE = loadImage('Assets/Menu/e.png');
    letterP = loadImage('Assets/Menu/p.png');
    letterI = loadImage('Assets/Menu/i.png');
    letterC = loadImage('Assets/Menu/c.png');
    letterS = loadImage('Assets/Menu/s.png');
    letterY = loadImage('Assets/Menu/y.png');
    letterM = loadImage('Assets/Menu/m.png');

    returnImg = loadImage('Assets/Images/return.png');
    clockImg = loadImage('Assets/Images/Clock.png');
};

/**
 * Runs after preload, creates levelData and canvas. Also sets some p5.js related values like font and draw settings
 */
function setup() {

    //Since this runs after preload(), we can finalize the levelData
    for (let i = 0; i < readLevelData.length; i++) {
        if (readLevelData[i][0] == '') {
            levelData.push([])
        } else {
            levelData[levelData.length - 1].push(readLevelData[i])
        }
    }

    //Give each level an id
    for (let i = 0; i < levelData.length; i++) {
        levelData[i].id = i
    };

    //Triggers on startup
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("p5canvas");
    noStroke();
    noSmooth();
    textAlign(LEFT, CENTER);
    frameRate(60);
    strokeCap(SQUARE);
    textFont("Trebuchet MS");

    //Set dimensions on startup, this also loads the current levelID
    windowResized();
};

/**
 * Sorts level list by difficulty and by order
 * @param {array} list Unsorted list
 * @param {int} order Direction to sort by
 * @return {array} Sorted list
 */
function insertionSort(listForSorting, order) {
    // Sorts the list using insertion method, we recognize that this replaces the existing list, however since the list is multiple layers deep, using simple list cloning methods doesn't work.
    var length = listForSorting.length;
    var temp;
    // starting should be one because we check the second item in the list first
    for (let starting = 1; starting < length; starting++) {
        for (let i = starting; i > 0; i--) {
            if ((parseInt(listForSorting[i][2][1]) * order) < (parseInt(listForSorting[i - 1][2][1]) * order)) {
                temp = listForSorting[i];
                listForSorting[i] = listForSorting[i - 1];
                listForSorting[i - 1] = temp;
            } else {
                break;
            };
        };
    };
    return (listForSorting);
};

// function drawRope(x1, y1, x2, y2) {
//     push()
//     strokeWeight(unit(0.1))
//     stroke("Peru")
//     line(x1, y1, x2, y2)
//     drawingContext.setLineDash([unit(0.1), unit(0.2)])
//     stroke("SaddleBrown")
//     line(x1, y1, x2, y2)
//     pop()
// };

/**
 * Used to draw an item at a specific angle
 * @param {object} img Sprite that should be drawn
 * @param {Number} x x-cord of item
 * @param {Number} y y-cord of item
 * @param {Number} w width of item
 * @param {Number} h height of item
 * @param {Number} a angle of rotation
 */
function rotateImg(img, x, y, w, h, angle) {
    push(); //save current draw settings
    imageMode(CENTER);
    //Makes the centre of the box the pivot
    translate(x + (w / 2), y + (h / 2));
    rotate(PI / 180 * angle);
    //Makes the bottom center the pivot
    image(img, 0, 0, w, h);
    pop(); //load saved draw settings
};

/**
 * Loads and starts a level
 * @param {Number} levelID Identifier of level that should be loaded
 */
function loadLevel(levelID) {
    if (levelID >= 0) {
        //Reset input list
        inputsList = [];
        var loadedLevel = [];

        //Load the user's edited level if user in level editor
        if (previewMode) {
            for (let i = 0; i < newLevelData.length; i++) {
                loadedLevel[i] = [...newLevelData[i]];
            };
        } else {
            for (let i = 0; i < levelData[levelID].length; i++) {
                loadedLevel[i] = [...levelData[levelID][i]];
            };
        };
    
        let givens = document.getElementById("givens");
        let inputs = document.getElementById("inputs");
        for (let i = 6; i < loadedLevel.length; i++) {

            //Set givens/inputs
            //Loop through each item's attributes, starting after name and type
            for (let o = 2; o < loadedLevel[i].length; o++) {
                //Check if current item is supposed to be given information
                var temp = loadedLevel[i][o].split(":");
                if (temp.length > 1) {
                    givens.appendChild(document.createTextNode(loadedLevel[i][0] + " " + temp[0] + ": " + temp[1] + temp[2]));
                    givens.appendChild(document.createElement("br"));

                    //Change the item's attribute back into its value so it can be read later
                    loadedLevel[i][o] = temp[1];
                } else {
                    //Check if current item is supposed to be inputed information
                    var temp = loadedLevel[i][o].split(";");
                    if (temp.length > 1) {
                        inputs.appendChild(document.createTextNode(loadedLevel[i][0] + " " + temp[0] + ": "));
                        let tempInput = document.createElement("input");
                        tempInput.type = "number";
                        tempInput.inputmode = "decimal";
                        tempInput.value = temp[1];
                        tempInput.id = temp[2];
                        tempInput.name = temp[3];
                        tempInput.min = temp[4];
                        tempInput.max = temp[5];
                        tempInput.step = temp[6];


                        //Use [i - 6] because there are 6 other things before the items are listed
                        if (temp[0] == "x-Position") {
                            tempInput.oninput = function() {
                                itemList[i - 6].pos.x = Number(tempInput.value);
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        } else if (temp[0] == "y-Position") {
                            //Since item will phase through floor if exactly touching floor, add an offset
                            tempInput.oninput = function() {
                                itemList[i - 6].pos.y = Number(10 - tempInput.value - 0.001 - itemList[i - 6].h);
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        } else if (temp[0] == "Width") {
                            tempInput.oninput = function() {
                                itemList[i - 6].w = Number(tempInput.value);
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        } else if (temp[0] == "Height") {
                            tempInput.oninput = function() {
                                itemList[i - 6].h = Number(tempInput.value);
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        } else if (temp[0] == "Mass") {
                            tempInput.oninput = function() {
                                itemList[i - 6].mass = Number(tempInput.value);
                                itemList[i - 6].gravityForce.y = itemList[i - 6].mass * itemList[i - 6].gravity
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        } else if (temp[0] == "x-Velocity") {
                            tempInput.oninput = function() {
                                itemList[i - 6].vel.x = Number(tempInput.value);
                                for (let item of itemList) {
                                    item.update(0);
                                };

                                if (Number(tempInput.value) >= Number(tempInput.id) - Number(tempInput.name) && Number(tempInput.value) <= Number(tempInput.id) + Number(tempInput.name) && parseFloat(tempInput.value) != NaN) {
                                    itemList[i - 6].correctCollision = true
                                } else {
                                    itemList[i - 6].correctCollision = false
                                }
                            };
                        } else if (temp[0] == "y-Velocity") {
                            tempInput.oninput = function() {
                                itemList[i - 6].vel.y = Number(tempInput.value) * -1;
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        }  else if (temp[0] == "x-Ramp Origin") {
                            tempInput.oninput = function() {
                                itemList[i - 6].p1x = Number(tempInput.value)
                                itemList[i - 6].p2x = itemList[i - 6].p1x + itemList[i - 6].length;
                                itemList[i - 6].p2y = itemList[i - 6].p1y;
                                itemList[i - 6].p3x = itemList[i - 6].p1x + itemList[i - 6].length;
                                itemList[i - 6].p3y = itemList[i - 6].p1y - (Math.tan(PI / 180 * itemList[i - 6].angle) * abs(itemList[i - 6].length));
                                itemList[i - 6].poly = [createVector(itemList[i - 6].p1x, itemList[i - 6].p1y), createVector(itemList[i - 6].p2x, itemList[i - 6].p2y), createVector(itemList[i - 6].p3x, itemList[i - 6].p3y)];
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        }  else if (temp[0] == "y-Ramp Origin") {
                            tempInput.oninput = function() {
                                itemList[i - 6].p1y = Number(tempInput.value)
                                itemList[i - 6].p2x = itemList[i - 6].p1x + itemList[i - 6].length;
                                itemList[i - 6].p2y = itemList[i - 6].p1y;
                                itemList[i - 6].p3x = itemList[i - 6].p1x + itemList[i - 6].length;
                                itemList[i - 6].p3y = itemList[i - 6].p1y - (Math.tan(PI / 180 * itemList[i - 6].angle) * abs(itemList[i - 6].length));
                                itemList[i - 6].poly = [createVector(itemList[i - 6].p1x, itemList[i - 6].p1y), createVector(itemList[i - 6].p2x, itemList[i - 6].p2y), createVector(itemList[i - 6].p3x, itemList[i - 6].p3y)];
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        }  else if (temp[0] == "Length") {
                            tempInput.oninput = function() {
                                itemList[i - 6].length = Number(tempInput.value)
                                itemList[i - 6].p2x = itemList[i - 6].p1x + itemList[i - 6].length;
                                itemList[i - 6].p2y = itemList[i - 6].p1y;
                                itemList[i - 6].p3x = itemList[i - 6].p1x + itemList[i - 6].length;
                                itemList[i - 6].p3y = itemList[i - 6].p1y - (Math.tan(PI / 180 * itemList[i - 6].angle) * abs(itemList[i - 6].length));
                                itemList[i - 6].poly = [createVector(itemList[i - 6].p1x, itemList[i - 6].p1y), createVector(itemList[i - 6].p2x, itemList[i - 6].p2y), createVector(itemList[i - 6].p3x, itemList[i - 6].p3y)];
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        }  else if (temp[0] == "Angle") {
                            tempInput.oninput = function() {
                                itemList[i - 6].angle = Number(tempInput.value)
                                itemList[i - 6].p2x = itemList[i - 6].p1x + itemList[i - 6].length;
                                itemList[i - 6].p2y = itemList[i - 6].p1y;
                                itemList[i - 6].p3x = itemList[i - 6].p1x + itemList[i - 6].length;
                                itemList[i - 6].p3y = itemList[i - 6].p1y - (Math.tan(PI / 180 * itemList[i - 6].angle) * abs(itemList[i - 6].length));
                                itemList[i - 6].poly = [createVector(itemList[i - 6].p1x, itemList[i - 6].p1y), createVector(itemList[i - 6].p2x, itemList[i - 6].p2y), createVector(itemList[i - 6].p3x, itemList[i - 6].p3y)];
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        } else if (temp[0] == "Friction Coefficient") {
                            tempInput.oninput = function() {
                                itemList[i - 6].frictionCoefficient = Number(tempInput.value);
                                for (let item of itemList) {
                                    item.update(0);
                                };
                            };
                        };
                        //display on canvas
                        inputs.appendChild(tempInput);
                        inputs.appendChild(document.createElement("br"));
                        inputs.appendChild(document.createElement("br"));

                        //Change the item's attribute back into its value so it can be read later
                        loadedLevel[i][o] = temp[1];
                    };
                };
            };

            //Create the item
            if (loadedLevel[i][1] == 'box') {
                
                box = new DynamicBox(loadedLevel[i][0], Number(loadedLevel[i][2]), 10 - Number(loadedLevel[i][3]) - 0.001 - Number(loadedLevel[i][5]), Number(loadedLevel[i][4]), Number(loadedLevel[i][5]), Number(loadedLevel[i][6]), Number(loadedLevel[i][7]), Number(loadedLevel[i][8]));
                
            } else if (loadedLevel[i][1] == 'ramp') {
                
                ramp = new Ramp(loadedLevel[i][0], Number(loadedLevel[i][2]), Number(loadedLevel[i][3]), Number(loadedLevel[i][4]), Number(loadedLevel[i][5]), Number(loadedLevel[i][6]));
                
            } else if (loadedLevel[i][1] == 'pulley') {
                
                pulley = new Pulley(Number(loadedLevel[i][2]), Number(loadedLevel[i][3]), loadedLevel[i][4], loadedLevel[i][5])
                
            } else if (loadedLevel[i][1] == 'staticBox') {

                staticBox = new StaticBox(loadedLevel[i][0], Number(loadedLevel[i][2]), 10 - Number(loadedLevel[i][3]) - Number(loadedLevel[i][5]), Number(loadedLevel[i][4]), Number(loadedLevel[i][5]), Number(loadedLevel[i][6]))
                
            };
            
        };

        //Load problem info
        document.getElementById("fullProblemTitle").innerHTML = loadedLevel[0];
        document.getElementById("fullProblem").innerHTML = loadedLevel[3];
            
        //Add extra givens
        let extraGivens = loadedLevel[4];
        //draw on canvas if there are any extra givens
        if (extraGivens[0] != "NA") {
            for (let i = 0; i < extraGivens.length; i++) {
                let eGiven = extraGivens[i].split(":");
                givens.appendChild(document.createTextNode(eGiven[0] + ": " + eGiven[1] + eGiven[2]));
                givens.appendChild(document.createElement("br"));
            };
        };

        //Create collision list(for momentum)
        let collisionTemp = loadedLevel[5];
        if (collisionTemp[0] != "NA") {
            //draw on canvas
            givens.appendChild(document.createTextNode(collisionTemp[0] + " Final velocity: " + collisionTemp[2] + "m/s"));
            givens.appendChild(document.createElement("br"));
            givens.appendChild(document.createTextNode(collisionTemp[1] + " Final velocity: " + collisionTemp[3] + "m/s"));
            givens.appendChild(document.createElement("br"));
            
            collision = [Number(collisionTemp[0]), Number(collisionTemp[1]), Number(collisionTemp[2]), Number(collisionTemp[3])]
        };

        //Run update functoion once for each item (With 0 time, this runs all collisions, adds normal force if item is grounded, etc)
        for (let item of itemList) {
            item.update(0);
        };

        //Add dynamic items to dynamic item list (for detecting when a problem should reset on its own)
        for (let item of itemList) {
            if (item.collider == "dynamic") {
                dynamicItemList.push(item);
            };
        };
        
    //menu screen 
    } else if (levelID == "none") {
        //draw random boxes for menu "idle screen"
        menuBox1 = new DynamicBox(1, random(0, 18), random(0, 10), 1, 1, 100, 0, 0);
        menuBox2 = new DynamicBox(2, random(0, 18), random(0, 10), 2, 2, 250, 0, 0);
        menuBox3 = new DynamicBox(3, random(0, 18), random(0, 10), 1, 2, 150, 0, 0);
        menuBox4 = new DynamicBox(4, random(0, 18), random(0, 10), 1, 1, 25, 0, 0);

        menuBox1.vel.x = random(-4, 4);
        menuBox2.vel.x = random(-4, 4);
        menuBox3.vel.x = random(-4, 4);
        menuBox4.vel.x = random(-4, 4);
    }
};

/**
 * Resets all variables that need to be reset when loading a different level
 */
function unloadLevel() {
    active = false;
    activeAlpha = 255;
    timer = 0;
    timeSinceLastMotion = false;
    firstStillness = true;
    itemList = [];
    dynamicItemList = [];
    frictionZones = [];
    document.getElementById("fullProblemTitle").innerHTML = "";
    document.getElementById("fullProblem").innerHTML = "";

    let givens1 = document.getElementById("givens");
    for (let child of givens1.children) {
        child.remove();
    };

    let inputs1 = document.getElementById("inputs");
    for (let child of inputs1.children) {
        child.remove();
    }; 
    
    document.getElementById("givens").innerHTML = "";
    document.getElementById("inputs").innerHTML = "";
};

/**
 * Resizes window to proper size
 */
function windowResized() {
    let w = windowWidth * (18 / 23);
    let h = w * (11 / 18);

    //Check if in portrait mode
    if (window.innerWidth < window.innerHeight) {
        document.getElementById("options").style.display = 'none';

        unitQuantity = w / 18;
        resizeCanvas(windowWidth, windowHeight);

        //Visual adjustments
        strokeWeight(unit(0.05));
        textSize(unit(1.5));
        stroke("Black");
        textAlign(CENTER);

        if (level != 0) {
            savedLevel = level;
        }
        level = 0;
    } else {
        //Since all html buttons are hidden on startup, unhide the menu.
        document.getElementById("options").style.display = 'flex';

        //USE SIDE PANEL
        //Split width into its units, there are 18 in the width
        let units = w / 18;
        //We want the options bar to be at least 5/18ths of the main canvas width
        if (w + (5 * units) > windowWidth) {
            w = windowWidth - (5 * units);
            h = (11 / 18) * w;
        };

        if (h > windowHeight) {
            h = windowHeight;
            w = h * (18 / 11);
            unitQuantity = w / 18;
        };

        unitQuantity = h / 11;
        resizeCanvas(w, h);
        textSize(unit(0.5));
        if (level == 0) {
            level = savedLevel;
        };
        document.getElementById("options").style.height = (h / windowHeight * 100) + "%";

        //Refresh on screen items
        unloadLevel();
        if (level != 4) {
            loadLevel(selectedProblem);
        };
        active = false;
        var inputsList = document.getElementById('inputs').getElementsByTagName('*');
        for (let i = 0; i < inputsList.length; i++) {
            inputsList[i].disabled = false
        }
        activeAlpha = 255;

        //Refresh gradients
        grad1 = createRadialGradient(unit(1), unit(12), unit(9), unit(5.5)); // angle, width
        grad1.colors(0, "#f5f5f5", 1, "#b5b5b5");
    };
};

/**
 * Detects if mouse is pressed, used for majority of mouse/mobile touch interaction
 */
function mousePressed() {
    if (level == 2) {
        
        if (selectedProblem == "none") {
            for (let i = 0; i < 8 - lastPageOffset; i++) {
                if (collidePointRect(mouseX, mouseY, ...boxes[i])) {
                    let temp = i + ((pageNum - 1) * 8);
                    selectedProblem = shownLevels[temp].id;
                };
            };

            if (collidePointRect(mouseX, mouseY, ...pageButtons[0]) && pageNum > 1) {
                pageNum -= 1;
            } else if (collidePointRect(mouseX, mouseY, ...pageButtons[1]) && pageNum < Math.ceil(shownLevels.length / 8)) {
                pageNum += 1;
            };
            
        } else {
            if (collidePointRect(mouseX, mouseY, unit(2), unit(2), unit(14), unit(7)) == false) {
                selectedProblem = "none";
            } else if (collidePointRect(mouseX, mouseY, ...pageButtons[2]) == true) {
                document.getElementById("simulation").style.display = "flex";
                document.getElementById("filters").style.display = "none";
                level = 3;

                let givens1 = document.getElementById("givens");
                for (let child of givens1.children) {
                    child.remove();
                };

                let inputs1 = document.getElementById("inputs");
                for (let child of inputs1.children) {
                    child.remove();
                }; 

                activeButtonColors = ["#3b9c52", "#308043", "#deffe6"];
                unloadLevel();
                loadLevel(selectedProblem);
            };
        };
    } else if (level == 3) {
        if (active == false) {
            if (collidePointRect(mouseX, mouseY, ...activeButton)) {
                active = true;
                initalTime = new Date();
                var inputsList = document.getElementById('inputs').getElementsByTagName('*');
                for (let i = 0; i < inputsList.length; i++) {
                    inputsList[i].disabled = true;
                };
            };
        } else {
            if (collidePointRect(mouseX, mouseY, ...activeButton)) {
                active = false;
                unloadLevel();
                loadLevel(selectedProblem);
            }

            //Objects get velocity towards mouse (for testing)
            
            // for (let i = 0; i < itemList.length; i++) {
            //     if (itemList[i].collider == "dynamic") {
            //         itemList[i].vel.x = deUnit(mouseX) - itemList[i].pos.x;
            //         itemList[i].vel.y = deUnit(mouseY) - itemList[i].pos.y;
            //     };
            // };
        };

        //Back to menu button
        if (collidePointCircle(mouseX, mouseY, unit(1.25), unit(1.25), unit(2))) {
            active = false;
            unloadLevel();
            if (previewMode) {
                document.getElementById("problemCreation").style.display = "flex";
                document.getElementById("simulation").style.display = "none";
                level = 4;
                loadLevel(1);
                previewMode = false;
            } else {
                level = 2;
                document.getElementById("simulation").style.display = "none";
                document.getElementById("filters").style.display = "flex";
            };
        };
    } else if (level == 4) {
        //Back to menu button
        if (collidePointCircle(mouseX, mouseY, unit(1.25), unit(1.25), unit(2))) {
            if (confirm("Going back to the menu will remove any progress in creating a problem. Continue?")) {
                active = false;
                newGivens = [];
                newInputs = [];
                newGlobalGivens = [];
                newCollisions = [];
                frictionZones = [];
                checkedBoxes = [];  //list of all checked subjects
                previewMode = false; 
                unloadLevel();
                loadLevel("none");
                level = 1;
                document.getElementById("problemCreation").style.display = "none";
                document.getElementById("menu").style.display = "flex";
            };
        };

        
        if (active == false) {

            //Check for collisions between mouse and items
            if (collidePointRect(mouseX, mouseY, 0, 0, unit(18), unit(11))) {
                let itemFound = false;
                for (let item of itemList) {
                    if (item.collider == "dynamic" || item.collider == "static") {
                        if (collidePointRect(mouseX, mouseY, unit(item.pos.x), unit(item.pos.y), unit(item.w), unit(item.h))) {
                            selectedItem = item;
                            itemFound = true;
                            if (item.collider == "dynamic") {
                                document.getElementById("dynbox").style.display = "block";
                                document.getElementById("statbox").style.display = "none";
                                document.getElementById("ramp").style.display = "none";
                                document.getElementById("dynboxTitle").innerHTML = item.id + " Dynamic Box";
                            } else {
                                document.getElementById("statbox").style.display = "block";
                                document.getElementById("dynbox").style.display = "none";
                                document.getElementById("ramp").style.display = "none";
                                document.getElementById("statboxTitle").innerHTML = item.id + " Static Box";
                            }
                            document.getElementById("info").style.display = "none";
                            document.getElementById("collisions").style.display = "none";
                            document.getElementById("problemDesc").style.display = "none";
                        };
                    } else if (item.collider == "ramp") {
                        if (collidePointPoly(deUnit(mouseX), deUnit(mouseY), [createVector(item.p1x, item.p1y), createVector(item.p2x, item.p2y), createVector(item.p3x, item.p3y)])) {
                            selectedItem = item;
                            itemFound = true;
                            document.getElementById("info").style.display = "none";
                            document.getElementById("problemDesc").style.display = "none";
                            document.getElementById("dynbox").style.display = "none";
                            document.getElementById("statbox").style.display = "none";
                            document.getElementById("collisions").style.display = "none";
                            document.getElementById("ramp").style.display = "block";
                            document.getElementById("rampTitle").innerHTML = item.id + " Ramp";
                        };
                    };
                };
                if (itemFound == false) {
                    selectedItem = "none";
                    document.getElementById("problemDesc").style.display = "none";
                    document.getElementById("dynbox").style.display = "none";
                    document.getElementById("statbox").style.display = "none";
                    document.getElementById("ramp").style.display = "none";
                    document.getElementById("collisions").style.display = "none";
                    document.getElementById("info").style.display = "flex";
                } else {
                    //Reset input field values to the correct numbers
                    if (selectedItem.collider == "dynamic") {
                        document.getElementById("dynid").value = selectedItem.id;
                        document.getElementById("dynx").value = selectedItem.pos.x;
                        document.getElementById("dyny").value = Math.round((9 - selectedItem.pos.y) * 100) / 100;
                        document.getElementById("dynw").value = selectedItem.w;
                        document.getElementById("dynh").value = selectedItem.h;
                        document.getElementById("dynm").value = selectedItem.mass;
                        document.getElementById("dynvx").value = selectedItem.vel.x;
                        document.getElementById("dynvy").value = selectedItem.vel.y;
                    } else if (selectedItem.collider == "static") {
                        document.getElementById("statid").value = selectedItem.id;
                        document.getElementById("statx").value = selectedItem.pos.x;
                        document.getElementById("staty").value = Math.round((9 - selectedItem.pos.y) * 100) / 100;
                        document.getElementById("statw").value = selectedItem.w;
                        document.getElementById("stath").value = selectedItem.h;
                        document.getElementById("statf").value = selectedItem.frictionCoefficient;
                    } else {
                        document.getElementById("rampid").value = selectedItem.id;
                        document.getElementById("rampx").value = selectedItem.p1x;
                        document.getElementById("rampy").value = selectedItem.p1y
                        document.getElementById("rampa").value = selectedItem.angle;
                        document.getElementById("rampl").value = selectedItem.length;
                        document.getElementById("rampf").value = selectedItem.frictionCoefficient;
                    };
                };
            };
        };
    };
};

/**
 * Convert units to pixels
 * @param {Number} num Number of units
 * @return {Number} Units converted into pixels
 */
function unit(num) {
    return num * unitQuantity;
};

/**
 * Convert pixels to units
 * @param {Number} num Number of pixels
 * @return {Number} Pixels converted into units
 */
function deUnit(num) {
    return num / unitQuantity;
};

/**
 * Creates a custom formated levelData array based off of user inputs from problem creator
 * @param {array} items 2D array of items created
 * @param {array} givens 2D array of givens
 * @param {array} inputs 2D array of solutions  
 */
function createLevelFromList(items, givens, inputs) {

    //Reset level data list
    newLevelData = [
        ['Awesome Problem'],
        ['Everything'],
        ['Impossible', '5'],
        ['Do the problem'],
        ['NA'],
        ['NA']
    ];

    if (String(document.getElementById("problemTitleEdit").value) != "") {
        newLevelData[0] = [String(document.getElementById("problemTitleEdit").value)];
    };

    if (String(document.getElementById("problemDescEdit").value) != "") {
        newLevelData[3] = [String(document.getElementById("problemDescEdit").value)];
    };

    //Set level difficulty
    let diffValue = Number(document.getElementById("difficultySelection").value);
    let title;
    if (diffValue == 1) {
        title = "Very easy";
    } else if (diffValue == 2) {
        title = "Easy";
    } else if (diffValue == 3) {
        title = "Medium";
    } else if (diffValue == 4) {
        title = "Hard";
    } else if (diffValue == 5) {
        title = "Very hard";
    };
    newLevelData[2] = [title, diffValue];

    //Set level subjects
    newLevelData[1] = []
    for (let i of checkedBoxes) {
        newLevelData[1].push(i)
    };


    //Add level givens
    if (newGlobalGivens.length > 0) {
        newLevelData[4] = [];
    };
    for (let i of newGlobalGivens) {
        newLevelData[4].push(i);
    };

    //Add collisions
    if (newCollisions.length > 0) {
        newLevelData[5] = [];
    };
    for (let i of newCollisions) {
        newLevelData[5].push(i);
    };

    //Add all items
    for (let item of items) {

        var slot1 = item.id;
        var slot2;
        var slot3;
        var slot4;
        var slot5;
        var slot6;
        var slot7;
        var slot8;
        var slot9;
        var slot10;
        var slot11;
        var slot12;
        var slot13;

        if (item.collider == "dynamic" || item.collider == "static") {
            slot2 = item.pos.x;
            slot3 = 10 - item.pos.y - item.h;
            slot4 = item.w;
            slot5 = item.h;

        };
        if (item.collider == "static") {
            slot13 = item.frictionCoefficient
        };
        if (item.collider == "dynamic") {
            slot6 = item.mass;
            slot7 = item.vel.x;
            slot8 = item.vel.y;
        };
        if (item.collider == "ramp") {
            slot9 = item.p1x;
            slot10 = item.p1y;
            slot11 = item.length;
            slot12 = item.angle;
            slot13 = item.frictionCoefficient;
        };
        for (let given of givens) {
            if (given[0].index == item.index) {
                if (given[1] == "pos.x") {
                    slot2 = "x-Position:"+String(given[0].pos.x)+":m"
                } else if (given[1] == "pos.y") {
                    slot3 = "y-Position:"+String(10 - given[0].pos.y - given[0].h)+":m"
                } else if (given[1] == "w") {
                    slot4 = "Width:"+String(given[0].w)+":m"
                } else if (given[1] == "h") {
                    slot5 = "Height:"+String(given[0].h)+":m"
                } else if (given[1] == "mass") {
                    slot6 = "Mass:"+String(given[0].mass)+":kg"
                } else if (given[1] == "vel.x") {
                    slot7 = "x-Velocity:"+String(given[0].vel.x)+":m/s"
                } else if (given[1] == "vel.y") {
                    slot8 = "y-Velocity:"+String(given[0].vel.y)+":m/s"
                } else if (given[1] == "p1x") {
                    slot9 = "x-Ramp Origin:"+String(given[0].p1x)+":m"
                } else if (given[1] == "p1y") {
                    slot10 = "y-Ramp Origin:"+String(given[0].p1y)+":m"
                } else if (given[1] == "length") {
                    slot11 = "Length:"+String(given[0].length)+":m"
                } else if (given[1] == "angle") {
                    slot12 = "Angle:"+String(given[0].angle)+":°"
                } else if (given[1] == "frictionCoefficient") {
                    slot13 = "Friction Coefficient:"+String(given[0].frictionCoefficient)+":μ"
                }
            };
        };

        for (let input of inputs) {
            if (input[0].index == item.index) {
                if (input[1] == "pos.x") {
                    slot2 = "x-Position;"+String(input[0].pos.x)+";"+String(input[2])+";"+String(input[2] / 10)+";0;18;0.5";
                } else if (input[1] == "pos.y") {
                    slot3 = "y-Position;"+String(10 - input[0].pos.y - input[0].h)+";"+String(10 - input[2] - input[0].h)+";"+String(input[2] / 10)+";0;"+String(10 - input[0].h)+";0.5";
                } else if (input[1] == "w") {
                    slot4 = "Width;"+String(input[0].w)+";"+String(input[2])+";"+String(input[2] / 10)+";0.5;18;0.5";
                } else if (input[1] == "h") {
                    slot5 = "Height;"+String(input[0].h)+";"+String(input[2])+";"+String(input[2] / 10)+";0.5;10;0.5";
                } else if (input[1] == "mass") {
                    slot6 = "Mass;"+String(input[0].mass)+";"+String(input[2])+";"+String(input[2] / 10)+";0;500;1";
                } else if (input[1] == "vel.x") {
                    slot7 = "x-Velocity;"+String(input[0].vel.x)+";"+String(input[2])+";"+String(input[2] / 10)+";0;25;1";
                } else if (input[1] == "vel.y") {
                    slot8 = "y-Velocity;"+String(input[0].vel.y)+";"+String(input[2])+";"+String(input[2] / 10)+";0;25;1";
                } else if (input[1] == "p1x") {
                    slot9 = "x-Ramp Origin;"+String(input[0].p1x)+";"+String(input[2])+";"+String(input[2] / 10)+";0;18;0.5";
                } else if (input[1] == "p1y") {
                    slot10 = "y-Ramp Origin;"+String(input[0].p1y)+";"+String(input[2])+";"+String(input[2] / 10)+";0;10;0.5";
                } else if (input[1] == "length") {
                    slot11 = "Length;"+String(input[0].length)+";"+String(input[2])+";"+String(input[2] / 10)+";-18;18;0.5";
                } else if (input[1] == "angle") {
                    slot12 = "Angle;"+String(input[0].angle)+";"+String(input[2])+";"+String(input[2] / 10)+";0.5;18;0.5";
                } else if (input[1] == "frictionCoefficient") {
                    slot13 = "Friction Coefficient;"+String(input[0].frictionCoefficient)+";"+String(input[2])+";"+String(input[2] / 10)+";0;1;0.1";
                };
            };
        };

        if (item.collider == "dynamic") {
            newLevelData.push([String(slot1), "box", String(slot2), String(slot3), String(slot4), String(slot5), String(slot6), String(slot7), String(slot8)]);
        } else if (item.collider == "static") {
            newLevelData.push([String(slot1), "staticBox", String(slot2), String(slot3), String(slot4), String(slot5), String(slot13)]);
        } else if (item.collider == "ramp") {
            newLevelData.push([String(slot1), "ramp", String(slot9), String(slot10), String(slot11), String(slot12), String(slot13)])
        };
    };

    if (checkedBoxes.length > 0) {
        return (true);
    } else {
        return (false);
    };
};
