
function FloorFactory() {

    var dimension;
    var board;
    var stairUp;
    var stairDown;
    var floorNum;
    var rooms;
    var regions;
    var mobs;
    var roomTries;
    var maxRoomSize;
    var minRoomSize;
    var roomOffSet;
    var lootCap;
    var mobCap;
    const LOOTRATE = 1;
    const MOBRATE = 1;

    this.createFloor = function(_dimension, _stairUp, _floorNum) {

        newFloor = new Floor();
        dimension = _dimension;
        stairUp = _stairUp;
        floorNum = _floorNum;
        stairDown = null;
        rooms = [];
        regions = [];
        mobs = [];
        roomTries = dimension * 10;
        maxRoomSize = dimension / 4;
        minRoomSize = floor(maxRoomSize / 4) + 1;
        roomOffSet = floor(minRoomSize / 2) + 2;
        lootCap = floor(((dimension / 10) + ((_floorNum + 5) / 3)) * LOOTRATE);
        mobCap = floor(((dimension / 8) + ((_floorNum + 30) / 2)) * MOBRATE);

        this.genBoard(dimension);

        this.genDungeon();

        newFloor.board = board;
        newFloor.dimension = dimension;
        newFloor.stairUp = stairUp;
        newFloor.stairDown = stairDown;
        newFloor.mobs = mobs;
        newFloor.mobCap = mobCap;

        return newFloor;

    };

    this.genBoard = function(_dimension) {
        board = new Array(_dimension);
        for (var i = 0; i < _dimension; i++) {
            board[i] = new Array(_dimension);
            for (var j = 0; j < _dimension; j++) {
                board[i][j] = new Square(i, j);
            }
        }
    };

    this.genDungeon = function() {
        this.genStairs();

        this.genRooms();

        this.genMaze();

        this.connectRegions();

        this.sparseMaze();

        for (var i = 0; i < (1 + floor(dimension / 20)); i++) {
            this.removeDetours();
        }

        this.populate();

        board[stairUp.x][stairUp.y].squareType = STAIRUP;
        board[stairDown.x][stairDown.y].squareType = STAIRDOWN;

        //move down to detour code
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (board[i][j].squareType == 5) {
                    board[i][j].squareType = -1;
                }
            }
        }

        rooms = null;
        //regions = null;

    };

    this.genStairs = function() {

        stairDown = createVector(floor(random(4, dimension - 4)), floor(random(4, dimension - 4)));

        while (abs(stairDown.x - stairUp.x) < dimension / 3 && abs(stairDown.y - stairUp.y) < dimension / 3) {
            stairDown.x = floor(random(4, dimension - 4));
            stairDown.y = floor(random(4, dimension - 4));
        }

        rooms.push(new Room(stairUp.x - floor(random(2, 4)), stairUp.y - floor(random(2, 4)), stairUp.x + floor(random(2, 4)), stairUp.y + floor(random(2, 4)), dimension));
        rooms.push(new Room(stairDown.x - floor(random(2, 4)), stairDown.y - floor(random(2, 4)), stairDown.x + floor(random(2, 4)), stairDown.y + floor(random(2, 4), dimension)));

        for (let r of rooms) {
            r.addChildren(board);
            regions.push(new Region(r.childSquares));
            r.roomType = -1;
        }

    };

    this.genRooms = function() {

        for (var i = 0; i < roomTries; i++) {

            var topLeftx = floor(random(0, dimension - 3));
            var topLefty = floor(random(0, dimension - 3));

            var size = floor(random(minRoomSize, maxRoomSize));

            var bottomRightx, bottomRightY;
            if (random(1) >= .5) {
                bottomRightx = topLeftx + size + floor(random(1, roomOffSet));
                bottomRighty = topLefty + size;
            }
            else {
                bottomRightx = topLeftx + size;
                bottomRighty = topLefty + size + floor(random(1, roomOffSet));
            }

            var newRoom = new Room(topLeftx, topLefty, bottomRightx, bottomRighty, dimension);

            var valid = true;

            if (newRoom.notRoom()) {
                valid = false;
            }

            for (let r of rooms) {
                if (newRoom.overlaps(r)) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                rooms.push(newRoom);
                newRoom.addChildren(board);
                regions.push(new Region(newRoom.childSquares));
            }
        }

        for (let r of rooms) {
            r.makeRoom(board);
        }
    };

    this.genMaze = function() {

        var cur = createVector(0, 0);

        for (var x = 0; x < dimension; x++) {
            for (var y = 0; y < dimension; y++) {
                if (x % 2 == 1 || y % 2 == 1) {
                    if (x > 0 && y > 0 && board[x][y].squareType == -1 && board[x][y].numNeighbors(board) < 2 && board[x - 1][y].squareType == -1 && board[x][y - 1].squareType == -1) {
                        cur.x = x;
                        cur.y = y;
                        this.genMazeSection(cur);
                    }
                }
            }
        }
        for (let r of regions) {
            for (let s of r.children) {
                s.region = r;
            }
        }
        //make some imperfections
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (board[i][j].squareType == 0 && board[i][j].pathNeighbors(board, dimension) == 2) {
                    if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i - 1][j].squareType == -1 && board[i - 2][j].squareType == 0 && board[i - 2][j].region == board[i][j].region) && random(1) < .02) {
                        board[i - 1][j].squareType = 0;
                        board[i - 1][j].region = board[i][j].region;
                    }
                    if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i + 1][j].squareType == -1 && board[i + 2][j].squareType == 0 && board[i + 2][j].region == board[i][j].region) && random(1) < .02) {
                        board[i + 1][j].squareType = 0;
                        board[i + 1][j].region = board[i][j].region;
                    }
                    if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i][j - 1].squareType == -1 && board[i][j - 2].squareType == 0 && board[i][j - 2].region == board[i][j].region) && random(1) < .02) {
                        board[i][j - 1].squareType = 0;
                        board[i][j - 1].region = board[i][j].region;
                    }
                    if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i][j + 1].squareType == -1 && board[i][j + 2].squareType == 0 && board[i][j + 2].region == board[i][j].region) && random(1) < .02) {
                        board[i][j + 1].squareType = 0;
                        board[i][j + 1].region = board[i][j].region;
                    }
                }
            }
        }
        //more imperfections?
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (board[i][j].squareType == -1 && board[i][j].pathNeighbors(board, dimension) == 2) {
                    if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i - 1][j].squareType == 0 && board[i + 1][j].squareType == 0 && board[i - 1][j].region == board[i + 1][j].region) && random(1) < .02) {
                        board[i][j].squareType = 0;
                        board[i][j].region = board[i][j].region;
                    }
                    if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i][j - 1].squareType == 0 && board[i][j + 1].squareType == 0 && board[i][j - 1].region == board[i][j + 1].region) && random(1) < .02) {
                        board[i][j].squareType = 0;
                        board[i][j].region = board[i][j].region;
                    }
                }
            }
        }
    };

    this.genMazeSection = function(cur) {

        moveStack = [];
        notVisited = true;
        var sectionSquares = [];
        currentSquare = createVector(cur.x, cur.y);

        while (notVisited) {
            board[currentSquare.x][currentSquare.y].squareType = 0;
            sectionSquares.push(board[currentSquare.x][currentSquare.y]);
            var moves = board[currentSquare.x][currentSquare.y].moves(board);
            if (moves.length !== 0) {
                moveStack.push(currentSquare);
                var randomMove = floor(map(random(1), 0, 1, 0, moves.length));
                currentSquare = moves[randomMove];
            }
            else if (moveStack.length !== 0) {
                currentSquare = moveStack[moveStack.length - 1];
                moveStack.pop();
            }
            else {
                break;
            }
            notVisited = false;
            for (var i = 0; i < dimension; i++) {
                for (var j = 0; j < dimension; j++) {
                    if (i % 2 == 1 || j % 2 == 1) {
                        if (board[i][j].squareType == -1) {
                            notVisited = true;
                        }
                    }
                }
            }
        }
        var r = new Region(sectionSquares);
        r.path = true;
        regions.push(r);
    };

    this.connectRegions = function() {
        regions[0].connect();
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (board[i][j].squareType == -1) {
                    board[i][j].connector(regions, board);
                }
            }
        }
        var allConnected = false;
        while (!allConnected) {
            for (let r of regions) {
                if (r.connected && r.connectors.length != 0) {
                    var temp = floor(random(r.connectors.length));
                    for (let u of regions) {
                        if (!u.connected && u.connectors.includes(r.connectors[temp])) {
                            u.connect();
                            r.connectors[temp].squareType = DOOR;
                            u.connectors.splice(u.connectors.indexOf(r.connectors[temp]), 1)
                            r.connectors.splice(temp, 1);
                        }
                    }
                }
            }
            allConnected = true;
            for (let r of regions) {
                if (!r.connected) {
                    allConnected = false;
                }
            }
        }
    };

    this.sparseMaze = function() {
        var deadends = true;
        while (deadends) {
            for (var i = 0; i < dimension; i++) {
                for (var j = 0; j < dimension; j++) {
                    if (board[i][j].deadend) {
                        board[i][j].deadend = false;
                        board[i][j].squareType = -1;
                    }
                }
            }

            for (var i = 0; i < dimension; i++) {
                for (var j = 0; j < dimension; j++) {
                    if (board[i][j].squareType == 0 && board[i][j].numNeighbors(board) <= 1 && random(1) < .97) {
                        board[i][j].deadend = true;
                    }
                }
            }

            deadends = false;
            for (var i = 0; i < dimension; i++) {
                for (var j = 0; j < dimension; j++) {
                    if (board[i][j].deadend) {
                        deadends = true;
                    }
                }
            }
        }
    };

    this.removeDetours = function() {
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (board[i][j].squareType == -1 && board[i][j].pathNeighbors(board) == 3 && board[i][j].diagNeighbors(board) == 4) {
                    board[i][j].squareType = 5;
                    if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i - 1][j].squareType == -1 || board[i - 1][j].squareType == 5)) {
                        board[i - 1][j].squareType = 0;
                        board[i - 1][j].region = board[i][j].region;
                        board[i + 1][j].squareType = -1;
                    }
                    else if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i + 1][j].squareType == -1 || board[i + 1][j].squareType == 5)) {
                        board[i + 1][j].squareType = 0;
                        board[i + 1][j].region = board[i][j].region;
                        board[i - 1][j].squareType = -1;
                    }
                    else if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i][j - 1].squareType == -1 || board[i][j - 1].squareType == 5)) {
                        board[i][j - 1].squareType = 0;
                        board[i][j - 1].region = board[i][j].region;
                        board[i][j + 1].squareType = -1;
                    }
                    else if (i > 1 && j > 1 && i < dimension - 2 && j < dimension - 2 && (board[i][j + 1].squareType == -1 || board[i][j + 1].squareType == 5)) {
                        board[i][j + 1].squareType = 0;
                        board[i][j + 1].region = board[i][j].region;
                        board[i][j - 1].squareType = -1;
                    }
                }
                else if (board[i][j].squareType == 5) {
                    board[i][j].squareType = -1;
                }
            }
        }
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                if (board[i][j].squareType == -1 && board[i][j].pathNeighbors(board) == 4 && board[i][j].diagNeighbors(board) == 4 && random(1) < .8) {
                    var n = board[i][j].neighbors(board);
                    var temp = floor(random(0, n.length));
                    n[temp].squareType = -1;
                }
            }
        }
        this.sparseMaze();
    };

    this.populate = function() {
        var i = 0;
        while (i < lootCap) {
            var randomRoom = rooms[floor(random(rooms.length))];
            while (randomRoom.roomType == -1) {
                randomRoom = rooms[floor(random(rooms.length))];
            }
            var roomEdges = randomRoom.getEdges();
            var randomSquare = roomEdges[floor(random(roomEdges.length))];
            while (randomSquare.squareType != 0) {
                randomSquare = roomEdges[floor(random(roomEdges.length))];
            }
            randomSquare.squareType = 2;
            i++;
        }
        i = 0;
        while (i < mobCap) {
            var randomRoom = rooms[floor(random(rooms.length))];
            while (randomRoom.roomType == -1) {
                randomRoom = rooms[floor(random(rooms.length))];
            }
            var randomSquare = randomRoom.childSquares[floor(random(randomRoom.childSquares.length))];
            while (randomSquare.squareType != 0) {
                randomSquare = randomRoom.childSquares[floor(random(randomRoom.childSquares.length))];
            }
            randomSquare.containsMob = true;
            mobs.push(new Mob(randomSquare.x, randomSquare.y, floorNum + 1));
            i++;
        }
        for (var i = 0; i < dimension; i++) {
            for (var j = 0; j < dimension; j++) {
                //delete doors that lead to nothing
                if (board[i][j].squareType == -5 && board[i][j].numNeighbors(board) < 2) {
                    board[i][j].squareType = //10% chance to make a door a path
                        -1;
                }
                else if (board[i][j].squareType == -5 && random(1) < .10) {
                    board[i][j].squareType = //change walls to paths if they have more than 2 path neighbors
                        0;
                }
                else if (board[i][j].squareType == -1 && board[i][j].pathNeighbors(board) > 2) {
                    board[i][j].squareType = //delete doors with too many surrounding doors
                        0;
                }
                else if (board[i][j].squareType == -5) {
                    for (var a = i - 1; a <= i + 1; a++) {
                        for (var b = j - 1; b <= j + 1; b++) {
                            if (a > 0 && b > 0 && a < dimension - 1 && b < dimension - 1 && (a != i || b != j)) {
                                if (board[a][b].squareType == -5 && random(1) < .9) {
                                    board[a][b].squareType = -1;
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}