const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer'

export const LEAGUES: Record<string, { name: string; country: string }> = {
  'bra.1': { name: 'Brasileirão A', country: 'Brasil' },
  'bra.2': { name: 'Brasileirão B', country: 'Brasil' },
  'arg.1': { name: 'Liga Profesional', country: 'Argentina' },
  'eng.1': { name: 'Premier League', country: 'Inglaterra' },
  'eng.2': { name: 'Championship', country: 'Inglaterra' },
  'esp.1': { name: 'LaLiga', country: 'Espanha' },
  'ita.1': { name: 'Serie A', country: 'Itália' },
  'ger.1': { name: 'Bundesliga', country: 'Alemanha' },
  'fra.1': { name: 'Ligue 1', country: 'França' },
  'por.1': { name: 'Liga Portugal', country: 'Portugal' },
  'ned.1': { name: 'Eredivisie', country: 'Holanda' },
  'usa.1': { name: 'MLS', country: 'EUA' },
  'mex.1': { name: 'Liga MX', country: 'México' },
  'col.1': { name: 'Liga BetPlay', country: 'Colômbia' },
  'chi.1': { name: 'Primera Chile', country: 'Chile' },
  'uru.1': { name: 'Primera Uruguay', country: 'Uruguai' },
  'tur.1': { name: 'Süper Lig', country: 'Turquia' },
  'sco.1': { name: 'Premiership', country: 'Escócia' },
  'bel.1': { name: 'Pro League', country: 'Bélgica' },
  'jpn.1': { name: 'J1 League', country: 'Japão' },
  'ksa.1': { name: 'Saudi Pro League', country: 'Arábia Saudita' },
  'aus.1': { name: 'A-League', country: 'Austrália' },
  'ger.2': { name: '2. Bundesliga', country: 'Alemanha' },
  'ita.2': { name: 'Serie B', country: 'Itália' },
  'esp.2': { name: 'LaLiga 2', country: 'Espanha' },
  'fra.2': { name: 'Ligue 2', country: 'França' },
  'por.2': { name: 'Liga Portugal 2', country: 'Portugal' },
  'arg.2': { name: 'Primera Nacional', country: 'Argentina' },
  'ecu.1': { name: 'Liga Pro Equador', country: 'Equador' },
  'per.1': { name: 'Liga 1 Peru', country: 'Peru' },
  'par.1': { name: 'Primera Paraguai', country: 'Paraguai' },
  'gre.1': { name: 'Super League Grécia', country: 'Grécia' },
  'aut.1': { name: 'Bundesliga Áustria', country: 'Áustria' },
  'sui.1': { name: 'Super League Suíça', country: 'Suíça' },
  'den.1': { name: 'Superliga', country: 'Dinamarca' },
  'swe.1': { name: 'Allsvenskan', country: 'Suécia' },
  'srb.1': { name: 'Superliga Sérvia', country: 'Sérvia' },
  'pol.1': { name: 'Ekstraklasa', country: 'Polônia' },
  'nor.1': { name: 'Eliteserien', country: 'Noruega' },
  'rus.1': { name: 'Premier Liga Rússia', country: 'Rússia' },
  'chn.1': { name: 'Super League China', country: 'China' },
  'uefa.europa.conf': { name: 'Conference League', country: 'Europa' },
  'concacaf.champions': { name: 'Champions CONCACAF', country: 'América do Norte' },
  'conmebol.libertadores': { name: 'Libertadores', country: 'América do Sul' },
  'conmebol.sudamericana': { name: 'Sul-Americana', country: 'América do Sul' },
  'uefa.champions': { name: 'Champions League', country: 'Europa' },
  'uefa.europa': { name: 'Europa League', country: 'Europa' },
  'bra.copa_do_brazil': { name: 'Copa do Brasil', country: 'Brasil' },
  'bra.camp.paulista': { name: 'Paulistão', country: 'Brasil' },
  'bra.camp.carioca': { name: 'Carioca', country: 'Brasil' },
  'bra.camp.mineiro': { name: 'Mineiro', country: 'Brasil' },
  'bra.camp.gaucho': { name: 'Gaúcho', country: 'Brasil' },
  'bra.3': { name: 'Brasileirão C', country: 'Brasil' },
  'conmebol.recopa': { name: 'Recopa Sul-Americana', country: 'América do Sul' },
  'eng.fa': { name: 'FA Cup', country: 'Inglaterra' },
  'eng.league_cup': { name: 'Carabao Cup', country: 'Inglaterra' },
  'esp.copa_del_rey': { name: 'Copa del Rey', country: 'Espanha' },
  'ger.dfb_pokal': { name: 'DFB-Pokal', country: 'Alemanha' },
  'ita.coppa_italia': { name: 'Coppa Italia', country: 'Itália' },
  'fra.coupe_de_france': { name: 'Copa da França', country: 'França' },
  'por.taca.portugal': { name: 'Taça de Portugal', country: 'Portugal' },
  'arg.copa': { name: 'Copa Argentina', country: 'Argentina' },
  'uefa.super_cup': { name: 'Supercopa da UEFA', country: 'Europa' },
  'uefa.nations': { name: 'Nations League', country: 'Europa' },
  'uefa.euro': { name: 'Eurocopa', country: 'Europa' },
  'conmebol.america': { name: 'Copa América', country: 'América do Sul' },
  'fifa.world': { name: 'Copa do Mundo', country: 'Mundo' },
  'fifa.worldq.conmebol': { name: 'Eliminatórias Sul-Americanas', country: 'América do Sul' },
  'fifa.worldq.uefa': { name: 'Eliminatórias Europeias', country: 'Europa' },
  'fifa.friendly': { name: 'Amistosos Internacionais', country: 'Mundo' },
  'fifa.cwc': { name: 'Mundial de Clubes', country: 'Mundo' },
  'fin.1': { name: 'Veikkausliiga', country: 'Finlândia' },
  'rou.1': { name: 'Liga 1 Romênia', country: 'Romênia' },
  'ukr.1': { name: 'Premier Liga Ucrânia', country: 'Ucrânia' },
  'cze.1': { name: 'Liga Tcheca', country: 'Tchéquia' },
  'hun.1': { name: 'NB I Hungria', country: 'Hungria' },
  'irl.1': { name: 'Premier Division Irlanda', country: 'Irlanda' },
  'wal.1': { name: 'Cymru Premier', country: 'Gales' },
  'isl.1': { name: 'Besta deild', country: 'Islândia' },
  'isr.1': { name: 'Ligat ha\'Al', country: 'Israel' },
  'qat.1': { name: 'Qatar Stars League', country: 'Catar' },
  'uae.1': { name: 'UAE Pro League', country: 'Emirados Árabes' },
  'kuw.1': { name: 'Kuwait Premier League', country: 'Kuwait' },
  'irn.1': { name: 'Persian Gulf Pro League', country: 'Irã' },
  'ind.1': { name: 'Indian Super League', country: 'Índia' },
  'vie.1': { name: 'V.League 1', country: 'Vietnã' },
  'ned.w.1': { name: 'Eredivisie Feminina', country: 'Holanda' },
  'uefa.wchampions': { name: 'Champions League Feminina', country: 'Europa' },
  'usa.nwsl': { name: 'NWSL', country: 'EUA' },
  'esp.w.1': { name: 'Liga F', country: 'Espanha' },
  'bol.1': { name: 'Liga Boliviana', country: 'Bolívia' },
  'ven.1': { name: 'Liga FUTVE', country: 'Venezuela' },
  'kor.1': { name: 'K League 1', country: 'Coreia do Sul' },
  'egy.1': { name: 'Egyptian Premier League', country: 'Egito' },
  'mar.1': { name: 'Botola Pro', country: 'Marrocos' },
  'rsa.1': { name: 'Premier Soccer League', country: 'África do Sul' },
  'mex.w.1': { name: 'Liga MX Feminina', country: 'México' },
  'eng.3': { name: 'League One', country: 'Inglaterra' },
  'eng.4': { name: 'League Two', country: 'Inglaterra' },
  'tur.2': { name: '1. Lig', country: 'Turquia' },
}

