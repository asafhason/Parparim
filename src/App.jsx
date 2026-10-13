import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { ArrowLeft, ArrowRight, BookOpen, Check, ClipboardList, Droplets, Flower2, Handshake, Heart, Leaf, MapPin, Maximize, Minimize, Search, Sprout, Sun, Thermometer, Trees, Users } from 'lucide-react'
import butterflyVideo from '../Snonit2.mp4'

const pillars = [
  { title: 'חיבור בין־דורי', icon: Users, text: 'ילדים ומבוגרים מתחברים לטבע וזה לזה, ומחזקים את ההון החברתי.' },
  { title: 'חוסן קהילתי', icon: Heart, text: 'שטח ציבורי קטן שמטפח איכות חיים, בריאות נפשית ופיזית.' },
  { title: 'משחק חופשי בטבע', icon: Sun, text: 'תנועה, יצירה וחקירה במרחב פתוח, נגיש ומזמין.' },
  { title: 'חינוך סביבתי', icon: Sprout, text: 'למידה מתוך עשייה, שתילה ומעקב אחר מחזור החיים.' },
]

const indicators = [
  { title: 'למה פרפרים?', icon: Thermometer, paragraphs: [<>הפרפרים הם <strong>המדחום של הטבע</strong> וסמן אקולוגי לבריאות הסביבה.</>] },
  { title: 'תרומת הידע להבנת הטבע', icon: 'butterfly', paragraphs: [<>גינת פרפרים משמשת <strong>מקום מפגש</strong> לפרפרי הסביבה ו<strong>חלון ראווה</strong> להיכרות איתם.</>] },
  { title: 'השתתפות הציבור בניטור וספירת פרפרים', icon: ClipboardList, paragraphs: [<>הניטור הוא <strong>כלי מדעי</strong> למדידת איכות הסביבה באמצעות הפרפרים.</>, <>ממנו לומדים <strong>התושבים והרשויות</strong> על תוצאות השקעתם בשמירת הטבע בקהילה.</>] },
]

const evidence = [
  { title: 'חזון עם שורשים של ידע.', kicker: 'אקדמיה ומדע', name: 'דובי בנימיני', subtitle: 'המומחה העולמי לפרפרים', icon: BookOpen, text: 'המיזם מבוסס על הידע של דובי בנימיני ועל עקרונות ספרו ״גינת הפרפרים בישראל״.', note: 'ידע מקצועי שהופך לתכנון אקולוגי.', theme: 'paper', graphic: 'book' },
  { title: 'גם אנחנו יכולים להשתנות.', kicker: 'גינון טיפולי', name: 'שינוי. ויסות. חוסן.', subtitle: 'גלגול הפרפר כמטאפורה לתהליכים אנושיים', icon: Heart, text: 'מגובה בעקרונותיה של ד״ר רחלי שוורץ־צחור ועמותת ״אדם צומח״. מחזור החיים של הפרפר מחבר בין שינוי, ויסות רגשי ובניית חוסן נפשי.', note: 'טבע שמאפשר לצמוח, גם מבפנים.', theme: 'rose', graphic: 'metamorphosis' },
  { title: 'לא מתחילים מאפס.', kicker: 'מודלים עירוניים מוכחים', name: 'בת־ים · מטה יהודה', subtitle: 'לומדים מהצלחות ברשויות מקומיות', icon: MapPin, text: 'יישום מוצלח של מודלים דומים בעיריית בת־ים ובמועצה האזורית מטה יהודה מעניק בסיס ללמידה ולהקמת הגינה שלנו.', note: 'מחברים ניסיון קיים לחזון מקומי.', theme: 'blue', graphic: 'places' },
]

