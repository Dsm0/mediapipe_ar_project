function getScaledValue(value, sourceRangeMin, sourceRangeMax, targetRangeMin, targetRangeMax) {
    var targetRange = targetRangeMax - targetRangeMin;
    var sourceRange = sourceRangeMax - sourceRangeMin;
    return (value - sourceRangeMin) * targetRange / sourceRange + targetRangeMin;
}

let minZValue = Infinity;
let maxZValue = -Infinity;

const adjustValue = (value) => {
    value = scaleZ(value);
    return {
        x: value.x.clamp(0, 1),
        y: value.y.clamp(0, 1),
        z: value.z.clamp(0, 1)
    }
}

const HAND_FAUST_PARAMS = {
    // DEFAULT: -1,
    [HAND_LANDMARKS.WRIST]: (faustNode, value) => {

        minZValue = Math.min(minZValue, value.z);
        maxZValue = Math.max(maxZValue, value.z);

        value = adjustValue(value);

        if (faustNode) {
            faustNode.setParamValue("/hand_synth/wrist_x", value.x)
            faustNode.setParamValue("/hand_synth/wrist_y", value.y)
            faustNode.setParamValue("/hand_synth/wrist_z", value.z)
        }
    },

    [HAND_LANDMARKS.INDEX_FINGER_TIP]: (faustNode, value) => {

        value = adjustValue(value);
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

    [HAND_LANDMARKS.THUMB_MCP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/thumb_mcp_x", value.x)
            faustNode.setParamValue("/hand_synth/thumb_mcp_y", value.y)
            faustNode.setParamValue("/hand_synth/thumb_mcp_z", value.z)
        }
    },

    [HAND_LANDMARKS.THUMB_IP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/thumb_ip_x", value.x)
            faustNode.setParamValue("/hand_synth/thumb_ip_y", value.y)
            faustNode.setParamValue("/hand_synth/thumb_ip_z", value.z)
        }
    },
    [HAND_LANDMARKS.THUMB_TIP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/thumb_tip_x", value.x)
            faustNode.setParamValue("/hand_synth/thumb_tip_y", value.y)
            faustNode.setParamValue("/hand_synth/thumb_tip_z", value.z)
        }
    },
    [HAND_LANDMARKS.INDEX_FINGER_MCP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/index_mcp_x", value.x)
            faustNode.setParamValue("/hand_synth/index_mcp_y", value.y)
            faustNode.setParamValue("/hand_synth/index_mcp_z", value.z)
        }
    },
    [HAND_LANDMARKS.MIDDLE_FINGER_TIP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/middle_tip_x", value.x)
            faustNode.setParamValue("/hand_synth/middle_tip_y", value.y)
            faustNode.setParamValue("/hand_synth/middle_tip_z", value.z)
        }
    },
    [HAND_LANDMARKS.RING_FINGER_MCP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/ring_mcp_x", value.x)
            faustNode.setParamValue("/hand_synth/ring_mcp_y", value.y)
            faustNode.setParamValue("/hand_synth/ring_mcp_z", value.z)
        }
    },

    [HAND_LANDMARKS.RING_FINGER_PIP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/ring_pip_x", value.x)
            faustNode.setParamValue("/hand_synth/ring_pip_y", value.y)
            faustNode.setParamValue("/hand_synth/ring_pip_z", value.z)
        }
    },

    [HAND_LANDMARKS.RING_FINGER_DIP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/ring_dip_x", value.x)
            faustNode.setParamValue("/hand_synth/ring_dip_y", value.y)
            faustNode.setParamValue("/hand_synth/ring_dip_z", value.z)
        }
    },
    [HAND_LANDMARKS.RING_FINGER_TIP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/ring_tip_x", value.x)
            faustNode.setParamValue("/hand_synth/ring_tip_y", value.y)
            faustNode.setParamValue("/hand_synth/ring_tip_z", value.z)
        }
    },

    [HAND_LANDMARKS.PINKY_MCP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/pinky_mcp_x", value.x)
            faustNode.setParamValue("/hand_synth/pinky_mcp_y", value.y)
            faustNode.setParamValue("/hand_synth/pinky_mcp_z", value.z)
        }
    },
    [HAND_LANDMARKS.PINKY_PIP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/pinky_pip_x", value.x)
            faustNode.setParamValue("/hand_synth/pinky_pip_y", value.y)
            faustNode.setParamValue("/hand_synth/pinky_pip_z", value.z)
        }
    },

    [HAND_LANDMARKS.PINKY_TIP]: (faustNode, value) => {
        value = adjustValue(value);
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/pinky_tip_x", value.x)
            faustNode.setParamValue("/hand_synth/pinky_tip_y", value.y)
            faustNode.setParamValue("/hand_synth/pinky_tip_z", value.z)
        }
    },

};







const FACE_FAUST_PARAMS = {
    [FACE_LANDMARKS.NOSE]: (faustNode, value) => {
        // console.log("NOSE", value);

        if (faustNode) {
            faustNode.setParamValue("/hand_synth/nose_x", value.x)
            faustNode.setParamValue("/hand_synth/nose_y", value.y)
            faustNode.setParamValue("/hand_synth/nose_z", value.z)
        }
    },
    [FACE_LANDMARKS.LEFT_EYE]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/left_eye_x", value.x)
            faustNode.setParamValue("/hand_synth/left_eye_y", value.y)
            faustNode.setParamValue("/hand_synth/left_eye_z", value.z)
        }
    },
    [FACE_LANDMARKS.RIGHT_EYE]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/right_eye_x", value.x)
            faustNode.setParamValue("/hand_synth/right_eye_y", value.y)
            faustNode.setParamValue("/hand_synth/right_eye_z", value.z)
        }
    },
    [FACE_LANDMARKS.LEFT_CHEEK]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/left_cheek_x", value.x)
            faustNode.setParamValue("/hand_synth/left_cheek_y", value.y)
            faustNode.setParamValue("/hand_synth/left_cheek_z", value.z)
        }
    },
    [FACE_LANDMARKS.RIGHT_CHEEK]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/right_cheek_x", value.x)
            faustNode.setParamValue("/hand_synth/right_cheek_y", value.y)
            faustNode.setParamValue("/hand_synth/right_cheek_z", value.z)
        }
    },
}






const FAUST_PARAMS = {
    ...HAND_FAUST_PARAMS,
    ...FACE_FAUST_PARAMS,
}

const updateFaustParams = (faustNode, landmarks) => {
    let i = 0;
    for (const landmark of landmarks) {
        let updateFunc = FAUST_PARAMS[i];
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