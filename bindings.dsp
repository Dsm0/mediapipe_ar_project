declare name "finger_libraries";

smoothingFunc = si.smoo;

wrist_x = hslider("[11]wrist_x", 0, 0, 1, 0.01) : smoothingFunc;
wrist_y = hslider("[12]wrist_y", 0, 0, 1, 0.01) : smoothingFunc;
wrist_z = hslider("[13]wrist_z", 0, 0, 1, 0.01) : smoothingFunc;

// thumb_cmc = hslider("thumb_cmc", 0, 0, 1, 0.01);
thumb_cmc_x = hslider("thumb_cmc_x", 1, 0, 1, 0.01) : smoothingFunc;
thumb_cmc_y = hslider("thumb_cmc_y", 1, 0, 1, 0.01) : smoothingFunc;
thumb_cmc_z = hslider("thumb_cmc_z", 1, 0, 1, 0.01) : smoothingFunc;

// thumb_mcp = hslider("thumb_mcp", 0, 0, 1, 0.01);
thumb_mcp_x = hslider("thumb_mcp_x", 1, 0, 1, 0.01) : smoothingFunc;
thumb_mcp_y = hslider("thumb_mcp_y", 1, 0, 1, 0.01) : smoothingFunc;
thumb_mcp_z = hslider("thumb_mcp_z", 1, 0, 1, 0.01) : smoothingFunc;

// thumb_ip = hslider("thumb_ip", 0, 0, 1, 0.01);
thumb_ip_x = hslider("thumb_ip_x", 1, 0, 1, 0.01) : smoothingFunc;
thumb_ip_y = hslider("thumb_ip_y", 1, 0, 1, 0.01) : smoothingFunc;
thumb_ip_z = hslider("thumb_ip_z", 1, 0, 1, 0.01) : smoothingFunc;

// thumb_tip = hslider("thumb_tip", 0, 0, 1, 0.01);
thumb_tip_x = hslider("thumb_tip_x", 1, 0, 1, 0.01) : smoothingFunc;
thumb_tip_y = hslider("thumb_tip_y", 1, 0, 1, 0.01) : smoothingFunc;
thumb_tip_z = hslider("thumb_tip_z", 1, 0, 1, 0.01) : smoothingFunc;

// index_mcp = hslider("index_mcp", 0, 0, 1, 0.01);
index_mcp_x = hslider("index_mcp_x", 1, 0, 1, 0.01) : smoothingFunc;
index_mcp_y = hslider("index_mcp_y", 1, 0, 1, 0.01) : smoothingFunc;
index_mcp_z = hslider("index_mcp_z", 1, 0, 1, 0.01) : smoothingFunc;

// index_pip = hslider("index_pip", 0, 0, 1, 0.01);
index_pip_x = hslider("index_pip_x", 1, 0, 1, 0.01) : smoothingFunc;
index_pip_y = hslider("index_pip_y", 1, 0, 1, 0.01) : smoothingFunc;
index_pip_z = hslider("index_pip_z", 1, 0, 1, 0.01) : smoothingFunc;

// index_dip = hslider("index_dip", 0, 0, 1, 0.01);
index_dip_x = hslider("index_dip_x", 1, 0, 1, 0.01) : smoothingFunc;
index_dip_y = hslider("index_dip_y", 1, 0, 1, 0.01) : smoothingFunc;
index_dip_z = hslider("index_dip_z", 1, 0, 1, 0.01) : smoothingFunc;

// index_tip = hslider("index_tip", 0, 0, 1, 0.01);
index_tip_x = hslider("index_tip_x", 1, 0, 1, 0.01) : smoothingFunc;
index_tip_y = hslider("index_tip_y", 1, 0, 1, 0.01) : smoothingFunc;
index_tip_z = hslider("index_tip_z", 1, 0, 1, 0.01) : smoothingFunc;

