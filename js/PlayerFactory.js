function PlayerFactory() {

    var x;
    var y;
    var attack, magic, intelligence, maxHealth;

    this.createPlayer = function(_attack, _magic, _intelligence, _class) {

        var x = dungeon.floors[0].stairUp.x;
        var y = dungeon.floors[0].stairUp.y;

        attack = _attack;
        magic = _magic;
        intelligence = _intelligence;

        return new Player(x, y, 10, 10, 10, 500);

    };

}