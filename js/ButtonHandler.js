$(document).ready(function() {

	$('#pattack').click(function() {
		player.physicalAttack();
	});
	$('#mattack').click(function() {
		player.magicalAttack();
	});
	$('#door').click(function() {
		player.openDoor();
	});

});
