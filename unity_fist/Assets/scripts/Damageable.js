#pragma strict

var health:int = 100;
var team : Team;

function OnDamage( amount:int ) : void
{
	health -= amount;
	if( health <= 0 ) {
		gameObject.SendMessage('OnDie');
	}
}
