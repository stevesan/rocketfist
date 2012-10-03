#pragma strict

import System.Collections.Generic;

var player:Player;
var mainCamera:Camera;

class LevelManager
{
	var levelsParent:GameObject = null;

	private var levels = new List.<LevelArea>();
	private var currentLevelInstance:LevelArea = null;
	private var currentLevelId = 0;

	//----------------------------------------
	//  Rounds the origin X/Y to integers, then orders by descending Y then ascending X (row major)
	//----------------------------------------
	static function CompareLevelPosition( a:LevelArea, b:LevelArea ) : int
	{
		var a_u:int = Mathf.Floor(a.transform.position.x);
		var a_v:int = Mathf.Floor(a.transform.position.y);
		var b_u:int = Mathf.Floor(b.transform.position.x);
		var b_v:int = Mathf.Floor(b.transform.position.y);

		if( a_v == b_v )
			return Mathf.RoundToInt( Mathf.Sign(a_u - b_u) );
		else
			return Mathf.RoundToInt( Mathf.Sign(b_v - a_v) );
	}

	function Init()
	{
		// Gather level areas
		for( var childXform:Transform in levelsParent.transform ) {
			var level = childXform.gameObject.GetComponent(LevelArea);
			if( level != null ) {
				levels.Add( level );
			}
		}

		// Sort them for level order
		levels.Sort( CompareLevelPosition );

		// Assign all other objects to levels based on position
		for( level in levels ) {
			for( var otherXform:Transform in levelsParent.transform ) {
				var other = otherXform.gameObject;
				if( other != level ) {
					if( level.ContainsObject(other) ) {
						level.Adopt(other);
					}
				}
			}

			level.Deactivate();
		}
	}

	function SwitchToLevel( levelId:int, origin:Vector3 )
	{
		if( currentLevelInstance != null ) {
			GameObject.Destroy(currentLevelInstance.gameObject);
		}

		currentLevelInstance = levels[levelId].MakeCopy();
		currentLevelInstance.Activate();
		currentLevelInstance.transform.position = origin;
		currentLevelId = levelId;
	}

	function ToNextLevel( wrap:boolean, origin:Vector3 ) {
		var nextId = currentLevelId+1;
		if( wrap  ) {
			nextId = nextId % levels.Count;
		}
		else {
			if( nextId >= levels.Count )
				nextId = levels.Count-1;
		}

		SwitchToLevel(nextId, origin);
	}
}

var levels = new LevelManager();

private var state = "menu";

function GetPlayer() : Player { return player; }

function Awake()
{
	levels.Init();
}


function Update()
{
	if( state == "menu" ) {
		if( Input.GetButtonDown('reset') ) {
			levels.SwitchToLevel( 0, mainCamera.transform.position );
			state = "inLevel";
		}
	}
	else if( state == "inLevel" ) {
		if( Input.GetButtonDown('reset') ) {
			levels.ToNextLevel( true, mainCamera.transform.position );
		}
	}
}
