"use strict";

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

        return new THREE.MeshPhongMaterial({ "map": texture });
    });

    var torso = new THREE.Mesh(new THREE.CubeGeometry(8, 12, 4, 8, 12, 4),
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

        return new THREE.MeshPhongMaterial({ "map": texture });
    });

    var _head = new THREE.Mesh(new THREE.CubeGeometry(8, 8, 8, 8, 8, 8),
        new THREE.MeshFaceMaterial(head_material));

    var head = new THREE.Object3D();
    head.add(_head);
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

        return new THREE.MeshPhongMaterial({ "map": texture });
    });

    var _arm = new THREE.Mesh(new THREE.CubeGeometry(4, 12, 4, 4, 12, 4),
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

        return new THREE.MeshPhongMaterial({ "map": texture });
    });

    var _arm = new THREE.Mesh(new THREE.CubeGeometry(4, 12, 4, 4, 12, 4),
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

        return new THREE.MeshPhongMaterial({ "map": texture });
    });

    var _leg = new THREE.Mesh(new THREE.CubeGeometry(4, 12, 4, 4, 12, 4),
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

        return new THREE.MeshPhongMaterial({ "map": texture });
    });

    var _leg = new THREE.Mesh(new THREE.CubeGeometry(4, 12, 4, 4, 12, 4),
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