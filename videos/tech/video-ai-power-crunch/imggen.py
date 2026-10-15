#!/usr/bin/env python3
"""Photoreal still generation on CPU (bf16 / AMX) with RealVisXL V5.0 Lightning (CreativeML OpenRAIL++-M, commercial use OK).
Usage: python imggen.py prompts.json [--only id1,id2]   -> shots/<id>.png (1344x768)"""
import json, os, sys, time, torch
from diffusers import StableDiffusionXLPipeline, EulerAncestralDiscreteScheduler
from huggingface_hub import hf_hub_download
HERE = os.path.dirname(os.path.abspath(__file__))
prompts = json.load(open(sys.argv[1]))
only = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
torch.set_num_threads(os.cpu_count())
ckpt = hf_hub_download('SG161222/RealVisXL_V5.0_Lightning', 'RealVisXL_V5.0_Lightning_fp16.safetensors')
t0 = time.time()
pipe = StableDiffusionXLPipeline.from_single_file(ckpt, torch_dtype=torch.bfloat16, use_safetensors=True)
pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing='trailing')
pipe.set_progress_bar_config(disable=True)
print('loaded', round(time.time() - t0), 's', flush=True)
NEG = 'cartoon, illustration, 3d render, cgi, painting, drawing, low quality, blurry, text, watermark, logo, signature, deformed, extra fingers, oversaturated, plastic skin'
for p in prompts:
    if only and p['id'] not in only: continue
    out = os.path.join(HERE, 'shots', p['id'] + '.png')
    if os.path.exists(out): continue
    t1 = time.time()
    g = torch.Generator('cpu').manual_seed(p.get('seed', 7))
    img = pipe(prompt=p['prompt'] + ', photorealistic, shot on Sony A7R IV, 35mm lens, natural lighting, high dynamic range, ultra detailed, 8k, film grain',
               negative_prompt=NEG, width=1344, height=768, num_inference_steps=p.get('steps', 6), guidance_scale=1.6, generator=g).images[0]
    img.save(out); print(p['id'], round(time.time() - t1), 's', flush=True)
