# Servizi da aggiungere a servizi.lazio

Creato il 05/11/2026. Lista dei servizi compatibili con l'edilizia su fune (lavori in quota) che si possono ancora inserire in servizi.lazio.
Non iniziare senza il via di Mirco. La redditivita' e' una stima di Claude (ticket medio, ricorrenza, clienti aziendali/condomini), non un dato.

## Fonti guardate

- servizi.lazio: `_avada/_lazio/` (servizi-a-roma, servizi-agli-edifici, servizi-ai-cittadini, servizi-alle-aziende, servizi-a-latina/frosinone/viterbo/rieti con i soli "servizi edili").
- italfuni2 (catalogo piu' completo: circa 50 servizi base, ognuno x 5 province), italfuni, edilextreme2/3/4 (sottoinsiemi dello stesso catalogo).
- Schema di riferimento negli altri siti: `_servizi/<servizio>.md` piu' una variante `-a-<provincia>` (roma, latina, frosinone, viterbo, rieti).

## Gia' presenti in servizi.lazio (non rifare)

Edilizia su fune a Roma; pulizia grondaie Roma; pulizia vetri e vetrate; frontalini balcone (Roma); manutenzione aree verdi; potatura alberi; ispezione facciate/tetti con drone e termografia (Lazio); insegne e striscioni in quota (Lazio); rimozione nidi di vespe e calabroni in quota (Lazio); parafulmini (Lazio); lucernari e finestre da tetto; cappotto termico (Lazio); pannelli solari; bonifica amianto; impermeabilizzazione terrazzi e balconi; restauro edifici storici; ristrutturazione tetto per provincia; pulizia graffiti; serbatoi idrici.

## Verifica nel repo (05/11/2026)

Controllate le 165 pagine in `_avada/_lazio/` (e la copia `_lazio/`): nessuna pagina dedicata ai servizi qui sotto, solo menzioni di passaggio dentro altri articoli. Quindi la lista A e B resta valida, con queste correzioni.

Pagine affini gia' presenti (non duplicare, al massimo fare la variante "su fune" o una pagina dedicata):
- #7 Cappotto termico: esiste "cappotto-termico-a-roma-e-nel-lazio" (solo Lazio, manca per provincia).
- #10 Impermeabilizzazione: esiste "impermeabilizzazione terrazzi e balconi" in tutte e 5 le province. Manca solo quella dei tetti su fune.
- #17 Restauro facciate: esiste "restauro edifici storici" in tutte e 5 le province. Manca la variante facciate dei centri storici.
- #4 Infiltrazioni tetto: esistono "ristrutturazione e manutenzione tetto" (Roma, Latina, Frosinone, Viterbo, Rieti) e "sostituzione tegole". Citano le infiltrazioni ma non hanno una pagina dedicata a ricerca e riparazione.
- #1-2 Linee vita: solo menzione dentro "sostituzione tegole" (4 province). Nessuna pagina dedicata.
- #13 Fotovoltaico: esiste "pannelli solari" (vendita e installazione) e "pulizia vetri" lo cita. Manca la pagina pulizia pannelli.
- #26 Solare termico: esiste solo "pannelli solari", da verificare se copre anche il termico.
- #25 Lucernari: esiste "lucernari e finestre da tetto" (installazione). Manca pulizia e manutenzione cupole.
- #32 Condizionatori: esiste "vendita installazione assistenza condizionatori". Manca solo la variante su fune.
- #33 Canne fumarie: esiste "caminetti su misura" che le cita. Nessuna pagina dedicata.
- #27 Videosorveglianza: esistono "sistema di allarme" e "domotica". Manca la variante in quota e le luminarie.
- #36 Muffa e umidita': nessuna pagina dedicata.
- Imbianchino esiste (generico). #9 Tinteggiature su fune resta da fare.
- Altre pagine su fune gia' presenti: ispezione drone e termografia, insegne e striscioni in quota, nidi di vespe in quota, parafulmini, pulizia vetri, pulizia graffiti, serbatoi idrici, video ispezioni fognarie, trasporti e sollevamenti eccezionali.

Confermati mancanti (nessuna pagina, nemmeno affine): #3, #5, #6, #8, #11, #12, #14, #15, #16, #18, #19-24, #28-31, #34, #35, #37 e tutte le idee D.

## STATO LAVORI (aggiornato 05/11/2026)

- FATTO: tutti i 18 servizi della lista A (#1-#18) generati come pagine "Roma e nel Lazio" con `_avada/genera_servizi_nuovi.py` (testi in `_avada/servizi_nuovi_data.py`), in `_lazio/servizi-agli-edifici/edilizia/` e `assistenza-agli-edifici/`. Lo script e' idempotente.
- FATTO: anche la lista B (#19-#37, 19 pagine) e le 5 idee D (24 pagine in piu'). Totale pagine in `_avada/_lazio/`: 207 (165 + 42 nuove).
- DA FARE: replica C nelle 4 province (edilizia su fune, frontalini, grondaie, vetri, aree verdi, recinzioni). Per aggiungere altri servizi: nuove voci `S(...)` in `servizi_nuovi_data.py` e rilancio dello script.
- DA VERIFICARE: build Jekyll, breadcrumb, menu. `lazio_import.py verifica` non e' nella cartella del repo.

## A. Priorita' alta (ticket alto, lavori ricorrenti, clienti condominio/azienda)

| # | Servizio | Fonte | Stato in servizi.lazio |
|---|----------|-------|------------------------|
| 1 | Installazione linee vita | italfuni2 | manca |
| 2 | Verifica periodica linee vita (controllo ricorrente; periodicita' DA VERIFICARE su norma e istruzioni del fabbricante) | italfuni2 | manca |
| 3 | Manutenzione programmata condomini (contratti annuali) | italfuni2 | manca |
| 4 | Ricerca e riparazione infiltrazioni tetto | italfuni2 | manca |
| 5 | Ripristino cemento armato e ferri d'armatura | italfuni2 | manca |
| 6 | Consolidamento cornicioni, frontalini e intonaci | italfuni2 | solo frontalini a Roma |
| 7 | Cappotto termico e finiture facciata (con incentivi, DA VERIFICARE) | italfuni2 | solo pagina Lazio |
| 8 | Ristrutturazione balconi e facciate su fune | italfuni, italfuni2 | manca |
| 9 | Tinteggiature complete su fune | italfuni, italfuni2 | manca |
| 10 | Impermeabilizzazione su fune (tetti e coperture) | italfuni, italfuni2 | manca |
| 11 | Manutenzione coperture capannoni | italfuni2 | manca |
| 12 | Pulizia e verniciatura silos, serbatoi, ciminiere | italfuni2 | manca |
| 13 | Pulizia pannelli fotovoltaici | italfuni, italfuni2 | manca |
| 14 | Ispezioni ponti e viadotti su fune | italfuni2 | manca |
| 15 | Sigillature, rifacimento fughe e giunti serramenti | italfuni2 | manca |
| 16 | Vetrate e facciate continue: sostituzione sigillature | italfuni2 | manca |
| 17 | Restauro facciate centri storici (Viterbo, Rieti, Frosinone) | italfuni2 | solo "edifici storici" |
| 18 | Manutenzione tetti, campanili e chiese | italfuni2 | manca |

## B. Priorita' media

| # | Servizio | Fonte | Stato |
|---|----------|-------|-------|
| 19 | Installazione e manutenzione antenne e ripetitori | italfuni2 | manca |
| 20 | Pulizia tetti e trattamento antimuschio | italfuni2 | manca |
| 21 | Rimozione neve e ghiaccio dai tetti (stagionale, utile a Rieti e Frosinone) | italfuni2 | manca |
| 22 | Reti e protezioni anti-uccelli | italfuni2 | manca |
| 23 | Dissuasori per piccioni | italfuni, edilextreme | manca |
| 24 | Pulizia guano e nidi di piccioni | italfuni2 | manca |
| 25 | Pulizia e manutenzione cupole e lucernari | italfuni2 | manca |
| 26 | Pannelli solari termici: installazione e manutenzione | italfuni2 | manca |
| 27 | Luminarie e videosorveglianza in quota | italfuni2 | manca |
| 28 | Riprese foto/video in sospensione | italfuni2 | manca |
| 29 | Recupero e salvataggio in quota (assistenza) | italfuni2 | manca |
| 30 | Rimozione materiale pericolante | italfuni, italfuni2 | manca |
| 31 | Lattoneria, ringhiere, trattamento ferri | italfuni2 | manca |
| 32 | Installazione condizionatori su fune | italfuni, italfuni2 | manca |
| 33 | Pulizia, manutenzione e installazione canne fumarie | italfuni, italfuni2 | manca |
| 34 | Montaggio isolanti termici | italfuni, italfuni2 | manca |
| 35 | Messa in sicurezza dei lavoratori / montaggio sistemi di sicurezza | italfuni, italfuni2 | manca |
| 36 | Rimozione muffa, umidita' e infiltrazioni su fune | italfuni, italfuni2 | manca |
| 37 | Pulizia componenti su fune | italfuni, italfuni2 | manca |

## C. Servizi di Roma da replicare nelle 4 province (Latina, Frosinone, Viterbo, Rieti)

Compatibili: edilizia su fune, frontalini balcone, pulizia grondaie, pulizia vetri e vetrate, manutenzione aree verdi, realizzazione recinzioni.
Non compatibili (lasciare solo a Roma): servizi hotel, traduzioni, noleggio tribune. Derattizzazione: da decidere.
Anche per i servizi gia' presenti "per tutto il Lazio" (drone/termografia, insegne in quota, nidi di vespe, parafulmini, potatura) si possono fare le varianti per provincia.

## D. Idee nuove, non presenti nei siti di riferimento (da valutare)

1. Consolidamento pareti rocciose, disgaggio massi e reti paramassi (lavoro in fune, enti pubblici; zone collinari di Rieti, Frosinone, Viterbo).
2. Lavaggio e pulizia facciate (idropulitrice, sabbiatura) con trattamento antigraffiti protettivo.
3. Ispezione e pulizia di serbatoi, cisterne e spazi confinati.
4. Verde pensile e verde verticale: manutenzione.
5. Collaudo e certificazioni dei sistemi anticaduta.

## Come inserirli (promemoria tecnico)

- Edilizia/servizi edili per provincia: `_avada/genera_province.py` (partendo dagli articoli di Roma).
- Gli altri siti usano un file per servizio e provincia: nome `<servizio>-a-<provincia>`; qui la struttura e' `_avada/_lazio/servizi-a-<provincia>/`.
- Controllare sempre: breadcrumb in `categorie.yml`, menu "Servizi per provincia", `python lazio_import.py verifica`.
- Per cominciare, proposta: A1-A4 + C (grondaie, vetri, edilizia su fune) nelle 4 province.

## AGGIORNAMENTO
- Replica C fatta nelle 4 province (24 pagine: edilizia su fune, frontalini, grondaie, vetri, aree verdi, recinzioni).
- Build Jekyll OK, nessun errore Liquid.
- Breadcrumb articoli: testo bianco, 14px, piu' staccato dal titolo (_avada/_layouts/avada-articolo.html).
- Da fare: commit/push, controllo visivo breadcrumb.
