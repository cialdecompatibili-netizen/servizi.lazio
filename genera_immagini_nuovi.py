# -*- coding: utf-8 -*-
# Genera le immagini (Gemini, gemini_auto\img.py) per gli articoli nuovi senza thumb. Idempotente. STOP al primo fallimento (anti-spreco crediti).
import os, re, subprocess, sys, io
from PIL import Image
BASE = os.path.dirname(os.path.abspath(__file__))
GA = r"C:\Users\mirco\Desktop\gemini_auto"
OUT = os.path.join(GA, "test_out", "servizi_lazio")
UP = os.path.join(BASE, "wp-content", "uploads", "2026", "11")
os.makedirs(OUT, exist_ok=True); os.makedirs(UP, exist_ok=True)
MAX = int(sys.argv[1]) if len(sys.argv) > 1 else 999
files = []
for r, _, fs in os.walk(os.path.join(BASE, "_lazio")):
    for f in fs:
        if f.endswith(".html"):
            p = os.path.join(r, f); t = io.open(p, encoding="utf-8").read()
            if 'date: "2026-11-05T12:00:00"' in t[:900] and "thumb_full:" not in t[:1500]: files.append((p, t))
print(len(files), "da fare", flush=True)
done = 0
for p, t in files:
    if done >= MAX: break
    title = re.search(r'^title: "(.*)"$', t, re.M).group(1).replace('\\"', '"')
    nome = re.sub(r"[^a-z0-9]+", "-", os.path.basename(p)[:-5].lower()).strip("-")[:70]
    sogg = title.split(" a Roma e nel Lazio")[0] + ", rope access workers on an Italian building, Rome"
    webp = os.path.join(OUT, nome + ".webp")
    if not os.path.exists(webp):
        subprocess.run([sys.executable, os.path.join(GA, "img.py"), sogg, "--profilo", "blog", "--nome", nome, "--out", OUT, "--tentativi", "2"],
                       capture_output=True, text=True, cwd=GA, timeout=900)
    if not os.path.exists(webp):
        print("STOP: non generata", nome, flush=True); break
    im = Image.open(webp).convert("RGB"); w, h = im.size
    im.resize((1200, round(1200 * h / w))).save(os.path.join(UP, nome + ".jpg"), "JPEG", quality=82)
    im.resize((320, 202)).save(os.path.join(UP, nome + "-320x202.jpg"), "JPEG", quality=82)
    s = min(w, h); im.crop(((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2)).resize((66, 66)).save(os.path.join(UP, nome + "-66x66.jpg"), "JPEG", quality=80)
    u = "/wp-content/uploads/2026/11/" + nome
    alt = title.split(":")[0].replace('"', "'")
    add = ('og_image: "https://servizi.lazio.it%s.jpg"\nog_w: "1200"\nog_h: "%d"\nog_type: "image/jpeg"\nthumb: "%s-66x66.jpg"\nthumb_full: "%s.jpg"\n'
           'thumb_alt: "%s"\nthumb_card: "%s-320x202.jpg"\nthumb_w: "1200"\nthumb_h: "%d"\nthumb_caption: ""\n') % (u, round(1200 * h / w), u, u, alt, u, round(1200 * h / w))
    t = re.sub(r'(^wp_tipo: .*\n)', lambda m: m.group(1) + add, t, count=1, flags=re.M)
    io.open(p, "w", encoding="utf-8", newline="\n").write(t); done += 1
    print("OK", nome, flush=True)
print("FINE", done, flush=True)
