(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/pim/ZifZaf/webgl-fiddling/steve.js/index.js":[function(require,module,exports){
Steve = require('./lib/steve.js');
},{"./lib/steve.js":"/Users/pim/ZifZaf/webgl-fiddling/steve.js/lib/steve.js"}],"/Users/pim/ZifZaf/webgl-fiddling/steve.js/lib/steve.js":[function(require,module,exports){
(function (global){
"use strict";

var THREE = (typeof window !== "undefined" ? window.THREE : typeof global !== "undefined" ? global.THREE : null);
var TWEEN = require('tween.js');

function Steve(skin) {
    THREE.Object3D.call(this);

    this.skin = skin;
    this.skin.subdata = function (left, top, right, bottom) {
        var width = right - left,
            height = bottom - top;

        var data = new Uint8Array(width * height * 4);

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width * 4; j++) { // red, green, blue, alpha
                data[i  * width * 4 + j] = skin.data[(i + top) * skin.width * 4 + left * 4 + j];
            }
        }

        return data;
    };

    this.torso = this.set_torso(this.skin);
    this.head = this.set_head(this.skin);
    this.left_arm = this.set_left_arm(this.skin);
    this.right_arm = this.set_right_arm(this.skin);
    this.left_leg = this.set_left_leg(this.skin);
    this.right_leg = this.set_right_leg(this.skin);

    this.add(this.torso);
}

Steve.prototype = Object.create(THREE.Object3D.prototype);

Steve.prototype.set_torso = function(skin) {
    var torso_texture = [
        new THREE.DataTexture(skin.subdata(28,  20, 32, 32), 4, 12),  // left
        new THREE.DataTexture(skin.subdata(16,  20, 20, 32), 4, 12),  // rigth
        new THREE.DataTexture(skin.subdata(20,  16, 28, 20), 8,  4),  // top
        new THREE.DataTexture(skin.subdata(28,  16, 36, 20), 8,  4),  // bottom
        new THREE.DataTexture(skin.subdata(20,  20, 28, 32), 8, 12),  // front
        new THREE.DataTexture(skin.subdata(32,  20, 40, 32), 8, 12)   // back
    ];

    var torso_material = torso_texture.map( function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent:true, "map": texture });
    });

    var torso = new THREE.Mesh(new THREE.BoxGeometry(8, 12, 4, 8, 12, 4),
        new THREE.MeshFaceMaterial(torso_material));

    return torso;
};

Steve.prototype.set_head = function(skin) {
    var head_texture = [
        new THREE.DataTexture(skin.subdata(16,  8, 24, 16), 8, 8),   // left
        new THREE.DataTexture(skin.subdata( 0,  8,  8, 16), 8, 8),   // rigth
        new THREE.DataTexture(skin.subdata( 8,  0, 16,  8), 8, 8),   // top
        new THREE.DataTexture(skin.subdata(16,  0, 24,  8), 8, 8),   // bottom
        new THREE.DataTexture(skin.subdata( 8,  8, 16, 16), 8, 8),   // front
        new THREE.DataTexture(skin.subdata(24,  8, 32, 16), 8, 8)    // back
    ];

    var head_material = head_texture.map( function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent:true, "map": texture });
    });

    var _head = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 8, 8, 8, 8),
        new THREE.MeshFaceMaterial(head_material));

    var hat_texture = [
        new THREE.DataTexture(skin.subdata(48,  8, 56, 16), 8, 8),   // left
        new THREE.DataTexture(skin.subdata(32,  8, 40, 16), 8, 8),   // rigth
        new THREE.DataTexture(skin.subdata(40,  0, 48,  8), 8, 8),   // top
        new THREE.DataTexture(skin.subdata(48,  0, 56,  8), 8, 8),   // bottom
        new THREE.DataTexture(skin.subdata(40,  8, 48, 16), 8, 8),   // front
        new THREE.DataTexture(skin.subdata(56,  8, 64, 16), 8, 8)    // back
    ];

    var hat_material = hat_texture.map( function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent:true, "map": texture });
    });

    var _hat = new THREE.Mesh(new THREE.BoxGeometry(9, 8, 9, 9, 8, 9),
        new THREE.MeshFaceMaterial(hat_material));

    var head = new THREE.Object3D();
    head.add(_head);
    //head.add(_hat);

    head.position.y += 10;
    this.torso.add(head);

    return head;
};

Steve.prototype.set_left_arm = function(skin) {
    var arm_texture = [
        new THREE.DataTexture(skin.subdata(48, 20, 52, 32), 4, 12),  // left
        new THREE.DataTexture(skin.subdata(40, 20, 44, 32), 4, 12),  // rigth
        new THREE.DataTexture(skin.subdata(44, 16, 48, 20), 4,  4),   // top
        new THREE.DataTexture(skin.subdata(48, 16, 52, 20), 4,  4),   // bottom
        new THREE.DataTexture(skin.subdata(44, 20, 48, 32), 4, 12),   // front
        new THREE.DataTexture(skin.subdata(52, 20, 56, 32), 4, 12)    // back
    ];

    var arm_material = arm_texture.map( function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent:true, "map": texture });
    });

    var _arm = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4, 4, 12, 4),
        new THREE.MeshFaceMaterial(arm_material));
    _arm.position.y = -4;

    var arm = new THREE.Object3D();
    arm.add(_arm);
    arm.position.x += 6;
    arm.position.y += 4;
    this.torso.add(arm);

    return arm;
};

Steve.prototype.set_right_arm = function(skin) {
    var arm_texture = [
        new THREE.DataTexture(skin.subdata(48, 20, 52, 32), 4, 12),  // left
        new THREE.DataTexture(skin.subdata(40, 20, 44, 32), 4, 12),  // rigth
        new THREE.DataTexture(skin.subdata(44, 16, 48, 20), 4,  4),   // top
        new THREE.DataTexture(skin.subdata(48, 16, 52, 20), 4,  4),   // bottom
        new THREE.DataTexture(skin.subdata(44, 20, 48, 32), 4, 12),   // front
        new THREE.DataTexture(skin.subdata(52, 20, 56, 32), 4, 12)    // back
    ];

    var arm_material = arm_texture.map( function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent:true, "map": texture });
    });

    var _arm = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4, 4, 12, 4),
        new THREE.MeshFaceMaterial(arm_material));
    _arm.position.y = -4;

    var arm = new THREE.Object3D();
    arm.add(_arm);
    arm.position.x += -6;
    arm.position.y += 4;
    this.torso.add(arm);

    return arm;
};

Steve.prototype.set_left_leg = function(skin) {
    var leg_texture = [
        new THREE.DataTexture(skin.subdata( 8, 20, 12, 32), 4, 12),  // left
        new THREE.DataTexture(skin.subdata( 0, 20,  4, 32), 4, 12),  // rigth
        new THREE.DataTexture(skin.subdata( 4, 16,  8, 20), 4,  4),   // top
        new THREE.DataTexture(skin.subdata( 8, 16, 12, 20), 4,  4),   // bottom
        new THREE.DataTexture(skin.subdata( 4, 20,  8, 32), 4, 12),   // front
        new THREE.DataTexture(skin.subdata(12, 20, 16, 32), 4, 12)    // back
    ];

    var leg_material = leg_texture.map( function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent:true, "map": texture });
    });

    var _leg = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4, 4, 12, 4),
        new THREE.MeshFaceMaterial(leg_material));
    _leg.position.y = -4;

    // left leg
    var leg = new THREE.Object3D();
    leg.add(_leg);
    leg.position.x += 2;
    leg.position.y += -8;
    this.torso.add(leg);

    return leg;
};

Steve.prototype.set_right_leg = function(skin) {
    var leg_texture = [
        new THREE.DataTexture(skin.subdata( 8, 20, 12, 32), 4, 12),  // left
        new THREE.DataTexture(skin.subdata( 0, 20,  4, 32), 4, 12),  // rigth
        new THREE.DataTexture(skin.subdata( 4, 16,  8, 20), 4,  4),   // top
        new THREE.DataTexture(skin.subdata( 8, 16, 12, 20), 4,  4),   // bottom
        new THREE.DataTexture(skin.subdata( 4, 20,  8, 32), 4, 12),   // front
        new THREE.DataTexture(skin.subdata(12, 20, 16, 32), 4, 12)    // back
    ];

    var leg_material = leg_texture.map( function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent:true, "map": texture });
    });

    var _leg = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4, 4, 12, 4),
        new THREE.MeshFaceMaterial(leg_material));
    _leg.position.y = -4;

    // left leg
    var leg = new THREE.Object3D();
    leg.add(_leg.clone());
    leg.position.x += -2;
    leg.position.y += -8;
    this.torso.add(leg);

    return leg;
};


