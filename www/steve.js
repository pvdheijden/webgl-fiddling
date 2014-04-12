"use strict";

var steve = function () {
    var material = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xf0f0f0
      });

    var torsoTexture = THREE.ImageUtils.loadTexture('funny_angry_monster.jpg');
    var torsoMaterial = new THREE.MeshPhongMaterial({
        map: torsoTexture
    });

    // torso
    var torso = new THREE.Mesh(new THREE.CubeGeometry(8, 12, 4), torsoMaterial);

    // head
    var _head = new THREE.Mesh(new THREE.CubeGeometry(8, 8, 8), material);

    var head = new THREE.Object3D();
    head.add(_head);
    head.position.y += 10;
    torso.add(head);

    // limbs
    var _limb = new THREE.Mesh(new THREE.CubeGeometry(4, 12, 4), material);
    _limb.position.y = -4;

    // left arm
    var lArm = new THREE.Object3D();
    lArm.add(_limb.clone());
    lArm.position.x += 6;
    lArm.position.y += 4;
    torso.add(lArm);

    // right arm
    var rArm = new THREE.Object3D();
    rArm.add(_limb.clone());
    rArm.position.x += -6;
    rArm.position.y += 4;
    torso.add(rArm);

    // left leg
    var lLeg = new THREE.Object3D();
    lLeg.add(_limb.clone());
    lLeg.position.x += 2;
    lLeg.position.y += -8;
    torso.add(lLeg);

    // left leg
    var rLeg = new THREE.Object3D();
    rLeg.add(_limb.clone());
    rLeg.position.x += -2;
    rLeg.position.y += -8;
    torso.add(rLeg);

    var steve = new THREE.Object3D();
    steve.add(torso);

    steve.head = function () {
        return head;
    };

    steve.lArm = function () {
        return lArm;
    };

    steve.rArm = function () {
        return rArm;
    };

    steve.lLeg = function () {
        return lLeg;
    };

    steve.rLeg = function () {
        return rLeg;
    };

    return steve;
  };