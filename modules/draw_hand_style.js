
// https://ai.google.dev/static/edge/mediapipe/images/solutions/hand-landmarks.png
const LANDMARKS = {
    DEFAULT: -1,
    WRIST: 0,
    THUMB_CMC: 1,
    THUMB_MCP: 2,
    THUMB_IP: 3,
    THUMB_TIP: 4,
    INDEX_FINGER_MCP: 5,
    INDEX_FINGER_PIP: 6,
    INDEX_FINGER_DIP: 7,
    INDEX_FINGER_TIP: 8,
    MIDDLE_FINGER_MCP: 9,
    MIDDLE_FINGER_PIP: 10,
    MIDDLE_FINGER_DIP: 11,
    MIDDLE_FINGER_TIP: 12,
    RING_FINGER_MCP: 13,
    RING_FINGER_PIP: 14,
    RING_FINGER_DIP: 15,
    RING_FINGER_TIP: 16,
    PINKY_MCP: 17,
    PINKY_PIP: 18,
    PINKY_DIP: 19,
    PINKY_TIP: 20,
};


const HAND_STYLES = {
    DEFAULT: (landmark) => {
        // console.log(landmark);

        let radius = Math.max(30 - ((landmark.value.z + 1) * 28), 0.5);
        return { color: "red", lineWidth: 4, radius, visibilityMin: .5, fillColor: "red" }
    }
}

const getStyle = (landmark, landmarkIndex) => {
    if (landmarkIndex in HAND_STYLES) {
        return HAND_STYLES[landmarkIndex](landmark);
    }
    return HAND_STYLES.DEFAULT(landmark);
}