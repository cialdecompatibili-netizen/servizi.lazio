# -*- coding: utf-8 -*-
# Replica C: servizi di Roma nelle 4 province (riusa PROV di genera_province.py). Idempotente.
import os, io
from genera_province import PROV, slug, q, BASE, DATE, CTA
T = [
 ('Edilizia su fune', "i lavori di edilizia su fune",
  [('Cos\'è l\'edilizia su fune', "Operatori specializzati lavorano appesi con <strong>doppia fune e imbracature certificate</strong>, senza ponteggi: tinteggiature, ripristini, sigillature, pulizie e piccole riparazioni su facciate, balconi e coperture."),
   ('Vantaggi', "Tempi rapidi, costi più bassi rispetto al ponteggio e meno disagi per chi vive o lavora nell'edificio."),
   ('Sicurezza', "Si seguono procedure di lavoro in quota, controllo dell'area sottostante e attrezzature controllate.")],
  ('Edilizia su fune a {n}', "Nel territorio di {c} ci sono {ed}, spesso con {mat}. Con un {clima}, i lavori su fune permettono interventi rapidi a {comuni} e dintorni.")),
 ('Frontalini balcone', "la manutenzione e il ripristino dei frontalini dei balconi",
  [('Perché si degradano', "Acqua, gelo e ferri ossidati sgretolano il copriferro dei frontalini e creano <strong>rischio di caduta di materiale</strong>."),
   ('Interventi', "Rimozione delle parti instabili, trattamento dei ferri, ricostruzione con malte, rasatura e tinteggiatura, anche in fune."),
   ('Quando intervenire', "Alla comparsa di macchie di ruggine, crepe o distacchi, prima che il danno si estenda.")],
  ('Frontalini a {n}', "Nelle palazzine di {c} il {clima} accelera il degrado dei balconi. Interveniamo a {comuni} e nei comuni vicini.")),
 ('Pulizia grondaie', "la pulizia di grondaie e pluviali",
  [('Perché è importante', "Grondaie ostruite da foglie e detriti causano <strong>infiltrazioni, muffa e danni alle facciate</strong>."),
   ('Come si esegue', "Rimozione dei depositi, controllo di pendenze e giunzioni, lavaggio dei pluviali, anche in quota."),
   ('Frequenza', "Almeno una volta all'anno, più spesso se ci sono alberi vicini.")],
  ('Grondaie a {n}', "In {c} il {clima} mette alla prova le grondaie delle case tipiche ({ed}). Lavoriamo a {comuni} e dintorni.")),
 ('Pulizia vetri e vetrate', "la pulizia di vetri, vetrate e facciate continue",
  [('Dove si interviene', "Uffici, negozi, condomini, serre e facciate continue, anche ad altezze elevate."),
   ('Metodi', "Acqua depurata, panni e raschietti professionali, <strong>lavoro su fune</strong> o con aste telescopiche."),
   ('Programma', "Interventi periodici concordati in base all'esposizione e allo sporco.")],
  ('Pulizia vetri a {n}', "Per gli edifici di {c} il {clima} sporca i vetri in modo diverso nelle stagioni. Operiamo a {comuni} e nei comuni vicini.")),
 ('Manutenzione aree verdi', "la manutenzione di giardini e aree verdi",
  [('Cosa comprende', "Taglio dell'erba, potatura di siepi e alberi, pulizia, concimazione e gestione dell'irrigazione."),
   ('Per chi', "Condomini, aziende, ville e enti che vogliono un verde curato con costi programmabili."),
   ('Contratti', "Si possono stipulare piani annuali con interventi periodici.")],
  ('Aree verdi a {n}', "Nel territorio di {c}, tra {pae}, scegliamo specie e interventi adatti al {clima}. Lavoriamo a {comuni} e nei dintorni.")),
 ('Realizzazione recinzioni', "la realizzazione di recinzioni",
  [('Tipi di recinzione', "Reti metalliche, ringhiere, cancellate, pannelli e recinzioni in legno, scelte per funzione ed estetica."),
   ('Installazione', "Si realizzano plinti o fissaggi, montaggio, verniciatura e eventuali cancelli."),
   ('Permessi', "Per alcune recinzioni possono servire pratiche edilizie: ci si informa presso il Comune.")],
  ('Recinzioni a {n}', "Nei contesti di {c} ({ed}) le recinzioni vanno scelte in armonia con {mat}. Operiamo a {comuni} e dintorni.")),
]
def main():
    wp, made = 93001, 0
    for kw, what, secs, (loch, loct) in T:
        for pk, P in PROV.items():
            wp += 1
            title = '%s %s: preventivi gratuiti' % (kw, P['n'])
            path0 = os.path.join(BASE, '_lazio', 'servizi-a-' + pk, 'servizi-edili-' + pk); os.makedirs(path0, exist_ok=True)
            path = os.path.join(path0, slug(title) + '.html')
            if os.path.exists(path): continue
            desc = 'Cerchi professionisti per %s a %s? Richiedi preventivi gratuiti al 100%% e senza impegno.' % (what, P['c'])
            cats = '["servizi/servizi-agli-edifici/edilizia", "servizi/servizi-agli-edifici", "servizi/servizi-a-%s/servizi-edili-%s", "servizi/servizi-a-%s"]' % (pk, pk, pk)
            head = ['---', 'layout: "avada-articolo"', 'title: "%s"' % q(title), 'description: "%s"' % q(desc),
                    'seo_title: "%s - Servizi Lazio"' % q(title), 'date: "%s"' % DATE, 'last_modified_at: "%s"' % DATE,
                    'wp_id: %d' % wp, 'wp_tipo: "post"', 'categorie: ' + cats, 'excerpt: "%s"' % q(desc),
                    'render_with_liquid: false', 'categorie_visibili: ' + cats, '---', '']
            body = ['<h2>%s %s</h2>' % (kw, P['n']), '<p>Stai cercando professionisti per %s a <strong>%s</strong>? Qui trovi informazioni utili e puoi richiedere <strong>preventivi gratuiti</strong>.</p>' % (what, P['c'])]
            for h, x in secs: body += ['<h2>%s a %s</h2>' % (h, P['n']), '<p>%s</p>' % x]
            body += ['<h2>%s</h2>' % loch.format(**P), '<p>%s</p>' % loct.format(**P), CTA.format(**P)]
            io.open(path, 'w', encoding='utf-8', newline='\n').write('\n'.join(head) + '\n'.join(body) + '\n'); made += 1
    print(made, 'articoli creati')
if __name__ == '__main__': main()
