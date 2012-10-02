#pragma strict

enum PlayerState { ALIVE, DEAD };

var speed:float = 1.0;
var mainCam : Camera;
var damage:int = 10;
var state = PlayerState.ALIVE;
var onPainFx : GameObject;
var onDieFx : GameObject;
var moveFx : AudioSource;

private var goalPos:Vector2;
var currCombo:int = 0;
var highestCombo:int = 0;

function GetMouseXYWorldPos() : Vector2
{
	var ray = mainCam.ScreenPointToRay( Input.mousePosition );
	// solve for when the ray hits z=0 plane
	var alpha = -ray.origin.z / ray.direction.z;
	var wpos = ray.origin + alpha*ray.direction;
	return Vector2(wpos.x, wpos.y);
}

function ScoreCombo()
{
	if( currCombo > highestCombo ) {
		highestCombo = currCombo;
	}
	currCombo = 0;
}

function Start () {
}

function Update () {
	if( state == PlayerState.ALIVE ) {
		var goalDist = Vector2.Distance( goalPos, transform.position );
		var maxDist = speed * Time.deltaTime;
		if( goalDist > maxDist ) {
			var dir = goalPos - transform.position;
			dir.Normalize();
			transform.position += dir * maxDist;
		}
		else {
			transform.position = goalPos;
			ScoreCombo();
		}

		if( Input.GetButtonDown('go') ) {
			goalPos = GetMouseXYWorldPos();
			moveFx.Play();
			ScoreCombo();
		}
	}
}

function OnTriggerEnter( other:Collider ) : void
{
	var dmgable = other.GetComponent( Damageable );
	if( dmgable != null ) {
		other.SendMessage('OnDamage', damage, SendMessageOptions.DontRequireReceiver );
		// doing damage, do a little freeze effect
		GetComponent(TimeScaleEffect).Play();
		currCombo++;
	}
}

function OnDie() : void
{
	if( state == PlayerState.ALIVE ) {
		Instantiate( onDieFx, transform.position, onDieFx.transform.rotation );
		state = PlayerState.DEAD;
	}
}

function OnDamage( amount:int ) : void
{
	if( state == PlayerState.ALIVE ) {
		Debug.Log('Player::OnDamage');
		Instantiate( onPainFx, transform.position, onPainFx.transform.rotation );
	}
}