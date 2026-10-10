#!/usr/bin/env python3
"""CPU SDXL (RealVisXL Lightning) -> original flat 2D cartoon character in a T-pose on white. Usage: python gen.py id seed 'prompt'"""
import os, sys, time, torch
from diffusers import StableDiffusionXLPipeline, EulerAncestralDiscreteScheduler
from huggingface_hub import hf_hub_download
HERE = os.path.dirname(os.path.abspath(__file__)); torch.set_num_threads(os.cpu_count())
ckpt = hf_hub_download('SG161222/RealVisXL_V5.0_Lightning', 'RealVisXL_V5.0_Lightning_fp16.safetensors')
pipe = StableDiffusionXLPipeline.from_single_file(ckpt, torch_dtype=torch.bfloat16, use_safetensors=True)
pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config, timestep_spacing='trailing'); pipe.set_progress_bar_config(disable=True)
NEG = 'photo, photorealistic, 3d render, realistic skin, shading gradients, background scenery, text, watermark, logo, cropped, multiple characters, hands behind back, crossed arms, blurry'
id_, seed, prompt = sys.argv[1], int(sys.argv[2]), sys.argv[3]
t = time.time(); g = torch.Generator('cpu').manual_seed(seed)
img = pipe(prompt=prompt, negative_prompt=NEG, width=832, height=1024, num_inference_steps=6, guidance_scale=1.8, generator=g).images[0]
img.save(os.path.join(HERE, id_ + '.png')); print(id_, round(time.time() - t), 's')
