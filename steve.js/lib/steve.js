"use strict";

var THREE = require('three');
var TWEEN = require('tween.js');

function Steve(skin_image) {
    THREE.Object3D.call(this);

    var context = $("<canvas>")[0].getContext("2d");
    context.drawImage(skin_image, 0, 0);

    this.skin = context.getImageData(0, 0, skin_image.width, skin_image.height);
    this.skin.subdata = function (left, top, right, bottom) {
        var width = right - left,
            height = bottom - top;

        var data = new Uint8Array(width * height * 4);

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width * 4; j++) { // red, green, blue, alpha
                data[i * width * 4 + j] = this.data[(i + top) * this.width * 4 + left * 4 + j];
            }
        }

        return data;
    };

    this.torso = this.create_torso(this.skin);

    this.head = this.create_head(this.skin);
    this.head.position.y += 10;
    this.torso.add(this.head);

    this.left_arm = this.create_left_arm(this.skin);
    this.left_arm.position.x += 6;
    this.left_arm.position.y += 4;
    this.torso.add(this.left_arm);

    this.right_arm = this.create_right_arm(this.skin);
    this.right_arm.position.x += -6;
    this.right_arm.position.y += 4;
    this.torso.add(this.right_arm);

    this.left_leg = this.create_left_leg(this.skin);
    this.left_leg.position.x += 2;
    this.left_leg.position.y += -8;
    this.torso.add(this.left_leg);

    this.right_leg = this.create_right_leg(this.skin);
    this.right_leg.position.x += -2;
    this.right_leg.position.y += -8;
    this.torso.add(this.right_leg);

    this.add(this.torso);
}

Steve.prototype = Object.create(THREE.Object3D.prototype);

Steve.prototype.create_torso = function () {
    var torso_texture = [
        new THREE.DataTexture(this.skin.subdata(28, 20, 32, 32), 4, 12),  // left
        new THREE.DataTexture(this.skin.subdata(16, 20, 20, 32), 4, 12),  // rigth
        new THREE.DataTexture(this.skin.subdata(20, 16, 28, 20), 8, 4),  // top
        new THREE.DataTexture(this.skin.subdata(28, 16, 36, 20), 8, 4),  // bottom
        new THREE.DataTexture(this.skin.subdata(20, 20, 28, 32), 8, 12),  // front
        new THREE.DataTexture(this.skin.subdata(32, 20, 40, 32), 8, 12)   // back
    ];

    var torso_material = torso_texture.map(function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent: true, "map": texture });
    });

    var torso = new THREE.Mesh(new THREE.BoxGeometry(8, 12, 4, 8, 12, 4),
        new THREE.MeshFaceMaterial(torso_material));

    return torso;
};

Steve.prototype.create_head = function () {
    var head_texture = [
        new THREE.DataTexture(this.skin.subdata(16, 8, 24, 16), 8, 8),   // left
        new THREE.DataTexture(this.skin.subdata(0, 8, 8, 16), 8, 8),   // rigth
        new THREE.DataTexture(this.skin.subdata(8, 0, 16, 8), 8, 8),   // top
        new THREE.DataTexture(this.skin.subdata(16, 0, 24, 8), 8, 8),   // bottom
        new THREE.DataTexture(this.skin.subdata(8, 8, 16, 16), 8, 8),   // front
        new THREE.DataTexture(this.skin.subdata(24, 8, 32, 16), 8, 8)    // back
    ];

    var head_material = head_texture.map(function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent: true, "map": texture });
    });

    var _head = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 8, 8, 8, 8),
        new THREE.MeshFaceMaterial(head_material));

    var hat_texture = [
        new THREE.DataTexture(this.skin.subdata(48, 8, 56, 16), 8, 8),   // left
        new THREE.DataTexture(this.skin.subdata(32, 8, 40, 16), 8, 8),   // rigth
        new THREE.DataTexture(this.skin.subdata(40, 0, 48, 8), 8, 8),   // top
        new THREE.DataTexture(this.skin.subdata(48, 0, 56, 8), 8, 8),   // bottom
        new THREE.DataTexture(this.skin.subdata(40, 8, 48, 16), 8, 8),   // front
        new THREE.DataTexture(this.skin.subdata(56, 8, 64, 16), 8, 8)    // back
    ];

    var hat_material = hat_texture.map(function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent: true, "map": texture });
    });

    var _hat = new THREE.Mesh(new THREE.BoxGeometry(9, 8, 9, 9, 8, 9),
        new THREE.MeshFaceMaterial(hat_material));

    var head = new THREE.Object3D();
    head.add(_head);
    //head.add(_hat);

    return head;
};

Steve.prototype.create_left_arm = function () {
    var arm_texture = [
        new THREE.DataTexture(this.skin.subdata(48, 20, 52, 32), 4, 12),  // left
        new THREE.DataTexture(this.skin.subdata(40, 20, 44, 32), 4, 12),  // rigth
        new THREE.DataTexture(this.skin.subdata(44, 16, 48, 20), 4, 4),   // top
        new THREE.DataTexture(this.skin.subdata(48, 16, 52, 20), 4, 4),   // bottom
        new THREE.DataTexture(this.skin.subdata(44, 20, 48, 32), 4, 12),   // front
        new THREE.DataTexture(this.skin.subdata(52, 20, 56, 32), 4, 12)    // back
    ];

    var arm_material = arm_texture.map(function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent: true, "map": texture });
    });

    var _arm = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4, 4, 12, 4),
        new THREE.MeshFaceMaterial(arm_material));
    _arm.position.y = -4;

    var arm = new THREE.Object3D();
    arm.add(_arm);

    return arm;
};