const lifecycle = [
  { title: 'הכול מתחיל בזחל.', label: 'איסוף וגידול', image: '/assets/caterpillar.webp', text: 'איסוף וגידול זחלי זנב־הסנונית. טיפול יומיומי והתבוננות מקרוב הופכים סקרנות קטנה לחוויה חיה.', note: 'תנועה · חקירה · תשומת לב' },
  { title: 'זמן להשתנות.', label: 'שלב הגולם', image: '/assets/chrysalis.webp', text: 'הגולם הצהוב־שחור. זמן של המתנה וויסות, שבו השינוי מתרחש גם כשלא רואים אותו מבחוץ.', note: 'המתנה · ויסות · שינוי' },
  { title: 'ואז, כנפיים.', label: 'רגע הבקיעה', image: '/assets/butterfly.webp', text: 'נקבת הפרפר בוקעת ומייבשת את כנפיה לקראת המעוף. רגע מרגש מתוך הניסיון המעשי של הצוות.', note: 'התפתחות · חוסן · מעוף' },
]

const roadmap = [
  { title: 'תכנון ואישורים', subtitle: 'מוצאים את המקום הנכון.', icon: MapPin, items: ['איתור ובחירת המיקום המתאים בשיתוף המועצה', 'גיבוש תוכנית אדריכלית ופדגוגית'] },
  { title: 'משאבים ושותפים', subtitle: 'מחברים את הקהילה.', icon: Handshake, items: ['הגשת בקשות לקולות קוראים ותקציבי מועצה וקהילה', 'רתימת מוסדות חינוך, גנים ומתנדבים מקומיים'] },
  { title: 'תכנון מפורט והקמה', subtitle: 'נותנים לחזון שורשים.', icon: Sprout, items: ['בחירת צמחי פונדקאות וצוף, תשתיות השקיה ופינות ישיבה', 'הקמת הגינה בשטח, בשיתוף הקהילה'] },
  { title: 'הפעלה וקיימות', subtitle: 'מטפחים לאורך זמן.', icon: Trees, items: ['שילוב תוכניות חקר בלמידה החוץ־כיתתית', 'אירועי שיא קהילתיים והכשרת נאמני גינה'] },
]

const requests = [
  { title: 'איתור שטח מתאים', icon: MapPin, text: 'שטח ציבורי מוצל חלקית, נגיש ומתאים לגינת פרפרים קהילתית.', summary: 'שטח ציבורי נגיש ומוצל חלקית.' },
  { title: 'חיבור מים וחשמל', icon: Droplets, text: 'חיבור למים וסיוע במערכת השקיה. במידת האפשר: חשמל לתאורה ולמערכות הגינה.', summary: 'מים להשקיה, ובמידת האפשר חשמל.' },
  { title: 'תקציב ומימון', icon: Handshake, text: 'תמיכה בהקמה ובתחזוקה, וסיוע באיתור קולות קוראים למימון הפרויקט.', summary: 'תמיכה בהקמה, בתחזוקה ובאיתור קולות קוראים.' },
]

const slides = [
  { kind: 'cover', chapter: 'גינת הפרפרים', theme: 'forest' },
  { kind: 'vision', chapter: 'החזון', theme: 'paper' },
  { kind: 'indicator', chapter: 'למה פרפרים', theme: 'yellow' },
  { kind: 'foundations', chapter: 'שורשים של ידע', theme: 'paper' },
  { kind: 'evidence', chapter: 'שורשים של ידע', theme: evidence[2].theme, detail: 2 },
  ...lifecycle.map((item, detail) => ({ kind: 'lifecycle', chapter: 'פלא בתוך עציץ', theme: 'forest', detail })),
  { kind: 'garden', chapter: 'המרחב המתוכנן', theme: 'paper' },
  { kind: 'plants', chapter: 'המרחב המתוכנן', theme: 'yellow' },
  { kind: 'roadmap', chapter: 'הדרך לשם', theme: 'paper' },
  { kind: 'closing', chapter: 'צומחים יחד', theme: 'forest' },
]