export type Game = { gf: number; ga: number; home: boolean; date: string; opp: string }
export type Match = {
  id: string; league: string; leagueName: string; country: string; date: string
  status: string; postponed: boolean
  home: { id: string; name: string }; away: { id: string; name: string }
}
export type Pick = {
  label: string; market: string; rate: number; hit: number; n: number
  r5: number | null; r10: number | null; r15: number | null; confidence: number
}
export type Result = {
  match: Match; pick: Pick | null; reason: string; nHome: number; nAway: number
  h2h: { n: number; text: string }; sources: string[]
  formHome: string; formAway: string
}

async function getJson(url: string, tries = 2): Promise<any> {
  for (let i = 0; i <= tries; i++) {
    try {
      const c = new AbortController()
      const t = setTimeout(() => c.abort(), 12000)
      const r = await fetch(url, { signal: c.signal })
      clearTimeout(t)
      if (r.ok) return await r.json()
    } catch { /* retry */ }
  }
  return null
}

const cache = new Map<string, { t: number; v: unknown }>()
async function cached<T>(url: string, ttl = 30 * 60000): Promise<T | null> {
  const hit = cache.get(url)
  if (hit && Date.now() - hit.t < ttl) return hit.v as T
  try {
    const s = sessionStorage.getItem('c:' + url)
    if (s) { const o = JSON.parse(s); if (Date.now() - o.t < ttl) return o.v }
  } catch { /* ignore */ }
  const v = await getJson(url)
  if (v) {
    cache.set(url, { t: Date.now(), v })
    try { sessionStorage.setItem('c:' + url, JSON.stringify({ t: Date.now(), v })) } catch { /* full */ }
  }
  return v
}

