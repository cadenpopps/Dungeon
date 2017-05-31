var dungeon;
var dungeonFactory;
var floorFactory;
var itemFactory;
var playerFactory;
var currentFloor,
	squareSize,
	dimension,
	counter,
	loading, starting,
	selectingSize,
	tempSquares,
	selectedClass,
	selectedStrength,
	selectedDexterity,
	selectedIntelligence,
	selectedTotal,
	levelLoadTime,
	moving;

var player;
var wallTextures;
var floorTextures;
var playerTextures;
var stairUpTexture;
var stairDownTexture;
var doorClosedTexture;
var doorOpenedTexture;
var lootClosedTexture;
var lootOpenTexture;
var font;
var userInterface;
var gameOver;

var canvas;
const LOOT = 2;
const WALL = -1;
const PATH = 0;
const STAIRDOWN = -2;
const STAIRUP = -3;
const DOOR = -5;
const PLAYERVISIONRANGE = 30;
const LOADIMAGES = true;
const LOADFONT = true;
const SCALE = 2;

function preload() {
	if (LOADIMAGES) {
		wallTextures = [];
		wallTextures.push(loadImage('data/wallTexture0.png'));
		wallTextures.push(loadImage('data/wallTexture1.png'));
		wallTextures.push(loadImage('data/wallTexture2.png'));
		floorTextures = [];
		floorTextures.push(loadImage('data/floorTexture0.png'));
		floorTextures.push(loadImage('data/floorTexture1.png'));
		floorTextures.push(loadImage('data/floorTexture2.png'));

		playerTextures = [];
		playerTextures.push(loadImage('data/playerTextureL.png'));
		playerTextures.push(loadImage('data/playerTextureR.png'));
		stairUpTexture = loadImage('data/stairUpTexture.png');
		stairDownTexture = loadImage('data/playerTextureR.png');
		doorClosedTexture = loadImage('data/doorClosedTexture.png');
		doorOpenedTexture = loadImage("data/doorOpenedTexture.png");
		lootClosedTexture = loadImage('data/lootClosedTexture.png');
		lootOpenTexture = loadImage('data/lootOpenTexture.png');
	}
	if (LOADFONT) {
		font = loadFont('data/SourceCodePro-Light.otf');
	}
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	currentFloor = 0;
	dimension = 0;
	squareSize = 0;
	selectingSize = 0;
	selectedStrength = 0;
	selectedDexterity = 0;
	selectedIntelligence = 0;
	selectedTotal = 0;
	tempSquares = 40;
	player = null;
	moving = ' ';
	loading = false;
	starting = false;
	gameOver = false;
	dungeonFactory = new DungeonFactory();
	floorFactory = new FloorFactory();
	itemFactory = new ItemFactory();
	playerFactory = new PlayerFactory();
	frameRate(60);

	canvas.parent("game");

	if (LOADFONT) {
		textFont(font);
	}
	else {
		textFont('monospace');
	}

	userInterface = new UserInterface();
	noStroke();
	load();
}

function draw() {

	if (gameOver) {
		userInterface.displayGameOver();
	}
	else if (loading) {
		userInterface.displayStart();
		counter++;
		if (counter == 90) {
			userInterface.startTime = -1;
			starting = true;
			noLoop();
			noStroke();
			loading = false;
		}
	}
	else if (starting) {
		starting = false;
		newDungeon(64);
	}
	else {
		background(3, 3, 3);
		userInterface.displayGame();
	}
}

function newDungeon(_dimension) {

	var startTime = millis();
	dimension = _dimension;

	if (dimension % 2 === 0) {
		dimension--;
	}

	squareSize = floor((height) / PLAYERVISIONRANGE);

	currentFloor = 0;

	dungeon = dungeonFactory.createDungeon(dimension);
	player = playerFactory.createPlayer(selectedStrength, selectedDexterity, selectedIntelligence, selectedClass);

	console.log(player.getStrength());
	console.log(player.getDexterity());
	console.log(player.getIntelligence());
	console.log(player.getHealth());

	// for (let f of dungeon.floors) {
	//    // if (f.floorNum < f. - 1 && !findPath(dungeon.floors.get(f.floorNum).stairDown, dungeon.floors.get(f.floorNum).stairUp, dungeon.floors.get(f.floorNum).board)) {
	//    //     startUp();
	//    // }
	//    // if (f.floorNum <  - 1) {
	//    //    while (!player.findPath(f.floorNum, f.stairUp, f.stairDown)) {
	//    //       console.log("\n\n\n\nnew dungeon");
	//    //       newDungeon();
	//    //    }
	//    // }
	//    // for (var i = 0; i < dimension; i++) {
	//    //    for (var j = 0; j < dimension; j++) {
	//    //       if (dungeon.floors[f.floorNum].board[i][j].squareType == -1) {
	//    //          dungeon.floors[f.floorNum].board[i][j].texture = wallTextures[(floor(random(wallTextures.length)))];
	//    //       }
	//    //       if (dungeon.floors[f.floorNum].board[i][j].squareType === 0) {
	//    //          dungeon.floors[f.floorNum].board[i][j].texture = floorTextures[(floor(random(floorTextures.length)))];
	//    //       }
	//    //    }
	//    // }
	// }

	levelLoadTime = floor(millis() - startTime);
	console.log((levelLoadTime / 1000) + " seconds to load.");
	player.update();
}

function mousePressed() {
	if (!loading) {
		// player.openDoor();
		// player.attack(dungeon.floors[currentFloor].mobs);
		// redraw();
	}
}

function load() {
	loading = true;
	starting = false;
	gameOver = false;
	selectingSize = 0;
	counter = 0;
	userInterface.gameOverTime = -1;
	loop();
}

function keyPressed() {
	if (key == 'N') {
		load();
	}
	if (!loading) {
		switch (key) {
			case 'W':
				//moving = 'u';
				player.move('u');
				break;
			case 'A':
				//moving ='l';
				player.move('l');
				break;
			case 'S':
				//moving = 'd';
				player.move('d');
				break;
			case 'D':
				//moving = 'r';
				player.move('r');
				break;
			case 'O':
				player.moveToMouse(mouseX, mouseY);
				break;
			case 'Q':
				player.openDoor();
				break;
			case 'E':
				player.physicalAttack();
				break;
			case 'R':
				player.magicalAttack();
				break;
		}
		switch (keyCode) {
			case UP_ARROW:
				player.move('u');
				break;
			case RIGHT_ARROW:
				player.move('r');
				break;
			case DOWN_ARROW:
				player.move('d');
				break;
			case LEFT_ARROW:
				player.move('l');
				break;
		}
	}
	else {
		if (keyCode == ENTER) {
			userInterface.startSequenceStep++;
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	userInterface.scale = floor(width / 5);
	redraw();
}