function Butterfly({ className = '' }) {
  return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 29C16 5 3 17 9 31c3 7 12 9 21 5-19 12-13 25-3 17 3-3 4-8 5-13 1 5 2 10 5 13 10 8 16-5-3-17 9 4 18 2 21-5C61 17 48 5 32 29Z" fill="currentColor"/><path d="M32 26v21m-1-22-5-8m7 8 5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}

function Heading({ eyebrow, children, subtitle }) {
  return <div className="slide-heading"><div className="eyebrow reveal">{eyebrow}</div><h1 className="reveal" style={{ '--delay': '90ms' }}>{children}</h1>{subtitle && <p className="slide-subtitle reveal" style={{ '--delay': '180ms' }}>{subtitle}</p>}</div>
}

function Flight({ celebration = false }) {
  return <div className={`flight ${celebration ? 'celebration' : ''}`} aria-hidden="true">{Array.from({ length: celebration ? 12 : 5 }, (_, index) => <Butterfly key={index} className={`flying-butterfly butterfly-${index % 5}`} />)}</div>
}

function HatchingReveal({ image, title }) {
  return <div className="hatching-scene">
    <div className="life-photo hatching-photo hatching-video-frame"><video className="hatching-video" src={butterflyVideo} poster={image} aria-label={title} autoPlay muted loop playsInline preload="auto" /></div>
    <img className="life-photo hatching-chrysalis" src={lifecycle[1].image} alt="" aria-hidden="true" />
    <div className="hatching-ring" aria-hidden="true" />
    <div className="hatching-flight" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <span className="hatching-butterfly" key={index} style={{ '--flight-x': `${-39 + index * 12}cqw`, '--flight-y': `${-27 - index % 3 * 12}cqw`, '--flight-angle': `${-30 + index * 10}deg`, '--flight-delay': `${1350 + index * 130}ms` }}><Butterfly /></span>)}</div>
  </div>
}

