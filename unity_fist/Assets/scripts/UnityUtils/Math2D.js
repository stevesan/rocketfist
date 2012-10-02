#pragma strict

import System.Collections.Generic;

static function Nearest( pts : Array, p:Vector2 ) : int
{
	var minDist = Mathf.Infinity;
	var minId = -1;

	for( var i = 0; i < pts.length; i++ )
	{
		var dist = Vector2.Distance( pts[i], p );
		if( dist < minDist )
		{
			minDist = dist;
			minId = i;
		}
	}

	return minId;
}

//----------------------------------------
//  Returns the counter-clockwise perpendicular vector from the given
//----------------------------------------
static function PerpCCW( v:Vector2 ) : Vector2
{
	return Vector2( -v.y, v.x );
}

//----------------------------------------
//  
//----------------------------------------
static function ClosestPointOn2DLine( p:Vector2, a:Vector2, b:Vector2 ) : Vector2
{
	var r = b-a;
	var t = (-r.x*(a.x-p.x) - r.y*(a.y-p.y)) / (r.x*r.x + r.y*r.y);
	var c = a+t*r;

	//Debug.DrawLine( a, b, Color.red, 0.0, false );
	//Debug.DrawLine( p, c, Color.green, 0.0, false );

	return c;
}

static function CCWAngle( a1:Vector2, a2:Vector2, b1:Vector2, b2:Vector2 ) : float
{
	var anorm = (a2-a1).normalized;
	var bnorm = (b2-b1).normalized;
	return CCWAngle( anorm, bnorm );
}

//----------------------------------------
//  
//----------------------------------------
static function CCWAngle( anorm:Vector2, bnorm:Vector2 ) : float
{
	// use the clamp, sometimes numerical issues cause the dot product to be off even if the norms are normalized
	var thetaUp = Mathf.Acos( Mathf.Clamp( Vector2.Dot( anorm, bnorm ), -1.0, 1.0 ) );

	// check if 
	var aup = PerpCCW( anorm );
	if( Vector2.Dot( aup, bnorm ) < 0.0 ) {
		// b is pointing in the -Y side
		// flip the angle
		var thetaDown = 2*Mathf.PI - thetaUp;
		return thetaDown;
	}
	else
		return thetaUp;
}

//----------------------------------------
//  Reflects p along the given line a->b
//----------------------------------------
static function Reflect2D( p:Vector2, a:Vector2, b:Vector2 ) : Vector2
{
	var c = ClosestPointOn2DLine( p, a, b );
	var perp = p-c;
	var ref = c - perp;
	return ref;
}

class Bounds2D
{
	var mins : Vector2;
	var maxs : Vector2;

	function SetTo( pts : List.<Vector2> )
	{
		mins = Vector2( Mathf.Infinity, Mathf.Infinity );
		maxs = Vector2( -Mathf.Infinity, -Mathf.Infinity );

		for( var i = 0; i < pts.Count; i++ )
		{
			mins = Vector2.Min( mins, pts[i] );
			maxs = Vector2.Max( maxs, pts[i] );
		}
	}

	function SetTo( pts : Vector2[] )
	{
		mins = Vector2( Mathf.Infinity, Mathf.Infinity );
		maxs = Vector2( -Mathf.Infinity, -Mathf.Infinity );

		for( var i = 0; i < pts.length; i++ )
		{
			mins = Vector2.Min( mins, pts[i] );
			maxs = Vector2.Max( maxs, pts[i] );
		}
	}

	function GetCenter() : Vector2
	{
		return 0.5 * (mins+maxs);
	}

	function Contains( p:Vector2 ) : boolean {
		return mins.x <= p.x && mins.y <= p.y
		&& maxs.x >= p.x && maxs.y >= p.y;
	}

	// random pos inside these bounds
	function RandomPosition() : Vector2 {
		return Vector2(
				Mathf.Lerp(mins.x, maxs.x, Random.value), 
				Mathf.Lerp(mins.y, maxs.y, Random.value) );
	}

	function WrapPosition(p:Vector2) : Vector2 
	{
		if( p.x < mins.x ) p.x = maxs.x;
		else if( p.x > maxs.x ) p.x = mins.x;

		if( p.y < mins.y ) p.y = maxs.y;
		else if( p.y > maxs.y ) p.y = mins.y;

		return p;
	}
}


//----------------------------------------
//  a0/1, b0/1 specify two points on INFINITE lines.
//----------------------------------------
static function Intersect2DLines( s0:Vector2, e0:Vector2, s1:Vector2, e1:Vector2 )
	: Vector2
{
	var si0 = SlopeIntercept( s0, e0 );
	var si1 = SlopeIntercept( s1, e1 );
	var m0 = si0.x; var b0 = si0.y;
	var m1 = si1.x; var b1 = si1.y;

	Utils.Assert( (m0 != Mathf.Infinity) || (m1 != Mathf.Infinity),
		'Both lines are vertical! They never intersect!');
	Utils.Assert( (m0 != 0) || (m1 != 0),
		'Both lines are horizontal! They never intersect!');

	if( m0 == Mathf.Infinity ) {
		return Vector2( s0.x, m1*s0.x+b1 );
	}
	else if( m1 == Mathf.Infinity ) {
		return Vector2( s1.x, m0*s1.x+b0 );
	}
	else {
		var x = (b1-b0) / (m0-m1);
		var y = m0*x + b0;
		return Vector2(x,y);
	}
}

static function SlopeIntercept( s:Vector2, e:Vector2 ) : Vector2
{
	var dx = e.x - s.x;
	var dy = e.y - s.y;
	if( Mathf.Abs(dx) < 1e-6 )
		return Vector2( Mathf.Infinity, Mathf.Infinity );
	var m = dy/dx;
	var b = s.y - m*s.x;
	return Vector2( m, b );
}

//----------------------------------------
//  Returns the Y coordinate of when line (s,e) intersects the X=x vertical line
//----------------------------------------
static function EvalLineAtX( s:Vector2, e:Vector2, x:float ) : float
{
	var r = e-s;
	var t = (x - s.x) / r.x;
	return s.y + t*r.y;
}

//----------------------------------------
//  Returns false if they're perfectly co-linear
//----------------------------------------
static function IsRightOfLine( pt:Vector2, a:Vector2, b:Vector2 ) : boolean
{
	var dir = b - a;
	var toRight = -1 * PerpCCW( dir );
	var toPt = pt - a;
	return Vector2.Dot( toPt, toRight ) > 0;
}

//----------------------------------------
//  Returns false if they're perfectly co-linear
//----------------------------------------
static function IsLeftOfLine( pt:Vector2, a:Vector2, b:Vector2 ) : boolean
{
	var dir = b - a;
	var toLeft = PerpCCW( dir );
	var toPt = pt - a;
	return Vector2.Dot( toPt, toLeft ) > 0;
}
