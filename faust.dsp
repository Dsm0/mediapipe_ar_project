declare name "hand_synth";
declare author "Remi Chapelle";

import("stdfaust.lib");
import("bindings.dsp");

// Final frequency calculation with arpeggiator
// f = (base_freq + arp_offset) : ba.midikey2hz;

f = 6 : ba.midikey2hz(floor(_)) * (os.sawtooth(g*160.0) : it.remap(-1,1,1,8*noseFactor + 5)); 

blink_factor = (eyeblink_left+eyeblink_right)/2.0;

blink_factor_trigger = (blink_factor  > 0.5 ) : 1.0 : 0.0;

blink_factor_env = en.ar(0.01,0.4,blink_factor_trigger);

g = noseFactor : min(1) : max(0) : (_ - blink_factor)*0.15;

t = button("[10]gate") : _ - blink_factor : si.smoo;
// t = 1 : si.smoo;

// p8 = hslider("[03]gain 8ve partial",1,0,1,0.01);
p8 = 1.0;

// p5 = hslider("[04]gain 5th partial",1,0,1,0.01);
p5 = 1.0;

// p3 = hslider("[05]gain 3d partial",1,0,1,0.01);
p3 = 1.0;

// px = hslider("[06]gain other partials",0.05,0,1,0.01);
px = 1.0;

// p0 = hslider("[02]gain fundamental",1,0,1,0.01);
p0 = 1.0;


psub = hslider("[07]gain lower octave",1,0,1,0.01);
nog = hslider("[08]noise gain",0.01,0,1,0.001);
pg = hslider("[09]gain preset",1,0,1,0.01);
r = dm.zita_light; //reverb


//Instrument

orgue_tone(freq) = 
    os.osc(freq)          *p0
        + os.osc(freq*2)   *p8
        + os.osc(freq*0.5) *psub*0.5
        + os.osc(freq*1.5) *p5*0.3
        + os.osc(freq*3)   *p5*0.9
        + os.osc(freq*4)   *p8*0.8
        + os.osc(freq*5)   *p3*0.7
        + os.osc(freq*6)   *p5*0.6
        + os.osc(freq*7)   *px*0.5
        + os.osc(freq*8)   *p8*0.6
        + os.osc(freq*9)   *px*0.3
        + os.osc(freq*10)  *p3*0.2
        + os.osc(freq*11)  *px*0.15
        + os.osc(freq*12)  *p5*0.1
        + os.osc(freq*13)  *px*0.8
        + os.osc(freq*14)  *px*0.6
        + os.osc(freq*15)  *px*0.5
        + os.osc(freq*16)  *p8*0.4
        + no.noise*nog;



// FROM:
// https://github.com/grame-cncm/faust/blob/master-dev/examples/bela/WaveSynth_Analog.dsp
WF(tablesize, rang) = abs((fmod((1+(float(ba.time)*rang)/float(tablesize)), 4.0))-2) -1.;

waveTravel = g;
lfoDepth = g;
lfoFreq = 10;
moov = ((os.lf_trianglepos(lfoFreq) * lfoDepth) + waveTravel) : min(1) : max(0);

// 4 WF maxi with this version:
scanner(nb, position) = -(_,soustraction) : *(_,coef) : cos : max(0)
    with {
        coef = 3.14159 * ((nb-1)*0.5);
        soustraction = select2( position>0, 0, (position/(nb-1)) );
    };

wfosc(freq) = (rdtable(tablesize, wt1, faze)*(moov : scanner(4,0)))+(rdtable(tablesize, wt2, faze)*(moov : scanner(4,1)))
            + (rdtable(tablesize, wt3, faze)*(moov : scanner(4,2)))+(rdtable(tablesize, wt4, faze)*(moov : scanner(4,3)))
    with {
        tablesize = 1024;
        wt1 = WF(tablesize, 16);
        wt2 = WF(tablesize, 8);
        wt3 = WF(tablesize, 6);
        wt4 = WF(tablesize, 4);
        faze = int(os.phasor(tablesize,freq));
    };

// process = wfosc(gFreq) * vol;










// filter = fi.resonlp(f * (pinky_tip_y *24 : floor(_)), pinky_tip_y*80, 1);

offset = blink_factor;
chord = (wfosc(f + offset) 
    + wfosc(f*(18/12) + offset)*os.osc(f + g*100) 
    + wfosc(f*(36/12) + offset)*os.osc(f + g*100));

tooth = os.sawtooth(f*8) : _ * (blink_factor*2.5);

organ = (chord*2.0 + tooth*1.0)*g*t : filter : _ <: r;

filter = fi.resonbp(f*8 , 0.8 + g*2.0, 1);


echo_time = max(800 - noseFactor*700,0.01);
echo_feedback = 0.2;
echo_damping = 0.8;

multiecho = vgroup("stereo echo", multi(ef.echo(echo_time,echo_feedback,echo_damping), 2))
    with { 
        multi(f,1) = f;
        multi(f,n) = f,multi(f,n-1);
    };

preProc = organ <: _,_ : multiecho;

process = preProc;