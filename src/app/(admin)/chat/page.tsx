'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Bot, User, Loader2, Trash2, Sparkles, Plus, MessageSquare } from 'lucide-react'
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

const ACTIVE_SESSION_KEY = 'chat-active-session-admin'

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

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [activeSessionId])

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    setLoadingMessages(true)
    try {
      const data = await apiFetch<SessionMessagesResponse>(`/chat/sessions/${sessionId}`)
      setMessages(data.messages)
    } catch (err) {
      console.error('Failed to load session messages:', err)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  // Initial mount: load sessions and restore active
  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const data = await apiFetch<SessionsResponse>('/chat/sessions')
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

  // Persist active session
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (activeSessionId) localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId)
    else localStorage.removeItem(ACTIVE_SESSION_KEY)
  }, [activeSessionId])

  const refreshSessions = async () => {
    try {
      const data = await apiFetch<SessionsResponse>('/chat/sessions')
      setSessions(data.sessions)
    } catch (err) {
      console.error('Failed to refresh sessions:', err)
    }
  }

  const startNewChat = () => {
    setActiveSessionId(null)
    setMessages([])
    inputRef.current?.focus()
  }

  const switchSession = async (sessionId: string) => {
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
      await apiFetch(`/chat/sessions/${sessionId}`, { method: 'DELETE' })
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
      const data = await apiFetch<ChatSendResponse>('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, sessionId: activeSessionId }),
      })

      setMessages(data.messages)
      if (data.sessionId !== activeSessionId) {
        setActiveSessionId(data.sessionId)
      }
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
    <div style={{ display: 'flex', gap: '1rem', height: 'calc(100vh - 5rem)', maxHeight: 'calc(100vh - 5rem)' }}>
      {/* Sessions sidebar */}
      <aside style={{
        width: '17rem', flexShrink: 0, display: 'flex', flexDirection: 'column',
        backgroundColor: 'rgba(17,19,24,0.5)', borderRadius: '0.75rem',
        border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
      }}>
        <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={startNewChat}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', padding: '0.625rem', borderRadius: '0.5rem',
              backgroundColor: '#E63946', color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontFamily: 'Cairo, sans-serif', fontWeight: 600,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C1121F' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#E63946' }}
          >
            <Plus size={16} />
            شات جديد
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {loadingSessions && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
              color: '#6b7280', fontSize: '0.8125rem', fontFamily: 'Cairo, sans-serif',
            }}>
              <Loader2 size={16} className="animate-spin" style={{ color: '#E63946', marginInlineEnd: '0.5rem' }} />
              تحميل...
            </div>
          )}
          {!loadingSessions && sessions.length === 0 && (
            <div style={{
              padding: '1.5rem 0.75rem', textAlign: 'center',
              color: '#6b7280', fontSize: '0.8125rem', fontFamily: 'Cairo, sans-serif',
            }}>
              مفيش شاتات لسه.<br />ابدأ شات جديد!
            </div>
          )}
          {!loadingSessions && sessions.map(session => {
            const isActive = session.id === activeSessionId
            const isHovered = session.id === hoveredSessionId
            return (
              <div
                key={session.id}
                onClick={() => switchSession(session.id)}
                onMouseEnter={() => setHoveredSessionId(session.id)}
                onMouseLeave={() => setHoveredSessionId(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.625rem 0.625rem',
                  borderRadius: '0.5rem', cursor: 'pointer',
                  backgroundColor: isActive ? 'rgba(230,57,70,0.12)' : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(230,57,70,0.3)' : 'transparent'}`,
                  marginBottom: '0.25rem', transition: 'all 0.15s',
                }}
              >
                <MessageSquare size={14} style={{
                  color: isActive ? '#E63946' : '#6b7280',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.8125rem', color: isActive ? '#F1FAEE' : '#d1d5db',
                    fontFamily: 'Cairo, sans-serif', fontWeight: isActive ? 600 : 500,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {session.title || 'شات جديد'}
                  </div>
                  <div style={{
                    fontSize: '0.6875rem', color: '#6b7280',
                    fontFamily: 'Cairo, sans-serif', marginTop: '0.125rem',
                  }}>
                    {formatRelativeTime(session.updatedAt)}
                  </div>
                </div>
                {(isActive || isHovered) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSession(session.id)
                    }}
                    style={{
                      width: '1.5rem', height: '1.5rem', borderRadius: '0.25rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'transparent', color: '#6b7280',
                      border: 'none', cursor: 'pointer', flexShrink: 0,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)'
                      e.currentTarget.style.color = '#f87171'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#6b7280'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </aside>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '1rem', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, rgba(230,57,70,0.2), rgba(230,57,70,0.05))',
              border: '1px solid rgba(230,57,70,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={18} style={{ color: '#E63946' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F1FAEE', fontFamily: 'Cairo, sans-serif' }}>
                المساعد الذكي
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'Cairo, sans-serif' }}>
                اسألني أي حاجة عن المركز أو اطلب مني أعدّل أي بيانات
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
          gap: '1rem', paddingBottom: '1rem', minHeight: 0,
        }}>
          {loadingMessages && messages.length === 0 && (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6b7280', fontSize: '0.875rem', fontFamily: 'Cairo, sans-serif',
            }}>
              <Loader2 size={18} className="animate-spin" style={{ color: '#E63946', marginInlineEnd: '0.5rem' }} />
              جاري تحميل المحادثة...
            </div>
          )}

          {!loadingMessages && messages.length === 0 && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
              opacity: 0.7,
            }}>
              <div style={{
                width: '5rem', height: '5rem', borderRadius: '1.25rem',
                background: 'linear-gradient(135deg, rgba(230,57,70,0.15), rgba(29,53,87,0.15))',
                border: '1px solid rgba(230,57,70,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={36} style={{ color: '#E63946' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#F1FAEE', fontFamily: 'Cairo, sans-serif', marginBottom: '0.5rem' }}>
                  أهلاً بيك! أنا المساعد الذكي بتاع المركز
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'Cairo, sans-serif' }}>
                  اسألني عن أي حاجة أو اطلب مني أعمل أي تعديل
                </p>
              </div>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
                justifyContent: 'center', maxWidth: '32rem',
              }}>
                {[
                  'كام عميل عندي؟',
                  'إيه المواعيد المعلقة؟',
                  'إيه القطع اللي قربت تخلص؟',
                  'إيرادات الشهر ده كام؟',
                  'اعرض آخر سجلات الصيانة',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    style={{
                      padding: '0.5rem 0.875rem', borderRadius: '9999px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#9ca3af', fontSize: '0.8125rem', cursor: 'pointer',
                      fontFamily: 'Cairo, sans-serif', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(230,57,70,0.1)'
                      e.currentTarget.style.borderColor = 'rgba(230,57,70,0.3)'
                      e.currentTarget.style.color = '#F1FAEE'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = '#9ca3af'
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex', gap: '0.75rem',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                animation: 'fadeIn 0.3s ease-out',
              }}
            >
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '0.5rem', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: msg.role === 'user' ? 'rgba(29,53,87,0.3)' : 'rgba(230,57,70,0.15)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(29,53,87,0.4)' : 'rgba(230,57,70,0.3)'}`,
              }}>
                {msg.role === 'user'
                  ? <User size={14} style={{ color: '#60a5fa' }} />
                  : <Bot size={14} style={{ color: '#E63946' }} />
                }
              </div>
              <div style={{
                maxWidth: '75%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                fontSize: '0.875rem', lineHeight: '1.7', fontFamily: 'Cairo, sans-serif',
                backgroundColor: msg.role === 'user' ? 'rgba(29,53,87,0.3)' : 'rgba(17,19,24,0.8)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(29,53,87,0.4)' : 'rgba(255,255,255,0.07)'}`,
                color: '#F1FAEE',
              }}
                dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
              />
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '0.5rem', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(230,57,70,0.15)',
                border: '1px solid rgba(230,57,70,0.3)',
              }}>
                <Bot size={14} style={{ color: '#E63946' }} />
              </div>
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '0.75rem',
                backgroundColor: 'rgba(17,19,24,0.8)',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: '#6b7280', fontSize: '0.875rem', fontFamily: 'Cairo, sans-serif',
              }}>
                <Loader2 size={16} className="animate-spin" style={{ color: '#E63946' }} />
                بفكر وبجهّز الرد...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{
          flexShrink: 0, paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '0.75rem',
            backgroundColor: '#181B22', borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '0.5rem', transition: 'border-color 0.2s',
          }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(230,57,70,0.4)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالتك هنا..."
              disabled={loading || loadingMessages}
              rows={1}
              style={{
                flex: 1, backgroundColor: 'transparent', color: '#F1FAEE',
                fontSize: '0.875rem', outline: 'none', resize: 'none',
                fontFamily: 'Cairo, sans-serif', padding: '0.375rem 0.5rem',
                height: '2.75rem', maxHeight: '9.375rem', lineHeight: '1.7',
                border: 'none',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || loadingMessages || !input.trim()}
              style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: input.trim() ? '#E63946' : 'rgba(255,255,255,0.05)',
                color: input.trim() ? '#fff' : '#6b7280',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s', flexShrink: 0,
              }}
              onMouseEnter={e => { if (input.trim()) e.currentTarget.style.backgroundColor = '#C1121F' }}
              onMouseLeave={e => { if (input.trim()) e.currentTarget.style.backgroundColor = '#E63946' }}
            >
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <Send size={18} style={{ transform: 'rotate(180deg)' }} />
              }
            </button>
          </div>
          <p style={{
            textAlign: 'center', fontSize: '0.6875rem', color: '#4b5563',
            marginTop: '0.5rem', fontFamily: 'Cairo, sans-serif',
          }}>
            المساعد الذكي ممكن يغلط أحياناً. راجع المعلومات المهمة.
          </p>
        </div>
      </div>
    </div>
  )
}