const ymd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '')

export async function findMatches(onProgress: (done: number, total: number) => void): Promise<Match[]> {
  const now = Date.now(), end = now + 12 * 3600000
  const days = [ymd(new Date(now - 3600000)), ymd(new Date(now)), ymd(new Date(end))]
  const uniq = [...new Set(days)]
  const jobs = Object.keys(LEAGUES).flatMap((l) => uniq.map((d) => ({ l, d })))
  const out = new Map<string, Match>()
  let done = 0
  await pool(jobs, 8, async ({ l, d }) => {
    const j = await cached<any>(`${BASE}/${l}/scoreboard?dates=${d}`, 10 * 60000)
    for (const e of j?.events ?? []) {
      const t = new Date(e.date).getTime()
      const comp = e.competitions?.[0]
      const h = comp?.competitors?.find((c: any) => c.homeAway === 'home')
      const a = comp?.competitors?.find((c: any) => c.homeAway === 'away')
      if (!h || !a || t < now || t > end) continue
      const st = e.status?.type?.name ?? ''
      out.set(l + e.id, {
        id: l + e.id, league: l, leagueName: LEAGUES[l].name, country: LEAGUES[l].country,
        date: e.date, status: e.status?.type?.description ?? '',
        postponed: /POSTPONED|CANCELED|SUSPENDED|DELAYED/.test(st),
        home: { id: h.team.id, name: h.team.displayName }, away: { id: a.team.id, name: a.team.displayName },
      })
    }
    onProgress(++done, jobs.length)
  })
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
  const known = new Set([...out.values()].map((m) => norm(m.home.name)))
  const sdbDays = [...new Set([new Date(now), new Date(end)].map((d) => d.toISOString().slice(0, 10)))]
  for (const d of sdbDays) {
    const j = await cached<any>(`${SDB}/eventsday.php?d=${d}&s=Soccer`, 10 * 60000)
    for (const e of j?.events ?? []) {
      if (!e.idHomeTeam || !e.idAwayTeam || !e.strHomeTeam || !e.strAwayTeam) continue
      const iso = e.strTimestamp ? e.strTimestamp + 'Z' : ''
      const t = new Date(iso).getTime()
      if (!iso || Number.isNaN(t) || t < now || t > end) continue
      const hn = norm(e.strHomeTeam)
      if (known.has(hn) || [...known].some((k) => k.length > 4 && (k.includes(hn) || hn.includes(k)))) continue
      const st = String(e.strStatus ?? '')
      out.set('sdb' + e.idEvent, {
        id: 'sdb' + e.idEvent, league: 'sdb', leagueName: e.strLeague ?? 'Outras ligas', country: e.strCountry ?? 'Mundo',
        date: iso, status: st, postponed: /POSTP|CANC|SUSP|ABAND/i.test(st),
        home: { id: 'sdb:' + e.idHomeTeam, name: e.strHomeTeam }, away: { id: 'sdb:' + e.idAwayTeam, name: e.strAwayTeam },
      })
    }
  }
  return [...out.values()].sort((x, y) => x.date.localeCompare(y.date))
}

async function pool<T>(items: T[], size: number, fn: (x: T) => Promise<void>) {
  let i = 0
  await Promise.all(Array.from({ length: size }, async () => {
    while (i < items.length) { const x = items[i++]; await fn(x).catch(() => {}) }
  }))
}

