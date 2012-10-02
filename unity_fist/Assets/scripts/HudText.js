#pragma strict

var control : GameController;

function Start () {

}

function Update () {

	GetComponent(GUIText).text = '';
	var player = control.GetPlayer();

	GetComponent(GUIText).text += 'COMBO: ' + player.currCombo;
	GetComponent(GUIText).text += '\nBEST COMBO: ' + player.highestCombo;
	
	if( player.state == PlayerState.ALIVE ) {
		// display health
		var health = player.GetComponent(Damageable).health;
		GetComponent(GUIText).text += '\n' + health + ' HP';
	}
	else {
		GetComponent(GUIText).text += '\n' + 'GAME OVER. PRESS R';
	}

}