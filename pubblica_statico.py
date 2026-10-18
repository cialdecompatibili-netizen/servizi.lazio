"""Prepara _out/ con il solo mirror statico (niente Jekyll, niente tool/admin/demo)."""
import os, shutil
OUT = "_out"
DIRS = ["admin","contatti","author","blog","categoria_portfolio","portfolio-items","servizi","servizi-a-roma","servizi-agli-edifici","servizi-ai-cittadini","servizi-alle-aziende","slide-page","wp-content","wp-includes"]
FILES = ["index.html","robots.txt","sitemap_index.xml","404.html","CNAME"]
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
for d in DIRS:
    if os.path.isdir(d): shutil.copytree(d, os.path.join(OUT, d))
for f in FILES:
    if os.path.isfile(f): shutil.copy(f, OUT)
open(os.path.join(OUT, ".nojekyll"), "w").close()
print("ok", sum(len(f) for _,_,f in os.walk(OUT)), "file")