function SlideContent({ slide }) {
  if (slide.kind === 'cover') return <>
    <img className="backdrop-photo" src="/assets/hero.webp" alt="פרפר זנב־הסנונית על יד, בצמחיית הגינה" fetchPriority="high" />
    <div className="photo-shade" />
    <div className="cover-content"><Heading eyebrow="גדרות · אקולידרס 2026" subtitle="מרחב קהילתי פתוח ליצירה, משחק והתפתחות.">גינת הפרפרים</Heading><p className="cover-statement reveal" style={{ '--delay': '240ms' }}>מקום קטן.<br /><span>חיבור גדול.</span></p><div className="cover-meta reveal" style={{ '--delay': '350ms' }}><MapPin size={17} />טבע · קהילה · התפתחות</div></div><Flight />
  </>

  if (slide.kind === 'vision') return <div className="slide-body vision-body"><Heading eyebrow="החזון שלנו" subtitle="מוקד משיכה יישובי וסביבתי שמחבר בין דורות ומטפח את איכות הסביבה.">כשטבע ואנשים נפגשים,<br />משהו טוב צומח.</Heading><div className="vision-composition"><div className="vision-core reveal"><Butterfly /><span>גינת פרפרים<small>קהילתית</small></span></div><div className="vision-grid">{pillars.map((item, index) => { const Icon = item.icon; return <article className={`vision-pillar reveal accent-${index}`} key={item.title} style={{ '--delay': `${260 + index * 110}ms` }}><Icon /><div><h2>{item.title}</h2><p>{item.text}</p></div></article> })}</div></div></div>

  if (slide.kind === 'indicator') return <div className="slide-body indicator-body"><Heading eyebrow="למה פרפרים" subtitle="סמן אקולוגי, חלון ללמידה וכלי לניטור קהילתי.">מדד טבעי לבריאות<br />הסביבה בקהילה.</Heading><div className="indicator-columns">{indicators.map((item, index) => { const Icon = item.icon; return <article className="indicator-column reveal" key={item.title} style={{ '--delay': `${240 + index * 160}ms` }}>{Icon === 'butterfly' ? <Butterfly /> : <Icon />}<h2>{item.title}</h2>{item.paragraphs.map((text, paragraph) => <p key={paragraph}>{text}</p>)}</article> })}</div></div>

  if (slide.kind === 'foundations') return <div className="slide-body foundations-body"><Heading eyebrow="אקדמיה ומדע · גינון טיפולי">חזון עם שורשים של ידע.</Heading><div className="foundations-columns">{evidence.slice(0, 2).map((item, index) => { const Icon = item.icon; return <article className="foundation-column reveal" key={item.kicker} style={{ '--delay': `${180 + index * 140}ms` }}><div className="foundation-label"><Icon /><span>{item.kicker}</span></div><h2>{item.name}</h2><span className="evidence-subtitle">{item.subtitle}</span><p className="body-copy">{item.text}</p><p className="evidence-note">{item.note}</p></article> })}</div></div>

  if (slide.kind === 'evidence') {
    const item = evidence[slide.detail]
    const Icon = item.icon
    return <div className={`slide-body evidence-body evidence-${item.graphic}`}><Heading eyebrow={item.kicker}>{item.title}</Heading><div className="evidence-layout"><div className="evidence-copy"><div className="large-icon reveal" style={{ '--delay': '170ms' }}><Icon /></div><h2 className="reveal" style={{ '--delay': '240ms' }}>{item.name}</h2><span className="evidence-subtitle reveal" style={{ '--delay': '300ms' }}>{item.subtitle}</span><p className="body-copy reveal" style={{ '--delay': '370ms' }}>{item.text}</p><p className="evidence-note reveal" style={{ '--delay': '450ms' }}>{item.note}</p></div><div className="evidence-art reveal" style={{ '--delay': '200ms' }} aria-hidden="true">{item.graphic === 'book' ? <div className="book-art"><Leaf /><span>גינת הפרפרים<br />בישראל</span><small>דובי בנימיני</small><Butterfly /></div> : item.graphic === 'metamorphosis' ? <div className="metamorphosis-art"><div><Sprout /></div><span /><div><Leaf /></div><span /><div><Butterfly /></div></div> : <div className="places-art"><div><MapPin /><span>בת־ים</span></div><div className="places-line" /><div><Trees /><span>מטה יהודה</span></div><small>ניסיון מקומי. השפעה קהילתית.</small></div>}</div></div></div>
  }

  if (slide.kind === 'lifecycle') {
    const item = lifecycle[slide.detail]
    return <div className="slide-body lifecycle-body"><div className="lifecycle-copy"><Heading eyebrow={`הניסיון שלנו · ${item.label}`} subtitle={item.text}>{item.title}</Heading><div className="life-track reveal" style={{ '--delay': '260ms' }}>{lifecycle.map((stage, index) => <div className={index <= slide.detail ? 'reached' : ''} key={stage.label}><span>{String(index + 1).padStart(2, '0')}</span><small>{stage.label}</small></div>)}</div><p className="life-note reveal" style={{ '--delay': '360ms' }}>{item.note}</p>{slide.detail === 2 && <blockquote className="reveal" style={{ '--delay': '480ms' }}>״הפרפר הראשון שלי יצא לדרך.<br />תביא הרבה אושר לעולם, שמחה ויופי.״<small>״איזה שלמות, תעשה טוב בעולם הזה.״</small></blockquote>}</div><div className="life-photo-composition"><div className="life-orbit" aria-hidden="true" />{slide.detail === 2 ? <HatchingReveal image={item.image} title={item.title} /> : <img className="life-photo reveal" src={item.image} alt={item.title} />}<span className="life-photo-caption reveal">התיעוד של צוות המיזם · זנב־הסנונית</span></div></div>
  }

  if (slide.kind === 'garden') return <div className="slide-body garden-body"><div className="garden-copy"><Heading eyebrow="המרחב המתוכנן" subtitle="תכנון קפדני ובר־קיימא. מרחב פתוח, נגיש ומזמין.">מתוכננת לפרפרים.<br />פתוחה לכולם.</Heading><div className="garden-features">{[
    [Users, 'פינות ישיבה', 'מפגשים בין־דוריים ופעילות קבוצתית.'],
    [Search, 'תצפית ומחקר', 'שולחנות ייעודיים לחקירה ולמידה.'],
    [Droplets, 'היגיינה ונגישות', 'כיור מובנה לרחיצת ידיים.'],
  ].map(([Icon, title, text], index) => <article className="reveal" key={title} style={{ '--delay': `${240 + index * 100}ms` }}><Icon /><div><h2>{title}</h2><p>{text}</p></div></article>)}</div></div><figure className="garden-visual garden-photo reveal" style={{ '--delay': '220ms' }}><img src="/assets/garden-photo.webp" alt="גינה עם פרפרים וצמחייה פורחת, פינות ישיבה, שולחן תצפית וכיור אבן" /><figcaption>תמונת השראה לגינה · לא תוכנית אדריכלית</figcaption></figure></div>

  if (slide.kind === 'plants') return <div className="slide-body plants-body"><Heading eyebrow="ערוגות אקולוגיות מותאמות" subtitle="צמחי צוף ופונדקאים למשיכת פרפרים וציפורים.">לכל צמח יש תפקיד.</Heading><div className="plant-groups">{[
    { title: 'צמחי פונדקאות', text: 'מקום למחזור החיים.', icon: Leaf, names: ['פיגם מצוי', 'שומר', 'כובע הנזיר'] },
    { title: 'צמחי צוף', text: 'פריחה שמזמינה פרפרים.', icon: Flower2, names: ['לנטנה', 'לוונדר'] },
  ].map((group, index) => { const Icon = group.icon; return <div className="plant-group reveal" key={group.title} style={{ '--delay': `${230 + index * 170}ms` }}><Icon className="plant-group-icon" /><h2>{group.title}</h2><p>{group.text}</p><div className="plant-names">{group.names.map((name, plantIndex) => <span className="reveal" key={name} style={{ '--delay': `${430 + plantIndex * 100}ms` }}><Sprout size={20} />{name}</span>)}</div></div> })}</div><div className="plant-underline" aria-hidden="true" /></div>

  if (slide.kind === 'roadmap') return <div className="slide-body roadmap-body"><Heading eyebrow="תוכנית העבודה המוצעת" subtitle="ארבעה שלבים: מבחירת המקום ועד גינה שמטופחת לאורך זמן.">מרעיון לגינה פורחת.</Heading><ol className="roadmap-stages">{roadmap.map((stage, index) => { const Icon = stage.icon; return <li className="roadmap-stage reveal" key={stage.title} style={{ '--delay': `${240 + index * 140}ms` }}><div className="roadmap-stage-head" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span><Icon /></div><h2>{stage.title}</h2><p className="roadmap-stage-subtitle">{stage.subtitle}</p><ul>{stage.items.map(task => <li key={task}><Check /><p>{task}</p></li>)}</ul></li> })}</ol></div>

  return <><img className="backdrop-photo closing-photo" src="/assets/hero.webp" alt="פרפר זנב־הסנונית בגינה" /><div className="photo-shade" /><div className="closing-content"><div className="closing-mark reveal"><Butterfly /></div><Heading eyebrow="מה אנחנו מבקשים מהמועצה">בואו נצמיח יחד.</Heading><ol className="closing-asks">{requests.map(({ title, summary }, index) => <li className="reveal" key={title} style={{ '--delay': `${260 + index * 130}ms` }}><span aria-hidden="true">{index + 1}</span><div><h2>{title}</h2><p>{summary}</p></div></li>)}</ol><div className="team reveal" style={{ '--delay': '700ms' }}><span>צוות המיזם · גדרות · אקולידרס 2026</span><p>רונית אדם · איריס אלבין · אסף חסון</p></div></div><Flight celebration /></>
}