Steve.prototype.do_pose = function(pose) {
    if (typeof pose.head !== 'undefined') {
        this.head.rotation.x = pose.head.x;
        this.head.rotation.y = pose.head.y;
        this.head.rotation.z = pose.head.z;
    }

    if (typeof pose.torso !== 'undefined') {
        this.torso.rotation.x = pose.torso.x;
        this.torso.rotation.y = pose.torso.y;
        this.torso.rotation.z = pose.torso.z;
    }

    if (typeof pose.left_arm !== 'undefined') {
        this.left_arm.rotation.x = pose.left_arm.x;
        this.left_arm.rotation.y = pose.left_arm.y;
        this.left_arm.rotation.z = pose.left_arm.z;
    }

    if (typeof pose.right_arm !== 'undefined') {
        this.right_arm.rotation.x = pose.right_arm.x;
        this.right_arm.rotation.y = pose.right_arm.y;
        this.right_arm.rotation.z = pose.right_arm.z;
    }

    if (typeof pose.left_leg !== 'undefined') {
        this.left_leg.rotation.x = pose.left_leg.x;
        this.left_leg.rotation.y = pose.left_leg.y;
        this.left_leg.rotation.z = pose.left_leg.z;
    }

    if (typeof pose.right_leg !== 'undefined') {
        this.right_leg.rotation.x = pose.right_leg.x;
        this.right_leg.rotation.y = pose.right_leg.y;
        this.right_leg.rotation.z = pose.right_leg.z;
    }
};

Steve.NEUTRAL_POSE = {
    'head':         { 'x': 0,   'y': 0,  'z': 0 },
    'torso':        { 'x': 0,   'y': 0,  'z': 0 },
    'left_arm':     { 'x': 0,   'y': 0,  'z': 0 },
    'right_arm':    { 'x': 0,   'y': 0,  'z': 0 },
    'left_leg':     { 'x': 0,   'y': 0,  'z': 0 },
    'right_leg':    { 'x': 0,   'y': 0,  'z': 0 }
};

Steve.HI_POSE = {
    'head':         { 'x': -15 * 0.0175,   'y': 15 * 0.0175,  'z': 0 },
    'torso':        { 'x': 0,              'y': 0,            'z': 0 },
    'left_arm':     { 'x': 180 * 0.0175,   'y': 0,            'z': 0 },
    'right_arm':    { 'x': 180 * 0.0175,   'y': 0,            'z': 0 },
    'left_leg':     { 'x': 0,              'y': 0,            'z': 0 },
    'right_leg':    { 'x': -45 * 0.0175,   'y': 0,            'z': 0 }
};

Steve.WALK_POSE = {
    'head':         { 'x':  0,              'y': 15 * 0.0175,   'z': 0 },
    'torso':        { 'x':  0,              'y': 0,             'z': 0 },
    'left_arm':     { 'x':  45 * 0.0175,    'y': 0,             'z': 0 },
    'right_arm':    { 'x': -45 * 0.0175,    'y': 0,             'z': 0 },
    'left_leg':     { 'x': -45 * 0.0175,    'y': 0,             'z': 0 },
    'right_leg':    { 'x':  45 * 0.0175,    'y': 0,             'z': 0 }
};

Steve.PARADE_POSE = {
    'head':         { 'x': 0,               'y': 0,  'z': 0 },
    'torso':        { 'x': 0,               'y': 0,  'z': 0 },
    'left_arm':     { 'x': 0,               'y': 0,  'z': -90 * 0.0175 },
    'right_arm':    { 'x': 90 * 0.0175,     'y': 0,  'z': 0 },
    'left_leg':     { 'x': 0,               'y': 0,  'z': 0 },
    'right_leg':    { 'x': -90 * 0.0175,    'y': 0,  'z': 0 }
};