const num = (s: any): number | null => {
  const v = typeof s === 'object' && s ? (s.value ?? s.displayValue) : s
  const n = Number(v)
  return v === undefined || v === null || v === '' || Number.isNaN(n) ? null : n
}

async function history(league: string, teamId: string, all = false): Promise<Game[]> {
  if (league === 'sdb') return []
  const y = new Date().getFullYear()
  const urls = [`${BASE}/${league}/teams/${teamId}/schedule`, ...(all ? [y, y - 1, y - 2].map((s) => `${BASE}/${league}/teams/${teamId}/schedule?season=${s}`) : [])]
  const js = await Promise.all(urls.map((u) => cached<any>(u)))
  const seen = new Set<string>()
  const events = js.flatMap((j) => j?.events ?? []).filter((e: any) => (seen.has(e.id) ? false : (seen.add(e.id), true)))
  const games: Game[] = []
  const j = { events }
  for (const e of j?.events ?? []) {
    const c = e.competitions?.[0]
    if (!c?.status?.type?.completed) continue
    const me = c.competitors?.find((x: any) => String(x.team?.id) === String(teamId))
    const op = c.competitors?.find((x: any) => String(x.team?.id) !== String(teamId))
    const gf = num(me?.score), ga = num(op?.score)
    if (gf === null || ga === null) continue
    games.push({ gf, ga, home: me.homeAway === 'home', date: e.date, opp: String(op.team?.id) })
  }
  const s = games.sort((a, b) => b.date.localeCompare(a.date))
  return all ? s : s.slice(0, 15)
}

async function sdbH2H(home: string, away: string): Promise<Game[]> {
  const j = await cached<any>(`${SDB}/searchevents.php?e=${encodeURIComponent(home + ' vs ' + away)}`, 6 * 3600000)
  const out: Game[] = []
  for (const e of j?.event ?? []) {
    const hs = num(e.intHomeScore), as = num(e.intAwayScore)
    if (hs === null || as === null || e.strSport !== 'Soccer') continue
    const fh = String(e.strHomeTeam).toLowerCase() === home.toLowerCase()
    out.push({ gf: fh ? hs : as, ga: fh ? as : hs, home: fh, date: e.dateEvent, opp: 'h2h' })
  }
  return out
}

const SDB = 'https://www.thesportsdb.com/api/v1/json/3'
async function sdbHistory(name: string): Promise<Game[]> {
  const s = await cached<any>(`${SDB}/searchteams.php?t=${encodeURIComponent(name)}`, 6 * 3600000)
  const t = (s?.teams ?? []).find((x: any) => x.strSport === 'Soccer')
  if (!t) return []
  const j = await cached<any>(`${SDB}/eventslast.php?id=${t.idTeam}`)
  const out: Game[] = []
  for (const e of j?.results ?? []) {
    const hs = num(e.intHomeScore), as = num(e.intAwayScore)
    if (hs === null || as === null) continue
    const home = String(e.idHomeTeam) === String(t.idTeam)
    out.push({ gf: home ? hs : as, ga: home ? as : hs, home, date: e.strTimestamp ? e.strTimestamp + 'Z' : e.dateEvent, opp: 'sdb:' + (home ? e.idAwayTeam : e.idHomeTeam) })
  }
  return out
}

async function enrich(base: Game[], name: string): Promise<{ games: Game[]; used: boolean }> {
  if (base.length >= 15) return { games: base, used: false }
  let extra = await sdbHistory(name).catch(() => [] as Game[])
  if (base.length + extra.length < 10) {
    const r = await cached<any>(`https://kcumbmwjcubsfswlpuyd.supabase.co/functions/v1/team-history?name=${encodeURIComponent(name)}`, 6 * 3600000).catch(() => null)
    const more: Game[] = (r?.games ?? []).map((g: any) => ({ gf: g.gf, ga: g.ga, home: g.home, date: g.date, opp: 'srv' }))
    if (more.length > extra.length) extra = more
  }
  const days = new Set(base.map((g) => g.date.slice(0, 10)))
  const add = extra.filter((g) => !days.has(g.date.slice(0, 10)))
  if (!add.length) return { games: base, used: false }
  return { games: [...base, ...add].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15), used: true }
}

