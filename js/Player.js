function Player(_x, _y, _strength, _dexterity, _intelligence, _maxHealth, _pClass) {

	var x = _x;
	var y = _y;
	var direction = 'r';

	const SIGHTRADIUS = 20;

	var canSee = [];
	var canSeeEdge = [];
	var hasSeen = [];

	var strength = _strength;
	var dexterity = _dexterity;
	var intelligence = _intelligence;
	var currentHealth = _maxHealth;
	var maxHealth = _maxHealth;
	var freePoints = 0;
	var pClass = _pClass;
	var xpMult = 0;
	var level = 1;

	var inventory;

	inventory = new Array(3);
	for (var i = 0; i < 3; i++) {
		inventory[i] = new Array(4);
		for (var j = 0; j < 4; j++) {
			inventory[i][j] = itemFactory.createItemPlaceholder();
		}
	}

	this.getInventory = function() {
		return inventory;
	};

	this.getStrength = function() {
		return strength;
	};

	this.getDexterity = function() {
		return dexterity;
	};

	this.getIntelligence = function() {
		return intelligence;
	};

	this.getHealth = function() {
		return currentHealth;
	};

	this.getHealthMult = function() {
		return currentHealth / maxHealth;
	};

	this.getClass = function() {
		return pClass;
	};

	this.getLevel = function() {
		return level;
	};

	this.getX = function() {
		return x;
	};

	this.getY = function() {
		return y;
	};

	this.getDirection = function() {
		return direction;
	};

	this.getXPMult = function() {
		return xpMult;
	};

	this.getCanSee = function() {
		return canSee;
	};
	this.getCanSeeEdge = function() {
		return canSeeEdge;
	};
	this.getHasSeen = function() {
		return hasSeen;
	};

	var levelUp = function() {
		xpMult -= 1;
		level++;
		maxHealth += 3;
		currentHealth += 3;
		freePoints++;

		// strength++;
		// dexterity++;
		// intelligence++;

		// if (pClass == 0) {
		// 	strength++;
		// } else if (pClass == 1) {
		// 	dexterity++;
		// } else if (pClass == 2) {
		// 	intelligence++;
		// }

	};

	this.update = function() {

		if (currentHealth <= 0) {
			gameover();
		}

		if (dungeon.floors[currentFloor].board[x][y].squareType == STAIRDOWN) {
			if (currentFloor == dungeon.numFloors - 1) {
				dungeon.addFloor();
			}
			currentFloor++;
			this.move('r');
		} else if (currentFloor > 0 && dungeon.floors[currentFloor].board[x][y].squareType == STAIRUP) {
			currentFloor--;
			this.move('l');
		}

		canSee = [];
		canSeeEdge = [];

		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				var distance = floor(dist(x, y, i, j));
				dungeon.floors[currentFloor].board[i][j].lightLevel = distance;
			}
		}

		for (var i = x - SIGHTRADIUS; i <= x + SIGHTRADIUS; i++) {
			for (var j = y - SIGHTRADIUS; j <= y + SIGHTRADIUS; j++) {
				if (i >= 0 && j >= 0 && i < dimension && j < dimension) {
					var l = new SightLine(x, y, i, j);
					if (!l.straight) {
						l.findTouching();
					}
					else {
						l.findStraightTouching();
					}
					var blocked = false;
					for (var k = 0; k < l.touching.length; k++) {
						if (blocked) {
							continue;
						}
						else if (l.touching[k].squareType == WALL || (l.touching[k].squareType == DOOR && !l.touching[k].isOpen)) {
							blocked = true;
							if (canSee.indexOf(l.touching[k]) == -1) {
								canSee.push(l.touching[k]);
							}
							if (hasSeen.indexOf(l.touching[k]) == -1) {
								hasSeen.push(l.touching[k]);
							}
						}
						else if (dungeon.floors[currentFloor].board[x][y].region !== null && !dungeon.floors[currentFloor].board[x][y].region.path && l.touching[k].region == dungeon.floors[currentFloor].board[x][y].region) {
							if (canSee.indexOf(l.touching[k]) == -1) {
								canSee.push(l.touching[k]);
							}
							if (hasSeen.indexOf(l.touching[k]) == -1) {
								hasSeen.push(l.touching[k]);
							}
						}
						else {
							if (canSee.indexOf(l.touching[k]) == -1) {
								canSee.push(l.touching[k]);
							}
							if (hasSeen.indexOf(l.touching[k]) == -1) {
								hasSeen.push(l.touching[k]);
							}
						}
					}
				}
			}
		}

		for (var a = canSee.length - 1; a >= 0; a--) {
			if (canSee[a].squareType != WALL && !(canSee[a].squareType == DOOR && !canSee[a].isOpen)) {
				for (var i = canSee[a].x - 1; i <= canSee[a].x + 1; i++) {
					for (var j = canSee[a].y - 1; j <= canSee[a].y + 1; j++) {
						if (i >= 0 && j >= 0 && i < dimension && j < dimension && (i != canSee[a].x || j != canSee[a].y)) {
							if (!canSeeEdge.includes((dungeon.floors[currentFloor].board[i][j]))) {
								canSeeEdge.push(dungeon.floors[currentFloor].board[i][j]);
							}
							if (!hasSeen.includes((dungeon.floors[currentFloor].board[i][j]))) {
								hasSeen.push(dungeon.floors[currentFloor].board[i][j]);
							}
						}
					}
				}
			}
		}
		redraw();
	};

	this.move = function(dir) {
		var sucess = false;
		dungeon.floors[currentFloor].board[x][y].containsMob = false;
		switch (dir) {
			case 'u':
				if (y > 0 && dungeon.floors[currentFloor].board[x][y - 1].currentlyWalkable()) {
					y--;
					sucess = true;
				}
				break;
			case 'd':
				if (y < dungeon.floors[currentFloor].dimension - 1 && dungeon.floors[currentFloor].board[x][y + 1].currentlyWalkable()) {
					y++;
					sucess = true;
				}
				break;
			case 'l':
				direction = 'l';
				if (x > 0 && dungeon.floors[currentFloor].board[x - 1][y].currentlyWalkable()) {
					x--;
					sucess = true;
				}
				break;
			case 'r':
				direction = 'r';
				if (x < dungeon.floors[currentFloor].dimension - 1 && dungeon.floors[currentFloor].board[x + 1][y].currentlyWalkable()) {
					x++;
					sucess = true;
				}
				break;
		}
		dungeon.floors[currentFloor].board[x][y].containsMob = true;
		if (sucess) {
			for (let m of dungeon.floors[currentFloor].mobs) {
				m.update();
			}
			this.update();
		}
		redraw();
		return sucess;
	};

	this.moveToMouse = function(msX, msY) {
		// var keepMoving = true;
		// var path = findPath(createVector(x, y, this.findGoal(msX, msY)));
		// while (keepMoving) {
		//    player.move();
		//    player.update();
		//    for (let s of canSee) {
		//       if (s.containsMob) {
		//          keepMoving = false;
		//       }
		//    }
		// }
		this.findGoal(msX, msY);
	};

	var findGoal = function(msX, msY) {

		var goalx = floor((msX - (width / 4) + (squareSize / 2) - (userInterface.leftPanelScale / 4)) / (squareSize * 2));
		var goaly = floor((msY - (height / 4) + squareSize) / (squareSize * 2));

		console.log(goalx + "   " + goaly);

	};

	var findPath = function(_start, _goal) {
		var start = _start;
		var goal = _goal;
		//println(board[(int)start.x][(int)start.y].squareType);
		//println(board[(int)goal.x][(int)goal.y].squareType);
		var closedSet = [];
		var openSet = [];
		//var cameFrom = [];
		var squareScores = [];
		var startSquare = (start.x * dimension) + start.y;

		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				squareScores.push(new MapSquare(dungeon.floors[f].board[i][j], 10000, 10000));
			}
		}

		squareScores[startSquare].gScore = 0;
		squareScores[startSquare].fScore = this.heuristic(start, goal);
		openSet.push(squareScores[startSquare]);

		while (openSet.length > 0) {
			var current = squareScores[startSquare];
			var lowest = 9999;
			for (var s = 0; s < squareScores.length; s++) {
				if (squareScores[s].fScore < lowest) {
					//console.log("lower");
					lowest = squareScores[s].fScore;
					current = squareScores[s];
				}
			}
			if (current.square.x == goal.x && current.square.y == goal.y) {
				// while (cameFrom.indexOf(current) != 0) {
				//     current = cameFrom.get(current);
				//     //current.squareType = 1;
				// }
				//dungeon.floors[f].board[start.x][start.y ].squareType = -3;
				return true;
			}

			openSet.splice(openSet.indexOf(current.square));
			//console.log("\n\n" + openSet.length);
			closedSet.push(current.square);
			//console.log(current.square);

			var currentNeighbors = current.square.neighbors(dungeon.floors[f].board);
			for (var i = 0; i < currentNeighbors.length; i++) {
				var skip = false;
				for (let c of closedSet) {
					console.log("check Skip");
					if (c.x == currentNeighbors[i].x && c.y == currentNeighbors[i].y) {
						console.log("skipping");
						skip = true;
					}
				}
				if (skip) {
					continue;
				}
				else {
					var tempG = current.gScore + 1;

					var dontAdd = false;
					for (let openSquare of openSet) {
						if (openSquare.x == currentNeighbors[i].x && openSquare.y == currentNeighbors[i].y) {
							dontAdd = true;
						}
					}
					if (!dontAdd) {
						openSet.push(currentNeighbors[i]);
					}
					var index = -1;
					for (var j = 0; j < squareScores.length; j++) {
						if (squareScores[j].square == currentNeighbors[i]) {
							index = j;
						}
					}
					if (tempG < squareScores[index].gScore) {
						//cameFrom.push(gScore[i]);
						//console.log("update");
						squareScores[index].gScore = tempG;
						squareScores[index].fScore = squareScores[index].gScore + this.heuristic(currentNeighbors[i].x, currentNeighbors[i].y, goal.x, goal.y);
					}
				}
			}
		}
		return false;
	};

	//dist from player to goal
	this.heuristic = function(_x1, _y1, _x2, _y2) {
		return dist(_x1, _y1, _x2, _y2);
	};

	this.openDoor = function() {
		for (var i = x - 1; i <= x + 1; i++) {
			for (var j = y - 1; j <= y + 1; j++) {
				if (i > 0 && j > 0 && i < dimension - 1 && j < dimension - 1 && (i != x || j != y)) {
					if (dungeon.floors[currentFloor].board[i][j].squareType == DOOR) {
						dungeon.floors[currentFloor].board[i][j].isOpen = !dungeon.floors[currentFloor].board[i][j].isOpen;
						this.update();
					}
				}
			}
		}
	};

	this.physicalAttack = function() {

		var psuccess = false;

		var tempBoard = dungeon.floors[currentFloor].board;

		for (i = x - 1; i <= x + 1; i++) {
			for (j = y - 1; j <= y + 1; j++) {
				if (!(x == i && y == j) && tempBoard[i][j].containsMob && !psuccess) {
					var m = tempBoard[i][j].mobAt();
					if (pAttackMob(m)) {
						dungeon.floors[currentFloor].mobs.splice(dungeon.floors[currentFloor].mobs.indexOf(m), 1);
						dungeon.floors[currentFloor].board[i][j].containsMob = false;
						addXP(m);
					}
					psuccess = true;
				}
			}
		}

		for (let m of dungeon.floors[currentFloor].mobs) {
			m.update();
		}

		this.update();
	};

	var pAttackMob = function(m) {

		m.loseHealth(strength, 'p'); //+weapon damage - mob defense
		if (m.getHealth() <= 0) {
			return true;
		}
		return false;

	};

	this.magicalAttack = function() {

		var msuccess = false;

		for (let s of canSee) {
			if (s.containsMob && !(s.x == x && s.y == y) && !msuccess) {
				var m = s.mobAt();
				if (mAttackMob(m)) {
					dungeon.floors[currentFloor].board[m.x][m.y].containsMob = false;
					dungeon.floors[currentFloor].mobs.splice(dungeon.floors[currentFloor].mobs.indexOf(m), 1);
					addXP(m);
				}
				msuccess = true;
			}
		}

		console.log("Magic attack sucess: " + msuccess);

		for (let m of dungeon.floors[currentFloor].mobs) {
			m.update();
		}

		this.update();
	};

	var mAttackMob = function(m) {
		m.loseHealth(intelligence, 'm'); //+weapon damage - mob defense
		if (m.getHealth() <= 0) {
			return true;
		}
		return false;

	};

	var addXP = function(mob) {
		xpMult += ((mob.getLevel() / level) / 10) + (intelligence / (90 + level));
		if (xpMult >= 1) {
			levelUp();
		}
	};

	this.loseHealth = function(healthLost) {
		currentHealth -= abs(healthLost); // - armor - physical
	};

	var gameover = function() {
		redraw();
		userInterface.gameOverTime = millis();
		gameOver = true;
		loop();
	};
}
