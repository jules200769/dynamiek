import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, ChevronRight, BookOpen, GraduationCap, CarFront, Euro, Star } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  readTime: number;
  category: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const posts: BlogPost[] = [
  {
    slug: 'hoeveel-rijlessen-nodig',
    title: 'Hoeveel rijlessen heb ik nodig om mijn rijbewijs te halen?',
    excerpt: 'Het aantal benodigde rijlessen verschilt per persoon. In dit artikel leggen we uit welke factoren een rol spelen en hoe je de kosten zo laag mogelijk houdt.',
    readTime: 5,
    category: 'Rijlessen',
    icon: <CarFront className="w-5 h-5" />,
    content: (
      <>
        <p>Een van de meest gestelde vragen bij het aanvragen van rijlessen is: <strong>hoeveel rijlessen heb ik nodig?</strong> Het eerlijke antwoord is dat dit sterk verschilt per persoon. Het gemiddelde in Nederland ligt rond de <strong>35 tot 45 rijlessen</strong>, maar jij kunt er meer of minder nodig hebben.</p>

        <h2>Factoren die het aantal rijlessen bepalen</h2>
        <p>Niet iedereen leert in hetzelfde tempo autorijden. De volgende factoren spelen een grote rol:</p>
        <ul>
          <li><strong>Leeftijd:</strong> Jongeren leren doorgaans sneller dan mensen die op latere leeftijd beginnen. Dat wil niet zeggen dat oudere leerlingen minder goed worden, ze hebben soms juist meer rijervaring als fietser of brommer-rijder.</li>
          <li><strong>Rijervaring:</strong> Heb je al eerder rijlessen gehad, of rijd je weleens op privéterrein? Dan heb je een voorsprong.</li>
          <li><strong>Concentratie en leerstijl:</strong> Mensen die snel onthouden en goed kunnen multitasken, leren rijden sneller.</li>
          <li><strong>Frequentie van de lessen:</strong> Meerdere lessen per week geven meer progressie dan één les om de week.</li>
          <li><strong>Kwaliteit van de instructeur:</strong> Een goede rijinstructeur past zijn methode aan op jouw leerstijl.</li>
        </ul>

        <h2>Gratis proefles als beginpunt</h2>
        <p>Bij Rijschool Dynamiek beginnen we altijd met een <strong>gratis proefles</strong> (in combinatie met een lespakket). Tijdens die proefles bekijkt jouw instructeur wat jouw huidige niveau is en maakt hij een inschatting van het benodigde aantal lessen. Zo weet je meteen waar je staat, zonder verplichtingen.</p>

        <h2>Tips om het aantal lessen te verminderen</h2>
        <ol>
          <li>Haal je theorie-examen ruim voor je praktijklessen. Zo ken je de verkeersregels al goed.</li>
          <li>Oefen tussentijds met iemand uit je omgeving (als je al een voorlopig rijbewijs hebt).</li>
          <li>Neem meerdere lessen per week tijdens vakanties of vrije periodes.</li>
          <li>Bekijk je video-opnames van rijbewijsexamens op YouTube om te begrijpen wat er van je verwacht wordt.</li>
        </ol>

        <h2>Conclusie</h2>
        <p>Er bestaat geen magisch getal. Wat telt is jouw persoonlijke voortgang. Bij Rijschool Dynamiek stemmen we het lessenpakket af op <em>jouw</em> tempo, niet op een standaard schema. <Link to="/" className="text-secondary underline hover:text-secondary/80">Vraag hier je gratis proefles aan</Link> en ontdek hoeveel lessen jij nodig hebt.</p>
      </>
    ),
  },
  {
    slug: 'rijbewijs-b-kosten',
    title: 'Wat kost een rijbewijs B in 2025? Alles wat je moet weten',
    excerpt: 'De totale kosten van een rijbewijs vallen uiteen in lessen, theorie en examens. Wij zetten alle kosten op een rij en laten zien hoe je slimmer kunt betalen.',
    readTime: 6,
    category: 'Kosten & Tarieven',
    icon: <Euro className="w-5 h-5" />,
    content: (
      <>
        <p>Het halen van een rijbewijs B is een investering. In 2025 liggen de gemiddelde <strong>totale kosten van een rijbewijs</strong> in Nederland tussen de <strong>€1.800 en €3.200</strong>. Maar wat betaal je precies voor, en hoe kun je slim besparen?</p>

        <h2>De kostenposten op een rij</h2>
        <ul>
          <li><strong>Theorie-examen (CBR):</strong> €40,70 per poging</li>
          <li><strong>Praktijkexamen (CBR):</strong> €129,25 per poging</li>
          <li><strong>Rijlessen:</strong> afhankelijk van het pakket en de rijschool</li>
          <li><strong>Theoriemateriaal:</strong> app-abonnementen of boeken, gemiddeld €15–€30</li>
          <li><strong>Rijbewijsaanvraag (gemeente):</strong> circa €40,70</li>
        </ul>

        <h2>Lespakketten vs. losse lessen</h2>
        <p>Bij Rijschool Dynamiek kun je kiezen tussen <strong>lespakketten</strong> en <strong>losse rijlessen</strong>. Een pakket is voordeliger per les en biedt zekerheid. Losse lessen zijn flexibeler. Bekijk onze <Link to="/rijlessen" className="text-secondary underline hover:text-secondary/80">tarieven en pakketten</Link> voor actuele prijzen.</p>

        <h2>Betalen per maand</h2>
        <p>Wij begrijpen dat een rijbewijs een grote uitgave is. Daarom is betaling <strong>in termijnen mogelijk</strong> — per maand of zelfs per rijles. Zo hoef je niet ineens een groot bedrag te betalen en blijft het rijbewijs voor iedereen bereikbaar.</p>

        <h2>Slagingspercentage en kosten besparen</h2>
        <p>Een hoog slagingspercentage bespaart je veel geld. Bij Rijschool Dynamiek plannen wij pas een examen in als jij er écht klaar voor bent. Dit vermindert de kans op een duur herexamen (opnieuw €129,25 + extra lessen).</p>

        <h2>Conclusie</h2>
        <p>Slim rijden begint bij slimme keuzes. Kies een rijschool met transparante tarieven, flexibele betaling en een hoog slagingspercentage. <Link to="/" className="text-secondary underline hover:text-secondary/80">Vraag een gratis proefles aan</Link> en ontvang een persoonlijk advies over de kosten voor jouw situatie.</p>
      </>
    ),
  },
  {
    slug: 'cbr-praktijkexamen-tips',
    title: 'CBR praktijkexamen: 10 tips om in één keer te slagen',
    excerpt: 'Het CBR-praktijkexamen is voor veel mensen spannend. Met deze 10 bewezen tips vergroot je jouw kans op slagen en weet je precies wat je kunt verwachten.',
    readTime: 7,
    category: 'Examen',
    icon: <GraduationCap className="w-5 h-5" />,
    content: (
      <>
        <p>Het <strong>CBR praktijkexamen</strong> duurt ongeveer 55 minuten en bestaat uit een rondrit in het verkeer. Zenuwachtig zijn is normaal, maar goede voorbereiding maakt het verschil. Hier zijn <strong>10 tips om in één keer te slagen voor je rijexamen</strong>.</p>

        <h2>1. Zorg voor voldoende nachtrust</h2>
        <p>Een uitgerust brein presteert beter. Plan geen zware avond voor je examen en zorg voor minimaal 7–8 uur slaap.</p>

        <h2>2. Eet iets voor je examen</h2>
        <p>Nuchter rijden vergroot stress en concentratieproblemen. Eet een lichte maaltijd of een snack voor vertrek.</p>

        <h2>3. Ken de examenroutes in jouw regio</h2>
        <p>CBR-examens rijden vaak vaste routes. Vraag je instructeur of je de bekende examenpunten — zoals bijzondere manoeuvres en kruispunten — extra kunt oefenen.</p>

        <h2>4. Beheers de bijzondere verrichtingen</h2>
        <p>Inparkeren, keren en achteruitrijden zijn standaard onderdelen van het examen. Oefen deze totdat ze automatisch gaan.</p>

        <h2>5. Kijk op tijd in je spiegels</h2>
        <p>De examinator let sterk op spiegelgebruik. Kijk regelmatig in je binnenspiegels en zijspiegels, ook als er niets te zien is.</p>

        <h2>6. Houd je snelheid altijd in de hand</h2>
        <p>Te hard rijden is een directe fout. Controleer je snelheid regelmatig en pas aan bij borden.</p>

        <h2>7. Geef gas weg bij twijfel</h2>
        <p>Voorrang, voetgangers, fietsers: bij twijfel is vertragen altijd de veilige keuze en toont rijvolwassenheid.</p>

        <h2>8. Let op de speciale instructies</h2>
        <p>De examinator kan vragen: "Rijd naar het volgende kruispunt en sla rechts af." Luister goed en vraag om herhaling als je het niet hebt gehoord.</p>

        <h2>9. Maak fouten bespreekbaar</h2>
        <p>Als je een fout maakt, raak dan niet in paniek. Rijden met een rustig hoofd na een foutje toont rijvolwassenheid en weegt mee in de beoordeling.</p>

        <h2>10. Oefen met jouw eigen instructeur in de examenomgeving</h2>
        <p>Bij Rijschool Dynamiek doen we proefexamens in de buurt van het CBR-kantoor. Zo weet je precies wat je te wachten staat.</p>

        <h2>Klaar voor je examen?</h2>
        <p>Jouw instructeur bij Rijschool Dynamiek plant pas een examen in als jij écht klaar bent. <Link to="/" className="text-secondary underline hover:text-secondary/80">Begin met een gratis proefles</Link> en werk toe naar jouw rijbewijs op jouw tempo.</p>
      </>
    ),
  },
  {
    slug: 'theorie-examen-rijbewijs',
    title: 'Theorie-examen rijbewijs B: zo haal je het in één keer',
    excerpt: 'Het theorie-examen is de eerste stap naar je rijbewijs. Ontdek hoe de toets werkt, welke vragen je kunt verwachten en hoe je het best kunt leren.',
    readTime: 5,
    category: 'Theorie',
    icon: <BookOpen className="w-5 h-5" />,
    content: (
      <>
        <p>Voordat je het CBR-praktijkexamen mag doen, moet je het <strong>theorie-examen rijbewijs B</strong> succesvol afleggen. Veel mensen onderschatten dit examen. Met de juiste voorbereiding is het echter goed te halen — ook in één keer.</p>

        <h2>Hoe werkt het theorie-examen?</h2>
        <p>Het CBR-theorie-examen bestaat uit <strong>65 vragen</strong>, verdeeld over verschillende categorieën:</p>
        <ul>
          <li>Kennis van verkeersregels</li>
          <li>Inzicht in verkeerssituaties</li>
          <li>Gevaarherkenning (video's)</li>
        </ul>
        <p>Je mag maximaal <strong>13 fouten</strong> maken. Het examen duurt 45 minuten en wordt op een computer afgenomen bij een CBR-locatie.</p>

        <h2>Wanneer mag je theorie-examen doen?</h2>
        <p>Je mag het theorie-examen afleggen vanaf <strong>16 jaar</strong>. Het theoriecertificaat is <strong>3 jaar geldig</strong> (let op: dit werd verlengd van 1,5 jaar). Haal het dus niet te vroeg als je nog lang niet gaat rijden.</p>

        <h2>De beste manier om te leren voor het theorie-examen</h2>
        <ol>
          <li><strong>Gebruik een officiële theorie-app</strong> zoals iTheorie of TheorieApp. Deze apps bootsen het echte examen na.</li>
          <li><strong>Oefen dagelijks</strong> minimaal 20–30 minuten. Herhaling is sleutel.</li>
          <li><strong>Focus op gevaarherkenning.</strong> Dit onderdeel kost de meeste mensen punten.</li>
          <li><strong>Maak proefexamens</strong> totdat je structureel slaagt met ruime marge.</li>
          <li><strong>Lees de theorieboeken</strong> van het ANWB of Vekabo als aanvulling.</li>
        </ol>

        <h2>Theorie en praktijk combineren</h2>
        <p>Bij Rijschool Dynamiek adviseren we om het theorie-examen te halen <em>vóórdat</em> je ver gevorderd bent met je praktijklessen. Zo passen de verkeersregels die je leert direct toe in de auto. Dubbeleffect!</p>

        <h2>Theorie-examen boeken</h2>
        <p>Je kunt het theorie-examen rechtstreeks boeken via de website van het CBR. Kosten: <strong>€40,70</strong> per poging. Zorg dat je je DigiD bij de hand hebt.</p>

        <p>Heb je vragen over de combinatie van theorie en rijlessen? <Link to="/veel-gestelde-vragen" className="text-secondary underline hover:text-secondary/80">Bekijk onze veelgestelde vragen</Link> of neem contact met ons op.</p>
      </>
    ),
  },
  {
    slug: 'rijschool-kiezen-tips',
    title: 'Hoe kies je de juiste rijschool? 7 tips voor de beste keuze',
    excerpt: 'Er zijn honderden rijscholen in Nederland. Maar hoe weet je welke écht bij jou past? Wij geven je 7 concrete tips om de juiste rijschool te kiezen.',
    readTime: 5,
    category: 'Rijschool kiezen',
    icon: <Star className="w-5 h-5" />,
    content: (
      <>
        <p>De keuze voor een rijschool is belangrijker dan veel mensen denken. Een goede rijschool bespaart je niet alleen tijd en geld — het zorgt ook voor een veilige basis als automobilist. Hier zijn <strong>7 tips om de beste rijschool te kiezen</strong>.</p>

        <h2>1. Controleer of de rijschool CBR-erkend is</h2>
        <p>Alleen een <strong>CBR-erkende rijschool</strong> mag officieel rijlessen aanbieden voor het rijbewijs B. Rijschool Dynamiek is volledig CBR-erkend. Controleer dit altijd als eerste.</p>

        <h2>2. Kijk naar het slagingspercentage</h2>
        <p>Een hoog slagingspercentage is een directe indicator van kwaliteit. Vraag de rijschool hierom, of zoek reviews op Google. Een rijschool die trots is op haar resultaten deelt dit graag.</p>

        <h2>3. Lees reviews op Google en sociale media</h2>
        <p>Echte ervaringen van leerlingen zijn goud waard. Let op het aantal reviews (niet alleen de score) en lees wat leerlingen schrijven over de instructeur, de sfeer en de communicatie.</p>

        <h2>4. Vraag naar transparante tarieven</h2>
        <p>Pas op voor rijscholen die vage prijzen hanteren. Bij Rijschool Dynamiek zijn de tarieven volledig transparant en kun je zelfs <strong>per maand of per rijles betalen</strong>. Geen verrassingen achteraf.</p>

        <h2>5. Let op de kwaliteit van de instructeur</h2>
        <p>Een goed gecertificeerde instructeur (WRM-register) past zijn of haar aanpak aan op jouw leerstijl. Vraag tijdens de proefles hoe de instructeur te werk gaat.</p>

        <h2>6. Kies voor een gratis proefles</h2>
        <p>Veel rijscholen bieden een <strong>gratis proefles</strong> aan. Maak hier gebruik van! Zo ervaar je de rijschool zonder risico en kun je daarna een weloverwogen keuze maken.</p>

        <h2>7. Kijk naar de flexibiliteit van lestijden</h2>
        <p>Studeer je of werk je? Kies een rijschool met flexibele lestijden, ook in de avonden en weekenden. Bij Rijschool Dynamiek zijn we beschikbaar van maandag tot en met zaterdag.</p>

        <h2>Maak kennis met Rijschool Dynamiek</h2>
        <p>Wij scoren <strong>5 sterren op Google</strong> en zijn trots op ons hoge slagingspercentage. Benieuwd of Rijschool Dynamiek bij jou past? <Link to="/" className="text-secondary underline hover:text-secondary/80">Vraag een gratis proefles aan</Link> — geheel vrijblijvend.</p>
      </>
    ),
  },
];

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.34, 1.15, 0.64, 1] }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group flex flex-col h-full bg-white rounded-2xl border border-primary/8 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
      >
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
              {post.icon}
              {post.category}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min lezen
            </span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed flex-1">{post.excerpt}</p>
          <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-secondary group-hover:gap-2 transition-all">
            Lees artikel
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function BlogPostPage({ post }: { post: BlogPost }) {
  return (
    <div className="min-h-screen bg-white md:bg-lines-pattern">
      <div className="bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 hidden md:block bg-[radial-gradient(ellipse_at_80%_20%,rgba(245,158,11,0.08),transparent_60%)]" />
        <div className="container-custom py-12 md:py-16 relative z-10 max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Terug naar blog
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary bg-secondary/20 px-3 py-1 rounded-full">
              {post.icon}
              {post.category}
            </span>
            <span className="text-xs text-white/50 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min lezen
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">{post.excerpt}</p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #f1f5f9 0%, transparent 100%)' }}
        />
      </div>

      <div className="container-custom py-10 md:py-14 max-w-3xl mx-auto relative z-10">
        <div className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-a:text-secondary prose-li:text-gray-700 prose-p:text-gray-700 prose-p:leading-relaxed prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-ul:space-y-1 prose-ol:space-y-1">
          {post.content}
        </div>

        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-primary text-white text-center shadow-xl">
          <h3 className="text-xl font-bold mb-2">Klaar om te beginnen?</h3>
          <p className="text-blue-100 mb-5 text-sm">Vraag nu je gratis proefles aan en haal snel en veilig je rijbewijs bij Rijschool Dynamiek.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-secondary hover:bg-secondary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
          >
            Gratis proefles aanvragen
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-primary/10">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Meer artikelen</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {posts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 2)
              .map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Blog({ slug }: { slug?: string }) {
  if (slug) {
    const post = posts.find((p) => p.slug === slug);
    if (post) return <BlogPostPage post={post} />;
  }

  return (
    <div className="min-h-screen bg-white md:bg-lines-pattern">
      <div className="bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 hidden md:block bg-[radial-gradient(ellipse_at_80%_20%,rgba(245,158,11,0.08),transparent_60%)]" />
        <div className="container-custom py-12 md:py-16 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Terug naar home
          </Link>
          <span className="inline-flex items-center gap-2 text-secondary font-semibold text-sm tracking-wide uppercase mb-4">
            <BookOpen size={16} />
            Rijschool blog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Tips & informatie over{' '}
            <span className="text-secondary">rijlessen</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            Alles wat je wilt weten over rijlessen, het CBR-examen, kosten en het kiezen van de juiste rijschool. Geschreven door de instructeurs van Rijschool Dynamiek.
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #f1f5f9 0%, transparent 100%)' }}
        />
      </div>

      <div className="container-custom py-10 md:py-16 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-16 p-7 md:p-10 rounded-2xl bg-primary text-white text-center shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-2">Rijbewijs halen bij Rijschool Dynamiek?</h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            CBR-erkend, gratis proefles bij lespakket, betalen per maand mogelijk. Start vandaag met jouw rijopleiding.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-secondary hover:bg-secondary-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg text-base"
          >
            Gratis proefles aanvragen
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