module.exports = Steve;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"tween.js":"/Users/pim/ZifZaf/webgl-fiddling/steve.js/node_modules/tween.js/index.js"}],"/Users/pim/ZifZaf/webgl-fiddling/steve.js/node_modules/tween.js/index.js":[function(require,module,exports){
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/sole/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Date.now shim for (ahem) Internet Explo(d|r)er
if ( Date.now === undefined ) {

	Date.now = function () {

		return new Date().valueOf();

	};

}

var TWEEN = TWEEN || ( function () {

	var _tweens = [];

	return {

		REVISION: '14',

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function ( tween ) {

			_tweens.push( tween );

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			if ( _tweens.length === 0 ) return false;

			var i = 0;

			time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

			while ( i < _tweens.length ) {

				if ( _tweens[ i ].update( time ) ) {

					i++;

				} else {

					_tweens.splice( i, 1 );

				}

			}

			return true;

		}
	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {

		_valuesStart[ field ] = parseFloat(object[field], 10);

	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {

			_duration = duration;

		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

			}

			_valuesStart[ property ] = _object[ property ];

			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

		}

		return this;

	};

	this.stop = function () {

		if ( !_isPlaying ) {
			return this;
		}

		TWEEN.remove( this );
		_isPlaying = false;

		if ( _onStopCallback !== null ) {

			_onStopCallback.call( _object );

		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

			_chainedTweens[ i ].stop();

		}

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function ( times ) {

		_repeat = times;
		return this;

	};

	this.yoyo = function( yoyo ) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function ( callback ) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function ( callback ) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function ( callback ) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function ( callback ) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function ( time ) {

		var property;

		if ( time < _startTime ) {

			return true;

		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {

				_onStartCallback.call( _object );

			}

			_onStartCallbackFired = true;

		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				_object[ property ] = _interpolationFunction( end, value );

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				// protect against non numeric properties.
				if ( typeof(end) === "number" ) {
					_object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _repeat > 0 ) {

				if( isFinite( _repeat ) ) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for( property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[ property ];
						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object );

				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

					_chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function ( k ) {

			return k;

		}

	},

	Quadratic: {

		In: function ( k ) {

			return k * k;

		},

		Out: function ( k ) {

			return k * ( 2 - k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In: function ( k ) {

			return k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In: function ( k ) {

			return k * k * k * k;

		},

		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In: function ( k ) {

			return k * k * k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

	Circular: {

		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

	Back: {

		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In: function ( k ) {

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

		},

		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		InOut: function ( k ) {

			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier: function ( v, k ) {

		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear: function ( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein: function ( n , i ) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( function () {

			var a = [ 1 ];

			return function ( n ) {

				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;

			};

		} )(),

		CatmullRom: function ( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

};

module.exports=TWEEN;
},{}]},{},["/Users/pim/ZifZaf/webgl-fiddling/steve.js/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3BpbS9aaWZaYWYvd2ViZ2wtZmlkZGxpbmcvc3RldmUuanMvaW5kZXguanMiLCIvVXNlcnMvcGltL1ppZlphZi93ZWJnbC1maWRkbGluZy9zdGV2ZS5qcy9saWIvc3RldmUuanMiLCIvVXNlcnMvcGltL1ppZlphZi93ZWJnbC1maWRkbGluZy9zdGV2ZS5qcy9ub2RlX21vZHVsZXMvdHdlZW4uanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlN0ZXZlID0gcmVxdWlyZSgnLi9saWIvc3RldmUuanMnKTsiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVEhSRUUgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRIUkVFIDogbnVsbCk7XG52YXIgVFdFRU4gPSByZXF1aXJlKCd0d2Vlbi5qcycpO1xuXG5mdW5jdGlvbiBTdGV2ZShza2luKSB7XG4gICAgVEhSRUUuT2JqZWN0M0QuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuc2tpbiA9IHNraW47XG4gICAgdGhpcy5za2luLnN1YmRhdGEgPSBmdW5jdGlvbiAobGVmdCwgdG9wLCByaWdodCwgYm90dG9tKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IHJpZ2h0IC0gbGVmdCxcbiAgICAgICAgICAgIGhlaWdodCA9IGJvdHRvbSAtIHRvcDtcblxuICAgICAgICB2YXIgZGF0YSA9IG5ldyBVaW50OEFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB3aWR0aCAqIDQ7IGorKykgeyAvLyByZWQsIGdyZWVuLCBibHVlLCBhbHBoYVxuICAgICAgICAgICAgICAgIGRhdGFbaSAgKiB3aWR0aCAqIDQgKyBqXSA9IHNraW4uZGF0YVsoaSArIHRvcCkgKiBza2luLndpZHRoICogNCArIGxlZnQgKiA0ICsgal07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9O1xuXG4gICAgdGhpcy50b3JzbyA9IHRoaXMuc2V0X3RvcnNvKHRoaXMuc2tpbik7XG4gICAgdGhpcy5oZWFkID0gdGhpcy5zZXRfaGVhZCh0aGlzLnNraW4pO1xuICAgIHRoaXMubGVmdF9hcm0gPSB0aGlzLnNldF9sZWZ0X2FybSh0aGlzLnNraW4pO1xuICAgIHRoaXMucmlnaHRfYXJtID0gdGhpcy5zZXRfcmlnaHRfYXJtKHRoaXMuc2tpbik7XG4gICAgdGhpcy5sZWZ0X2xlZyA9IHRoaXMuc2V0X2xlZnRfbGVnKHRoaXMuc2tpbik7XG4gICAgdGhpcy5yaWdodF9sZWcgPSB0aGlzLnNldF9yaWdodF9sZWcodGhpcy5za2luKTtcblxuICAgIHRoaXMuYWRkKHRoaXMudG9yc28pO1xufVxuXG5TdGV2ZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRIUkVFLk9iamVjdDNELnByb3RvdHlwZSk7XG5cblN0ZXZlLnByb3RvdHlwZS5zZXRfdG9yc28gPSBmdW5jdGlvbihza2luKSB7XG4gICAgdmFyIHRvcnNvX3RleHR1cmUgPSBbXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoMjgsICAyMCwgMzIsIDMyKSwgNCwgMTIpLCAgLy8gbGVmdFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDE2LCAgMjAsIDIwLCAzMiksIDQsIDEyKSwgIC8vIHJpZ3RoXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoMjAsICAxNiwgMjgsIDIwKSwgOCwgIDQpLCAgLy8gdG9wXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoMjgsICAxNiwgMzYsIDIwKSwgOCwgIDQpLCAgLy8gYm90dG9tXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoMjAsICAyMCwgMjgsIDMyKSwgOCwgMTIpLCAgLy8gZnJvbnRcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSgzMiwgIDIwLCA0MCwgMzIpLCA4LCAxMikgICAvLyBiYWNrXG4gICAgXTtcblxuICAgIHZhciB0b3Jzb19tYXRlcmlhbCA9IHRvcnNvX3RleHR1cmUubWFwKCBmdW5jdGlvbiAodGV4dHVyZSkge1xuICAgICAgICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XG4gICAgICAgIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IHRyYW5zcGFyZW50OnRydWUsIFwibWFwXCI6IHRleHR1cmUgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgdG9yc28gPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQm94R2VvbWV0cnkoOCwgMTIsIDQsIDgsIDEyLCA0KSxcbiAgICAgICAgbmV3IFRIUkVFLk1lc2hGYWNlTWF0ZXJpYWwodG9yc29fbWF0ZXJpYWwpKTtcblxuICAgIHJldHVybiB0b3Jzbztcbn07XG5cblN0ZXZlLnByb3RvdHlwZS5zZXRfaGVhZCA9IGZ1bmN0aW9uKHNraW4pIHtcbiAgICB2YXIgaGVhZF90ZXh0dXJlID0gW1xuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDE2LCAgOCwgMjQsIDE2KSwgOCwgOCksICAgLy8gbGVmdFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKCAwLCAgOCwgIDgsIDE2KSwgOCwgOCksICAgLy8gcmlndGhcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSggOCwgIDAsIDE2LCAgOCksIDgsIDgpLCAgIC8vIHRvcFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDE2LCAgMCwgMjQsICA4KSwgOCwgOCksICAgLy8gYm90dG9tXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoIDgsICA4LCAxNiwgMTYpLCA4LCA4KSwgICAvLyBmcm9udFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDI0LCAgOCwgMzIsIDE2KSwgOCwgOCkgICAgLy8gYmFja1xuICAgIF07XG5cbiAgICB2YXIgaGVhZF9tYXRlcmlhbCA9IGhlYWRfdGV4dHVyZS5tYXAoIGZ1bmN0aW9uICh0ZXh0dXJlKSB7XG4gICAgICAgIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgICAgICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgdHJhbnNwYXJlbnQ6dHJ1ZSwgXCJtYXBcIjogdGV4dHVyZSB9KTtcbiAgICB9KTtcblxuICAgIHZhciBfaGVhZCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg4LCA4LCA4LCA4LCA4LCA4KSxcbiAgICAgICAgbmV3IFRIUkVFLk1lc2hGYWNlTWF0ZXJpYWwoaGVhZF9tYXRlcmlhbCkpO1xuXG4gICAgdmFyIGhhdF90ZXh0dXJlID0gW1xuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDQ4LCAgOCwgNTYsIDE2KSwgOCwgOCksICAgLy8gbGVmdFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDMyLCAgOCwgNDAsIDE2KSwgOCwgOCksICAgLy8gcmlndGhcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSg0MCwgIDAsIDQ4LCAgOCksIDgsIDgpLCAgIC8vIHRvcFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDQ4LCAgMCwgNTYsICA4KSwgOCwgOCksICAgLy8gYm90dG9tXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoNDAsICA4LCA0OCwgMTYpLCA4LCA4KSwgICAvLyBmcm9udFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDU2LCAgOCwgNjQsIDE2KSwgOCwgOCkgICAgLy8gYmFja1xuICAgIF07XG5cbiAgICB2YXIgaGF0X21hdGVyaWFsID0gaGF0X3RleHR1cmUubWFwKCBmdW5jdGlvbiAodGV4dHVyZSkge1xuICAgICAgICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XG4gICAgICAgIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IHRyYW5zcGFyZW50OnRydWUsIFwibWFwXCI6IHRleHR1cmUgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgX2hhdCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg5LCA4LCA5LCA5LCA4LCA5KSxcbiAgICAgICAgbmV3IFRIUkVFLk1lc2hGYWNlTWF0ZXJpYWwoaGF0X21hdGVyaWFsKSk7XG5cbiAgICB2YXIgaGVhZCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgIGhlYWQuYWRkKF9oZWFkKTtcbiAgICAvL2hlYWQuYWRkKF9oYXQpO1xuXG4gICAgaGVhZC5wb3NpdGlvbi55ICs9IDEwO1xuICAgIHRoaXMudG9yc28uYWRkKGhlYWQpO1xuXG4gICAgcmV0dXJuIGhlYWQ7XG59O1xuXG5TdGV2ZS5wcm90b3R5cGUuc2V0X2xlZnRfYXJtID0gZnVuY3Rpb24oc2tpbikge1xuICAgIHZhciBhcm1fdGV4dHVyZSA9IFtcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSg0OCwgMjAsIDUyLCAzMiksIDQsIDEyKSwgIC8vIGxlZnRcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSg0MCwgMjAsIDQ0LCAzMiksIDQsIDEyKSwgIC8vIHJpZ3RoXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoNDQsIDE2LCA0OCwgMjApLCA0LCAgNCksICAgLy8gdG9wXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoNDgsIDE2LCA1MiwgMjApLCA0LCAgNCksICAgLy8gYm90dG9tXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoNDQsIDIwLCA0OCwgMzIpLCA0LCAxMiksICAgLy8gZnJvbnRcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSg1MiwgMjAsIDU2LCAzMiksIDQsIDEyKSAgICAvLyBiYWNrXG4gICAgXTtcblxuICAgIHZhciBhcm1fbWF0ZXJpYWwgPSBhcm1fdGV4dHVyZS5tYXAoIGZ1bmN0aW9uICh0ZXh0dXJlKSB7XG4gICAgICAgIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgICAgICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgdHJhbnNwYXJlbnQ6dHJ1ZSwgXCJtYXBcIjogdGV4dHVyZSB9KTtcbiAgICB9KTtcblxuICAgIHZhciBfYXJtID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KDQsIDEyLCA0LCA0LCAxMiwgNCksXG4gICAgICAgIG5ldyBUSFJFRS5NZXNoRmFjZU1hdGVyaWFsKGFybV9tYXRlcmlhbCkpO1xuICAgIF9hcm0ucG9zaXRpb24ueSA9IC00O1xuXG4gICAgdmFyIGFybSA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgIGFybS5hZGQoX2FybSk7XG4gICAgYXJtLnBvc2l0aW9uLnggKz0gNjtcbiAgICBhcm0ucG9zaXRpb24ueSArPSA0O1xuICAgIHRoaXMudG9yc28uYWRkKGFybSk7XG5cbiAgICByZXR1cm4gYXJtO1xufTtcblxuU3RldmUucHJvdG90eXBlLnNldF9yaWdodF9hcm0gPSBmdW5jdGlvbihza2luKSB7XG4gICAgdmFyIGFybV90ZXh0dXJlID0gW1xuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDQ4LCAyMCwgNTIsIDMyKSwgNCwgMTIpLCAgLy8gbGVmdFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDQwLCAyMCwgNDQsIDMyKSwgNCwgMTIpLCAgLy8gcmlndGhcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSg0NCwgMTYsIDQ4LCAyMCksIDQsICA0KSwgICAvLyB0b3BcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSg0OCwgMTYsIDUyLCAyMCksIDQsICA0KSwgICAvLyBib3R0b21cbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSg0NCwgMjAsIDQ4LCAzMiksIDQsIDEyKSwgICAvLyBmcm9udFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKDUyLCAyMCwgNTYsIDMyKSwgNCwgMTIpICAgIC8vIGJhY2tcbiAgICBdO1xuXG4gICAgdmFyIGFybV9tYXRlcmlhbCA9IGFybV90ZXh0dXJlLm1hcCggZnVuY3Rpb24gKHRleHR1cmUpIHtcbiAgICAgICAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICAgICAgICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XG4gICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyB0cmFuc3BhcmVudDp0cnVlLCBcIm1hcFwiOiB0ZXh0dXJlIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIF9hcm0gPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQm94R2VvbWV0cnkoNCwgMTIsIDQsIDQsIDEyLCA0KSxcbiAgICAgICAgbmV3IFRIUkVFLk1lc2hGYWNlTWF0ZXJpYWwoYXJtX21hdGVyaWFsKSk7XG4gICAgX2FybS5wb3NpdGlvbi55ID0gLTQ7XG5cbiAgICB2YXIgYXJtID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgYXJtLmFkZChfYXJtKTtcbiAgICBhcm0ucG9zaXRpb24ueCArPSAtNjtcbiAgICBhcm0ucG9zaXRpb24ueSArPSA0O1xuICAgIHRoaXMudG9yc28uYWRkKGFybSk7XG5cbiAgICByZXR1cm4gYXJtO1xufTtcblxuU3RldmUucHJvdG90eXBlLnNldF9sZWZ0X2xlZyA9IGZ1bmN0aW9uKHNraW4pIHtcbiAgICB2YXIgbGVnX3RleHR1cmUgPSBbXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoIDgsIDIwLCAxMiwgMzIpLCA0LCAxMiksICAvLyBsZWZ0XG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoIDAsIDIwLCAgNCwgMzIpLCA0LCAxMiksICAvLyByaWd0aFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKCA0LCAxNiwgIDgsIDIwKSwgNCwgIDQpLCAgIC8vIHRvcFxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKCA4LCAxNiwgMTIsIDIwKSwgNCwgIDQpLCAgIC8vIGJvdHRvbVxuICAgICAgICBuZXcgVEhSRUUuRGF0YVRleHR1cmUoc2tpbi5zdWJkYXRhKCA0LCAyMCwgIDgsIDMyKSwgNCwgMTIpLCAgIC8vIGZyb250XG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoMTIsIDIwLCAxNiwgMzIpLCA0LCAxMikgICAgLy8gYmFja1xuICAgIF07XG5cbiAgICB2YXIgbGVnX21hdGVyaWFsID0gbGVnX3RleHR1cmUubWFwKCBmdW5jdGlvbiAodGV4dHVyZSkge1xuICAgICAgICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLk5lYXJlc3RGaWx0ZXI7XG4gICAgICAgIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IHRyYW5zcGFyZW50OnRydWUsIFwibWFwXCI6IHRleHR1cmUgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgX2xlZyA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg0LCAxMiwgNCwgNCwgMTIsIDQpLFxuICAgICAgICBuZXcgVEhSRUUuTWVzaEZhY2VNYXRlcmlhbChsZWdfbWF0ZXJpYWwpKTtcbiAgICBfbGVnLnBvc2l0aW9uLnkgPSAtNDtcblxuICAgIC8vIGxlZnQgbGVnXG4gICAgdmFyIGxlZyA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgIGxlZy5hZGQoX2xlZyk7XG4gICAgbGVnLnBvc2l0aW9uLnggKz0gMjtcbiAgICBsZWcucG9zaXRpb24ueSArPSAtODtcbiAgICB0aGlzLnRvcnNvLmFkZChsZWcpO1xuXG4gICAgcmV0dXJuIGxlZztcbn07XG5cblN0ZXZlLnByb3RvdHlwZS5zZXRfcmlnaHRfbGVnID0gZnVuY3Rpb24oc2tpbikge1xuICAgIHZhciBsZWdfdGV4dHVyZSA9IFtcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSggOCwgMjAsIDEyLCAzMiksIDQsIDEyKSwgIC8vIGxlZnRcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSggMCwgMjAsICA0LCAzMiksIDQsIDEyKSwgIC8vIHJpZ3RoXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoIDQsIDE2LCAgOCwgMjApLCA0LCAgNCksICAgLy8gdG9wXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoIDgsIDE2LCAxMiwgMjApLCA0LCAgNCksICAgLy8gYm90dG9tXG4gICAgICAgIG5ldyBUSFJFRS5EYXRhVGV4dHVyZShza2luLnN1YmRhdGEoIDQsIDIwLCAgOCwgMzIpLCA0LCAxMiksICAgLy8gZnJvbnRcbiAgICAgICAgbmV3IFRIUkVFLkRhdGFUZXh0dXJlKHNraW4uc3ViZGF0YSgxMiwgMjAsIDE2LCAzMiksIDQsIDEyKSAgICAvLyBiYWNrXG4gICAgXTtcblxuICAgIHZhciBsZWdfbWF0ZXJpYWwgPSBsZWdfdGV4dHVyZS5tYXAoIGZ1bmN0aW9uICh0ZXh0dXJlKSB7XG4gICAgICAgIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTmVhcmVzdEZpbHRlcjtcbiAgICAgICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgdHJhbnNwYXJlbnQ6dHJ1ZSwgXCJtYXBcIjogdGV4dHVyZSB9KTtcbiAgICB9KTtcblxuICAgIHZhciBfbGVnID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KDQsIDEyLCA0LCA0LCAxMiwgNCksXG4gICAgICAgIG5ldyBUSFJFRS5NZXNoRmFjZU1hdGVyaWFsKGxlZ19tYXRlcmlhbCkpO1xuICAgIF9sZWcucG9zaXRpb24ueSA9IC00O1xuXG4gICAgLy8gbGVmdCBsZWdcbiAgICB2YXIgbGVnID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgbGVnLmFkZChfbGVnLmNsb25lKCkpO1xuICAgIGxlZy5wb3NpdGlvbi54ICs9IC0yO1xuICAgIGxlZy5wb3NpdGlvbi55ICs9IC04O1xuICAgIHRoaXMudG9yc28uYWRkKGxlZyk7XG5cbiAgICByZXR1cm4gbGVnO1xufTtcblxuXG5TdGV2ZS5wcm90b3R5cGUuZG9fcG9zZSA9IGZ1bmN0aW9uKHBvc2UpIHtcbiAgICBpZiAodHlwZW9mIHBvc2UuaGVhZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5oZWFkLnJvdGF0aW9uLnggPSBwb3NlLmhlYWQueDtcbiAgICAgICAgdGhpcy5oZWFkLnJvdGF0aW9uLnkgPSBwb3NlLmhlYWQueTtcbiAgICAgICAgdGhpcy5oZWFkLnJvdGF0aW9uLnogPSBwb3NlLmhlYWQuejtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBvc2UudG9yc28gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMudG9yc28ucm90YXRpb24ueCA9IHBvc2UudG9yc28ueDtcbiAgICAgICAgdGhpcy50b3Jzby5yb3RhdGlvbi55ID0gcG9zZS50b3Jzby55O1xuICAgICAgICB0aGlzLnRvcnNvLnJvdGF0aW9uLnogPSBwb3NlLnRvcnNvLno7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwb3NlLmxlZnRfYXJtICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLmxlZnRfYXJtLnJvdGF0aW9uLnggPSBwb3NlLmxlZnRfYXJtLng7XG4gICAgICAgIHRoaXMubGVmdF9hcm0ucm90YXRpb24ueSA9IHBvc2UubGVmdF9hcm0ueTtcbiAgICAgICAgdGhpcy5sZWZ0X2FybS5yb3RhdGlvbi56ID0gcG9zZS5sZWZ0X2FybS56O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcG9zZS5yaWdodF9hcm0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMucmlnaHRfYXJtLnJvdGF0aW9uLnggPSBwb3NlLnJpZ2h0X2FybS54O1xuICAgICAgICB0aGlzLnJpZ2h0X2FybS5yb3RhdGlvbi55ID0gcG9zZS5yaWdodF9hcm0ueTtcbiAgICAgICAgdGhpcy5yaWdodF9hcm0ucm90YXRpb24ueiA9IHBvc2UucmlnaHRfYXJtLno7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwb3NlLmxlZnRfbGVnICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLmxlZnRfbGVnLnJvdGF0aW9uLnggPSBwb3NlLmxlZnRfbGVnLng7XG4gICAgICAgIHRoaXMubGVmdF9sZWcucm90YXRpb24ueSA9IHBvc2UubGVmdF9sZWcueTtcbiAgICAgICAgdGhpcy5sZWZ0X2xlZy5yb3RhdGlvbi56ID0gcG9zZS5sZWZ0X2xlZy56O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcG9zZS5yaWdodF9sZWcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMucmlnaHRfbGVnLnJvdGF0aW9uLnggPSBwb3NlLnJpZ2h0X2xlZy54O1xuICAgICAgICB0aGlzLnJpZ2h0X2xlZy5yb3RhdGlvbi55ID0gcG9zZS5yaWdodF9sZWcueTtcbiAgICAgICAgdGhpcy5yaWdodF9sZWcucm90YXRpb24ueiA9IHBvc2UucmlnaHRfbGVnLno7XG4gICAgfVxufTtcblxuU3RldmUuTkVVVFJBTF9QT1NFID0ge1xuICAgICdoZWFkJzogICAgICAgICB7ICd4JzogMCwgICAneSc6IDAsICAneic6IDAgfSxcbiAgICAndG9yc28nOiAgICAgICAgeyAneCc6IDAsICAgJ3knOiAwLCAgJ3onOiAwIH0sXG4gICAgJ2xlZnRfYXJtJzogICAgIHsgJ3gnOiAwLCAgICd5JzogMCwgICd6JzogMCB9LFxuICAgICdyaWdodF9hcm0nOiAgICB7ICd4JzogMCwgICAneSc6IDAsICAneic6IDAgfSxcbiAgICAnbGVmdF9sZWcnOiAgICAgeyAneCc6IDAsICAgJ3knOiAwLCAgJ3onOiAwIH0sXG4gICAgJ3JpZ2h0X2xlZyc6ICAgIHsgJ3gnOiAwLCAgICd5JzogMCwgICd6JzogMCB9XG59O1xuXG5TdGV2ZS5ISV9QT1NFID0ge1xuICAgICdoZWFkJzogICAgICAgICB7ICd4JzogLTE1ICogMC4wMTc1LCAgICd5JzogMTUgKiAwLjAxNzUsICAneic6IDAgfSxcbiAgICAndG9yc28nOiAgICAgICAgeyAneCc6IDAsICAgICAgICAgICAgICAneSc6IDAsICAgICAgICAgICAgJ3onOiAwIH0sXG4gICAgJ2xlZnRfYXJtJzogICAgIHsgJ3gnOiAxODAgKiAwLjAxNzUsICAgJ3knOiAwLCAgICAgICAgICAgICd6JzogMCB9LFxuICAgICdyaWdodF9hcm0nOiAgICB7ICd4JzogMTgwICogMC4wMTc1LCAgICd5JzogMCwgICAgICAgICAgICAneic6IDAgfSxcbiAgICAnbGVmdF9sZWcnOiAgICAgeyAneCc6IDAsICAgICAgICAgICAgICAneSc6IDAsICAgICAgICAgICAgJ3onOiAwIH0sXG4gICAgJ3JpZ2h0X2xlZyc6ICAgIHsgJ3gnOiAtNDUgKiAwLjAxNzUsICAgJ3knOiAwLCAgICAgICAgICAgICd6JzogMCB9XG59O1xuXG5TdGV2ZS5XQUxLX1BPU0UgPSB7XG4gICAgJ2hlYWQnOiAgICAgICAgIHsgJ3gnOiAgMCwgICAgICAgICAgICAgICd5JzogMTUgKiAwLjAxNzUsICAgJ3onOiAwIH0sXG4gICAgJ3RvcnNvJzogICAgICAgIHsgJ3gnOiAgMCwgICAgICAgICAgICAgICd5JzogMCwgICAgICAgICAgICAgJ3onOiAwIH0sXG4gICAgJ2xlZnRfYXJtJzogICAgIHsgJ3gnOiAgNDUgKiAwLjAxNzUsICAgICd5JzogMCwgICAgICAgICAgICAgJ3onOiAwIH0sXG4gICAgJ3JpZ2h0X2FybSc6ICAgIHsgJ3gnOiAtNDUgKiAwLjAxNzUsICAgICd5JzogMCwgICAgICAgICAgICAgJ3onOiAwIH0sXG4gICAgJ2xlZnRfbGVnJzogICAgIHsgJ3gnOiAtNDUgKiAwLjAxNzUsICAgICd5JzogMCwgICAgICAgICAgICAgJ3onOiAwIH0sXG4gICAgJ3JpZ2h0X2xlZyc6ICAgIHsgJ3gnOiAgNDUgKiAwLjAxNzUsICAgICd5JzogMCwgICAgICAgICAgICAgJ3onOiAwIH1cbn07XG5cblN0ZXZlLlBBUkFERV9QT1NFID0ge1xuICAgICdoZWFkJzogICAgICAgICB7ICd4JzogMCwgICAgICAgICAgICAgICAneSc6IDAsICAneic6IDAgfSxcbiAgICAndG9yc28nOiAgICAgICAgeyAneCc6IDAsICAgICAgICAgICAgICAgJ3knOiAwLCAgJ3onOiAwIH0sXG4gICAgJ2xlZnRfYXJtJzogICAgIHsgJ3gnOiAwLCAgICAgICAgICAgICAgICd5JzogMCwgICd6JzogLTkwICogMC4wMTc1IH0sXG4gICAgJ3JpZ2h0X2FybSc6ICAgIHsgJ3gnOiA5MCAqIDAuMDE3NSwgICAgICd5JzogMCwgICd6JzogMCB9LFxuICAgICdsZWZ0X2xlZyc6ICAgICB7ICd4JzogMCwgICAgICAgICAgICAgICAneSc6IDAsICAneic6IDAgfSxcbiAgICAncmlnaHRfbGVnJzogICAgeyAneCc6IC05MCAqIDAuMDE3NSwgICAgJ3knOiAwLCAgJ3onOiAwIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RldmU7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIvKipcbiAqIFR3ZWVuLmpzIC0gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vc29sZS90d2Vlbi5qc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vc29sZS90d2Vlbi5qcy9ncmFwaHMvY29udHJpYnV0b3JzIGZvciB0aGUgZnVsbCBsaXN0IG9mIGNvbnRyaWJ1dG9ycy5cbiAqIFRoYW5rIHlvdSBhbGwsIHlvdSdyZSBhd2Vzb21lIVxuICovXG5cbi8vIERhdGUubm93IHNoaW0gZm9yIChhaGVtKSBJbnRlcm5ldCBFeHBsbyhkfHIpZXJcbmlmICggRGF0ZS5ub3cgPT09IHVuZGVmaW5lZCApIHtcblxuXHREYXRlLm5vdyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcblxuXHR9O1xuXG59XG5cbnZhciBUV0VFTiA9IFRXRUVOIHx8ICggZnVuY3Rpb24gKCkge1xuXG5cdHZhciBfdHdlZW5zID0gW107XG5cblx0cmV0dXJuIHtcblxuXHRcdFJFVklTSU9OOiAnMTQnLFxuXG5cdFx0Z2V0QWxsOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHJldHVybiBfdHdlZW5zO1xuXG5cdFx0fSxcblxuXHRcdHJlbW92ZUFsbDogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRfdHdlZW5zID0gW107XG5cblx0XHR9LFxuXG5cdFx0YWRkOiBmdW5jdGlvbiAoIHR3ZWVuICkge1xuXG5cdFx0XHRfdHdlZW5zLnB1c2goIHR3ZWVuICk7XG5cblx0XHR9LFxuXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbiAoIHR3ZWVuICkge1xuXG5cdFx0XHR2YXIgaSA9IF90d2VlbnMuaW5kZXhPZiggdHdlZW4gKTtcblxuXHRcdFx0aWYgKCBpICE9PSAtMSApIHtcblxuXHRcdFx0XHRfdHdlZW5zLnNwbGljZSggaSwgMSApO1xuXG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0dXBkYXRlOiBmdW5jdGlvbiAoIHRpbWUgKSB7XG5cblx0XHRcdGlmICggX3R3ZWVucy5sZW5ndGggPT09IDAgKSByZXR1cm4gZmFsc2U7XG5cblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0dGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiAoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wZXJmb3JtYW5jZSAhPT0gdW5kZWZpbmVkICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgIT09IHVuZGVmaW5lZCA/IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSA6IERhdGUubm93KCkgKTtcblxuXHRcdFx0d2hpbGUgKCBpIDwgX3R3ZWVucy5sZW5ndGggKSB7XG5cblx0XHRcdFx0aWYgKCBfdHdlZW5zWyBpIF0udXBkYXRlKCB0aW1lICkgKSB7XG5cblx0XHRcdFx0XHRpKys7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdF90d2VlbnMuc3BsaWNlKCBpLCAxICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0fVxuXHR9O1xuXG59ICkoKTtcblxuVFdFRU4uVHdlZW4gPSBmdW5jdGlvbiAoIG9iamVjdCApIHtcblxuXHR2YXIgX29iamVjdCA9IG9iamVjdDtcblx0dmFyIF92YWx1ZXNTdGFydCA9IHt9O1xuXHR2YXIgX3ZhbHVlc0VuZCA9IHt9O1xuXHR2YXIgX3ZhbHVlc1N0YXJ0UmVwZWF0ID0ge307XG5cdHZhciBfZHVyYXRpb24gPSAxMDAwO1xuXHR2YXIgX3JlcGVhdCA9IDA7XG5cdHZhciBfeW95byA9IGZhbHNlO1xuXHR2YXIgX2lzUGxheWluZyA9IGZhbHNlO1xuXHR2YXIgX3JldmVyc2VkID0gZmFsc2U7XG5cdHZhciBfZGVsYXlUaW1lID0gMDtcblx0dmFyIF9zdGFydFRpbWUgPSBudWxsO1xuXHR2YXIgX2Vhc2luZ0Z1bmN0aW9uID0gVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lO1xuXHR2YXIgX2ludGVycG9sYXRpb25GdW5jdGlvbiA9IFRXRUVOLkludGVycG9sYXRpb24uTGluZWFyO1xuXHR2YXIgX2NoYWluZWRUd2VlbnMgPSBbXTtcblx0dmFyIF9vblN0YXJ0Q2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFja0ZpcmVkID0gZmFsc2U7XG5cdHZhciBfb25VcGRhdGVDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25Db21wbGV0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vblN0b3BDYWxsYmFjayA9IG51bGw7XG5cblx0Ly8gU2V0IGFsbCBzdGFydGluZyB2YWx1ZXMgcHJlc2VudCBvbiB0aGUgdGFyZ2V0IG9iamVjdFxuXHRmb3IgKCB2YXIgZmllbGQgaW4gb2JqZWN0ICkge1xuXG5cdFx0X3ZhbHVlc1N0YXJ0WyBmaWVsZCBdID0gcGFyc2VGbG9hdChvYmplY3RbZmllbGRdLCAxMCk7XG5cblx0fVxuXG5cdHRoaXMudG8gPSBmdW5jdGlvbiAoIHByb3BlcnRpZXMsIGR1cmF0aW9uICkge1xuXG5cdFx0aWYgKCBkdXJhdGlvbiAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRfZHVyYXRpb24gPSBkdXJhdGlvbjtcblxuXHRcdH1cblxuXHRcdF92YWx1ZXNFbmQgPSBwcm9wZXJ0aWVzO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCB0aW1lICkge1xuXG5cdFx0VFdFRU4uYWRkKCB0aGlzICk7XG5cblx0XHRfaXNQbGF5aW5nID0gdHJ1ZTtcblxuXHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IGZhbHNlO1xuXG5cdFx0X3N0YXJ0VGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiAoIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wZXJmb3JtYW5jZSAhPT0gdW5kZWZpbmVkICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgIT09IHVuZGVmaW5lZCA/IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSA6IERhdGUubm93KCkgKTtcblx0XHRfc3RhcnRUaW1lICs9IF9kZWxheVRpbWU7XG5cblx0XHRmb3IgKCB2YXIgcHJvcGVydHkgaW4gX3ZhbHVlc0VuZCApIHtcblxuXHRcdFx0Ly8gY2hlY2sgaWYgYW4gQXJyYXkgd2FzIHByb3ZpZGVkIGFzIHByb3BlcnR5IHZhbHVlXG5cdFx0XHRpZiAoIF92YWx1ZXNFbmRbIHByb3BlcnR5IF0gaW5zdGFuY2VvZiBBcnJheSApIHtcblxuXHRcdFx0XHRpZiAoIF92YWx1ZXNFbmRbIHByb3BlcnR5IF0ubGVuZ3RoID09PSAwICkge1xuXG5cdFx0XHRcdFx0Y29udGludWU7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGNyZWF0ZSBhIGxvY2FsIGNvcHkgb2YgdGhlIEFycmF5IHdpdGggdGhlIHN0YXJ0IHZhbHVlIGF0IHRoZSBmcm9udFxuXHRcdFx0XHRfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdID0gWyBfb2JqZWN0WyBwcm9wZXJ0eSBdIF0uY29uY2F0KCBfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdICk7XG5cblx0XHRcdH1cblxuXHRcdFx0X3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdID0gX29iamVjdFsgcHJvcGVydHkgXTtcblxuXHRcdFx0aWYoICggX3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdIGluc3RhbmNlb2YgQXJyYXkgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdF92YWx1ZXNTdGFydFsgcHJvcGVydHkgXSAqPSAxLjA7IC8vIEVuc3VyZXMgd2UncmUgdXNpbmcgbnVtYmVycywgbm90IHN0cmluZ3Ncblx0XHRcdH1cblxuXHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdID0gX3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdIHx8IDA7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICggIV9pc1BsYXlpbmcgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHRUV0VFTi5yZW1vdmUoIHRoaXMgKTtcblx0XHRfaXNQbGF5aW5nID0gZmFsc2U7XG5cblx0XHRpZiAoIF9vblN0b3BDYWxsYmFjayAhPT0gbnVsbCApIHtcblxuXHRcdFx0X29uU3RvcENhbGxiYWNrLmNhbGwoIF9vYmplY3QgKTtcblxuXHRcdH1cblxuXHRcdHRoaXMuc3RvcENoYWluZWRUd2VlbnMoKTtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RvcENoYWluZWRUd2VlbnMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKysgKSB7XG5cblx0XHRcdF9jaGFpbmVkVHdlZW5zWyBpIF0uc3RvcCgpO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5kZWxheSA9IGZ1bmN0aW9uICggYW1vdW50ICkge1xuXG5cdFx0X2RlbGF5VGltZSA9IGFtb3VudDtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMucmVwZWF0ID0gZnVuY3Rpb24gKCB0aW1lcyApIHtcblxuXHRcdF9yZXBlYXQgPSB0aW1lcztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMueW95byA9IGZ1bmN0aW9uKCB5b3lvICkge1xuXG5cdFx0X3lveW8gPSB5b3lvO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblxuXHR0aGlzLmVhc2luZyA9IGZ1bmN0aW9uICggZWFzaW5nICkge1xuXG5cdFx0X2Vhc2luZ0Z1bmN0aW9uID0gZWFzaW5nO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5pbnRlcnBvbGF0aW9uID0gZnVuY3Rpb24gKCBpbnRlcnBvbGF0aW9uICkge1xuXG5cdFx0X2ludGVycG9sYXRpb25GdW5jdGlvbiA9IGludGVycG9sYXRpb247XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmNoYWluID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0X2NoYWluZWRUd2VlbnMgPSBhcmd1bWVudHM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uU3RhcnQgPSBmdW5jdGlvbiAoIGNhbGxiYWNrICkge1xuXG5cdFx0X29uU3RhcnRDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblVwZGF0ZSA9IGZ1bmN0aW9uICggY2FsbGJhY2sgKSB7XG5cblx0XHRfb25VcGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vbkNvbXBsZXRlID0gZnVuY3Rpb24gKCBjYWxsYmFjayApIHtcblxuXHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdG9wID0gZnVuY3Rpb24gKCBjYWxsYmFjayApIHtcblxuXHRcdF9vblN0b3BDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoIHRpbWUgKSB7XG5cblx0XHR2YXIgcHJvcGVydHk7XG5cblx0XHRpZiAoIHRpbWUgPCBfc3RhcnRUaW1lICkge1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdH1cblxuXHRcdGlmICggX29uU3RhcnRDYWxsYmFja0ZpcmVkID09PSBmYWxzZSApIHtcblxuXHRcdFx0aWYgKCBfb25TdGFydENhbGxiYWNrICE9PSBudWxsICkge1xuXG5cdFx0XHRcdF9vblN0YXJ0Q2FsbGJhY2suY2FsbCggX29iamVjdCApO1xuXG5cdFx0XHR9XG5cblx0XHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IHRydWU7XG5cblx0XHR9XG5cblx0XHR2YXIgZWxhcHNlZCA9ICggdGltZSAtIF9zdGFydFRpbWUgKSAvIF9kdXJhdGlvbjtcblx0XHRlbGFwc2VkID0gZWxhcHNlZCA+IDEgPyAxIDogZWxhcHNlZDtcblxuXHRcdHZhciB2YWx1ZSA9IF9lYXNpbmdGdW5jdGlvbiggZWxhcHNlZCApO1xuXG5cdFx0Zm9yICggcHJvcGVydHkgaW4gX3ZhbHVlc0VuZCApIHtcblxuXHRcdFx0dmFyIHN0YXJ0ID0gX3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdIHx8IDA7XG5cdFx0XHR2YXIgZW5kID0gX3ZhbHVlc0VuZFsgcHJvcGVydHkgXTtcblxuXHRcdFx0aWYgKCBlbmQgaW5zdGFuY2VvZiBBcnJheSApIHtcblxuXHRcdFx0XHRfb2JqZWN0WyBwcm9wZXJ0eSBdID0gX2ludGVycG9sYXRpb25GdW5jdGlvbiggZW5kLCB2YWx1ZSApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFBhcnNlcyByZWxhdGl2ZSBlbmQgdmFsdWVzIHdpdGggc3RhcnQgYXMgYmFzZSAoZS5nLjogKzEwLCAtMylcblx0XHRcdFx0aWYgKCB0eXBlb2YoZW5kKSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0XHRlbmQgPSBzdGFydCArIHBhcnNlRmxvYXQoZW5kLCAxMCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBwcm90ZWN0IGFnYWluc3Qgbm9uIG51bWVyaWMgcHJvcGVydGllcy5cblx0XHRcdFx0aWYgKCB0eXBlb2YoZW5kKSA9PT0gXCJudW1iZXJcIiApIHtcblx0XHRcdFx0XHRfb2JqZWN0WyBwcm9wZXJ0eSBdID0gc3RhcnQgKyAoIGVuZCAtIHN0YXJ0ICkgKiB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoIF9vblVwZGF0ZUNhbGxiYWNrICE9PSBudWxsICkge1xuXG5cdFx0XHRfb25VcGRhdGVDYWxsYmFjay5jYWxsKCBfb2JqZWN0LCB2YWx1ZSApO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBlbGFwc2VkID09IDEgKSB7XG5cblx0XHRcdGlmICggX3JlcGVhdCA+IDAgKSB7XG5cblx0XHRcdFx0aWYoIGlzRmluaXRlKCBfcmVwZWF0ICkgKSB7XG5cdFx0XHRcdFx0X3JlcGVhdC0tO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gcmVhc3NpZ24gc3RhcnRpbmcgdmFsdWVzLCByZXN0YXJ0IGJ5IG1ha2luZyBzdGFydFRpbWUgPSBub3dcblx0XHRcdFx0Zm9yKCBwcm9wZXJ0eSBpbiBfdmFsdWVzU3RhcnRSZXBlYXQgKSB7XG5cblx0XHRcdFx0XHRpZiAoIHR5cGVvZiggX3ZhbHVlc0VuZFsgcHJvcGVydHkgXSApID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdID0gX3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdICsgcGFyc2VGbG9hdChfdmFsdWVzRW5kWyBwcm9wZXJ0eSBdLCAxMCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKF95b3lvKSB7XG5cdFx0XHRcdFx0XHR2YXIgdG1wID0gX3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdO1xuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdID0gX3ZhbHVlc0VuZFsgcHJvcGVydHkgXTtcblx0XHRcdFx0XHRcdF92YWx1ZXNFbmRbIHByb3BlcnR5IF0gPSB0bXA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0WyBwcm9wZXJ0eSBdID0gX3ZhbHVlc1N0YXJ0UmVwZWF0WyBwcm9wZXJ0eSBdO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRfcmV2ZXJzZWQgPSAhX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X3N0YXJ0VGltZSA9IHRpbWUgKyBfZGVsYXlUaW1lO1xuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmICggX29uQ29tcGxldGVDYWxsYmFjayAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2suY2FsbCggX29iamVjdCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKysgKSB7XG5cblx0XHRcdFx0XHRfY2hhaW5lZFR3ZWVuc1sgaSBdLnN0YXJ0KCB0aW1lICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cblx0fTtcblxufTtcblxuXG5UV0VFTi5FYXNpbmcgPSB7XG5cblx0TGluZWFyOiB7XG5cblx0XHROb25lOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhZHJhdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrICogKCAyIC0gayApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGs7XG5cdFx0XHRyZXR1cm4gLSAwLjUgKiAoIC0tayAqICggayAtIDIgKSAtIDEgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEN1YmljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGsgKiBrO1xuXHRcdFx0cmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICsgMiApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhcnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAxIC0gKCAtLWsgKiBrICogayAqIGsgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxKSByZXR1cm4gMC41ICogayAqIGsgKiBrICogaztcblx0XHRcdHJldHVybiAtIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICogayAtIDIgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1aW50aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogayAqIGsgKiBrICogayAqIGs7XG5cdFx0XHRyZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqIGsgKiBrICogayArIDIgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFNpbnVzb2lkYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAxIC0gTWF0aC5jb3MoIGsgKiBNYXRoLlBJIC8gMiApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zaW4oIGsgKiBNYXRoLlBJIC8gMiApO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiAwLjUgKiAoIDEgLSBNYXRoLmNvcyggTWF0aC5QSSAqIGsgKSApO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0RXhwb25lbnRpYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHJldHVybiBrID09PSAwID8gMCA6IE1hdGgucG93KCAxMDI0LCBrIC0gMSApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gayA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coIDIsIC0gMTAgKiBrICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCBrID09PSAwICkgcmV0dXJuIDA7XG5cdFx0XHRpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gMC41ICogTWF0aC5wb3coIDEwMjQsIGsgLSAxICk7XG5cdFx0XHRyZXR1cm4gMC41ICogKCAtIE1hdGgucG93KCAyLCAtIDEwICogKCBrIC0gMSApICkgKyAyICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRDaXJjdWxhcjoge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLnNxcnQoIDEgLSBrICogayApO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zcXJ0KCAxIC0gKCAtLWsgKiBrICkgKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKCBrICkge1xuXG5cdFx0XHRpZiAoICggayAqPSAyICkgPCAxKSByZXR1cm4gLSAwLjUgKiAoIE1hdGguc3FydCggMSAtIGsgKiBrKSAtIDEpO1xuXHRcdFx0cmV0dXJuIDAuNSAqICggTWF0aC5zcXJ0KCAxIC0gKCBrIC09IDIpICogaykgKyAxKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEVsYXN0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzLCBhID0gMC4xLCBwID0gMC40O1xuXHRcdFx0aWYgKCBrID09PSAwICkgcmV0dXJuIDA7XG5cdFx0XHRpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcblx0XHRcdGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cblx0XHRcdGVsc2UgcyA9IHAgKiBNYXRoLmFzaW4oIDEgLyBhICkgLyAoIDIgKiBNYXRoLlBJICk7XG5cdFx0XHRyZXR1cm4gLSAoIGEgKiBNYXRoLnBvdyggMiwgMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzLCBhID0gMC4xLCBwID0gMC40O1xuXHRcdFx0aWYgKCBrID09PSAwICkgcmV0dXJuIDA7XG5cdFx0XHRpZiAoIGsgPT09IDEgKSByZXR1cm4gMTtcblx0XHRcdGlmICggIWEgfHwgYSA8IDEgKSB7IGEgPSAxOyBzID0gcCAvIDQ7IH1cblx0XHRcdGVsc2UgcyA9IHAgKiBNYXRoLmFzaW4oIDEgLyBhICkgLyAoIDIgKiBNYXRoLlBJICk7XG5cdFx0XHRyZXR1cm4gKCBhICogTWF0aC5wb3coIDIsIC0gMTAgKiBrKSAqIE1hdGguc2luKCAoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKyAxICk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XG5cdFx0XHRpZiAoIGsgPT09IDAgKSByZXR1cm4gMDtcblx0XHRcdGlmICggayA9PT0gMSApIHJldHVybiAxO1xuXHRcdFx0aWYgKCAhYSB8fCBhIDwgMSApIHsgYSA9IDE7IHMgPSBwIC8gNDsgfVxuXHRcdFx0ZWxzZSBzID0gcCAqIE1hdGguYXNpbiggMSAvIGEgKSAvICggMiAqIE1hdGguUEkgKTtcblx0XHRcdGlmICggKCBrICo9IDIgKSA8IDEgKSByZXR1cm4gLSAwLjUgKiAoIGEgKiBNYXRoLnBvdyggMiwgMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICk7XG5cdFx0XHRyZXR1cm4gYSAqIE1hdGgucG93KCAyLCAtMTAgKiAoIGsgLT0gMSApICkgKiBNYXRoLnNpbiggKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICogMC41ICsgMTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEJhY2s6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblx0XHRcdHJldHVybiBrICogayAqICggKCBzICsgMSApICogayAtIHMgKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiAoICggcyArIDEgKSAqIGsgKyBzICkgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoIGsgKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1OCAqIDEuNTI1O1xuXHRcdFx0aWYgKCAoIGsgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiAoIGsgKiBrICogKCAoIHMgKyAxICkgKiBrIC0gcyApICk7XG5cdFx0XHRyZXR1cm4gMC41ICogKCAoIGsgLT0gMiApICogayAqICggKCBzICsgMSApICogayArIHMgKSArIDIgKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEJvdW5jZToge1xuXG5cdFx0SW46IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBUV0VFTi5FYXNpbmcuQm91bmNlLk91dCggMSAtIGsgKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCBrIDwgKCAxIC8gMi43NSApICkge1xuXG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiBrICogaztcblxuXHRcdFx0fSBlbHNlIGlmICggayA8ICggMiAvIDIuNzUgKSApIHtcblxuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKCBrIC09ICggMS41IC8gMi43NSApICkgKiBrICsgMC43NTtcblxuXHRcdFx0fSBlbHNlIGlmICggayA8ICggMi41IC8gMi43NSApICkge1xuXG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAyLjI1IC8gMi43NSApICkgKiBrICsgMC45Mzc1O1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAyLjYyNSAvIDIuNzUgKSApICogayArIDAuOTg0Mzc1O1xuXG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uICggayApIHtcblxuXHRcdFx0aWYgKCBrIDwgMC41ICkgcmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuSW4oIGsgKiAyICkgKiAwLjU7XG5cdFx0XHRyZXR1cm4gVFdFRU4uRWFzaW5nLkJvdW5jZS5PdXQoIGsgKiAyIC0gMSApICogMC41ICsgMC41O1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxuVFdFRU4uSW50ZXJwb2xhdGlvbiA9IHtcblxuXHRMaW5lYXI6IGZ1bmN0aW9uICggdiwgayApIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxLCBmID0gbSAqIGssIGkgPSBNYXRoLmZsb29yKCBmICksIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5MaW5lYXI7XG5cblx0XHRpZiAoIGsgPCAwICkgcmV0dXJuIGZuKCB2WyAwIF0sIHZbIDEgXSwgZiApO1xuXHRcdGlmICggayA+IDEgKSByZXR1cm4gZm4oIHZbIG0gXSwgdlsgbSAtIDEgXSwgbSAtIGYgKTtcblxuXHRcdHJldHVybiBmbiggdlsgaSBdLCB2WyBpICsgMSA+IG0gPyBtIDogaSArIDEgXSwgZiAtIGkgKTtcblxuXHR9LFxuXG5cdEJlemllcjogZnVuY3Rpb24gKCB2LCBrICkge1xuXG5cdFx0dmFyIGIgPSAwLCBuID0gdi5sZW5ndGggLSAxLCBwdyA9IE1hdGgucG93LCBibiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuQmVybnN0ZWluLCBpO1xuXG5cdFx0Zm9yICggaSA9IDA7IGkgPD0gbjsgaSsrICkge1xuXHRcdFx0YiArPSBwdyggMSAtIGssIG4gLSBpICkgKiBwdyggaywgaSApICogdlsgaSBdICogYm4oIG4sIGkgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYjtcblxuXHR9LFxuXG5cdENhdG11bGxSb206IGZ1bmN0aW9uICggdiwgayApIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxLCBmID0gbSAqIGssIGkgPSBNYXRoLmZsb29yKCBmICksIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5DYXRtdWxsUm9tO1xuXG5cdFx0aWYgKCB2WyAwIF0gPT09IHZbIG0gXSApIHtcblxuXHRcdFx0aWYgKCBrIDwgMCApIGkgPSBNYXRoLmZsb29yKCBmID0gbSAqICggMSArIGsgKSApO1xuXG5cdFx0XHRyZXR1cm4gZm4oIHZbICggaSAtIDEgKyBtICkgJSBtIF0sIHZbIGkgXSwgdlsgKCBpICsgMSApICUgbSBdLCB2WyAoIGkgKyAyICkgJSBtIF0sIGYgLSBpICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRpZiAoIGsgPCAwICkgcmV0dXJuIHZbIDAgXSAtICggZm4oIHZbIDAgXSwgdlsgMCBdLCB2WyAxIF0sIHZbIDEgXSwgLWYgKSAtIHZbIDAgXSApO1xuXHRcdFx0aWYgKCBrID4gMSApIHJldHVybiB2WyBtIF0gLSAoIGZuKCB2WyBtIF0sIHZbIG0gXSwgdlsgbSAtIDEgXSwgdlsgbSAtIDEgXSwgZiAtIG0gKSAtIHZbIG0gXSApO1xuXG5cdFx0XHRyZXR1cm4gZm4oIHZbIGkgPyBpIC0gMSA6IDAgXSwgdlsgaSBdLCB2WyBtIDwgaSArIDEgPyBtIDogaSArIDEgXSwgdlsgbSA8IGkgKyAyID8gbSA6IGkgKyAyIF0sIGYgLSBpICk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRVdGlsczoge1xuXG5cdFx0TGluZWFyOiBmdW5jdGlvbiAoIHAwLCBwMSwgdCApIHtcblxuXHRcdFx0cmV0dXJuICggcDEgLSBwMCApICogdCArIHAwO1xuXG5cdFx0fSxcblxuXHRcdEJlcm5zdGVpbjogZnVuY3Rpb24gKCBuICwgaSApIHtcblxuXHRcdFx0dmFyIGZjID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5GYWN0b3JpYWw7XG5cdFx0XHRyZXR1cm4gZmMoIG4gKSAvIGZjKCBpICkgLyBmYyggbiAtIGkgKTtcblxuXHRcdH0sXG5cblx0XHRGYWN0b3JpYWw6ICggZnVuY3Rpb24gKCkge1xuXG5cdFx0XHR2YXIgYSA9IFsgMSBdO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCBuICkge1xuXG5cdFx0XHRcdHZhciBzID0gMSwgaTtcblx0XHRcdFx0aWYgKCBhWyBuIF0gKSByZXR1cm4gYVsgbiBdO1xuXHRcdFx0XHRmb3IgKCBpID0gbjsgaSA+IDE7IGktLSApIHMgKj0gaTtcblx0XHRcdFx0cmV0dXJuIGFbIG4gXSA9IHM7XG5cblx0XHRcdH07XG5cblx0XHR9ICkoKSxcblxuXHRcdENhdG11bGxSb206IGZ1bmN0aW9uICggcDAsIHAxLCBwMiwgcDMsIHQgKSB7XG5cblx0XHRcdHZhciB2MCA9ICggcDIgLSBwMCApICogMC41LCB2MSA9ICggcDMgLSBwMSApICogMC41LCB0MiA9IHQgKiB0LCB0MyA9IHQgKiB0Mjtcblx0XHRcdHJldHVybiAoIDIgKiBwMSAtIDIgKiBwMiArIHYwICsgdjEgKSAqIHQzICsgKCAtIDMgKiBwMSArIDMgKiBwMiAtIDIgKiB2MCAtIHYxICkgKiB0MiArIHYwICogdCArIHAxO1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHM9VFdFRU47Il19