// middle_mcp = hslider("middle_mcp", 0, 0, 1, 0.01);
middle_mcp_x = hslider("middle_mcp_x", 1, 0, 1, 0.01) : smoothingFunc;
middle_mcp_y = hslider("middle_mcp_y", 1, 0, 1, 0.01) : smoothingFunc;
middle_mcp_z = hslider("middle_mcp_z", 1, 0, 1, 0.01) : smoothingFunc;

// middle_pip = hslider("middle_pip", 0, 0, 1, 0.01);
middle_pip_x = hslider("middle_pip_x", 1, 0, 1, 0.01) : smoothingFunc;
middle_pip_y = hslider("middle_pip_y", 1, 0, 1, 0.01) : smoothingFunc;
middle_pip_z = hslider("middle_pip_z", 1, 0, 1, 0.01) : smoothingFunc;

// middle_dip = hslider("middle_dip", 0, 0, 1, 0.01);
middle_dip_x = hslider("middle_dip_x", 1, 0, 1, 0.01) : smoothingFunc;
middle_dip_y = hslider("middle_dip_y", 1, 0, 1, 0.01) : smoothingFunc;
middle_dip_z = hslider("middle_dip_z", 1, 0, 1, 0.01) : smoothingFunc;

// middle_tip = hslider("middle_tip", 0, 0, 1, 0.01);
middle_tip_x = hslider("middle_tip_x", 1, 0, 1, 0.01) : smoothingFunc;
middle_tip_y = hslider("middle_tip_y", 1, 0, 1, 0.01) : smoothingFunc;
middle_tip_z = hslider("middle_tip_z", 1, 0, 1, 0.01) : smoothingFunc;

// ring_mcp = hslider("ring_mcp", 0, 0, 1, 0.01);
ring_mcp_x = hslider("ring_mcp_x", 1, 0, 1, 0.01) : smoothingFunc;
ring_mcp_y = hslider("ring_mcp_y", 1, 0, 1, 0.01) : smoothingFunc;
ring_mcp_z = hslider("ring_mcp_z", 1, 0, 1, 0.01) : smoothingFunc;

// ring_pip = hslider("ring_pip", 0, 0, 1, 0.01);
ring_pip_x = hslider("ring_pip_x", 1, 0, 1, 0.01) : smoothingFunc;
ring_pip_y = hslider("ring_pip_y", 1, 0, 1, 0.01) : smoothingFunc;
ring_pip_z = hslider("ring_pip_z", 1, 0, 1, 0.01) : smoothingFunc;

// ring_dip = hslider("ring_dip", 0, 0, 1, 0.01);
ring_dip_x = hslider("ring_dip_x", 1, 0, 1, 0.01) : smoothingFunc;
ring_dip_y = hslider("ring_dip_y", 1, 0, 1, 0.01) : smoothingFunc;
ring_dip_z = hslider("ring_dip_z", 1, 0, 1, 0.01) : smoothingFunc;

// ring_tip = hslider("ring_tip", 0, 0, 1, 0.01);
ring_tip_x = hslider("ring_tip_x", 1, 0, 1, 0.01) : smoothingFunc;
ring_tip_y = hslider("ring_tip_y", 1, 0, 1, 0.01) : smoothingFunc;
ring_tip_z = hslider("ring_tip_z", 1, 0, 1, 0.01) : smoothingFunc;

// pinky_mcp = hslider("pinky_mcp", 0, 0, 1, 0.01);
pinky_mcp_x = hslider("pinky_mcp_x", 1, 0, 1, 0.01) : smoothingFunc;
pinky_mcp_y = hslider("pinky_mcp_y", 1, 0, 1, 0.01) : smoothingFunc;
pinky_mcp_z = hslider("pinky_mcp_z", 1, 0, 1, 0.01) : smoothingFunc;

// pinky_pip = hslider("pinky_pip", 0, 0, 1, 0.01);
pinky_pip_x = hslider("pinky_pip_x", 1, 0, 1, 0.01) : smoothingFunc;
pinky_pip_y = hslider("pinky_pip_y", 1, 0, 1, 0.01) : smoothingFunc;
pinky_pip_z = hslider("pinky_pip_z", 1, 0, 1, 0.01) : smoothingFunc;

