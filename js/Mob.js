function Mob(_x, _y, _level) {

	var x = _x;
	var y = _y;

	var healthMult = 1;
	var level = _level;
	var strength = floor(random(10, 15)) + (2 * level);
	var dexterity = floor(random(15)) + (2 * level);
	var intelligence = floor(random(10, 15)) + (2 * level);
	var maxHealth = floor(random(20, 30)) + (2 * level);
	var currentHealth = maxHealth;

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

	this.getXPMult = function() {
		return xpMult;
	};

	this.getX = function() {
		return x;
	};

	this.getY = function() {
		return y;
	};

	this.update = function() {
		if (!(abs(x - player.getX()) < 2 && abs(y - player.getY()) < 2) && (abs(x - player.getX()) < 10 && abs(y - player.getY()) < 10)) {
			getCloser();
		}
		else if (abs(x - player.getX()) < 2 && abs(y - player.getY()) < 2) {
			attack();
		}
	};

	var move = function(dir) {
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
				if (x > 0 && dungeon.floors[currentFloor].board[x - 1][y].currentlyWalkable()) {
					x--;
					sucess = true;
				}
				break;
			case 'r':
				if (x < dungeon.floors[currentFloor].dimension - 1 && dungeon.floors[currentFloor].board[x + 1][y].currentlyWalkable()) {
					x++;
					sucess = true;
				}
				break;
		}
		dungeon.floors[currentFloor].board[x][y].containsMob = true;
		return sucess;
	};

	var getCloser = function() {
		if (move(getDirectionToPlayer())) {
			return;
		}
		else {
			move(getDirectionToPlayerAlt());
		}
	};

	//prioritizes R, L, U, D
	var getDirectionToPlayer = function() {
		if (x < player.getX()) {
			return 'r';
		}
		else if (x > player.getX()) {
			return 'l';
		}
		else if (y > player.getY()) {
			return 'u';
		}
		else if (y < player.getY()) {
			return 'd';
		}
	};

	var getDirectionToPlayerAlt = function() {
		if (y > player.getY()) {
			return 'u';
		}
		else if (y < player.getY()) {
			return 'd';
		}
		else if (x < player.getX()) {
			return 'r';
		}
		else if (x > player.getX()) {
			return 'l';
		}
	};

	var attack = function() {
		player.loseHealth(strength);
	};

	this.loseHealth = function(healthLost, attType) {
		if (attType == 'p') {
			currentHealth -= abs(healthLost);
		}

	};
}
