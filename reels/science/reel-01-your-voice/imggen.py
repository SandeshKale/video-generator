#!/usr/bin/env python3
"""Stills for reel #01 on CPU (bf16) with RealVisXL V5.0 Lightning. Usage: python3 imggen.py prompts.json [--only id,id]  -> shots/<id>.png
Each prompt may set w,h,steps,seed,suffix,neg."""
import json, os, sys, time, torch
from diffusers import StableDiffusionXLPipeline, EulerAncestralDiscreteScheduler
from huggingface_hub import hf_hub_download
HERE = os.path.dirname(os.path.abspath(__file__))
prompts = json.load(open(os.path.join(HERE, sys.argv[1])))
only = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
torch.set_num_threads(os.cpu_count())
ckpt = hf_hub_download('SG161222/RealVisXL_V5.0_Lightning', 'RealVisXL_V5.0_Lightning_fp16.safetensors')
pipe = StableDiffusionXLPipeline.from_single_file(ckpt, torch_dtype=torch.bfloat16, use_safetensors=True)
pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing='trailing'); pipe.set_progress_bar_config(disable=True)
NEG = 'cartoon, illustration, 3d render, cgi, painting, drawing, low quality, blurry, text, watermark, logo, signature, deformed, extra fingers, oversaturated, plastic skin'
SUF = ', photorealistic, shot on Sony A7R IV, 85mm lens, cinematic lighting, high dynamic range, ultra detailed, 8k, film grain'
os.makedirs(os.path.join(HERE, 'shots'), exist_ok=True)
for p in prompts:
    if only and p['id'] not in only: continue
    out = os.path.join(HERE, 'shots', p['id'] + '.png')
    if os.path.exists(out): continue
    t1 = time.time(); g = torch.Generator('cpu').manual_seed(p.get('seed', 7))
    img = pipe(prompt=p['prompt'] + p.get('suffix', SUF), negative_prompt=p.get('neg', NEG), width=p.get('w', 576), height=p.get('h', 1024),
               num_inference_steps=p.get('steps', 6), guidance_scale=p.get('cfg', 1.6), generator=g).images[0]
    img.save(out); print(p['id'], round(time.time() - t1), 's', flush=True)
