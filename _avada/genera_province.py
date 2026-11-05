# -*- coding: utf-8 -*-
# Genera gli articoli "servizi edili" per Latina, Frosinone, Viterbo, Rieti dagli articoli di Roma (stessa logica/pattern).
import re, io, os, sys
BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, '_lazio', 'servizi-a-roma', 'servizi-edili-roma')
OUT = os.path.join(BASE, '_lazio', 'servizi-per-provincia')
DATE = '2026-11-05T09:00:00'

PROV = {
 'latina': dict(n='Latina', c='Latina e provincia', comuni='Latina, Aprilia, Cisterna di Latina, Terracina, Formia, Gaeta, Sezze e Fondi',
  clima='clima mite e salino della costa pontina, con umidità elevata e vento di mare',
  ed='case di bonifica degli anni Trenta, ville a pochi passi dal mare e casali nella campagna pontina',
  pae='pianura agricola, dune costiere e colline dei Monti Lepini e Ausoni', mat='cotto, tufo e intonaci esposti alla salsedine'),
 'frosinone': dict(n='Frosinone', c='Frosinone e provincia', comuni='Frosinone, Cassino, Sora, Alatri, Ferentino, Anagni, Fiuggi e Veroli',
  clima='inverni freddi con gelate e piogge intense sulle zone appenniniche e della Ciociaria',
  ed='borghi di pietra, case rurali ciociare e palazzine dei centri industriali della Valle del Sacco',
  pae='colline ciociare, valli fluviali e rilievi degli Ernici e dei Monti Cairo', mat='pietra calcarea, laterizio e coppi tradizionali'),
 'viterbo': dict(n='Viterbo', c='Viterbo e provincia', comuni='Viterbo, Civita Castellana, Tarquinia, Montefiascone, Orte, Vetralla, Ronciglione e Bagnoregio',
  clima='clima continentale attorno ai laghi di Bolsena e Vico, con estati calde e inverni umidi',
  ed='edifici in tufo e peperino, casali della Tuscia e centri storici medievali',
  pae='colline vulcaniche, boschi di castagno e quercia, terreni a ridosso dei laghi', mat='tufo, peperino e coppi in cotto fatti a mano'),
 'rieti': dict(n='Rieti', c='Rieti e provincia', comuni='Rieti, Poggio Mirteto, Fara in Sabina, Cittaducale, Amatrice, Magliano Sabina, Leonessa e Contigliano',
  clima='inverni rigidi con neve e forti escursioni termiche, specie nella Valle Reatina e verso il Terminillo',
  ed='case in pietra della Sabina, fienili e casali di montagna, edifici in zona sismica',
  pae='Piana Reatina, uliveti sabini e rilievi appenninici', mat='pietra locale, legno di castagno e quercia, coppi'),
}

