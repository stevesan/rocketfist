#pragma strict

//----------------------------------------
//  Handles things such as freezing the game for a split second for extra impact
//	No one else should mess with Time.timeScale except this component!
//----------------------------------------

var scale = 0.0;	// 0.0 == freeze
var duration = 0.5;

private var freezeUntilRt:float;

function Start () {
	freezeUntilRt = 0.0;

	// in case we started with a corrupt time scale..
	Time.timeScale = 1.0;
}

function Play()
{
	freezeUntilRt = Time.realtimeSinceStartup + duration;
	Time.timeScale = scale;
}

function Update () {
	if( freezeUntilRt > 0.0 && Time.realtimeSinceStartup >= freezeUntilRt ) {
		// effect is up! return to normal scale
		Time.timeScale = 1.0;
		freezeUntilRt = 0.0;
	}
}