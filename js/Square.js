function Square(_x, _y) {
	this.x = _x;
	this.y = _y;
	this.squareType = -1;
	this.lightLevel = 0;
	this.deadend = false;
	this.containsMob = false;
	this.isOpen = false;
	this.region = null;
	this.texture = random(100);
	if (this.texture < 60) {
		this.texture = 0;
	}
	else if (this.texture < 98) {
		this.texture = 1;
	}
	else {
		this.texture = 2;
	}

	//returns an arraylist of pvectors of moves (for maze)
	this.moves = function(board) {
		moves = [];
		if (this.x > 1 && board[this.x - 1][this.y].squareType == -1 && (this.y) % 2 == 1 && board[this.x - 1][this.y].numNeighbors(board) < 2) {
			moves.push(createVector(this.x - 1, this.y));
		}
		if (this.x < board.length - 2 && board[this.x + 1][this.y].squareType == -1 && (this.y) % 2 == 1 && board[this.x + 1][this.y].numNeighbors(board) < 2) {
			moves.push(createVector(this.x + 1, this.y));
		}
		if (this.y > 1 && board[this.x][this.y - 1].squareType == -1 && (this.x) % 2 == 1 && board[this.x][this.y - 1].numNeighbors(board) < 2) {
			moves.push(createVector(this.x, this.y - 1));
		}
		if (this.y < board.length - 2 && board[this.x][this.y + 1].squareType == -1 && (this.x) % 2 == 1 && board[this.x][this.y + 1].numNeighbors(board) < 2) {
			moves.push(createVector(this.x, this.y + 1));
		}
		return moves;
	};

	//returns the number of neighbors, doors or paths
	this.numNeighbors = function(board) {
		var neighbors = 0;
		if (this.x > 0 && board[this.x - 1][this.y].walkable()) {
			neighbors++;
		}
		if (this.x < dimension - 1 && board[this.x + 1][this.y].walkable()) {
			neighbors++;
		}
		if (this.y > 0 && board[this.x][this.y - 1].walkable()) {
			neighbors++;
		}
		if (this.y < dimension - 1 && board[this.x][this.y + 1].walkable()) {
			neighbors++;
		}
		return neighbors;
	};

	//returns an ArrayList of neighbors, doors or paths
	this.neighbors = function(board) {
		var neighbors = [];
		if (this.x > 0 && board[this.x - 1][this.y].walkable()) {
			neighbors.push(board[this.x - 1][this.y]);
		}
		if (this.x < dimension - 1 && board[this.x + 1][this.y].walkable()) {
			neighbors.push(board[this.x + 1][this.y]);
		}
		if (this.y > 0 && board[this.x][this.y - 1].walkable()) {
			neighbors.push(board[this.x][this.y - 1]);
		}
		if (this.y < dimension - 1 && board[this.x][this.y + 1].walkable()) {
			neighbors.push(board[this.x][this.y + 1]);
		}
		return neighbors;
	};

	this.walkable = function() {
		return (this.squareType == PATH || this.squareType == DOOR || this.squareType == STAIRDOWN || this.squareType == STAIRUP);
	};

	this.currentlyWalkable = function() {
		return (!this.containsMob && (this.squareType == PATH || (this.squareType == DOOR && this.isOpen) || this.squareType == STAIRDOWN || this.squareType == STAIRUP));
	};

	this.diagNeighbors = function(board) {
		var neighbors = 0;
		if (this.x > 0 && board[this.x - 1][this.y - 1].squareType === 0) {
			neighbors++;
		}
		if (this.x < dimension - 1 && board[this.x + 1][this.y + 1].squareType === 0) {
			neighbors++;
		}
		if (this.y > 0 && board[this.x + 1][this.y - 1].squareType === 0) {
			neighbors++;
		}
		if (this.y < dimension - 1 && board[this.x - 1][this.y + 1].squareType === 0) {
			neighbors++;
		}
		return neighbors;
	};

	this.pathNeighbors = function(board) {
		var neighbors = 0;
		if (this.x > 0 && board[this.x - 1][this.y].squareType === 0) {
			neighbors++;
		}
		if (this.x < dimension - 2 && board[this.x + 1][this.y].squareType === 0) {
			neighbors++;
		}
		if (this.y > 0 && board[this.x][this.y - 1].squareType === 0) {
			neighbors++;
		}
		if (this.y < dimension - 2 && board[this.x][this.y + 1].squareType === 0) {
			neighbors++;
		}
		return neighbors;
	};

	this.connector = function(_regions, _board) {
		for (let r of _regions) {
			if (this.adjacentTo(r, _board)) {
				for (let u of _regions) {
					if (this.adjacentTo(u, _board)) {
						if (!r.connectors.includes(this)) {
							r.connectors.push(this);
						}
						if (!u.connectors.includes(this)) {
							u.connectors.push(this);
						}

					}
				}
			}
		}
		return false;
	};

	this.adjacentTo = function(_region, _board) {
		if ((this.x > 0 && _board[this.x - 1][this.y].region != null && _board[this.x - 1][this.y].region == _region) || (this.x < dimension - 1 && _board[this.x + 1][this.y].region != null && _board[this.x + 1][this.y].region == _region) || (this.y > 0 && _board[this.x][this.y - 1].region != null && _board[this.x][this.y - 1].region == _region) || (this.y < dimension - 1 && _board[this.x][this.y + 1].region != null && _board[this.x][this.y + 1].region == _region)) {
			return true;
		}

		return false;
	};

	this.mobAt = function() {
		for (let m of dungeon.floors[currentFloor].mobs) {
			if (this.x == m.getX() && this.y == m.getY()) {
				return m;
			}
		}
		return null;
	};
}