# (key file Roma, titolo base, descrizione breve, [(h2, testo)], (h2 locale, testo locale con tratti provincia))
T = [
 ('arredare-il-tuo-giardino', 'Arredare il giardino', 'l\'arredo e la sistemazione del giardino',
  [('Perché progettare bene il giardino', 'Un giardino curato aumenta il valore della casa e allunga la stagione in cui si vive all\'aperto. Prima di acquistare mobili o piante conviene definire <strong>zone, percorsi, illuminazione e irrigazione</strong>, così da evitare rifacimenti costosi.'),
   ('Pavimentazioni, pergole e arredi', 'Pavimenti drenanti, gazebo, pergole in legno o ferro, <strong>recinzioni</strong> e aree relax vanno scelti in base all\'esposizione e alla manutenzione che si vuole sostenere. I materiali per esterni devono resistere a sole, pioggia e sbalzi di temperatura.'),
   ('Verde, siepi e illuminazione', 'Alberi, siepi e aiuole richiedono una scelta di specie adatte al suolo. Un impianto di illuminazione a basso consumo e un <strong>impianto di irrigazione automatico</strong> completano il progetto e riducono i tempi di gestione.')],
  ('Giardini a {n}: cosa tenere presente', 'Nel territorio di {c} il paesaggio è fatto di {pae}. Con un {clima}, le piante vanno scelte con attenzione e i materiali per esterni devono tollerare questo contesto. Lavoriamo a {comuni} e dintorni con ditte che conoscono terreni e regole locali.')),
 ('bonifica-amianto', 'Bonifica amianto', 'la rimozione e lo smaltimento dell\'amianto',
  [('Quando serve la bonifica', 'Coperture in <strong>eternit</strong>, canne fumarie, serbatoi e pannelli in cemento-amianto vanno controllati: se il materiale è friabile o danneggiato può rilasciare fibre pericolose. Una verifica tecnica stabilisce se serve rimuovere, incapsulare o confinare.'),
   ('Le tre modalità di intervento', 'La <strong>rimozione</strong> elimina il materiale e lo smaltisce in discarica autorizzata, l\'<strong>incapsulamento</strong> lo ricopre con prodotti specifici, il <strong>confinamento</strong> lo isola con una nuova struttura. La scelta dipende da stato, posizione e budget.'),
   ('Normativa e sicurezza', 'L\'intervento richiede ditte iscritte all\'Albo gestori ambientali, un piano di lavoro presentato alla ASL e un corretto smaltimento con documentazione. Rivolgersi a professionisti abilitati è l\'unico modo per lavorare in sicurezza e in regola.')],
  ('Amianto a {n} e provincia', 'In {c} sono presenti {ed}: molte coperture realizzate tra gli anni Sessanta e Ottanta contengono ancora fibrocemento. Se ti trovi a {comuni} o nei comuni limitrofi, richiedi un sopralluogo gratuito per valutare lo stato del materiale.')),
 ('impermeabilizzazione-terrazzi', 'Impermeabilizzazione di terrazzi e balconi', 'l\'impermeabilizzazione di terrazzi e balconi',
  [('I segnali di infiltrazione', 'Macchie di umidità sul soffitto sottostante, muffa, intonaco che si stacca o pavimento che sale sono i segni tipici di una <strong>impermeabilizzazione</strong> ormai inefficace. Intervenire presto limita i danni e i costi.'),
   ('Sistemi e materiali', 'Guaine bituminose, membrane in PVC o poliolefine, resine liquide poliuretaniche e malte cementizie osmotiche sono le soluzioni più usate. Si sceglie in base a pendenze, tipo di pavimentazione e se il terrazzo è calpestabile.'),
   ('Come si esegue il lavoro', 'Si rimuove la vecchia pavimentazione se necessario, si controllano massetto e pendenze, si posa il sistema impermeabile con risvolti e raccordi a regola d\'arte e si ripristina la finitura. I <strong>dettagli ai bordi</strong> fanno la differenza.')],
  ('Terrazzi a {n}: l\'effetto del clima', 'Qui il {clima} mette a dura prova le superfici esposte. Nelle abitazioni di {c}, dove troviamo {ed}, una buona impermeabilizzazione protegge strutture e intonaci. Interveniamo a {comuni} e nei comuni vicini.')),
 ('pavimenti-in-cotto', 'Pavimenti in cotto', 'la posa, il restauro e il trattamento dei pavimenti in cotto',
  [('Perché scegliere il cotto', 'Il cotto è un materiale <strong>naturale, durevole e caldo</strong>, adatto a case rustiche e moderne. Con il tempo acquista carattere e, se ben trattato, dura per generazioni.'),
   ('Posa e trattamenti', 'La posa richiede un sottofondo piano e asciutto. Dopo la stesura si eseguono <strong>saturazione, cera o protettivi</strong> per ridurre l\'assorbimento di macchie e olio. Anche i vecchi pavimenti si possono levigare e rigenerare.'),
   ('Manutenzione e costi', 'Una pulizia con detergenti neutri e un nuovo trattamento ogni alcuni anni mantengono il cotto in ottime condizioni. Il costo dipende da formato, lavorazione artigianale e stato del fondo: il preventivo gratuito serve a chiarirlo.')],
  ('Cotto a {n} e provincia', 'Nelle case di {c} ({ed}) il cotto è una scelta storica. Con {mat} il pavimento dialoga bene con l\'architettura locale. Le ditte con cui collaboriamo operano a {comuni} e conoscono i formati tipici del territorio.')),
 ('restauro-casale', 'Restauro di un casale', 'il restauro e il recupero di casali e rustici',
  [('Da dove partire', 'Il recupero di un casale comincia da un <strong>rilievo e da una verifica strutturale</strong>: murature, solai, tetto, fondazioni e umidità di risalita. Solo dopo si definiscono progetto, permessi e computo.'),
   ('Interventi tipici', 'Consolidamento delle murature, rifacimento del tetto, nuovi impianti, isolamento termico compatibile con i materiali storici e <strong>serramenti</strong> coerenti con l\'edificio. Conservare i caratteri originali è spesso anche un vantaggio economico.'),
   ('Permessi e incentivi', 'Servono pratiche edilizie adatte al tipo di lavoro e, in aree vincolate, il parere della Soprintendenza. Esistono detrazioni fiscali per ristrutturazioni, efficienza energetica e adeguamento sismico: conviene verificarle prima di iniziare.')],
  ('Casali a {n}', 'Nel territorio di {c} ci sono {ed}, immersi in {pae}. Restaurarli significa rispettare {mat} e adattarli al {clima}. Mettiamo in contatto con imprese di {comuni} e dintorni.')),
 ('restauro-edifici-storici', 'Restauro di edifici storici', 'il restauro di palazzi e edifici storici',
  [('Un lavoro da specialisti', 'Restaurare un edificio storico richiede <strong>competenze specifiche</strong>: analisi dei materiali, diagnostica del degrado e interventi reversibili che rispettino l\'originale.'),
   ('Facciate, strutture e finiture', 'Si interviene su intonaci a calce, decorazioni, cornici, volte e solai. Il consolidamento strutturale deve essere compatibile con la muratura storica e spesso richiede <strong>indagini preliminari</strong>.'),
   ('Vincoli e autorizzazioni', 'Per gli immobili tutelati sono necessarie autorizzazioni della Soprintendenza. Un\'impresa esperta sa preparare la documentazione e gestire i rapporti con gli enti, evitando blocchi del cantiere.')],
  ('Edifici storici a {n}', 'In {c} il patrimonio comprende {ed}. I centri come {comuni} custodiscono edifici con {mat}. Un intervento ben fatto conserva l\'identità del luogo, tenendo conto del {clima}.')),
 ('restauro-tetto-in-legno', 'Restauro del tetto in legno', 'il restauro e il consolidamento di tetti in legno',
  [('Travi, travetti e assito', 'Un tetto in legno invecchia per umidità, insetti xilofagi e infiltrazioni. Il primo passo è <strong>valutare lo stato delle travi</strong>: spesso basta sostituire singoli elementi e non tutta la struttura.'),
   ('Trattamenti e consolidamento', 'Si eseguono trattamenti antitarlo e antimuffa, si rinforzano i punti critici con <strong>piastre, staffe o resine</strong> e si rifà il manto di copertura con coibentazione e ventilazione adeguate.'),
   ('Estetica e sicurezza', 'Un tetto in legno restaurato conserva fascino e prestazioni. È anche l\'occasione per migliorare isolamento e <strong>resistenza sismica</strong>, due aspetti spesso trascurati nei vecchi edifici.')],
  ('Tetti in legno a {n}', 'Nelle case di {c}, tra {ed}, i tetti in legno sono molto diffusi. Il {clima} accelera il degrado se manca manutenzione. Operiamo a {comuni} con carpentieri esperti in {mat}.')),
 ('ristrutturazione-camera-da-letto', 'Ristrutturazione della camera da letto', 'la ristrutturazione della camera da letto',
  [('Pianificare lo spazio', 'Una camera da letto ben progettata separa <strong>zona notte, armadi e luci</strong>. Pareti, pavimento, serramenti e impianti elettrici vanno pensati insieme per evitare interventi doppi.'),
   ('Materiali e comfort', 'Pavimenti caldi, pitture traspiranti, <strong>isolamento acustico e termico</strong> e illuminazione regolabile migliorano il riposo. Anche la scelta di porte e finestre incide sul comfort quotidiano.'),
   ('Tempi e costi', 'Per una camera di dimensioni medie bastano di solito pochi giorni di lavoro. Il costo varia con la quantità di opere murarie e con le finiture: il preventivo gratuito permette di confrontare più proposte.')],
  ('Camere da letto a {n}', 'Chi vive in {c} sa che il {clima} influisce sul comfort. Nelle abitazioni tipiche ({ed}) vale la pena curare isolamento e serramenti. Lavoriamo a {comuni} e nei comuni limitrofi.')),
 ('sostituzione-tegole', 'Sostituzione tegole', 'la sostituzione di tegole e coppi del tetto',
  [('Quando sostituire le tegole', 'Tegole rotte, spostate o coperte di muschio lasciano passare l\'acqua. Spesso <strong>non serve rifare tutto il tetto</strong>: una sostituzione mirata, insieme al controllo di guaine e gronde, risolve il problema.'),
   ('Tipologie di tegole', 'Laterizio, cemento, pietra naturale e resina hanno costi e durata diversi. Il <strong>coppo in cotto</strong> resta la scelta tradizionale, mentre il cemento offre buon rapporto qualità prezzo.'),
   ('Come si lavora in sicurezza', 'L\'intervento si esegue con ponteggi o linee vita adeguate. Il <strong>preventivo gratuito</strong> include sopralluogo e indicazione dei materiali, così da evitare sorprese a lavoro iniziato.')],
  ('Tegole a {n} e provincia', 'In {c} il {clima} sollecita molto le coperture. Per questo i coppi vanno scelti in linea con {mat}. Ci rivolgiamo a {comuni} e a tutta la zona con ditte che conoscono i tetti locali.')),
]

