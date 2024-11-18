function getScaledValue(value, sourceRangeMin, sourceRangeMax, targetRangeMin, targetRangeMax) {
    var targetRange = targetRangeMax - targetRangeMin;
    var sourceRange = sourceRangeMax - sourceRangeMin;
    return (value - sourceRangeMin) * targetRange / sourceRange + targetRangeMin;
}

let minZValue = Infinity;
let maxZValue = -Infinity;

const HAND_FAUST_PARAMS = {
    // DEFAULT: -1,
    [LANDMARKS.WRIST]: (faustNode, value) => {

        minZValue = Math.min(minZValue, value.z);
        maxZValue = Math.max(maxZValue, value.z);

        let adjustedValue = scaleZ(value);

        if (faustNode) {
            faustNode.setParamValue("/hand_synth/wrist_x", adjustedValue.x)
            faustNode.setParamValue("/hand_synth/wrist_y", adjustedValue.y)
            faustNode.setParamValue("/hand_synth/wrist_z", adjustedValue.z)
        }
    },
    // [LANDMARKS.THUMB_TIP]: (faustNode, value) => {
    //     // console.log(value);

    //     let freq = (value.y).clamp(0, 10);

    //     if (faustNode) {
    //         faustNode.setParamValue("/hand_synth/thumb_tip_x", value.x)
    //         faustNode.setParamValue("/hand_synth/thumb_tip_y", value.y)
    //         faustNode.setParamValue("/hand_synth/thumb_tip_z", value.z)
    //     }
    // },

    [LANDMARKS.INDEX_FINGER_TIP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/index_finger_tip_x", value.x)
            faustNode.setParamValue("/hand_synth/index_finger_tip_y", value.y)
            faustNode.setParamValue("/hand_synth/index_finger_tip_z", value.z)
        }
    },

    // [LANDMARKS.MIDDLE_FINGER_TIP]: (faustNode, value) => {
    //     if (faustNode) {
    //         faustNode.setParamValue("/hand_synth/middle_finger_tip_x", value.x)
    //         faustNode.setParamValue("/hand_synth/middle_finger_tip_y", value.y)
    //         faustNode.setParamValue("/hand_synth/middle_finger_tip_z", value.z)
    //     }
    // },

    // [LANDMARKS.RING_FINGER_TIP]: (faustNode, value) => {

    //     if (faustNode) {
    //         faustNode.setParamValue("/hand_synth/ring_finger_tip_x", value.x)
    //         faustNode.setParamValue("/hand_synth/ring_finger_tip_y", value.y)
    //         faustNode.setParamValue("/hand_synth/ring_finger_tip_z", value.z)
    //         // faustNode.setParamValue("/hand_synth/gain_8ve_partial", gain)
    //     }
    // },


    // [LANDMARKS.PINKY_TIP]: (faustNode, value) => {

    //     if (faustNode) {
    //         faustNode.setParamValue("/hand_synth/pinky_tip_x", value.x)
    //         faustNode.setParamValue("/hand_synth/pinky_tip_y", value.y)
    //         faustNode.setParamValue("/hand_synth/pinky_tip_z", value.z)
    //     }
    // },

    [LANDMARKS.THUMB_MCP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/thumb_mcp_x", value.x)
            faustNode.setParamValue("/hand_synth/thumb_mcp_y", value.y)
            faustNode.setParamValue("/hand_synth/thumb_mcp_z", value.z)
        }
    },

    [LANDMARKS.THUMB_IP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/thumb_ip_x", value.x)
            faustNode.setParamValue("/hand_synth/thumb_ip_y", value.y)
            faustNode.setParamValue("/hand_synth/thumb_ip_z", value.z)
        }
    },
    [LANDMARKS.THUMB_TIP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/thumb_tip_x", value.x)
            faustNode.setParamValue("/hand_synth/thumb_tip_y", value.y)
            faustNode.setParamValue("/hand_synth/thumb_tip_z", value.z)
        }
    },
    [LANDMARKS.INDEX_FINGER_MCP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/index_mcp_x", value.x)
            faustNode.setParamValue("/hand_synth/index_mcp_y", value.y)
            faustNode.setParamValue("/hand_synth/index_mcp_z", value.z)
        }
    },
    [LANDMARKS.MIDDLE_FINGER_TIP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/middle_tip_x", value.x)
            faustNode.setParamValue("/hand_synth/middle_tip_y", value.y)
            faustNode.setParamValue("/hand_synth/middle_tip_z", value.z)
        }
    },
    [LANDMARKS.RING_FINGER_MCP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/ring_mcp_x", value.x)
            faustNode.setParamValue("/hand_synth/ring_mcp_y", value.y)
            faustNode.setParamValue("/hand_synth/ring_mcp_z", value.z)
        }
    },

    [LANDMARKS.RING_FINGER_PIP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/ring_pip_x", value.x)
            faustNode.setParamValue("/hand_synth/ring_pip_y", value.y)
            faustNode.setParamValue("/hand_synth/ring_pip_z", value.z)
        }
    },

    [LANDMARKS.RING_FINGER_DIP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/ring_dip_x", value.x)
            faustNode.setParamValue("/hand_synth/ring_dip_y", value.y)
            faustNode.setParamValue("/hand_synth/ring_dip_z", value.z)
        }
    },
    [LANDMARKS.RING_FINGER_TIP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/ring_tip_x", value.x)
            faustNode.setParamValue("/hand_synth/ring_tip_y", value.y)
            faustNode.setParamValue("/hand_synth/ring_tip_z", value.z)
        }
    },

    [LANDMARKS.PINKY_MCP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/pinky_mcp_x", value.x)
            faustNode.setParamValue("/hand_synth/pinky_mcp_y", value.y)
            faustNode.setParamValue("/hand_synth/pinky_mcp_z", value.z)
        }
    },
    [LANDMARKS.PINKY_PIP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/pinky_pip_x", value.x)
            faustNode.setParamValue("/hand_synth/pinky_pip_y", value.y)
            faustNode.setParamValue("/hand_synth/pinky_pip_z", value.z)
        }
    },

    [LANDMARKS.PINKY_TIP]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/pinky_tip_x", value.x)
            faustNode.setParamValue("/hand_synth/pinky_tip_y", value.y)
            faustNode.setParamValue("/hand_synth/pinky_tip_z", value.z)
        }
    },

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
        faustNode.setParamValue("/hand_synth/gate", 0)
    }
};


const updateFaustParamsForLandmarks = (faustNode) => {
    if (faustNode) {
        faustNode.setParamValue("/hand_synth/gate", 1)
    }
};  