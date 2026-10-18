"""Prepara _out/ con il solo mirror statico (niente Jekyll, niente tool/admin/demo)."""
import os, shutil, subprocess, sys
OUT = "_out"; TMP = "_avada_site"
DIRS = ["admin","contatti","author","blog","categoria_portfolio","portfolio-items","servizi","servizi-a-roma","servizi-agli-edifici","servizi-ai-cittadini","servizi-alle-aziende","slide-page","wp-content","wp-includes"]
FILES = ["index.html","robots.txt","sitemap_index.xml","404.html","CNAME"]
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
for d in DIRS:
    if os.path.isdir(d): shutil.copytree(d, os.path.join(OUT, d))
for f in FILES:
    if os.path.isfile(f): shutil.copy(f, OUT)
open(os.path.join(OUT, ".nojekyll"), "w").close()

# --- Jekyll: articoli e categorie (_avada/) sovrapposti al mirror, stesso URL. baseurl: con CNAME "" altrimenti /<repo> (anteprima github.io)
repo = os.environ.get("GITHUB_REPOSITORY", "x/servizi.lazio").split("/")[-1]
baseurl = "" if os.path.isfile("CNAME") else "/" + repo
open("_avada/_config_deploy.yml", "w").write('baseurl: "%s"\navada_prefix: ""\n' % baseurl)
shutil.rmtree(TMP, ignore_errors=True)
cmd = os.environ.get("JEKYLL_CMD", "jekyll") + " build -s _avada -d " + TMP + " --config _avada/_config.yml,_avada/_config_deploy.yml"
r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
print((r.stdout + r.stderr)[-1500:])
if r.returncode != 0 or not os.path.isdir(TMP): sys.exit("build Jekyll fallita")
n = 0
for dp, dn, fn in os.walk(TMP):
    for f in fn:
        src = os.path.join(dp, f); dst = os.path.join(OUT, os.path.relpath(src, TMP))
        os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy(src, dst); n += 1
print("jekyll:", n, "file sovrapposti")
if baseurl:  # anteprima su github.io: i link root-relative nel testo degli articoli vanno prefissati col baseurl
    import re
    pre = re.compile(r'((?:href|src|action|poster|data-src)=")/(?!/|%s/)' % re.escape(baseurl.strip("/")))
    sset = re.compile(r'(srcset=")([^"]*)"')
    fixset = lambda m: m.group(1) + re.sub(r'(^|,\s*)/(?!/)', lambda k: k.group(1) + baseurl + "/", m.group(2)) + '"'
    for dp, dn, fn in os.walk(TMP):
        for f in fn:
            if not f.endswith(".html"): continue
            p = os.path.join(OUT, os.path.relpath(os.path.join(dp, f), TMP))
            s = open(p, encoding="utf-8", newline="").read()
            s2 = sset.sub(fixset, pre.sub(lambda m: m.group(1) + baseurl + "/", s))
            if s2 != s: open(p, "w", encoding="utf-8", newline="").write(s2)
print("ok", sum(len(f) for _,_,f in os.walk(OUT)), "file")
