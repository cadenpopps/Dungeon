function UserInterface() {

	this.scale = width / 5;
	this.leftPanelScale = this.scale / 3;
	this.topPaneScale = 0;
	this.bottomPaneScale = 0;
	// this.startSequence = new StartSequence();
	// this.startSequenceStep = 0;
	this.startTime = -1;
	this.gameOverTime = -1;

	var playerInfoWidth;

	// const HEALTHINTERVALS = 50;
	// const HEALTHINTERVALSIZE = .8; //0 - 1

	this.displayStart = function() {
		if (this.startTime == -1) {
			this.startTime = millis();
		}
		background(7, 5, 5);
		textSize(width / 15);
		textAlign(CENTER);
		if ((millis() - this.startTime) < 255) {
			fill(255, (millis() - this.startTime));
		}
		else {
			fill(255);
		}
		text("Welcome Adventurer", width / 2, (height / 2));
	};

	this.displayGameOver = function() {
		if (this.gameOverTime == -1) {
			this.gameOverTime = millis();
		}
		background(7, 5, 5);
		textAlign(CENTER);
		textSize(width / 15);
		if ((millis() - this.gameOverTime) < 255) {
			fill(255, (millis() - this.gameOverTime));
		}
		else {
			fill(255);
		}

		text("Game Over", width / 2, (height / 2));
		if (millis() > this.gameOverTime + 1000) {
			textSize(width / 30);
			text("Press n or refresh to restart", width / 2, (height / 2) + (width / 15));
		}
	};

	this.displayGame = function() {

		this.drawBoard(player, dungeon.floors[currentFloor].board, PLAYERVISIONRANGE);

		this.leftPanelScale = this.scale / 3;

		this.displayPlayerInfo();

		//this.displayInventory();

		noStroke();
		fill(227, 223, 223);

		this.displayTerminal();
	};

	this.displayPlayerInfo = function() {

		//noStroke();

		playerInfoWidth = width / 12;

		// this.displayPlayerImage();
		this.displayHealth();
		this.displayXP();
		//this.displayPlayerStats();
		//fill(227, 223, 223);
		//textSize((this.scale) / 15);
		//textAlign(CENTER);
		//text("Floor " + (currentFloor + 1), (width / 2) + (this.leftPanelScale / 2), height - (this.scale / 7));

	};

	this.displayPlayerImage = function() {

		fill(100);
		rect(0, 0, playerInfoWidth, playerInfoWidth);
		textAlign(LEFT);
		textSize(this.leftPanelScale / 10);
		fill(0);
		text("player\nplaceholder", 10, 40);

	};

	this.displayHealth = function() {

		var healthBarWidth = player.getHealthMult();

		$("#health").css("width", (20 * healthBarWidth) + "vw");

	};

	this.displayXP = function() {

		var XPBarWidth = player.getXPMult();

		$("#xp").css("width", (20 * XPBarWidth) + "vw");

	};

	this.displayInventory = function() {

		stroke(227, 223, 223);
		strokeWeight(1);
		fill(0);
		rect(-1, 15, this.leftPanelScale + 2, height - 30);
		noStroke();

		this.displayPlayerEquiped();

	};

	this.displayPlayerStats = function() {

	};

	this.displayPlayerEquiped = function() {

		this.displayPlayerInventorySpot(0);
		this.displayPlayerInventorySpot(1);
		this.displayPlayerInventorySpot(2);

	};

	this.displayPlayerInventorySpot = function(num) {
		fill(227, 223, 223);
		rect(this.leftPanelScale / 10, height / 2 + (num * (height / 6)), this.leftPanelScale - this.leftPanelScale / 5, this.leftPanelScale - this.leftPanelScale / 5);
		textAlign(LEFT);
		textSize(this.leftPanelScale / 10);
		fill(0);
		text("inventory\nplaceholder", this.leftPanelScale / 10, height / 2 + (num * (height / 6)) + 20);
	};

	this.displayTerminal = function() {

	};

	this.drawBoard = function(playerCopy, boardCopy, visionRange) {
		push();
		noStroke();
		scale(SCALE);
		translate(floor((-player.getX() * squareSize) + (width / (SCALE * 2)) - (squareSize / 2)), floor((-player.getY() * squareSize) + (height / (SCALE * 2)) - squareSize));
		if (LOADIMAGES) {
			this.drawBoardWithImages(playerCopy, boardCopy, visionRange);
		}
		else {
			this.drawBoardWithoutImages(playerCopy, boardCopy, visionRange);
			// this.drawBoardWithText(playerCopy, boardCopy, visionRange);
		}
		pop();
	};

	this.drawBoardWithImages = function(player, board, visionRange) {

		for (var i = player.getX() - visionRange; i < player.getX() + visionRange; i++) {
			for (var j = player.getY() - visionRange; j < player.getY() + visionRange; j++) {
				if (i >= 0 && j >= 0 && i <= dimension - 1 && j <= dimension - 1) {
					var curSquare = board[i][j];
					if (player.getCanSee().includes(curSquare) || player.getHasSeen().includes(curSquare) || player.getCanSeeEdge().includes(curSquare)) {
						switch (curSquare.squareType) {
							case PATH:
								//path
								image(floorTextures[curSquare.texture], i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case WALL:
								//wall
								image(wallTextures[curSquare.texture], i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case STAIRDOWN:
								//stair down
								fill(0, 50, 255);
								image(stairDownTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case STAIRUP:
								//stair up
								image(stairUpTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case DOOR:
								//door
								if (curSquare.isOpen) {
									image(doorOpenedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								}
								else {
									image(doorClosedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								}
								break;
							case LOOT:
								//loot
								fill(255, 50, 50);
								image(lootClosedTexture, i * squareSize, j * squareSize, squareSize, squareSize);
								break;
						}
						//darken for light level
						if (player.getCanSee().includes(curSquare)) {
							fill(0, 0, 5, constrain(curSquare.lightLevel * 4, 0, 50));
							rect(i * squareSize, j * squareSize, squareSize, squareSize);
							if (curSquare.containsMob && (player.getX() != i || player.getY() != j)) {
								fill(255, 100, 0, 180);
								rect(i * squareSize + (squareSize / 8), j * squareSize + (squareSize / 8), squareSize / 1.25, squareSize / 1.25);
								fill(255, 50, 50);
								rect(i * squareSize + (squareSize / 8), j * squareSize - (squareSize / 8), 3 * (squareSize / 4), (squareSize / 8));
								fill(50, 255, 50);
								rect(i * squareSize + (squareSize / 8), j * squareSize - (squareSize / 8), 3 * (squareSize / 4) * curSquare.mobAt().getHealthMult(), (squareSize / 8));
							}
						}
						else if (player.getCanSeeEdge().includes(curSquare)) {
							if (curSquare.containsMob && (player.getX() != i || player.getY() != j)) {
								fill(255, 100, 0, 180);
								rect(i * squareSize + (squareSize / 8), j * squareSize + (squareSize / 8), squareSize / 1.25, squareSize / 1.25);
							}
							fill(0, 0, 10, constrain(curSquare.lightLevel * 7, 0, 60));
							rect(i * squareSize, j * squareSize, squareSize, squareSize);
						}
						else if (player.getHasSeen().includes(curSquare)) {
							fill(0, 0, 5, 90);
							rect(i * squareSize, j * squareSize, squareSize, squareSize);
						}
					}
				}
			}
		}
		if (player.getDirection() == 'l') {
			image(playerTextures[0], player.getX() * squareSize, player.getY() * squareSize, squareSize, squareSize);
		}
		else {
			image(playerTextures[1], player.getX() * squareSize, player.getY() * squareSize, squareSize, squareSize);
		}
	};

	this.drawBoardWithoutImages = function(player, board, visionRange) {
		for (var i = player.getX() - visionRange; i < player.getX() + visionRange; i++) {
			for (var j = player.getY() - visionRange; j < player.getY() + visionRange; j++) {
				if (i >= 0 && j >= 0 && i <= dimension - 1 && j <= dimension - 1) {
					var curSquare = board[i][j];
					// textSize(4);
					// fill(0);
					// textAlign(LEFT);
					// text(curSquare.x + ", " + curSquare.y, i * squareSize, j * squareSize);
					if (player.getCanSee().includes(curSquare) || player.getHasSeen().includes(curSquare) || player.getCanSeeEdge().includes(curSquare)) {
						switch (curSquare.squareType) {
							case PATH:
								//path
								fill(80);
								rect(i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case WALL:
								//wall
								fill(210);
								rect(i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case STAIRDOWN:
								//stair down
								fill(0, 50, 255);
								rect(i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case STAIRUP:
								//stair up
								fill(0, 255, 50);
								rect(i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case DOOR:
								//door
								if (curSquare.isOpen) {
									fill(150, 50, 20, 100);
								}
								else {
									fill(100, 50, 20);
								}
								rect(i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case LOOT:
								//loot
								fill(255, 50, 50);
								rect(i * squareSize, j * squareSize, squareSize, squareSize);
								break;
						}
						//darken for light level
						if (player.getCanSee().includes(curSquare)) {
							if (curSquare.containsMob && !(player.getX() == i && player.getY() == j)) {
								fill(255, 100, 0, 180);
								rect(i * squareSize + (squareSize / 8), j * squareSize + (squareSize / 8), 3 * (squareSize / 4), squareSize - (squareSize / 4));
								fill(255, 50, 50);
								rect(i * squareSize + (squareSize / 8), j * squareSize - (squareSize / 8), 3 * (squareSize / 4), (squareSize / 8));
								fill(50, 255, 50);
								rect(i * squareSize + (squareSize / 8), j * squareSize - (squareSize / 8), 3 * (squareSize / 4) * curSquare.mobAt().getHealthMult(), (squareSize / 8));
							}
							fill(0, 0, 5, constrain(curSquare.lightLevel * 4, 0, 50));
							rect(i * squareSize, j * squareSize, squareSize, squareSize);
						}
						else if (player.getCanSeeEdge().includes(curSquare)) {
							fill(0, 0, 10, constrain(curSquare.lightLevel * 7, 0, 60));
							rect(i * squareSize, j * squareSize, squareSize, squareSize);
						}
						else if (player.getHasSeen().includes(curSquare)) {
							fill(0, 0, 5, 90);
							rect(i * squareSize, j * squareSize, squareSize, squareSize);
						}
					}
				}
			}
		}
		fill(0, 0, 255, 200);
		rect(player.getX() * squareSize + 2, player.getY() * squareSize + 2, squareSize - 4, squareSize - 4);
	};

	this.drawBoardWithText = function(player, board, visionRange) {
		textSize(15);
		for (var i = player.getX() - visionRange; i < player.getX() + visionRange; i++) {
			for (var j = player.getY() - visionRange; j < player.getY() + visionRange; j++) {
				if (i >= 0 && j >= 0 && i <= dimension - 1 && j <= dimension - 1) {
					var curSquare = board[i][j];
					fill(255);
					if (player.getCanSee().includes(curSquare) || player.getHasSeen().includes(curSquare) || player.getCanSeeEdge().includes(curSquare)) {
						switch (curSquare.squareType) {
							case PATH:
								break;
							case WALL:
								//wall
								text("#", i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case STAIRDOWN:
								//stair down
								text("\\/", i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case STAIRUP:
								//stair up
								text("/\\", i * squareSize, j * squareSize, squareSize, squareSize);
								break;
							case DOOR:
								//door
								fill(150, 50, 20);
								if (curSquare.isOpen) {
									text("d", i * squareSize, j * squareSize, squareSize, squareSize);
								}
								else {
									text("D", i * squareSize, j * squareSize, squareSize, squareSize);
								}
								fill(255);
								break;
							case LOOT:
								//loot
								text("L", i * squareSize, j * squareSize, squareSize, squareSize);
								break;
						}
						//darken for light level
						if (player.getCanSee().includes(curSquare)) {
							if (curSquare.containsMob && (player.getX() != i || player.getY() != j)) {
								fill(255, 100, 0, 180);
								text("m", i * squareSize, j * squareSize, squareSize, squareSize);
								fill(255, 50, 50);
								rect(i * squareSize + (squareSize / 8), j * squareSize - (squareSize / 8), 3 * (squareSize / 4), (squareSize / 8));
								fill(50, 255, 50);
								rect(i * squareSize + (squareSize / 8), j * squareSize - (squareSize / 8), 3 * (squareSize / 4) / curSquare.mobAt().getHealthMult(), (squareSize / 8));
							}
							fill(0, 0, 5, constrain(curSquare.lightLevel * 4, 0, 50));
							//rect(i * squareSize, j * squareSize, squareSize, squareSize);
						}
						else if (player.getCanSeeEdge().includes(curSquare)) {
							fill(0, 0, 10, constrain(curSquare.lightLevel * 7, 0, 60));
							//rect(i * squareSize, j * squareSize, squareSize, squareSize);
						}
						else if (player.getHasSeen().includes(curSquare)) {
							fill(0, 0, 5, 90);
							//rect(i * squareSize, j * squareSize, squareSize, squareSize);
						}
					}
				}
			}
		}
		fill(0, 0, 255, 200);
		text("P", player.getX() * squareSize, player.getY() * squareSize, squareSize, squareSize);

	};

}