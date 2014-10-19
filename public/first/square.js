"use strict";

/*

 0 = (-0.5, 0.5) ------- 4 = (0.5, 0.5)
 |                          |
 |        2 = (0, 0)        |
 |                          |
 1 = (-0.5, -0.5) ------ 3 = (0.5, -0.5)

 */

var square = {

    staticPositions: function () {
        var positions = [    -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            0.0, 0.0, 0.0,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5    ];

        return positions;
    },

    dynPositions: function (angle) {
        var x_translation = Math.sin(angle) / 2.0;
        var positions = [    -0.5 + x_translation, 0.5, -0.5,
                -0.5 + x_translation, -0.5, -0.5,
                0.0 + x_translation, 0.0, 0.0,
                0.5 + x_translation, -0.5, 0.5,
                0.5 + x_translation, 0.5, 0.5    ];

        return positions;
    },

    colors: [ 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0 ],

    indices: [  0, 1, 2, 2, 3, 4 ]
};