function SightLine(sx, sy, ex, ey) {

   this.straight = false;
   this.touching = [];

   this.startx = sx;
   this.starty = sy;
   this.endx = ex;
   this.endy = ey;
   if (sx == ex) {
      this.straight = true;
   }
   if (sy == ey) {
      this.straight = true;
   }

   this.findTouching = function() {

      var deltax = this.startx - this.endx;
      var deltay = this.starty - this.endy;
      var deltaerr = abs(deltay / deltax);
      var error = deltaerr - 0.5;
      var j = this.starty;
      if (this.startx < this.endx) {
         for (var i = this.startx; i <= this.endx; i++) {
            this.touching.push(dungeon.floors[currentFloor].board[i][j]);
            error = error + deltaerr;
            if (error >= 0.5) {
               if (this.starty < this.endy) {
                  j = j + 1;
               }
               else {
                  j = j - 1;
               }
               error = error - 1.0;
            }
         }
      }
      else {
         for (var i = this.startx; i >= this.endx; i--) {
            this.touching.push(dungeon.floors[currentFloor].board[i][j]);
            error = error + deltaerr;
            if (error >= 0.5) {
               if (this.starty < this.endy) {
                  j = j + 1;
               }
               else {
                  j = j - 1;
               }
               error = error - 1.0;
            }
         }
      }

      deltax = this.startx - this.endx;
      deltay = this.starty - this.endy;
      deltaerr = abs(deltax / deltay);
      error = deltaerr - 0.5;
      var a = this.startx;
      if (this.starty < this.endy) {
         for (var b = this.starty; b <= this.endy; b++) {
            this.touching.push(dungeon.floors[currentFloor].board[a][b]);
            error = error + deltaerr;
            if (error >= 0.5) {
               if (this.startx < this.endx) {
                  a = a + 1;
               }
               else {
                  a = a - 1;
               }
               error = error - 1.0;
            }
         }
      }
      else {
         for (var b = this.starty; b >= this.endy; b--) {
            this.touching.push(dungeon.floors[currentFloor].board[a][b]);
            error = error + deltaerr;
            if (error >= 0.5) {
               if (this.startx < this.endx) {
                  a = a + 1;
               }
               else {
                  a = a - 1;
               }
               error = error - 1.0;
            }
         }
      }
   }

   this.findStraightTouching = function() {

      if (this.startx == this.endx) {
         if (this.starty < this.endy) {
            for (var i = this.starty; i <= this.endy; i++) {
               this.touching.push(dungeon.floors[currentFloor].board[this.startx][i]);
            }
         }
         else {
            for (var i = this.starty; i >= this.endy; i--) {
               this.touching.push(dungeon.floors[currentFloor].board[this.startx][i]);
            }
         }
      }
      else if (this.starty == this.endy) {
         if (this.startx < this.endx) {
            for (var i = this.startx; i <= this.endx; i++) {
               this.touching.push(dungeon.floors[currentFloor].board[i][this.starty]);
            }
         }
         else {
            for (var i = this.startx; i >= this.endx; i--) {
               this.touching.push(dungeon.floors[currentFloor].board[i][this.starty]);
            }
         }
      }
   }
}
