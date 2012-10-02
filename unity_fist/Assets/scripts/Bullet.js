#pragma strict
enum Team { PLAYER, CPU };

var lifeTime = 1.0;
var damage = 10.0;
var targetTeam : Team;

private var mover:Mover;
private var wakeTime:float;

function Awake()
{
	mover = GetComponent(Mover);
	wakeTime = Time.time;
}

function SetTarget( t:GameObject )
{
	var dir = t.transform.position - transform.position;
	dir.Normalize();
	mover.MoveInDirection( dir );

	// UNITY BUG need to assign the rotation to transform..
	var rot = new Quaternion();
	rot.SetFromToRotation( Vector3(1,0,0), dir );
	transform.localRotation = rot;
}

function Update()
{
	if( Time.time-wakeTime >= lifeTime )
		Destroy( gameObject );
}

function OnTriggerEnter( other:Collider )
{
	var dmgable = other.GetComponent( Damageable );
	if( dmgable != null && dmgable.team == targetTeam ) {
		other.SendMessage('OnDamage', damage, SendMessageOptions.DontRequireReceiver );
		Destroy( gameObject );
	}
}
