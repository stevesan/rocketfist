#pragma strict

var onDieFx : GameObject;
var bulletPrefab : GameObject;
var firePeriod:float = 1.0;

private var lastFireTime = 0.0;
private var control:GameController;

function Start () {
	lastFireTime = Time.time + Random.Range(-0.5,0.5)*firePeriod;
	var controlObj = Utils.FindAncestorWithComponent( GameController, gameObject );
	control = controlObj.GetComponent( GameController );
}

function Fire() {
	var p = control.GetPlayer();
	var bullet = Instantiate( bulletPrefab,
			transform.position,
			bulletPrefab.transform.rotation );
	bullet.transform.parent = transform.parent;
	bullet.GetComponent(Bullet).SetTarget( p.gameObject );
}

function Update () {

	if( Time.time-lastFireTime > firePeriod ) {
		Fire();
		lastFireTime = Time.time;
	}

}

function OnDie() : void
{
	Instantiate( onDieFx, transform.position, onDieFx.transform.rotation );
	Destroy( gameObject );
}