CTA = '<p><strong>Servizi.lazio.it</strong> collabora con ditte con esperienza decennale su {c}. Richiedere un <strong>preventivo gratuito al 100%</strong> è facilissimo: basta compilare il <strong>form</strong> qui in fondo e un nostro esperto ti ricontatterà in brevissimo tempo.</p>'

def slug(s):
    s = s.lower()
    for a, b in (('à','a'),('è','e'),('é','e'),('ì','i'),('ò','o'),('ù','u')): s = s.replace(a, b)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def q(s): return s.replace('\\', '\\\\').replace('"', '\\"')

def main():
    os.makedirs(OUT, exist_ok=True)
    files = os.listdir(SRC)
    wp = 91001
    made = []
    for key, kw, what, secs, (loch, loct) in T:
        src = next(f for f in files if f.startswith(key))
        fm = io.open(os.path.join(SRC, src), encoding='utf-8', errors='replace').read().split('---')[1]
        keep = [l for l in fm.splitlines() if re.match(r'(og_image|og_w|og_h|og_type|thumb|thumb_full|thumb_card|thumb_w|thumb_h|thumb_caption|thumb_titolo):', l)]
        for pk, P in PROV.items():
            title = '%s %s: preventivi gratuiti' % (kw, P['n'])
            desc = 'Cerchi professionisti per %s a %s? Clicca qui per preventivi gratuiti al 100%% e senza impegno.' % (what, P['c'])
            body = ['<h2>%s %s</h2>' % (kw, P['n']),
                    '<p>Stai cercando professionisti per %s a <strong>%s</strong>? Qui trovi informazioni utili e puoi richiedere <strong>preventivi gratuiti</strong> a ditte selezionate.</p>' % (what, P['c'])]
            for h, t in secs:
                body.append('<h2>%s a %s</h2>' % (h, P['n']))
                body.append('<p>%s</p>' % t)
            body.append('<h2>%s</h2>' % loch.format(**P))
            body.append('<p>%s</p>' % loct.format(**P))
            body.append(CTA.format(**P))
            cats = '["servizi/servizi-agli-edifici/edilizia", "servizi/servizi-agli-edifici", "servizi/servizi-per-provincia"]'
            head = ['---', 'layout: "avada-articolo"', 'title: "%s"' % q(title), 'description: "%s"' % q(desc),
                    'seo_title: "%s - Servizi Lazio"' % q(title), 'date: "%s"' % DATE, 'last_modified_at: "%s"' % DATE,
                    'wp_id: %d' % wp, 'wp_tipo: "post"', 'categorie: ' + cats] + keep + [
                    'excerpt: "%s"' % q(desc), 'render_with_liquid: false', 'categorie_visibili: ' + cats, '---', '']
            name = slug('%s %s preventivi gratuiti' % (kw, P['n'])) + '.html'
            io.open(os.path.join(OUT, name), 'w', encoding='utf-8', newline='\n').write('\n'.join(head) + '\n'.join(body) + '\n')
            made.append(name); wp += 1
    print(len(made), 'articoli creati in', OUT)

if __name__ == '__main__':
    main()
