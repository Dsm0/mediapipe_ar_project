# mediapipe_ar_project
final project for "creating for ar" course





# NOTE:
to update sounds, need to update:

-- will be generated by faust ide exports
- dsp-module.wasm
- dsp-meta.json

-- will be updated by hand
- hand_faust_params.js




## NOTE:
- all faust patches should have some kind of glide from one param value to the next,
- ie. setParam('gain',0.2) -> setParam('gain',0.5) should sound like a glide, not a jump