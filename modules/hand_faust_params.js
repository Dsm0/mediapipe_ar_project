const HAND_FAUST_PARAMS = {
    // DEFAULT: -1,
    [LANDMARKS.WRIST]: (faustNode, value) => {
        let gain = (value.z * 500000).clamp(0, 1);
        if (faustNode) {
            faustNode.setParamValue("/untitled1/gain", gain)
        }
    },
    [LANDMARKS.THUMB_CMC]: (faustNode, value) => {
        // console.log(value);
        // faustNode.setParamValue("/untitled1/gain", value)
    },
    [LANDMARKS.THUMB_MCP]: (faustNode, value) => {
        // console.log(value);
        // faustNode.setParamValue("/untitled1/gain", value)
    },
    [LANDMARKS.THUMB_IP]: (faustNode, value) => {
        // console.log(value);
        // faustNode.setParamValue("/untitled1/gain", value)
    },
    [LANDMARKS.THUMB_TIP]: 4,
    [LANDMARKS.INDEX_FINGER_MCP]: 5,
    [LANDMARKS.INDEX_FINGER_PIP]: 6,
    [LANDMARKS.INDEX_FINGER_DIP]: 7,
    [LANDMARKS.INDEX_FINGER_TIP]: 8,
    [LANDMARKS.MIDDLE_FINGER_MCP]: 9,
    [LANDMARKS.MIDDLE_FINGER_PIP]: 10,
    [LANDMARKS.MIDDLE_FINGER_DIP]: 11,
    [LANDMARKS.MIDDLE_FINGER_TIP]: 12,
    [LANDMARKS.RING_FINGER_MCP]: 13,
    [LANDMARKS.RING_FINGER_PIP]: 14,
    [LANDMARKS.RING_FINGER_DIP]: 15,
    [LANDMARKS.RING_FINGER_TIP]: 16,
    [LANDMARKS.PINKY_MCP]: 17,
    [LANDMARKS.PINKY_PIP]: 18,
    [LANDMARKS.PINKY_DIP]: 19,
    [LANDMARKS.PINKY_TIP]: 20,
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