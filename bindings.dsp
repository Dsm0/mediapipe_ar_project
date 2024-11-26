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