// pinky_dip = hslider("pinky_dip", 0, 0, 1, 0.01);
pinky_dip_x = hslider("pinky_dip_x", 1, 0, 1, 0.01) : smoothingFunc;
pinky_dip_y = hslider("pinky_dip_y", 1, 0, 1, 0.01) : smoothingFunc;
pinky_dip_z = hslider("pinky_dip_z", 1, 0, 1, 0.01) : smoothingFunc;

// pinky_tip = hslider("pinky_tip", 0, 0, 1, 0.01);
pinky_tip_x = hslider("pinky_tip_x", 1, 0, 1, 0.01) : smoothingFunc;
pinky_tip_y = hslider("pinky_tip_y", 1, 0, 1, 0.01) : smoothingFunc;
pinky_tip_z = hslider("pinky_tip_z", 1, 0, 1, 0.01) : smoothingFunc;


nose_x = hslider("nose_x", 1, 0, 1, 0.01) : smoothingFunc;
nose_y = hslider("nose_y", 1, 0, 1, 0.01) : smoothingFunc;
nose_z = hslider("nose_z", 1, 0, 1, 0.01) : smoothingFunc;

noseFactor = hslider("noseFactor", 0, 0, 1, 0.01) : smoothingFunc;

left_iris_x = hslider("left_iris_x", 1, 0, 1, 0.01) : smoothingFunc;
left_iris_y = hslider("left_iris_y", 1, 0, 1, 0.01) : smoothingFunc;
left_iris_z = hslider("left_iris_z", 1, 0, 1, 0.01) : smoothingFunc;

right_iris_x = hslider("right_iris_x", 1, 0, 1, 0.01) : smoothingFunc;
right_iris_y = hslider("right_iris_y", 1, 0, 1, 0.01) : smoothingFunc;
right_iris_z = hslider("right_iris_z", 1, 0, 1, 0.01) : smoothingFunc;


// Face blendshapes
neutral = hslider("neutral", 0, 0, 1, 0.01) : smoothingFunc;
browdown_left = hslider("browdown_left", 0, 0, 1, 0.01) : smoothingFunc;
browdown_right = hslider("browdown_right", 0, 0, 1, 0.01) : smoothingFunc;
browinnerup = hslider("browinnerup", 0, 0, 1, 0.01) : smoothingFunc;
browouterup_left = hslider("browouterup_left", 0, 0, 1, 0.01) : smoothingFunc;
browouterup_right = hslider("browouterup_right", 0, 0, 1, 0.01) : smoothingFunc;
cheek_puff = hslider("cheek_puff", 0, 0, 1, 0.01) : smoothingFunc;
cheek_squint_left = hslider("cheek_squint_left", 0, 0, 1, 0.01) : smoothingFunc;
cheek_squint_right = hslider("cheek_squint_right", 0, 0, 1, 0.01) : smoothingFunc;

eyeblink_left = hslider("eyeblink_left", 0, 0, 1, 0.01) : smoothingFunc;
eyeblink_right = hslider("eyeblink_right", 0, 0, 1, 0.01) : smoothingFunc;

