const scaleZ = (point) => {
    return {
        x: point.x,
        y: point.y,
        z: Math.abs(point.z),
    };
};


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
        z: value.z
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
        value = adjustValue(value);
        // console.log("NOSE", value);

        if (faustNode) {
            faustNode.setParamValue("/hand_synth/nose_x", value.x)
            faustNode.setParamValue("/hand_synth/nose_y", value.y)
            faustNode.setParamValue("/hand_synth/nose_z", value.z)
        }
    },
    [FACE_LANDMARKS.LEFT_IRIS]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/left_iris_x", value.x)
            faustNode.setParamValue("/hand_synth/left_iris_y", value.y)
            faustNode.setParamValue("/hand_synth/left_iris_z", value.z)
        }
    },
    [FACE_LANDMARKS.RIGHT_IRIS]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/right_iris_x", value.x)
            faustNode.setParamValue("/hand_synth/right_iris_y", value.y)
            faustNode.setParamValue("/hand_synth/right_iris_z", value.z)
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


const BLENDSHAPE_FAUST_PARAMS = {
    [BLENDSHAPE_CATEGORIES._NEUTRAL]: (faustNode, value) => { },
    [BLENDSHAPE_CATEGORIES.BROWDOWNLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/browdown_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.BROWDOWNRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/browouterup_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.CHEEKPUFF]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/cheek_puff", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.CHEEKSQUINTLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/cheek_squint_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYEBLINKLEFT]: (faustNode, value) => {
        if (faustNode) {
            console.log("EYEBLINKLEFT", value);
            faustNode.setParamValue("/hand_synth/eyeblink_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYEBLINKRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyeblink_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYELOOKDOWNLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyelookdown_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYELOOKDOWNRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyelookdown_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYELOOKINLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyelookin_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYELOOKINRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyelookin_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYELOOKOUTLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyelookout_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYELOOKOUTRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyelookout_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYELOOKUPLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyelookup_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYELOOKUPRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyelookup_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYESQUINTLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyesquint_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYESQUINTRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyesquint_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYEWIDELEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyewide_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.EYEWIDERIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/eyewide_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.JAWFORWARD]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/jaw_forward", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.JAWLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/jaw_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.JAWMOPEN]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/jaw_open", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.JAWRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/jaw_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHCLOSE]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_close", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHDIMPLELEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_dimple_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHDIMPLERIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_dimple_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHFROWNLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_frown_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHFROWNRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_frown_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHFUNNEL]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_funnel", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHLOWERDOWNLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_lower_down_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHLOWERDOWNRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_lower_down_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHPRESSLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_press_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHPRESSRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_press_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHPUCKER]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_pucker", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHROLLLOWER]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_roll_lower", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHROLLUPPER]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_roll_upper", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHSHRUGLOWER]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_shrug_lower", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHSHRUGUPPER]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_shrug_upper", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHSMILELEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_smile_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHSMILERIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_smile_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHSTRETCHLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_stretch_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHSTRETCHRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_stretch_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHUPPERUPLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_upper_up_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.MOUTHUPPERUPRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/mouth_upper_up_right", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.NOSESNEERLEFT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/nose_sneer_left", value)
        }
    },
    [BLENDSHAPE_CATEGORIES.NOSESNEERRIGHT]: (faustNode, value) => {
        if (faustNode) {
            faustNode.setParamValue("/hand_synth/nose_sneer_right", value)
        }
    }

}






const FAUST_PARAMS = {
    ...HAND_FAUST_PARAMS,
    ...FACE_FAUST_PARAMS,
    ...BLENDSHAPE_FAUST_PARAMS,
}

const updateFaustParams = (faustNode, landmarks) => {
    let i = 0;
    for (const landmark of landmarks) {
        let updateFunc = FACE_FAUST_PARAMS[i];
        if (updateFunc instanceof Function) {
            updateFunc(faustNode, landmark);
        }
        ++i;
    }
};

const updateFaustParamsBlendshapes = (faustNode, blendShapes) => {
    let categories = blendShapes[0].categories;
    for (const item of categories) {
        let updateFunc = BLENDSHAPE_FAUST_PARAMS[item.index];
        if (updateFunc instanceof Function) {
            updateFunc(faustNode, item.score);
        }
    }
}

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




