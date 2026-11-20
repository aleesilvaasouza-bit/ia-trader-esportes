const URL = 'https://kcumbmwjcubsfswlpuyd.supabase.co'
const KEY = 'sb_publishable_cSsDMEoW7peO5k7OZdAYpg_-wUT0_hq'
const STORE = 'iatrader-sb-session'

type Session = { access_token: string; refresh_token: string; email: string }

const read = (): Session | null => { try { return JSON.parse(localStorage.getItem(STORE) ?? 'null') } catch { return null } }
const save = (s: Session | null) => { if (s) localStorage.setItem(STORE, JSON.stringify(s)); else localStorage.removeItem(STORE) }

async function auth(path: string, body: unknown) {
  const r = await fetch(`${URL}/auth/v1/${path}`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const j = await r.json().catch(() => ({}))
  return { ok: r.ok, j }
}

function store(j: { access_token?: string; refresh_token?: string; user?: { email?: string } }): string | null {
  if (!j.access_token || !j.refresh_token) return null
  const email = j.user?.email ?? read()?.email ?? ''
  save({ access_token: j.access_token, refresh_token: j.refresh_token, email })
  return email
}

export const currentEmail = () => read()?.email ?? ''
export const signOut = () => save(null)

export async function signIn(email: string, password: string): Promise<{ email?: string; error?: string }> {
  const { ok, j } = await auth('token?grant_type=password', { email, password })
  if (!ok) return { error: 'Senha incorreta ou conta não encontrada.' }
  return { email: store(j) ?? email }
}

export async function signUp(email: string, password: string): Promise<{ email?: string; error?: string }> {
  const { ok, j } = await auth('signup', { email, password })
  if (!ok) return { error: /registered|exists/i.test(JSON.stringify(j)) ? 'Usuário, e-mail ou telefone já cadastrado.' : 'Não foi possível criar a conta. Verifique os dados.' }
  const e = store(j)
  if (e) return { email: e }
  return signIn(email, password)
}

async function refresh(): Promise<boolean> {
  const s = read()
  if (!s) return false
  const { ok, j } = await auth('token?grant_type=refresh_token', { refresh_token: s.refresh_token })
  if (!ok) { save(null); return false }
  return store({ ...j, user: { email: s.email } }) !== null
}

export function userId(): string {
  try { return JSON.parse(atob((read()?.access_token ?? '').split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub ?? '' } catch { return '' }
}

export async function rpcJson(fn: string): Promise<any | null> {
  for (let i = 0; i < 2; i++) {
    const s = read()
    if (!s) return null
    const r = await fetch(`${URL}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${s.access_token}`, 'Content-Type': 'application/json' }, body: '{}' })
    if (r.ok) return await r.json()
    if (r.status === 401 && i === 0 && (await refresh())) continue
    return null
  }
  return null
}

export async function db(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown): Promise<any | null> {
  for (let i = 0; i < 2; i++) {
    const s = read()
    if (!s) return null
    const r = await fetch(`${URL}/rest/v1/${path}`, { method, headers: { apikey: KEY, Authorization: `Bearer ${s.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: body === undefined ? undefined : JSON.stringify(body) })
    if (r.ok) return method === 'GET' ? await r.json() : true
    if (r.status === 401 && i === 0 && (await refresh())) continue
    return null
  }
  return null
}

export async function rpc(fn: string): Promise<number | null> {
  for (let i = 0; i < 2; i++) {
    const s = read()
    if (!s) return null
    const r = await fetch(`${URL}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${s.access_token}`, 'Content-Type': 'application/json' }, body: '{}' })
    if (r.ok) return Number(await r.json())
    if (r.status === 401 && i === 0 && (await refresh())) continue
    return null
  }
  return null
}
