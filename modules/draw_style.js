

const HAND_STYLES = {
    [HAND_LANDMARKS.WRIST]: (landmark) => {
        let radius = Math.max(30 - ((landmark.value.z + 1) * 280), 0.2);
        return { color: "green", lineWidth: 4, radius, visibilityMin: .5, fillColor: "red" }
    }
    ,
    DEFAULT: (landmark) => {
        let radius = Math.max(30 - ((landmark.value.z + 1) * 28), 0.2);
        return { color: "red", lineWidth: 4, radius, visibilityMin: .5, fillColor: "red" }
    }
}

const getStyle = (landmark, landmarkIndex) => {
    if (landmarkIndex in HAND_STYLES) {
        return HAND_STYLES[landmarkIndex](landmark);
    }
    return HAND_STYLES.DEFAULT(landmark);
}