#pragma strict

var player:Player;

function GetPlayer() : Player { return player; }

function Update()
{
	if( Input.GetButtonDown('reset') ) {
		Application.LoadLevel( Application.loadedLevelName );
	}
}
