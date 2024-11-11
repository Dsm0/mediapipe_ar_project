function getScaledValue(value, sourceRangeMin, sourceRangeMax, targetRangeMin, targetRangeMax) {
    var targetRange = targetRangeMax - targetRangeMin;
    var sourceRange = sourceRangeMax - sourceRangeMin;
    return (value - sourceRangeMin) * targetRange / sourceRange + targetRangeMin;
}


const HAND_FAUST_PARAMS = {
    // DEFAULT: -1,
    [LANDMARKS.WRIST]: (faustNode, value) => {

        let gain = (value.x).clamp(0, 0.7);
        // console.log(value.x, gain);

        if (faustNode) {
            faustNode.setParamValue("/untitled1/gain", gain)
        }
    },
    [LANDMARKS.THUMB_TIP]: (faustNode, value) => {
        // console.log(value);

        let freq = (value.y).clamp(0, 10);

        let scaledFreq = getScaledValue(freq, 0, 10, 220, 440);

        if (faustNode) {
            faustNode.setParamValue("/untitled1/freq", scaledFreq)
        }
    },

    [LANDMARKS.INDEX_FINGER_TIP]: (faustNode, value) => {

        let gain = (value.y).clamp(0, 1);
        // console.log(value.x, gain);

        if (faustNode) {
            faustNode.setParamValue("/untitled1/gain_fundamental", gain)
        }
    },

    [LANDMARKS.MIDDLE_FINGER_TIP]: (faustNode, value) => {

        let gain = (value.y).clamp(0, 1);
        // console.log(value.x, gain);

        if (faustNode) {
            faustNode.setParamValue("/untitled1/gain_3d_partial", gain)
        }
    },

    [LANDMARKS.RING_FINGER_TIP]: (faustNode, value) => {

        let gain = (value.y).clamp(0, 1);
        console.log(value.x, gain);

        if (faustNode) {
            faustNode.setParamValue("/untitled1/gain_8ve_partial", gain)
        }
    },


    [LANDMARKS.PINKY_TIP]: (faustNode, value) => {

        let gain = (value.y).clamp(0, 1);

        if (faustNode) {
            faustNode.setParamValue("/untitled1/gain_other_partials", gain)
        }
    },



    // [LANDMARKS.THUMB_MCP]: (faustNode, value) => {
    //     // console.log(value);
    //     // faustNode.setParamValue("/untitled1/gain", value)
    // },
    // [LANDMARKS.THUMB_IP]: (faustNode, value) => {
    //     // console.log(value);
    //     // faustNode.setParamValue("/untitled1/gain", value)
    // },
    // [LANDMARKS.THUMB_TIP]: 4,
    // [LANDMARKS.INDEX_FINGER_MCP]: 5,
    // [LANDMARKS.INDEX_FINGER_PIP]: 6,
    // [LANDMARKS.INDEX_FINGER_DIP]: 7,
    // [LANDMARKS.INDEX_FINGER_TIP]: 8,
    // [LANDMARKS.MIDDLE_FINGER_MCP]: 9,
    // [LANDMARKS.MIDDLE_FINGER_PIP]: 10,
    // [LANDMARKS.MIDDLE_FINGER_DIP]: 11,
    // [LANDMARKS.MIDDLE_FINGER_TIP]: 12,
    // [LANDMARKS.RING_FINGER_MCP]: 13,
    // [LANDMARKS.RING_FINGER_PIP]: 14,
    // [LANDMARKS.RING_FINGER_DIP]: 15,
    // [LANDMARKS.RING_FINGER_TIP]: 16,
    // [LANDMARKS.PINKY_MCP]: 17,
    // [LANDMARKS.PINKY_PIP]: 18,
    // [LANDMARKS.PINKY_DIP]: 19,
    // [LANDMARKS.PINKY_TIP]: 20,

};

const updateFaustParams = (faustNode, landmarks) => {
    let i = 0;
    for (const landmark of landmarks) {
        let updateFunc = HAND_FAUST_PARAMS[i];
        if (updateFunc instanceof Function) {
            updateFunc(faustNode, landmark);
        }
        ++i;
    }
};

const updateFaustParamsNoLandmarks = (faustNode) => {
    if (faustNode) {
        faustNode.setParamValue("/untitled1/gate", 0)
    }
};


const updateFaustParamsForLandmarks = (faustNode) => {
    if (faustNode) {
        faustNode.setParamValue("/untitled1/gate", 1)
    }
};  