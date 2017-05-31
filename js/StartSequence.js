function StartSequence() {

	this.tempTime = 0;
	this.startTime = -1;

	this.display = function() {
		this.displayTitle();
	};

	this.displayTitle = function() {
		if (this.startTime == -1) {
			this.startTime = millis();
		}
		background(7, 5, 5);
		textSize(width / 15);
		textAlign(CENTER);
		if ((millis() - this.startTime) < 255) {
			fill(255, (millis() - this.startTime));
		}
		else {
			fill(255);
		}
		text("Welcome Adventurer", width / 2, (height / 2));
	};

	this.displayCharacterClassSelector = function() {
		textSize(width / 20);
		textAlign(CENTER);
		fill(255);
		text("Select your stats", 0, height / 20, width, (height / 20) + (width / 20));
		this.displayCharacterClassChoices();
		this.displayCharacterClassHelp();
	};

	this.displayCharacterClassHelp = function() {

		var helpScale;
		fill(240, 230);

		if (!this.characterClassHelpExpanded) {
			helpScale = width / 30;
			rect(width - helpScale, height - helpScale, helpScale, helpScale);
			fill(0);
			textSize(width / 50);
			text("?", width - helpScale / 2, height - helpScale / 3);
		}
		else {
			helpScale = width / 2.9;
			rect(width - helpScale, height - helpScale / 1.3, helpScale, helpScale);
			fill(0);
			textSize(width / 70);
			textAlign(LEFT);
			text("Click on a class to select it\nfor your character.\n\n" +
				"The warrior is a strong melee fighter.\n\n" +
				"The mage is a powerful magic user.\n\n" +
				"The rogue is stealthy and intelligent.\n\n" +
				"Each class specializes in one area,\nbut any class can adopt any style of\nplay they want as they level up", width - helpScale / 1.05, height - helpScale / 1.5);
		}
	};

	this.displayCharacterClassChoices = function() {

		if (LOADIMAGES) {
			image(this.smallBoard, width / 4 - 128, height / 2.5);
			image(this.medBoard, width / 2 - 128, height / 2.5);
			image(this.largeBoard, width - (width / 4) - 128, height / 2.5);
		}
		else {
			fill(255);
			textAlign(CENTER);
			textSize(width / 20);
			text("Warrior", width / 4, (height / 3));
			text("Mage", width / 2, (height / 3));
			text("Rogue", width - (width / 4), (height / 3));
			rect(width / 4 - 128, height / 2.5, 256, 256);
			rect(width / 2 - 128, height / 2.5, 256, 256);
			rect(width - (width / 4) - 128, height / 2.5, 256, 256);
		}

		if (!this.characterClassHelpExpanded) {
			this.displayClassChoiceSelectedBorder();
		}

	};

	this.displayClassChoiceSelectedBorder = function() {

		//use tint???

		if (mouseX < width / 4 + 128 && mouseX > width / 4 - 128) {
			fill(100, 50);
			rect(width / 4 - 128 - selectedBorderSize, height / 2.5 - selectedBorderSize, 256 + (2 * selectedBorderSize), 256 + (2 * selectedBorderSize));
		}
		else if (mouseX > width / 2 - 128 && mouseX < width / 2 + 128) {
			fill(100, 50);
			rect(width / 2 - 128 - selectedBorderSize, height / 2.5 - selectedBorderSize, 256 + (2 * selectedBorderSize), 256 + (2 * selectedBorderSize));
		}
		else if (mouseX > width - (width / 4) - 128 && mouseX < width - (width / 4) + 128) {
			fill(100, 50);
			rect(width - (width / 4) - 128 - selectedBorderSize, height / 2.5 - selectedBorderSize, 256 + (2 * selectedBorderSize), 256 + (2 * selectedBorderSize));
		}
	};

	this.displayCharacterStatSelector = function() {
		textSize(width / 20);
		textAlign(CENTER);
		fill(255);
		text("Select your stats", 0, height / 20, width, (height / 20) + (width / 20));
		this.displayCharacterStatPicker();
		this.displayCharacterDefaultOption();
		this.displayCharacterStatHelp();
	};

	this.displayCharacterStatPicker = function() {
		textSize(width / 30);
		textAlign(LEFT);
		text("Strength", width / 15, 3 * (height / 7));
		text("Dexterity", width / 15, 4 * (height / 7));
		text("Intelligence", width / 15, 5 * (height / 7));

		text("- " + selectedStrength + " +", width - (width / 5), 3 * (height / 7));
		text("- " + selectedDexterity + " +", width - (width / 5), 4 * (height / 7));
		text("- " + selectedIntelligence + " +", width - (width / 5), 5 * (height / 7));

		fill(200 + (selectedTotal * 5), 250 - (selectedTotal * 5), 150);
		text("Points left", width / 15, 2 * (height / 7));
		textAlign(CENTER)
		text((10 - selectedTotal), width - (width / 5) + (textWidth("  ") * 1.25), 2 * (height / 7));

		this.displayCharacterStatBars();

	};

	this.displayCharacterStatBars = function() {

		var rectScale = width / 25;

		fill(200 + (selectedTotal * 5), 250 - (selectedTotal * 5), 150);

		for (var i = 0; i < 10 - selectedTotal; i++) {
			rect(width / 3 + (i * rectScale) + width / 30, 2 * (height / 7) - rectScale / 2, rectScale * .8, rectScale / 2);
		}

		fill(255);

		for (var i = 0; i < selectedStrength; i++) {
			rect(width / 3 + (i * rectScale) + width / 30, 3 * (height / 7) - rectScale / 2, rectScale * .8, rectScale / 2);
		}

		for (var i = 0; i < selectedDexterity; i++) {
			rect(width / 3 + (i * rectScale) + width / 30, 4 * (height / 7) - rectScale / 2, rectScale * .8, rectScale / 2);
		}

		for (var i = 0; i < selectedIntelligence; i++) {
			rect(width / 3 + (i * rectScale) + width / 30, 5 * (height / 7) - rectScale / 2, rectScale * .8, rectScale / 2);
		}

	};

	this.displayCharacterDefaultOption = function() {

		if (!this.characterStatHelpExpanded && mouseY > height - (height / 5) && mouseX > width / 4 && mouseX < width - (width / 4)) {
			stroke(200, 40);
			strokeWeight(3.5);
		}

		fill(255);
		textSize(width / 30);
		textAlign(CENTER);
		if (selectedTotal < 10) {

			var classStr;
			if (selectedClass == 0) {
				classStr = "warrior";
			} else if (selectedClass == 1) {
				classStr = "mage"
			} else if (selectedClass == 2) {
				classStr = "rogue"
			}

			text("Select recommended stats for a " + classStr + ".", width / 2, height - (height / 15));
		}
		else {
			text("Ready to go!", width / 2, height - (height / 15));
		}
		noStroke();
	};

	this.selectDefaultStats = function() {

		if (selectedClass == 0) {
			selectedStrength = 6;
			selectedDexterity = 3;
			selectedIntelligence = 1;
		}
		else if (selectedClass == 1) {
			selectedStrength = 3;
			selectedDexterity = 1;
			selectedIntelligence = 6;
		}
		else if (selectedClass == 2) {
			selectedStrength = 1;
			selectedDexterity = 6;
			selectedIntelligence = 3;
		}

		selectedTotal = 10;

	};

	this.displayCharacterStatHelp = function() {

		var helpScale;
		fill(240, 230);

		if (!this.characterStatHelpExpanded) {
			helpScale = width / 30;
			rect(width - helpScale, height - helpScale, helpScale, helpScale);
			fill(0);
			textSize(width / 50);
			text("?", width - helpScale / 2, height - helpScale / 3);
		}
		else {
			helpScale = width / 2.1;
			rect(width - helpScale, height - helpScale / 1.2, helpScale, helpScale);
			fill(0);
			textSize(width / 70);
			textAlign(LEFT);
			text("Click the arrows or use your arrow keys to\nadd/subtract stat points from a stat.\n\n" +
				"-Strength describes how much physical attack damage\nyour character can deal and receive. It also\ndetermines what weapons your character can use.\n\n" +
				"-Dexterity describes how agile, quick, and accurate\nyour character is. High dexterity will allow your\ncharacter to dodge traps and attacks, be more\naccurate, and gain a speed advantage.\n\n" +
				"-Intelligence describes your character's magic\nabilities, ability to use magic items, and the\namount of experience your character gains.\n\n" +
				"You have 10 points to distribute between stats.\nClicking the recommended stats button will auto\nspread the values, sacrificing custimization for\na simpler experience.", width - helpScale / 1.05, height - helpScale / 1.3);
		}
	};

}