type Cand = { label: string; market: string; th: number; h: (g: Game) => boolean; a: (g: Game) => boolean }
const tot = (g: Game) => g.gf + g.ga
const CANDS: Cand[] = [
  { label: 'Mais de 1.5 gols', market: 'Gols', th: 0.8, h: (g) => tot(g) >= 2, a: (g) => tot(g) >= 2 },
  { label: 'Mais de 2.5 gols', market: 'Gols', th: 0.7, h: (g) => tot(g) >= 3, a: (g) => tot(g) >= 3 },
  { label: 'Menos de 2.5 gols', market: 'Gols', th: 0.7, h: (g) => tot(g) <= 2, a: (g) => tot(g) <= 2 },
  { label: 'Menos de 3.5 gols', market: 'Gols', th: 0.8, h: (g) => tot(g) <= 3, a: (g) => tot(g) <= 3 },
  { label: 'Vitória do mandante', market: 'Resultado', th: 0.7, h: (g) => g.gf > g.ga, a: (g) => g.gf < g.ga },
  { label: 'Vitória do visitante', market: 'Resultado', th: 0.7, h: (g) => g.gf < g.ga, a: (g) => g.gf > g.ga },
  { label: 'Dupla chance 1X', market: 'Dupla chance', th: 0.8, h: (g) => g.gf >= g.ga, a: (g) => g.gf <= g.ga },
  { label: 'Dupla chance X2', market: 'Dupla chance', th: 0.8, h: (g) => g.gf <= g.ga, a: (g) => g.gf >= g.ga },
]

const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length
const form = (gs: Game[]) => gs.slice(0, 5).map((g) => (g.gf > g.ga ? 'V' : g.gf < g.ga ? 'D' : 'E')).join(' ')

export async function analyze(m: Match): Promise<Result> {
  const [hAll, a0, sh] = await Promise.all([history(m.league, m.home.id, true), history(m.league, m.away.id), sdbH2H(m.home.name, m.away.name).catch(() => [] as Game[])])
  const h0 = hAll.slice(0, 15)
  const [eh, ea] = await Promise.all([enrich(h0, m.home.name), enrich(a0, m.away.name)])
  const hh = eh.games, aa = ea.games
  const espnH2 = hAll.filter((g) => g.opp === m.away.id)
  const days = new Set(espnH2.map((g) => g.date.slice(0, 10)))
  const h2 = [...espnH2, ...sh.filter((g) => !days.has(g.date.slice(0, 10)))].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10)
  const usedH2 = h2.length > espnH2.length
  const base = {
    match: m, nHome: hh.length, nAway: aa.length,
    h2h: { n: h2.length, text: h2.map((g) => `${g.gf}-${g.ga}`).join(', ') },
    sources: ['ESPN (site.api.espn.com): agenda e histórico de resultados', ...(eh.used || ea.used || usedH2 ? ['TheSportsDB (thesportsdb.com): resultados e confrontos complementares'] : []), 'ESPN: temporadas anteriores (confrontos diretos)'],
    formHome: form(hh), formAway: form(aa),
  }
  if (m.postponed) return { ...base, pick: null, reason: 'Jogo adiado/cancelado/suspenso: SEM ENTRADA CONFIÁVEL.' }
  const okH = hh.length >= 5, okA = aa.length >= 5
  if (!okH && !okA)
    return { ...base, pick: null, reason: `Dados insuficientes (${hh.length} e ${aa.length} jogos encontrados; mínimo 5 em pelo menos uma equipe). SEM ENTRADA CONFIÁVEL.` }
  const rate = (c: Cand, k: number) => {
    const hs = hh.slice(0, k), as = aa.slice(0, k)
    if (hs.length < k || as.length < k) return null
    return (avg(hs.map((g) => (c.h(g) ? 1 : 0))) + avg(as.map((g) => (c.a(g) ? 1 : 0)))) / 2
  }
  let best: Pick | null = null, bestMargin = -1
  for (const c of okH && okA ? CANDS : []) {
    const r5 = rate(c, 5), r10 = rate(c, 10), r15 = rate(c, 15)
    const rf = r15 ?? r10
    const hr = h2.length >= 3 ? avg(h2.map((g) => (c.h(g) ? 1 : 0))) : null
    const r = rf === null ? null : hr === null ? rf : rf * 0.65 + hr * 0.35
    if (r === null || r10 === null || r < Math.max(0.7, c.th) || r10 < 0.7 || (r5 !== null && r5 < 0.6) || (hr !== null && hr < c.th - 0.2)) continue
    const n = hh.length + aa.length
    const margin = r - c.th
    if (margin > bestMargin) {
      bestMargin = margin
      best = { label: c.label, market: c.market, rate: r, hit: Math.round(r * n), n, r5, r10, r15,
        confidence: Math.round(Math.min(95, r * 100 * Math.min(1, n / 30) - Math.abs((r5 ?? r) - r) * 20)) }
    }
  }
  const teamCands: { name: string; gs: Game[]; min: number; th: number; own: boolean }[] = [
    { name: m.home.name, gs: hh, min: 2, th: 0.7, own: true },
    { name: m.away.name, gs: aa, min: 2, th: 0.7, own: false },
    { name: m.home.name, gs: hh, min: 1, th: 0.9, own: true },
    { name: m.away.name, gs: aa, min: 1, th: 0.9, own: false },
  ]
  for (const t of teamCands) {
    if (t.gs.length < 5) continue
    const k = Math.min(10, t.gs.length)
    const r10 = avg(t.gs.slice(0, k).map((g) => (g.gf >= t.min ? 1 : 0)))
    const r5 = avg(t.gs.slice(0, 5).map((g) => (g.gf >= t.min ? 1 : 0)))
    const ownGames = t.gs.filter((g) => g.home === t.own).slice(0, 8)
    const rv = ownGames.length >= 4 ? avg(ownGames.map((g) => (g.gf >= t.min ? 1 : 0))) : r10
    const r = r10 * 0.6 + rv * 0.4
    if (r < Math.max(0.7, t.th) || r10 < 0.7 || r5 < 0.6) continue
    const margin = r - t.th + 0.02
    if (margin > bestMargin) {
      bestMargin = margin
      best = { label: t.name + ' marca ' + (t.min === 1 ? '1+ gol' : 'mais de 1.5 gols'), market: 'Gols do time', rate: r, hit: Math.round(r * k), n: k, r5, r10, r15: null,
        confidence: Math.round(Math.min(95, r * 100 * Math.min(1, k / 10))) }
    }
  }
  if (!best) return { ...base, pick: null, reason: 'Nenhum mercado (gols, resultado, dupla chance) atingiu o critério mínimo de consistência. SEM ENTRADA CONFIÁVEL.' }
  const how = h2.length >= 3 ? `Pesou 65% nos últimos jogos de cada time e 35% nos ${h2.length} confrontos diretos (${base.h2h.text}).` : 'Sem confrontos diretos suficientes: usei só os últimos jogos de cada time.'
  return { ...base, pick: best, reason: `${how} ${best.label}: ocorreu em ${Math.round(best.rate * 100)}% na combinação, de forma consistente nas janelas de 5, 10 e 15 jogos. Frequência histórica, não garantia. Escanteios e cartões não foram avaliados: a fonte gratuita não fornece esses dados de forma confiável.` }
}

