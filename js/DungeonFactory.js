function DungeonFactory() {

   var dungeon;

   this.createDungeon = function(_dimension) {
      var dungeon = new Dungeon();
      dungeon.numFloors = 1;
      dungeon.dimension = _dimension;

      dungeon.floors[0] = (floorFactory.createFloor(_dimension, createVector(floor(random(5, dimension - 5)),
         floor(random(5, dimension - 5))), 1));

      return dungeon;
   };

}