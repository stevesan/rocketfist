#pragma strict

var levelName:String = "level";

private var bounds:Bounds2D;

function Start () {
	// TODO - remove the render component - only need it in-editor

	// TODO - set bounds
}

//----------------------------------------
//  Returns bounds for the mesh of the level area. Presumably a scaled cube
//----------------------------------------
function ContainsObject( obj:GameObject )
{
	return bounds.Contains( obj.transform.position );
}

//----------------------------------------
//  Adopts the given object as an object in this level
//----------------------------------------
function Adopt( obj:GameObject )
{
	obj.transform.parent = this.transform;
}

//----------------------------------------
//  
//----------------------------------------
function Deactivate()
{
	// TODO deactivate this and all children
}

function Activate()
{
	// TODO activate this and all children
}

function MakeCopy()
{
	return Instantiate( this, this.transform.position, this.transform.rotation );
}

function GetCenterForCamera()
{
	return transform.position;
}

function Update () {

}