export async function finalScore(matchId: string, league: string): Promise<{ h: number; a: number } | null> {
  const id = matchId.slice(league.length)
  if (league === 'sdb') {
    const j = await getJson(`${SDB}/lookupevent.php?id=${id}`)
    const e = j?.events?.[0]
    const h = num(e?.intHomeScore), a = num(e?.intAwayScore)
    return h === null || a === null || !/FT|AET|PEN|Finished|Match Finished/i.test(String(e?.strStatus ?? '')) ? null : { h, a }
  }
  const j = await getJson(`${BASE}/${league}/summary?event=${id}`)
  const c = j?.header?.competitions?.[0]
  if (!c?.status?.type?.completed) return null
  const h = num(c.competitors?.find((x: any) => x.homeAway === 'home')?.score)
  const a = num(c.competitors?.find((x: any) => x.homeAway === 'away')?.score)
  return h === null || a === null ? null : { h, a }
}

export function evalPick(label: string, home: string, h: number, a: number): boolean | null {
  const t = h + a
  const map: Record<string, boolean> = {
    'Mais de 1.5 gols': t >= 2, 'Mais de 2.5 gols': t >= 3, 'Menos de 2.5 gols': t <= 2, 'Menos de 3.5 gols': t <= 3,
    'Vitória do mandante': h > a, 'Vitória do visitante': a > h, 'Dupla chance 1X': h >= a, 'Dupla chance X2': a >= h,
  }
  if (label in map) return map[label]
  const m = label.match(/^(.*) marca (1\+ gol|mais de 1\.5 gols)$/)
  if (!m) return null
  const g = m[1] === home ? h : a
  return g >= (m[2] === '1+ gol' ? 1 : 2)
}

export { pool }
