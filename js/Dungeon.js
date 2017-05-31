function Dungeon() {

   this.numFloors;
   this.dimension;
   this.floors = [];

   this.addFloor = function() {
      this.numFloors++;
      this.floors.push(floorFactory.createFloor(this.dimension, this.floors[this.floors.length-1].stairDown, this.numFloors));
   };

}
