import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { analyze, evalPick, finalScore, findMatches, pool, type Match, type Result } from '@/lib/engine'
import { currentEmail, db, rpc, rpcJson, signIn, signOut, signUp, userId } from '@/lib/supabase'

type QR = { id: string; question: string; answer: string; position: number }
type AU = { id: string; email: string; created_at: string; last_sign_in_at: string | null; ads_cookies: boolean | null; marketing_email: boolean | null; notifications: boolean | null; analyses: number }

function Admin({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<AU[]>([])
  const [qr, setQr] = useState<QR[]>([])
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<'users' | 'replies'>('users')
  async function load() {
    const u = await rpcJson('admin_list_users')
    if (Array.isArray(u)) setUsers(u)
    const r = await db('GET', 'quick_replies?select=*&order=position.asc')
    if (Array.isArray(r)) setQr(r)
  }
  useEffect(() => { void load() }, [])
  async function add() {
    if (!q.trim() || !a.trim()) return
    const ok = await db('POST', 'quick_replies', { question: q.trim(), answer: a.trim(), position: qr.length + 1 })
    setMsg(ok ? 'Resposta salva.' : 'Falha ao salvar.')
    if (ok) { setQ(''); setA(''); await load() }
  }
  async function del(id: string) {
    if (!confirm('Apagar esta resposta?')) return
    const ok = await db('DELETE', `quick_replies?id=eq.${id}`)
    setMsg(ok ? 'Resposta apagada.' : 'Falha ao apagar.')
    await load()
  }
  const yn = (v: boolean | null) => (v ? 'sim' : 'não')
  const inp = 'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white'
  const tb = (k: 'users' | 'replies') => `rounded-full px-4 py-2 text-xs font-bold ${tab === k ? 'bg-blue-500' : 'bg-white/10'}`
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#060818] p-4 text-slate-100">
      <div className="mx-auto max-w-2xl space-y-3">
        <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Área administrativa</h2><button type="button" className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold" onClick={onClose}>Fechar</button></div>
        <div className="flex gap-2"><button type="button" className={tb('users')} onClick={() => setTab('users')}>Usuários ({users.length})</button><button type="button" className={tb('replies')} onClick={() => setTab('replies')}>Respostas rápidas ({qr.length})</button></div>
        {msg && <p className="text-xs text-amber-300">{msg}</p>}
        {tab === 'users' && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Total de análises salvas: {users.reduce((s, u) => s + Number(u.analyses), 0)}</p>
            {users.map((u) => (
              <div key={u.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                <p className="break-all text-sm font-semibold">{u.email}</p>
                <p className="text-slate-400">Cadastro: {new Date(u.created_at).toLocaleDateString('pt-BR')} · Último acesso: {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString('pt-BR') : '-'}</p>
                <p className="text-slate-300">Análises: {u.analyses} · Anúncios: {yn(u.ads_cookies)} · E-mail: {yn(u.marketing_email)} · Notificações: {yn(u.notifications)}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'replies' && (
          <div className="space-y-2">
            <input className={inp} placeholder="Pergunta" value={q} onChange={(e) => setQ(e.target.value)} />
            <textarea className={inp} rows={3} placeholder="Resposta" value={a} onChange={(e) => setA(e.target.value)} />
            <Button onClick={() => void add()} className="rounded-full bg-blue-500 text-xs font-bold text-white">Adicionar resposta</Button>
            {qr.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                <p className="text-sm font-semibold">{r.question}</p><p className="mt-1 text-slate-300">{r.answer}</p>
                <button type="button" className="mt-2 text-red-400 underline" onClick={() => void del(r.id)}>Apagar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type Row = { id: string; fixture_id: string; home_team: string; away_team: string; competition: string; kickoff_at: string; selection: string; status: string; analysis_payload: { league?: string; confidence?: number; score?: string } }

function notifySettled(before: Row[], after: Row[]) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted' || localStorage.getItem('iatrader-notif') !== '1') return
  const was = new Map(before.map((r) => [r.id, r.status]))
  after.forEach((r) => {
    if (was.get(r.id) === 'pending' && (r.status === 'won' || r.status === 'lost')) {
      try { new Notification(r.status === 'won' ? 'Análise ACERTOU ✓' : 'Análise errou ✗', { body: `${r.home_team} x ${r.away_team} · ${r.selection} · ${r.analysis_payload?.score ?? ''}` }) } catch { /* ignora */ }
    }
  })
}

function Consent({ user, onDone }: { user: string; onDone: () => void }) {
  const [terms, setTerms] = useState(false)
  const [adult, setAdult] = useState(false)
  const [ads, setAds] = useState(true)
  const [mail, setMail] = useState(true)
  const [notif, setNotif] = useState(true)
  const [busy, setBusy] = useState(false)
  async function accept() {
    setBusy(true)
    let n = false
    if (notif && typeof Notification !== 'undefined') n = (await Notification.requestPermission()) === 'granted'
    localStorage.setItem('iatrader-notif', n ? '1' : '0')
    localStorage.setItem('iatrader-consent', '1')
    const row = { user_id: userId(), email: user, terms_accepted_at: new Date().toISOString(), ads_cookies: ads, marketing_email: mail, notifications: n, updated_at: new Date().toISOString() }
    const ex = await db('GET', `user_consents?select=user_id&user_id=eq.${row.user_id}`)
    if (Array.isArray(ex) && ex.length) await db('PATCH', `user_consents?user_id=eq.${row.user_id}`, row)
    else await db('POST', 'user_consents', row)
    setBusy(false); onDone()
  }
  const box = 'mt-0.5 h-4 w-4 shrink-0'
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center">
      <div className="max-h-[92svh] w-full max-w-md space-y-3 overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1030] p-5 text-sm text-slate-200">
        <h2 className="text-lg font-extrabold">Termos de uso e privacidade</h2>
        <p className="text-xs text-slate-400">As análises são frequências históricas, não garantem resultado. Uso apenas por maiores de 18 anos. Usamos cookies para o funcionamento do app e, se você permitir, para exibir anúncios.</p>
        <label className="flex gap-2"><input type="checkbox" className={box} checked={terms} onChange={(e) => setTerms(e.target.checked)} /><span>Li e aceito os termos de uso e a política de privacidade (obrigatório).</span></label>
        <label className="flex gap-2"><input type="checkbox" className={box} checked={adult} onChange={(e) => setAdult(e.target.checked)} /><span>Tenho 18 anos ou mais (obrigatório).</span></label>
        <label className="flex gap-2"><input type="checkbox" className={box} checked={ads} onChange={(e) => setAds(e.target.checked)} /><span>Aceito cookies para anúncios.</span></label>
        <label className="flex gap-2"><input type="checkbox" className={box} checked={mail} onChange={(e) => setMail(e.target.checked)} /><span>Aceito receber anúncios no meu e-mail ({user}).</span></label>
        <label className="flex gap-2"><input type="checkbox" className={box} checked={notif} onChange={(e) => setNotif(e.target.checked)} /><span>Quero notificações em tempo real quando uma análise acertar ou errar.</span></label>
        <Button disabled={!terms || !adult || busy} onClick={() => void accept()} className="h-12 w-full rounded-full border-0 bg-gradient-to-r from-blue-500 to-violet-500 text-xs font-extrabold text-white">{busy ? '...' : 'ACEITAR E CONTINUAR'}</Button>
      </div>
    </div>
  )
}

function Support() {
  const [remote, setRemote] = useState<QR[]>([])
  useEffect(() => { void db('GET', 'quick_replies?select=*&order=position.asc').then((r) => { if (Array.isArray(r)) setRemote(r) }) }, [])
  const fallback: [string, string][] = [
    ['O que é o IA Trader Esportes?', 'Um app que reúne jogos de várias ligas do mundo, analisa o histórico dos times e só mostra entradas com pelo menos 70% de chance pelos dados.'],
    ['Como funcionam as análises?', 'Usamos os últimos jogos, os confrontos diretos e a forma recente. Se os dados não forem suficientes, o jogo não mostra entrada.'],
    ['O app garante lucro?', 'Não. São frequências históricas, sem garantia de resultado. Aposte com responsabilidade (18+).'],
    ['Quantas análises posso fazer?', 'Há um limite diário de análises manuais; ele zera todo dia.'],
    ['Como funciona o histórico?', 'Cada entrada é salva na sua conta. Depois do jogo, o app confere o placar e marca verde (acertou) ou vermelho (errou).'],
    ['Por que algum jogo não mostra entrada?', 'O jogo precisa ter ao menos 5 partidas de histórico por time e 70% de chance. Sem isso, ele fica sem entrada.'],
    ['As notificações funcionam com o app fechado?', 'Não. Elas chegam enquanto o app está aberto, pois o placar é conferido a cada 5 minutos.'],
    ['Como mudar notificações, cookies ou e-mails?', 'Toque em "Rever preferências" abaixo para escolher de novo.'],
  ]
  const items: [string, string][] = remote.length ? remote.map((r) => [r.question, r.answer]) : fallback
  return (
    <section className="space-y-2 border-t border-white/10 pt-4">
      <h2 className="text-sm font-extrabold tracking-wide">PERGUNTAS FREQUENTES E SUPORTE</h2>
      {items.map(([q, a]) => (
        <details key={q} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-xs text-slate-300">{a}</p></details>
      ))}
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
        <p className="font-semibold text-slate-100">Precisa de ajuda?</p>
        <p className="mt-1">Envie sua dúvida ou problema por e-mail e responderemos o quanto antes.</p>
        <a className="mt-2 inline-block rounded-full bg-blue-500 px-4 py-2 font-bold text-white" href={`mailto:suporte@iatrader.app?subject=${encodeURIComponent('Suporte IA Trader Esportes')}`}>Falar com o suporte</a>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
        <p className="font-semibold text-slate-100">Feedback e contato</p>
        <p className="mt-1">Tem uma sugestão ou elogio? Conte para nós ou fale pelas redes.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <a className="rounded-full bg-violet-500 px-4 py-2 font-bold text-white" href={`mailto:suporte@iatrader.app?subject=${encodeURIComponent('Feedback IA Trader Esportes')}`}>Enviar feedback</a>
          <a className="rounded-full bg-sky-500 px-4 py-2 font-bold text-white" href="https://t.me/AlexandreSports" target="_blank" rel="noreferrer">Telegram</a>
          <a className="rounded-full bg-pink-500 px-4 py-2 font-bold text-white" href="https://www.instagram.com/aleesilvaasouzaa?lqvp=cGhzeG1pdXhpMjRh" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
      <button type="button" className="text-xs text-blue-300 underline" onClick={() => { localStorage.removeItem('iatrader-consent'); location.reload() }}>Rever preferências (termos, cookies e notificações)</button>
    </section>
  )
}

function History({ rows }: { rows: Row[] }) {
  const won = rows.filter((r) => r.status === 'won').length, lost = rows.filter((r) => r.status === 'lost').length
  return (
    <section className="space-y-3 border-t border-white/10 pt-4">
      <h2 className="text-sm font-extrabold tracking-wide">HISTÓRICO DE ANÁLISES</h2>
      <p className="text-xs text-slate-400">Acertos: {won} · Erros: {lost} · Pendentes: {rows.length - won - lost}</p>
      {!rows.length && <p className="text-xs text-slate-500">As análises geradas ficam salvas aqui.</p>}
      {rows.map((r) => {
        const c = r.status === 'won' ? 'border-green-500/60 bg-green-500/15' : r.status === 'lost' ? 'border-red-500/60 bg-red-500/15' : 'border-white/10 bg-white/5'
        return (
          <article key={r.id} className={`rounded-2xl border p-3 text-sm ${c}`}>
            <div className="flex justify-between text-xs text-slate-400"><span>{r.competition}</span><span>{new Date(r.kickoff_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span></div>
            <p className="mt-1 font-semibold">{r.home_team} x {r.away_team}</p>
            <p className="text-xs">{r.selection}{r.analysis_payload?.confidence ? ` · ${r.analysis_payload.confidence}%` : ''}</p>
            <p className={`mt-1 text-xs font-bold ${r.status === 'won' ? 'text-green-400' : r.status === 'lost' ? 'text-red-400' : 'text-slate-400'}`}>{r.status === 'won' ? `ACERTOU ✓ ${r.analysis_payload?.score ?? ''}` : r.status === 'lost' ? `ERROU ✗ ${r.analysis_payload?.score ?? ''}` : 'AGUARDANDO O JOGO'}</p>
          </article>
        )
      })}
    </section>
  )
}

type Lang = 'pt' | 'en' | 'es'
const T = {
  pt: { analyze: 'ANALISAR JOGOS', running: 'Analisando...', found: 'Encontradas', done: 'Analisadas', all: 'Todos', country: 'País', league: 'Campeonato', view: 'VER ANÁLISE', hide: 'FECHAR', none: 'SEM ENTRADA CONFIÁVEL', left: 'Análises restantes hoje', limit: 'Limite diário atingido. Volte amanhã.', err: 'Falha de rede ou fonte indisponível. Verifique a internet e tente novamente.', empty: 'Nenhuma partida encontrada nas próximas 12 horas.', games: 'jogos analisados', conf: 'Confiança', src: 'Fontes', h2h: 'Confrontos diretos', form: 'Forma (5)', disc: 'Frequências históricas, não são garantia de resultado. Aposte com responsabilidade (18+).', postponed: 'ADIADO', team: 'Time', logout: 'Sair' },
  en: { analyze: 'ANALYZE MATCHES', running: 'Analyzing...', found: 'Found', done: 'Analyzed', all: 'All', country: 'Country', league: 'League', view: 'VIEW ANALYSIS', hide: 'CLOSE', none: 'NO RELIABLE PICK', left: 'Analyses left today', limit: 'Daily limit reached. Come back tomorrow.', err: 'Network error or source unavailable. Check your connection and retry.', empty: 'No matches found in the next 12 hours.', games: 'games analyzed', conf: 'Confidence', src: 'Sources', h2h: 'Head to head', form: 'Form (5)', disc: 'Historical frequencies, not a guarantee. Bet responsibly (18+).', postponed: 'POSTPONED', team: 'Team', logout: 'Log out' },
  es: { analyze: 'ANALIZAR PARTIDOS', running: 'Analizando...', found: 'Encontrados', done: 'Analizados', all: 'Todos', country: 'País', league: 'Campeonato', view: 'VER ANÁLISIS', hide: 'CERRAR', none: 'SIN ENTRADA CONFIABLE', left: 'Análisis restantes hoy', limit: 'Límite diario alcanzado. Vuelve mañana.', err: 'Error de red o fuente no disponible. Revisa tu conexión.', empty: 'No hay partidos en las próximas 12 horas.', games: 'partidos analizados', conf: 'Confianza', src: 'Fuentes', h2h: 'Enfrentamientos', form: 'Forma (5)', disc: 'Frecuencias históricas, no garantía. Apuesta con responsabilidad (18+).', postponed: 'APLAZADO', team: 'Equipo', logout: 'Salir' },
}
const MAX = 2
const AD_LINK = 'https://r1wovcg.com/v3/landing-page/football?p=qw33'
const nm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

function Auth({ onLogin }: { onLogin: (u: string) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [f, setF] = useState({ email: '', pass: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const inp = 'mt-1 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-400'
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr('')
    const email = f.email.trim().toLowerCase()
    if (!email.includes('@')) { setErr('Informe um e-mail válido.'); return }
    if (f.pass.length < 6) { setErr('A senha precisa ter ao menos 6 caracteres.'); return }
    setBusy(true)
    const r = mode === 'signup' ? await signUp(email, f.pass) : await signIn(email, f.pass)
    setBusy(false)
    if (r.error || !r.email) { setErr(r.error ?? 'Erro.'); return }
    onLogin(r.email)
  }
  return (
    <div className="min-h-svh bg-[radial-gradient(ellipse_at_top,#1e2a6b_0%,#0b1030_45%,#060818_100%)] text-slate-100">
      <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-4 px-4 py-6">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-blue-300">IA / Trader Esportes</span>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/40 bg-blue-500/10 text-blue-300"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8l3.5 2.5-1.3 4h-4.4l-1.3-4L12 8zM12 3v5M20.5 9.5l-5 1M17.5 19l-3.3-4.5M6.5 19l3.3-4.5M3.5 9.5l5 1" /></svg></div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-extrabold tracking-wide">IA TRADER ESPORTES</h1>
              <p className="text-[11px] leading-tight text-slate-400">Inteligência esportiva • Dados e estatísticas do futebol</p>
            </div>
          </div>
          <h2 className="text-center text-2xl font-extrabold">{mode === 'login' ? 'Bem-vindo de volta!' : 'Criar minha conta'}</h2>
          <form onSubmit={submit} className="space-y-3">
            <label className="block text-xs">E-mail<input className={inp} type="email" autoComplete="email" placeholder="seuemail@exemplo.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
            <label className="block text-xs">Senha<input className={inp} type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="Mínimo de 6 caracteres" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} /></label>
            {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
            <Button type="submit" disabled={busy} size="lg" className="h-12 w-full rounded-full border-0 bg-gradient-to-r from-blue-500 to-violet-500 text-xs font-extrabold tracking-wider text-white">{busy ? '...' : mode === 'login' ? 'ENTRAR NA MINHA CONTA' : 'CRIAR CONTA E ENTRAR'}</Button>
          </form>
          <p className="text-center text-xs text-slate-300">{mode === 'signup' ? 'Já tem cadastro? ' : 'Ainda não tem cadastro? '}<button type="button" className="text-blue-300 underline" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setErr('') }}>{mode === 'signup' ? 'Fazer login' : 'Criar minha conta'}</button></p>
        </div>
      </main>
    </div>
  )
}

function Card({ r, t, lang }: { r: Result; t: (typeof T)['pt']; lang: Lang }) {
  const [open, setOpen] = useState(false)
  const m = r.match, p = r.pick
  const time = new Date(m.date).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-100 shadow-lg">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{m.country} · {m.leagueName}</span>
        <span>{time}{m.postponed && ` · ${t.postponed}`}</span>
      </div>
      <h3 className="mt-2 font-semibold">{m.home.name} x {m.away.name}</h3>
      <p className={`mt-2 rounded-md px-3 py-2 text-sm font-bold ${p ? 'bg-blue-500/15 text-blue-300' : 'bg-white/5 text-slate-400'}`}>
        {p ? `${p.label} · ${t.conf} ${p.confidence}%` : t.none}
      </p>
      <Button variant="outline" size="sm" className="mt-3 w-full rounded-xl border-white/15 bg-white/5 text-white" onClick={() => setOpen(!open)}>{open ? t.hide : t.view}</Button>
      {open && (
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>{r.reason}</p>
          <p>{t.form}: {m.home.name} {r.formHome || '-'} · {m.away.name} {r.formAway || '-'}</p>
          <p>{t.h2h}: {r.h2h.n ? r.h2h.text : '-'}</p>
          <p>{r.nHome}+{r.nAway} {t.games}</p>
          <p className="text-xs text-slate-400">{t.src}: {r.sources.join('; ')}</p>
          <p className="text-xs text-slate-500">{t.disc}</p>
        </div>
      )}
    </article>
  )
}

function Home({ user, onLogout }: { user: string; onLogout: () => void }) {
  const [lang, setLang] = useState<Lang>('pt')
  const t = T[lang]
  const [matches, setMatches] = useState<Match[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [progress, setProgress] = useState(0)
  const [secs, setSecs] = useState(0)
  const [country, setCountry] = useState('')
  const [league, setLeague] = useState('')
  const [team, setTeam] = useState('')
  const [used, setUsed] = useState(0)
  const timer = useRef(0)
  const running = useRef(false)
  const [rows, setRows] = useState<Row[]>([])
  const saved = useRef(new Set<string>())
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  async function loadRows() {
    const d = await db('GET', 'analysis_history?select=id,fixture_id,home_team,away_team,competition,kickoff_at,selection,status,analysis_payload&order=kickoff_at.desc&limit=100')
    if (!Array.isArray(d)) return
    d.forEach((r: Row) => saved.current.add(r.fixture_id))
    setRows(d)
    const due = (d as Row[]).filter((r) => r.status === 'pending' && Date.now() > new Date(r.kickoff_at).getTime() + 2.5 * 3600000)
    let changed = false
    await pool(due, 3, async (r) => {
      const lg = r.analysis_payload?.league ?? ''
      const s = await finalScore(r.fixture_id, lg)
      if (!s) return
      const ok = evalPick(r.selection, r.home_team, s.h, s.a)
      if (ok === null) return
      const ps = { ...r.analysis_payload, score: `${s.h}-${s.a}` }
      if (await db('PATCH', `analysis_history?id=eq.${r.id}`, { status: ok ? 'won' : 'lost', settled_at: new Date().toISOString(), analysis_payload: ps })) changed = true
    })
    if (changed) { const n = await db('GET', 'analysis_history?select=id,fixture_id,home_team,away_team,competition,kickoff_at,selection,status,analysis_payload&order=kickoff_at.desc&limit=100'); if (Array.isArray(n)) { setRows(n); notifySettled(d as Row[], n as Row[]) } }
  }
  async function save(r: Result) {
    const p = r.pick, uid = userId()
    if (!p || !uid || saved.current.has(r.match.id)) return
    saved.current.add(r.match.id)
    const ok = await db('POST', 'analysis_history', { user_id: uid, fixture_id: r.match.id, home_team: r.match.home.name, away_team: r.match.away.name, competition: r.match.leagueName, kickoff_at: r.match.date, market: p.market, selection: p.label, analysis_payload: { league: r.match.league, confidence: p.confidence, reason: r.reason } })
    if (!ok) saved.current.delete(r.match.id)
  }

  useEffect(() => {
    void rpcJson('am_i_admin').then((v) => setIsAdmin(v === true))
    void rpc('get_usage').then((n) => { if (n !== null) setUsed(n) })
    void loadRows()
    const iv = setInterval(() => void loadRows(), 5 * 60000)
    return () => { clearInterval(timer.current); clearInterval(iv) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [adOpen, setAdOpen] = useState(false)
  const [partner, setPartner] = useState<boolean | null>(null)
  const [pid, setPid] = useState('')
  const [perr, setPerr] = useState('')
  useEffect(() => {
    void db('GET', 'partner_accounts?select=partner_id').then((d) => setPartner(Array.isArray(d) && d.length > 0))
  }, [])
  async function confirmPartner() {
    const id = pid.trim()
    if (!/^\d{9}$/.test(id)) { setPerr('O ID da 1win deve ter exatamente 9 dígitos (apenas números).'); return }
    const ok = await db('POST', 'partner_accounts', { user_id: userId(), partner_id: id })
    if (!ok) { setPerr('Não foi possível salvar. Tente novamente.'); return }
    setPartner(true); setAdOpen(false); setPerr('')
    void run(false)
  }
  function clickAnalyze() { if (partner) void run(false); else setAdOpen(true) }
  async function run(auto = false) {
    if (running.current) return
    running.current = true
    try { await runInner(auto) } finally { running.current = false }
  }
  async function runInner(auto: boolean) {
    if (!navigator.onLine) { setMsg(t.err); return }
    if (!auto) {
      const n = await rpc('consume_analysis')
      if (n === null) { setMsg(t.err); return }
      if (n < 0) { setUsed(MAX); setMsg(t.limit); return }
      setUsed(n)
    }
    setBusy(true); setMsg(''); setResults([]); setMatches([]); setProgress(0); setSecs(0)
    const t0 = Date.now()
    timer.current = window.setInterval(() => setSecs(Math.floor((Date.now() - t0) / 1000)), 500)
    try {
      const all = await findMatches((d, n) => setProgress(Math.round((d / n) * 40)))
      const ms = all.filter((m, i) => all.findIndex((x) => x.id === m.id) === i)
      setMatches(ms)
      if (!ms.length) setMsg(t.empty)
      let done = 0
      await pool(ms, 6, async (m) => {
        const r = await analyze(m)
        await save(r)
        setResults((x) => [...x, r].sort((a, b) => a.match.date.localeCompare(b.match.date)))
        setProgress(40 + Math.round((++done / ms.length) * 60))
      })
    } catch { setMsg(t.err) }
    clearInterval(timer.current); setBusy(false)
    void loadRows()
  }

  useEffect(() => { if (partner) void run(true) }, [partner]) // eslint-disable-line react-hooks/exhaustive-deps

  const countries = useMemo(() => [...new Set(matches.map((m) => m.country))].sort(), [matches])
  const leagues = useMemo(() => [...new Set(matches.filter((m) => !country || m.country === country).map((m) => m.leagueName))].sort(), [matches, country])
  const shown = results.filter((r) => {
    if (!r.pick) return false
    if ((country && r.match.country !== country) || (league && r.match.leagueName !== league)) return false
    if (team && !nm(r.match.home.name).includes(nm(team)) && !nm(r.match.away.name).includes(nm(team))) return false
    return true
  })
  const sel = 'h-10 rounded-xl border border-white/10 bg-[#0b1030] px-2 text-sm text-white'

  return (
    <div className="min-h-svh bg-[radial-gradient(ellipse_at_top,#1e2a6b_0%,#0b1030_45%,#060818_100%)] text-slate-100">
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {adOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-sm space-y-3 rounded-3xl border border-white/10 bg-[#0b1030] p-5 text-center shadow-2xl">
              <span className="inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-300">Publicidade • Link de afiliado</span>
              <h3 className="text-xl font-extrabold">Libere as análises</h3>
              <p className="text-sm text-slate-300">Para liberar as análises, crie sua conta na plataforma parceira 1win pelo botão abaixo. Se você já tem conta, é só informar seu ID.</p>
              <a href={AD_LINK} target="_blank" rel="noopener noreferrer sponsored" className="block h-12 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-sm font-extrabold leading-[3rem] text-white">CRIAR CONTA NA 1WIN</a>
              <input inputMode="numeric" placeholder="Seu ID de usuário da 1win" value={pid} onChange={(e) => setPid(e.target.value)} className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-center text-sm text-white placeholder:text-slate-400" />
              {perr && <p role="alert" className="text-xs text-red-400">{perr}</p>}
              <button type="button" className="h-12 w-full rounded-full bg-white/10 text-sm font-bold" onClick={() => void confirmPartner()}>Já tenho conta / Liberar análises</button>
              <button type="button" className="text-xs text-slate-400 underline" onClick={() => setAdOpen(false)}>Fechar</button>
              <p className="text-[10px] leading-tight text-slate-400">Somente maiores de 18 anos. Jogue com responsabilidade. Apostas envolvem risco e não há ganho garantido. Este é um link de afiliado: podemos receber comissão.</p>
            </div>
          </div>
        )}
        <header className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-base font-extrabold tracking-wide">IA TRADER ESPORTES</h1>
            <p className="truncate text-xs text-slate-400">{user}</p>
          </div>
          <div className="flex items-center gap-2">
            <select aria-label="Idioma" className={sel} value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
              <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option>
            </select>
            {isAdmin && <button type="button" className="h-10 rounded-xl bg-amber-500 px-3 text-xs font-bold text-black" onClick={() => setAdminOpen(true)}>Admin</button>}
            <button type="button" className="h-10 rounded-xl bg-white/10 px-3 text-xs font-bold" onClick={onLogout}>{t.logout}</button>
          </div>
        </header>
        <Button disabled={busy || used >= MAX} onClick={clickAnalyze} className="h-12 w-full rounded-full border-0 bg-gradient-to-r from-blue-500 to-violet-500 text-xs font-extrabold tracking-wider text-white">{busy ? `${t.running} ${progress}% · ${secs}s` : t.analyze}</Button>
        <p className="text-xs text-slate-400">{t.left}: {Math.max(0, MAX - used)}</p>
        {msg && <p role="alert" className="text-sm text-amber-300">{msg}</p>}
        <p className="text-xs text-slate-400">{t.found}: {matches.length} · {t.done}: {results.length}</p>
        <div className="flex flex-wrap gap-2">
          <select aria-label={t.country} className={sel} value={country} onChange={(e) => { setCountry(e.target.value); setLeague('') }}><option value="">{t.country}: {t.all}</option>{countries.map((c) => <option key={c}>{c}</option>)}</select>
          <select aria-label={t.league} className={sel} value={league} onChange={(e) => setLeague(e.target.value)}><option value="">{t.league}: {t.all}</option>{leagues.map((c) => <option key={c}>{c}</option>)}</select>
          <input aria-label={t.team} placeholder={t.team} className={sel + ' min-w-0 flex-1'} value={team} onChange={(e) => setTeam(e.target.value)} />
        </div>
        <div className="space-y-3">{shown.map((r) => <Card key={r.match.id} r={r} t={t} lang={lang} />)}</div>
        <History rows={rows} />
        <Support />
      </main>
      {isAdmin && adminOpen && <Admin onClose={() => setAdminOpen(false)} />}
    </div>
  )
}

function Root() {
  const [user, setUser] = useState(() => currentEmail())
  const [ok, setOk] = useState(() => localStorage.getItem('iatrader-consent') === '1')
  if (!user) return <Auth onLogin={setUser} />
  return (
    <>
      <Home key={user} user={user} onLogout={() => { signOut(); setUser('') }} />
      {!ok && <Consent user={user} onDone={() => setOk(true)} />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes><Route path="*" element={<Root />} /></Routes>
    </BrowserRouter>
  )
}
