'use strict';

var poses = {

    'NEUTRAL_POSE': {
        'head': {'x': 0, 'y': 0, 'z': 0},
        'torso': {'x': 0, 'y': 0, 'z': 0},
        'left_arm': {'x': 0, 'y': 0, 'z': 0},
        'right_arm': {'x': 0, 'y': 0, 'z': 0},
        'left_leg': {'x': 0, 'y': 0, 'z': 0},
        'right_leg': {'x': 0, 'y': 0, 'z': 0}
    },

    'HI_POSE': {
        'head': {'x': -15 * 0.0175, 'y': 15 * 0.0175, 'z': 0},
        'torso': {'x': 0, 'y': 0, 'z': 0},
        'left_arm': {'x': 180 * 0.0175, 'y': 0, 'z': 0},
        'right_arm': {'x': 180 * 0.0175, 'y': 0, 'z': 0},
        'left_leg': {'x': 0, 'y': 0, 'z': 0},
        'right_leg': {'x': -45 * 0.0175, 'y': 0, 'z': 0}
    },

    'WALK_POSE': {
        'head': {'x': 0, 'y': 15 * 0.0175, 'z': 0},
        'torso': {'x': 0, 'y': 0, 'z': 0},
        'left_arm': {'x': 45 * 0.0175, 'y': 0, 'z': 0},
        'right_arm': {'x': -45 * 0.0175, 'y': 0, 'z': 0},
        'left_leg': {'x': -45 * 0.0175, 'y': 0, 'z': 0},
        'right_leg': {'x': 45 * 0.0175, 'y': 0, 'z': 0}
    },

    'PARADE_POSE': {
        'head': {'x': 0, 'y': 0, 'z': 0},
        'torso': {'x': 0, 'y': 0, 'z': 0},
        'left_arm': {'x': -90 * 0.0175, 'y': 0, 'z': 0},
        'right_arm': {'x': 90 * 0.0175, 'y': 0, 'z': 0},
        'left_leg': {'x': 0, 'y': 0, 'z': 0},
        'right_leg': {'x': -90 * 0.0175, 'y': 0, 'z': 0}
    }

};
