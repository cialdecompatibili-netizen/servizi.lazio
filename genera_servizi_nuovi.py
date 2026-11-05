# -*- coding: utf-8 -*-
# Genera gli articoli dei nuovi servizi (servizi_nuovi_data.py) in _lazio/servizi-agli-edifici/<cat>/. Idempotente: salta i file esistenti.
import re, io, os
from servizi_nuovi_data import L
BASE = os.path.dirname(os.path.abspath(__file__))
DATE = '2026-11-05T12:00:00'
ASSIST = ('linee vita', 'condomini', 'infiltrazioni', 'fotovoltaici', 'ponti e viadotti', 'campanili')

def slug(s):
    s = s.lower()
    for a, b in (('à','a'),('è','e'),('é','e'),('ì','i'),('ò','o'),('ù','u'),("'",'')): s = s.replace(a, b)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')
def q(s): return s.replace('\\', '\\\\').replace('"', '\\"')

def main():
    wp, made = 92001, 0
    for t, cosa, intro, secs in L:
        cat = 'assistenza-agli-edifici' if any(k in t.lower() for k in ASSIST) else 'edilizia'
        title = '%s: preventivi gratuiti' % t
        desc = 'Cerchi professionisti per %s a Roma e nel Lazio? Richiedi preventivi gratuiti al 100%% e senza impegno.' % cosa
        out = os.path.join(BASE, '_lazio', 'servizi-agli-edifici', cat); os.makedirs(out, exist_ok=True)
        path = os.path.join(out, slug(title) + '.html'); wp += 1
        if os.path.exists(path): continue
        cats = '["servizi/servizi-agli-edifici/%s", "servizi/servizi-agli-edifici"]' % cat
        head = ['---', 'layout: "avada-articolo"', 'title: "%s"' % q(title), 'description: "%s"' % q(desc),
                'seo_title: "%s - Servizi Lazio"' % q(title), 'date: "%s"' % DATE, 'last_modified_at: "%s"' % DATE,
                'wp_id: %d' % wp, 'wp_tipo: "post"', 'categorie: ' + cats, 'excerpt: "%s"' % q(desc),
                'render_with_liquid: false', 'categorie_visibili: ' + cats, '---', '']
        body = ['<h2>%s</h2>' % t, '<p>%s</p>' % intro]
        for h, x in secs: body += ['<h2>%s</h2>' % h, '<p>%s</p>' % x]
        body += ['<h2>Come ottenere un preventivo</h2>',
                 '<p>Indica tipo di edificio, altezza approssimativa e zona. Compila il <strong>form</strong> qui in fondo: ti metteremo in contatto con ditte della tua provincia, <strong>gratuitamente e senza impegno</strong>.</p>']
        io.open(path, 'w', encoding='utf-8', newline='\n').write('\n'.join(head) + '\n'.join(body) + '\n'); made += 1
    print(made, 'articoli creati')

if __name__ == '__main__':
    main()
