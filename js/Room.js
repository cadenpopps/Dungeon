function Room(_topLeftx, _topLefty, _bottomRightx, _bottomRighty, dimension) {

   this.x1 = _topLeftx;
   this.y1 = _topLefty;
   this.x2 = _bottomRightx;
   this.y2 = _bottomRighty;

   if (this.x1 % 2 === 0) {
      this.x1++;
   }
   if (this.y1 % 2 === 0) {
      this.y1++;
   }

   if (this.x2 % 2 == 1) {
      this.x2++;
   }
   if (this.y2 % 2 == 1) {
      this.y2++;
   }

   if (this.x2 >= dimension - 1) {
      this.x2 = dimension - 1;
   }
   if (this.y2 >= dimension - 1) {
      this.y2 = dimension - 1;
   }

   this.rwidth = abs(this.x1 - this.x2);
   this.rheight = abs(this.y1 - this.y2);

   this.roomType = 0;

   this.childSquares = [];

   this.overlaps = function(tempRoom) {

      if (tempRoom.x1 > this.x2 || tempRoom.x2 < this.x1) {
         return false;
      }

      if (tempRoom.y1 > this.y2 || tempRoom.y2 < this.y1) {
         return false;
      }

      return true;

   };

   this.notRoom = function() {

      if (abs(this.rwidth - this.rheight) > 3 || this.rheight < 2 || this.rwidth < 2) {
         return true;
      }

      return false;

   };

   this.addChildren = function(_board) {
      for (var i = this.x1; i < this.x2; i++) {
         for (var j = this.y1; j < this.y2; j++) {
            this.childSquares.push(_board[i][j]);
         }
      }
   };

   this.makeRoom = function(_board) {
      for (var i = this.x1; i < this.x2; i++) {
         for (var j = this.y1; j < this.y2; j++) {
            _board[i][j].squareType = 0;
         }
      }
   };

   this.getEdges = function(board) {

      var edges = [];

      for (let s of this.childSquares) {
         if (s.x == this.x1 || s.y == this.y1 || s.x == this.x2 || s.y == this.y2) {
            edges.push(s);
         }
      }

      return edges;

   };
}
