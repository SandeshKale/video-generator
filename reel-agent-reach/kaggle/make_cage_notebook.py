# Composes CageMatch_AVATAR.ipynb: clone the user's voice for the cage-match script, word timings, avatar (LivePortrait) + LatentSync for the host beats, RVM cut-outs.
import json, re
av = json.load(open('AgentReach_AVATAR.ipynb'))['cells']; al = json.load(open('AgentReach_GPU_ALL.ipynb'))['cells']
src = lambda c: ''.join(c['source'])
def code(s): return {"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": s.splitlines(True)}
SENT = [
 ("s01",1,"This robot cage fight went viral.","This robot cage fight went viral.",True,1.05),
 ("s02",1,"But no AI was fighting.","But no AI was fighting.",True,1.05),
 ("s03",2,"A content creator stepped into a cage in San Francisco, and fought three humanoids.","A content creator stepped into a cage in San Francisco, and fought three humanoids.",False,None),
 ("s04",3,"A small Unitree G1 first.","A small Unitree G one first.",False,None),
 ("s05",3,"Then two modified T800s, with kicks up to 850 pounds, the company says.","Then two modified T eight hundreds, with kicks up to eight hundred fifty pounds, the company says.",False,None),
 ("s06",4,"Robots versus humans, right?","Robots versus humans, right?",True,None),
 ("s07",4,"Here's the twist.","Here's the twist.",True,0.95),
 ("s08",5,"Every robot had a human pilot, driving it live with VR gear or a gamepad, its partner says.","Every robot had a human pilot, driving it live with V R gear or a gamepad, its partner says.",False,None),
 ("s09",6,"The AI?","The A I?",False,None),
 ("s10",6,"It only keeps the robot upright.","It only keeps the robot upright.",False,None),
 ("s11",7,"Balance is the hard part.","Balance is the hard part.",True,None),
 ("s12",7,"The fighting? A video game with a body.","The fighting? A video game with a body.",True,None),
 ("s13",8,"Its pilots even qualified in a simulator.","Its pilots even qualified in a simulator.",False,None),
 ("s14",8,"Three thousand, six hundred seventy matches.","Three thousand, six hundred seventy matches.",False,None),
 ("s15",9,"Eight million views later, California stepped in.","Eight million views later, California stepped in.",False,None),
 ("s16",9,"A cease-and-desist, twelve days after the fight.","A cease and desist, twelve days after the fight.",False,None),
 ("s17",10,"So is it a robot fight, or a video game with a body?","So is it a robot fight, or a video game with a body?",True,None),
 ("s18",10,"Tell me below, and follow for more.","Tell me below, and follow for more.",True,None)]
HOST = [s[0] for s in SENT if s[4]]
cells = []
cells.append(json.loads(json.dumps(av[0])))
cells[0]['source'] = ["# Cage-match reel — your voice + your avatar (GPU stage)\n", "\n", "1. **OmniVoice** speaks the 18 script lines in *your* voice (cloned from your own clip; best of 4 takes per line by speech recognition) and **faster-whisper** gives word timings.\n",
  "2. **LivePortrait** transfers your real clip's head motion, brows, blinks onto your avatar still (InsightFace replaced by YuNet), **LatentSync** lip-syncs the lines that show the corner avatar, **Robust Video Matting** cuts the avatar out.\n",
  "Kaggle: GPU P100, Internet On, Run All (about 1–1.5 h, resumable). Output: `cagematch-out.zip`. Only your own voice/face, for your own reels.\n"]
c1 = src(av[1])
c1 = re.sub(r'"voice_zip_id".*\n', '', c1)
c1 = re.sub(r'  "fix_lines".*\n', '  "takes_per_ref": 2,\n  "sentences": ' + json.dumps(SENT).replace('true','True').replace('false','False').replace('null','None') + ',\n', c1)
c1 = re.sub(r'  "host_ids".*\n', '  "host_ids": ' + json.dumps(HOST) + '\n', c1)
c1 = c1.replace("['work','vo','groups','host','out','lp']", "['work','takes','vo','groups','host','out','lp']")
cells.append(code(c1))
cells.append(av[2])
# inputs: only the clip + refs
c3 = """# 3. Inputs: your real clip (performance reference + voice references)
drive_get(CFG['clip_id'], f'{BASE}/work/real.mp4')
for k, v in CFG['refs'].items():
    o = f'{BASE}/work/ref_{k}.wav'
    if not os.path.exists(o): sh(f"ffmpeg -v error -y -ss {v['start']} -to {v['end']} -i {BASE}/work/real.mp4 -vn -ac 1 -ar 24000 -af loudnorm=I=-20 {o}")
print('refs ready')"""
cells.append(code(c3))
for i in (4, 5, 6): cells.append(al[i])     # voice generation, take picking, word timings
for c in av[5:]: cells.append(c)
nb = {"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python"}}, "nbformat": 4, "nbformat_minor": 5}
txt = json.dumps(nb, indent=1).replace('agentreach-avatar-out.zip', 'cagematch-out.zip')
open('CageMatch_AVATAR.ipynb', 'w').write(txt); print('cells', len(cells))