Steve.prototype.create_right_arm = function () {
    var arm_texture = [
        new THREE.DataTexture(this.skin.subdata(48, 20, 52, 32), 4, 12),  // left
        new THREE.DataTexture(this.skin.subdata(40, 20, 44, 32), 4, 12),  // rigth
        new THREE.DataTexture(this.skin.subdata(44, 16, 48, 20), 4, 4),   // top
        new THREE.DataTexture(this.skin.subdata(48, 16, 52, 20), 4, 4),   // bottom
        new THREE.DataTexture(this.skin.subdata(44, 20, 48, 32), 4, 12),   // front
        new THREE.DataTexture(this.skin.subdata(52, 20, 56, 32), 4, 12)    // back
    ];

    var arm_material = arm_texture.map(function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent: true, "map": texture });
    });

    var _arm = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4, 4, 12, 4),
        new THREE.MeshFaceMaterial(arm_material));
    _arm.position.y = -4;

    var arm = new THREE.Object3D();
    arm.add(_arm);

    return arm;
};

Steve.prototype.create_left_leg = function () {
    var leg_texture = [
        new THREE.DataTexture(this.skin.subdata(8, 20, 12, 32), 4, 12),  // left
        new THREE.DataTexture(this.skin.subdata(0, 20, 4, 32), 4, 12),  // rigth
        new THREE.DataTexture(this.skin.subdata(4, 16, 8, 20), 4, 4),   // top
        new THREE.DataTexture(this.skin.subdata(8, 16, 12, 20), 4, 4),   // bottom
        new THREE.DataTexture(this.skin.subdata(4, 20, 8, 32), 4, 12),   // front
        new THREE.DataTexture(this.skin.subdata(12, 20, 16, 32), 4, 12)    // back
    ];

    var leg_material = leg_texture.map(function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent: true, "map": texture });
    });

    var _leg = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4, 4, 12, 4),
        new THREE.MeshFaceMaterial(leg_material));
    _leg.position.y = -4;

    // left leg
    var leg = new THREE.Object3D();
    leg.add(_leg);

    return leg;
};

Steve.prototype.create_right_leg = function () {
    var leg_texture = [
        new THREE.DataTexture(this.skin.subdata(8, 20, 12, 32), 4, 12),  // left
        new THREE.DataTexture(this.skin.subdata(0, 20, 4, 32), 4, 12),  // rigth
        new THREE.DataTexture(this.skin.subdata(4, 16, 8, 20), 4, 4),   // top
        new THREE.DataTexture(this.skin.subdata(8, 16, 12, 20), 4, 4),   // bottom
        new THREE.DataTexture(this.skin.subdata(4, 20, 8, 32), 4, 12),   // front
        new THREE.DataTexture(this.skin.subdata(12, 20, 16, 32), 4, 12)    // back
    ];

    var leg_material = leg_texture.map(function (texture) {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;

        return new THREE.MeshPhongMaterial({ transparent: true, "map": texture });
    });

    var _leg = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4, 4, 12, 4),
        new THREE.MeshFaceMaterial(leg_material));
    _leg.position.y = -4;

    // right leg
    var leg = new THREE.Object3D();
    leg.add(_leg);

    return leg;
};


Steve.prototype.do_pose = function (pose) {
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
    'head': { 'x': 0, 'y': 0, 'z': 0 },
    'torso': { 'x': 0, 'y': 0, 'z': 0 },
    'left_arm': { 'x': 0, 'y': 0, 'z': 0 },
    'right_arm': { 'x': 0, 'y': 0, 'z': 0 },
    'left_leg': { 'x': 0, 'y': 0, 'z': 0 },
    'right_leg': { 'x': 0, 'y': 0, 'z': 0 }
};

Steve.HI_POSE = {
    'head': { 'x': -15 * 0.0175, 'y': 15 * 0.0175, 'z': 0 },
    'torso': { 'x': 0, 'y': 0, 'z': 0 },
    'left_arm': { 'x': 180 * 0.0175, 'y': 0, 'z': 0 },
    'right_arm': { 'x': 180 * 0.0175, 'y': 0, 'z': 0 },
    'left_leg': { 'x': 0, 'y': 0, 'z': 0 },
    'right_leg': { 'x': -45 * 0.0175, 'y': 0, 'z': 0 }
};

Steve.WALK_POSE = {
    'head': { 'x': 0, 'y': 15 * 0.0175, 'z': 0 },
    'torso': { 'x': 0, 'y': 0, 'z': 0 },
    'left_arm': { 'x': 45 * 0.0175, 'y': 0, 'z': 0 },
    'right_arm': { 'x': -45 * 0.0175, 'y': 0, 'z': 0 },
    'left_leg': { 'x': -45 * 0.0175, 'y': 0, 'z': 0 },
    'right_leg': { 'x': 45 * 0.0175, 'y': 0, 'z': 0 }
};

Steve.PARADE_POSE = {
    'head': { 'x': 0, 'y': 0, 'z': 0 },
    'torso': { 'x': 0, 'y': 0, 'z': 0 },
    'left_arm': { 'x': 0, 'y': 0, 'z': -90 * 0.0175 },
    'right_arm': { 'x': 90 * 0.0175, 'y': 0, 'z': 0 },
    'left_leg': { 'x': 0, 'y': 0, 'z': 0 },
    'right_leg': { 'x': -90 * 0.0175, 'y': 0, 'z': 0 }
};

module.exports = Steve;