function App() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState('')
  const transitionLock = useRef(false)
  const transitionTimer = useRef(null)
  const navigateRef = useRef(null)
  const slide = slides[slideIndex]
  const finished = slideIndex === slides.length - 1

  function navigate(offset) {
    if (transitionLock.current || slideIndex + offset < 0 || slideIndex + offset >= slides.length) return
    transitionLock.current = true
    setTransitioning(true)
    const update = () => flushSync(() => setSlideIndex(index => index + offset))
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const transition = document.startViewTransition(update)
      transition.ready.catch(() => {})
      transition.finished.catch(() => {})
    } else update()
    transitionTimer.current = setTimeout(() => { transitionLock.current = false; setTransitioning(false) }, 700)
  }
  function advance() { navigate(1) }
  navigateRef.current = navigate

  useEffect(() => {
    function onKey(event) {
      if ([' ', 'Enter'].includes(event.key) && event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select')) return
      if ([' ', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        if (!event.repeat) navigateRef.current(event.key === 'ArrowRight' ? -1 : 1)
      }
    }
    function onFullscreen() { setFullscreen(Boolean(document.fullscreenElement)) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFullscreen)
    lifecycle.map(item => item.image).concat('/assets/garden-photo.webp').forEach(source => { const image = new Image(); image.src = source })
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFullscreen); clearTimeout(transitionTimer.current) }
  }, [])

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
      setFullscreenError('')
    } catch { setFullscreenError('לא ניתן להפעיל מסך מלא בדפדפן זה.') }
  }

  return <div className={`presentation theme-${slide.theme}`} data-slide-index={slideIndex} data-transitioning={transitioning} onClick={advance}>
    <header className="presentation-header"><div className="brand"><Butterfly /><span>גינת הפרפרים<small>גדרות · אקולידרס 2026</small></span></div><span className="chapter-label">{slide.chapter}</span><button className="fullscreen-button" onClick={event => { event.stopPropagation(); toggleFullscreen() }} aria-label={fullscreen ? 'יציאה ממסך מלא' : 'מסך מלא'} title={fullscreen ? 'יציאה ממסך מלא' : 'מסך מלא'}>{fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}</button></header>
    <main className="presentation-stage" aria-label={`שקף ${slideIndex + 1} מתוך ${slides.length}`}><section key={slideIndex} className={`slide slide-${slide.kind}`} aria-labelledby="current-slide-title"><SlideContent slide={slide} /><h2 className="sr-only" id="current-slide-title">{slide.chapter}</h2></section></main>
    <footer className="presentation-footer"><div className="slide-counter" dir="ltr"><strong>{String(slideIndex + 1).padStart(2, '0')}</strong><span>/ {String(slides.length).padStart(2, '0')}</span></div><div className="progress-track" role="progressbar" aria-label="התקדמות המצגת" aria-valuemin={1} aria-valuemax={slides.length} aria-valuenow={slideIndex + 1}>{slides.map((item, index) => <span key={index} className={index <= slideIndex ? 'complete' : ''} />)}</div><nav className="presentation-controls" aria-label="ניווט בין שקפים"><button className="previous-button" onClick={event => { event.stopPropagation(); navigate(-1) }} disabled={slideIndex === 0 || transitioning} aria-label="השקף הקודם" title="השקף הקודם"><ArrowRight size={20} /></button><button className="next-button" onClick={event => { event.stopPropagation(); advance() }} disabled={finished || transitioning} aria-label={finished ? 'סיום המצגת' : 'השקף הבא'} title={finished ? 'סיום המצגת' : 'השקף הבא'}><span>{finished ? 'צומחים יחד' : 'ממשיכים'}</span>{finished ? <Check size={20} /> : <ArrowLeft size={21} />}</button></nav></footer>
    <div className="sr-only" role="status" aria-live="polite">שקף {slideIndex + 1} מתוך {slides.length}: {slide.chapter}{fullscreenError && ` · ${fullscreenError}`}</div>
  </div>
}

export default App