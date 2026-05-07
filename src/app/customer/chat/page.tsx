'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Bot, User, Loader2, Trash2, Sparkles, Plus, MessageSquare, History, X } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface DisplayMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatSessionSummary {
  id: string
  title: string | null
  createdAt: string
  updatedAt: string
  messageCount: number
}

interface SessionsResponse {
  sessions: ChatSessionSummary[]
}

interface SessionMessagesResponse {
  messages: DisplayMessage[]
}

interface ChatSendResponse {
  reply: string
  sessionId: string
  messages: DisplayMessage[]
}

const ACTIVE_SESSION_KEY = 'chat-active-session-customer'

const SUGGESTIONS = [
  'اعرض بياناتي',
  'إيه مواعيدي؟',
  'عايز أحجز موعد صيانة',
  'اعرض سجل صيانة سيارتي',
  'إيه الزيوت المتاحة عندكم؟',
  'عندي عربية جديدة عايز أضيفها',
]

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `من ${minutes} دقيقة`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `من ${hours} ساعة`
  const days = Math.floor(hours / 24)
  if (days < 7) return `من ${days} يوم`
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })
}

export default function CustomerChatPage() {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { inputRef.current?.focus() }, [activeSessionId])

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    setLoadingMessages(true)
    try {
      const data = await apiFetch<SessionMessagesResponse>(`/chat/customer/sessions/${sessionId}`)
      setMessages(data.messages)
    } catch (err) {
      console.error('Failed to load session messages:', err)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const data = await apiFetch<SessionsResponse>('/chat/customer/sessions')
        if (cancelled) return
        setSessions(data.sessions)

        const stored = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_SESSION_KEY) : null
        const fallback = data.sessions[0]?.id ?? null
        const active = stored && data.sessions.some(s => s.id === stored) ? stored : fallback

        if (active) {
          setActiveSessionId(active)
          await loadSessionMessages(active)
        }
      } catch (err) {
        console.error('Failed to load chat sessions:', err)
      } finally {
        if (!cancelled) setLoadingSessions(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [loadSessionMessages])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (activeSessionId) localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId)
    else localStorage.removeItem(ACTIVE_SESSION_KEY)
  }, [activeSessionId])

  const refreshSessions = async () => {
    try {
      const data = await apiFetch<SessionsResponse>('/chat/customer/sessions')
      setSessions(data.sessions)
    } catch (err) {
      console.error('Failed to refresh sessions:', err)
    }
  }

  const startNewChat = () => {
    setActiveSessionId(null)
    setMessages([])
    setDrawerOpen(false)
    inputRef.current?.focus()
  }

  const switchSession = async (sessionId: string) => {
    setDrawerOpen(false)
    if (sessionId === activeSessionId) return
    setActiveSessionId(sessionId)
    await loadSessionMessages(sessionId)
  }

  const deleteSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    const label = session?.title || 'الشات'
    if (!window.confirm(`متأكد إنك عايز تحذف "${label}"؟`)) return

    const previousSessions = sessions
    setSessions(prev => prev.filter(s => s.id !== sessionId))

    if (sessionId === activeSessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId)
      const next = remaining[0]?.id ?? null
      setActiveSessionId(next)
      if (next) await loadSessionMessages(next)
      else setMessages([])
    }

    try {
      await apiFetch(`/chat/customer/sessions/${sessionId}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete session:', err)
      setSessions(previousSessions)
    }
  }

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim()
    if (!text || loading || loadingMessages) return

    const userMsg: DisplayMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    if (inputRef.current) inputRef.current.style.height = '2.75rem'

    try {
      const data = await apiFetch<ChatSendResponse>('/chat/customer', {
        method: 'POST',
        body: JSON.stringify({ message: text, sessionId: activeSessionId }),
      })

      setMessages(data.messages)
      if (data.sessionId !== activeSessionId) setActiveSessionId(data.sessionId)
      await refreshSessions()
    } catch (err: unknown) {
      let errorMsg = 'حصلت مشكلة في الاتصال. حاول تاني.'
      if (err && typeof err === 'object') {
        if ('reply' in err) errorMsg = (err as { reply: string }).reply
        else if ('error' in err) errorMsg = (err as { error: string }).error
      }
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = '2.75rem'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }

  const formatContent = (content: string) =>
    content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')

  return (
    <div className="max-w-lg mx-auto px-4 py-4 flex flex-col relative" style={{ height: 'calc(100vh - 8.5rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(230,57,70,0.2), rgba(230,57,70,0.05))',
              border: '1px solid rgba(230,57,70,0.3)',
            }}
          >
            <Sparkles size={18} className="text-brand-red" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground font-arabic">المساعد الذكي</h1>
            <p className="text-[11px] text-muted-foreground font-arabic">اسألني أو اطلب مني أحجزلك موعد</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={startNewChat}
            title="شات جديد"
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-red/10 border border-brand-red/30 text-brand-red hover:bg-brand-red/20 transition-colors"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            title="الشاتات السابقة"
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/[0.1] text-muted-foreground hover:bg-white/[0.08] transition-colors relative"
          >
            <History size={16} />
            {sessions.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center font-arabic">
                {sessions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-3 min-h-0">
        {loadingMessages && messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center gap-2 text-[13px] text-muted-foreground font-arabic">
            <Loader2 size={15} className="animate-spin text-brand-red" />
            جاري تحميل المحادثة...
          </div>
        )}

        {!loadingMessages && messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 opacity-80">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(230,57,70,0.15), rgba(29,53,87,0.15))',
                border: '1px solid rgba(230,57,70,0.2)',
              }}
            >
              <Bot size={30} className="text-brand-red" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground font-arabic mb-1">أهلاً بيك! 👋</p>
              <p className="text-xs text-muted-foreground font-arabic px-4">
                أنا المساعد الذكي بتاعك. أقدر أعرضلك بياناتك، أحجزلك مواعيد، وأجاوبك على أي استفسار
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center px-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[11px] text-muted-foreground font-arabic hover:bg-brand-red/10 hover:border-brand-red/30 hover:text-foreground transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex gap-2"
            style={{
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
              style={{
                backgroundColor: msg.role === 'user' ? 'rgba(29,53,87,0.3)' : 'rgba(230,57,70,0.15)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(29,53,87,0.4)' : 'rgba(230,57,70,0.3)'}`,
              }}
            >
              {msg.role === 'user'
                ? <User size={13} className="text-blue-400" />
                : <Bot size={13} className="text-brand-red" />
              }
            </div>

            <div
              className="max-w-[80%] px-3 py-2.5 rounded-xl text-[13px] leading-relaxed font-arabic text-foreground"
              style={{
                backgroundColor: msg.role === 'user' ? 'rgba(29,53,87,0.3)' : 'rgba(17,19,24,0.8)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(29,53,87,0.4)' : 'rgba(255,255,255,0.07)'}`,
              }}
              dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
            />
          </div>
        ))}

        {loading && (
          <div className="flex gap-2" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}
            >
              <Bot size={13} className="text-brand-red" />
            </div>
            <div className="px-3 py-2.5 rounded-xl flex items-center gap-2 text-muted-foreground text-[13px] font-arabic"
              style={{ backgroundColor: 'rgba(17,19,24,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Loader2 size={14} className="animate-spin text-brand-red" />
              بفكر...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 pt-3 border-t border-white/[0.06]">
        <div className="flex items-end gap-2 bg-surface-800 rounded-xl border border-white/[0.08] p-1.5 transition-colors focus-within:border-brand-red/40">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك..."
            disabled={loading || loadingMessages}
            rows={1}
            className="flex-1 bg-transparent text-foreground text-[13px] outline-none resize-none font-arabic px-2 py-1.5 border-0"
            style={{ height: '2.75rem', maxHeight: '9.375rem', lineHeight: '1.7' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || loadingMessages || !input.trim()}
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:cursor-default"
            style={{
              backgroundColor: input.trim() ? '#E63946' : 'rgba(255,255,255,0.05)',
              color: input.trim() ? '#fff' : '#6b7280',
            }}
          >
            {loading
              ? <Loader2 size={16} className="animate-spin" />
              : <Send size={16} style={{ transform: 'rotate(180deg)' }} />
            }
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-1.5 font-arabic">
          المساعد الذكي ممكن يغلط. راجع المعلومات المهمة.
        </p>
      </div>

      {/* Sessions drawer */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 50, backdropFilter: 'blur(2px)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        />
      )}
      <aside
        style={{
          position: 'fixed', top: 0, bottom: 0, insetInlineStart: 0,
          width: '85%', maxWidth: '20rem',
          backgroundColor: '#111318', borderInlineEnd: '1px solid rgba(255,255,255,0.08)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease-out',
          zIndex: 51, display: 'flex', flexDirection: 'column',
        }}
      >
        <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
          <h2 className="text-sm font-bold text-foreground font-arabic">الشاتات السابقة</h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-white/[0.05] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-3">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white font-arabic text-sm font-semibold hover:bg-brand-red/90 transition-colors"
          >
            <Plus size={15} />
            شات جديد
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {loadingSessions && (
            <div className="flex items-center justify-center py-8 gap-2 text-[13px] text-muted-foreground font-arabic">
              <Loader2 size={15} className="animate-spin text-brand-red" />
              تحميل...
            </div>
          )}
          {!loadingSessions && sessions.length === 0 && (
            <div className="text-center py-8 px-3 text-[13px] text-muted-foreground font-arabic">
              مفيش شاتات لسه
            </div>
          )}
          {!loadingSessions && sessions.map(session => {
            const isActive = session.id === activeSessionId
            return (
              <div
                key={session.id}
                onClick={() => switchSession(session.id)}
                className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer mb-1 transition-colors group"
                style={{
                  backgroundColor: isActive ? 'rgba(230,57,70,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(230,57,70,0.3)' : 'transparent'}`,
                }}
              >
                <MessageSquare
                  size={14}
                  style={{ color: isActive ? '#E63946' : '#6b7280', flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[13px] font-arabic truncate"
                    style={{
                      color: isActive ? '#F1FAEE' : '#d1d5db',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {session.title || 'شات جديد'}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-arabic mt-0.5">
                    {formatRelativeTime(session.updatedAt)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                  className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-red-500/20 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}
        </div>
      </aside>
    </div>
  )
}