eyelookdown_left = hslider("eyelookdown_left", 0, 0, 1, 0.01) : smoothingFunc;
eyelookdown_right = hslider("eyelookdown_right", 0, 0, 1, 0.01) : smoothingFunc;
eyelookin_left = hslider("eyelookin_left", 0, 0, 1, 0.01) : smoothingFunc;
eyelookin_right = hslider("eyelookin_right", 0, 0, 1, 0.01) : smoothingFunc;
eyelookout_left = hslider("eyelookout_left", 0, 0, 1, 0.01) : smoothingFunc;
eyelookout_right = hslider("eyelookout_right", 0, 0, 1, 0.01) : smoothingFunc;
eyelookup_left = hslider("eyelookup_left", 0, 0, 1, 0.01) : smoothingFunc;
eyelookup_right = hslider("eyelookup_right", 0, 0, 1, 0.01) : smoothingFunc;
eyesquint_left = hslider("eyesquint_left", 0, 0, 1, 0.01) : smoothingFunc;
eyesquint_right = hslider("eyesquint_right", 0, 0, 1, 0.01) : smoothingFunc;
eyewide_left = hslider("eyewide_left", 0, 0, 1, 0.01) : smoothingFunc;
eyewide_right = hslider("eyewide_right", 0, 0, 1, 0.01) : smoothingFunc;
jaw_forward = hslider("jaw_forward", 0, 0, 1, 0.01) : smoothingFunc;
jaw_left = hslider("jaw_left", 0, 0, 1, 0.01) : smoothingFunc;
jaw_open = hslider("jaw_open", 0, 0, 1, 0.01) : smoothingFunc;
jaw_right = hslider("jaw_right", 0, 0, 1, 0.01) : smoothingFunc;
mouth_close = hslider("mouth_close", 0, 0, 1, 0.01) : smoothingFunc;
mouth_dimple_left = hslider("mouth_dimple_left", 0, 0, 1, 0.01) : smoothingFunc;
mouth_dimple_right = hslider("mouth_dimple_right", 0, 0, 1, 0.01) : smoothingFunc;
mouth_frown_left = hslider("mouth_frown_left", 0, 0, 1, 0.01) : smoothingFunc;
mouth_frown_right = hslider("mouth_frown_right", 0, 0, 1, 0.01) : smoothingFunc;
mouth_funnel = hslider("mouth_funnel", 0, 0, 1, 0.01) : smoothingFunc;
mouth_left = hslider("mouth_left", 0, 0, 1, 0.01) : smoothingFunc;
mouth_lower_down_left = hslider("mouth_lower_down_left", 0, 0, 1, 0.01) : smoothingFunc;
mouth_lower_down_right = hslider("mouth_lower_down_right", 0, 0, 1, 0.01) : smoothingFunc;
mouth_press_left = hslider("mouth_press_left", 0, 0, 1, 0.01) : smoothingFunc;
mouth_press_right = hslider("mouth_press_right", 0, 0, 1, 0.01) : smoothingFunc;
mouth_pucker = hslider("mouth_pucker", 0, 0, 1, 0.01) : smoothingFunc;
mouth_right = hslider("mouth_right", 0, 0, 1, 0.01) : smoothingFunc;
mouth_roll_lower = hslider("mouth_roll_lower", 0, 0, 1, 0.01) : smoothingFunc;
mouth_roll_upper = hslider("mouth_roll_upper", 0, 0, 1, 0.01) : smoothingFunc;
mouth_shrug_lower = hslider("mouth_shrug_lower", 0, 0, 1, 0.01) : smoothingFunc;
mouth_shrug_upper = hslider("mouth_shrug_upper", 0, 0, 1, 0.01) : smoothingFunc;
mouth_smile_left = hslider("mouth_smile_left", 0, 0, 1, 0.01) : smoothingFunc;
mouth_smile_right = hslider("mouth_smile_right", 0, 0, 1, 0.01) : smoothingFunc;
mouth_stretch_left = hslider("mouth_stretch_left", 0, 0, 1, 0.01) : smoothingFunc;
mouth_stretch_right = hslider("mouth_stretch_right", 0, 0, 1, 0.01) : smoothingFunc;
mouth_upper_up_left = hslider("mouth_upper_up_left", 0, 0, 1, 0.01) : smoothingFunc;
mouth_upper_up_right = hslider("mouth_upper_up_right", 0, 0, 1, 0.01) : smoothingFunc;
nose_sneer_left = hslider("nose_sneer_left", 0, 0, 1, 0.01) : smoothingFunc;
nose_sneer_right = hslider("nose_sneer_right", 0, 0, 1, 0.01) : smoothingFunc;


