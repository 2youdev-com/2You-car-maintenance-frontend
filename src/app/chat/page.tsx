'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Trash2, Sparkles } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface ChatMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

interface DisplayMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: DisplayMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Auto-resize textarea back
    if (inputRef.current) {
      inputRef.current.style.height = '2.75rem'
    }

    try {
      const data = await apiFetch<{ reply: string; history: ChatMessage[] }>('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, history }),
      })

      const assistantMsg: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMsg])
      setHistory(data.history)
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'error' in err
        ? (err as { error: string }).error
        : 'حصلت مشكلة في الاتصال. حاول تاني.'

      const assistantMsg: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
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

  const clearChat = () => {
    setMessages([])
    setHistory([])
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto resize
    e.target.style.height = '2.75rem'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 5rem)', maxHeight: 'calc(100vh - 5rem)' }}>
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
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
              backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
              fontSize: '0.8125rem', fontFamily: 'Cairo, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)' }}
          >
            <Trash2 size={14} />
            مسح المحادثة
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        gap: '1rem', paddingBottom: '1rem', minHeight: 0,
      }}>
        {messages.length === 0 && (
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
            {/* Suggestion chips */}
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
                  onClick={() => {
                    setInput(suggestion)
                    inputRef.current?.focus()
                  }}
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
            {/* Avatar */}
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '0.5rem', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: msg.role === 'user'
                ? 'rgba(29,53,87,0.3)'
                : 'rgba(230,57,70,0.15)',
              border: `1px solid ${msg.role === 'user'
                ? 'rgba(29,53,87,0.4)'
                : 'rgba(230,57,70,0.3)'}`,
            }}>
              {msg.role === 'user'
                ? <User size={14} style={{ color: '#60a5fa' }} />
                : <Bot size={14} style={{ color: '#E63946' }} />
              }
            </div>

            {/* Message bubble */}
            <div style={{
              maxWidth: '75%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
              fontSize: '0.875rem', lineHeight: '1.7', fontFamily: 'Cairo, sans-serif',
              backgroundColor: msg.role === 'user'
                ? 'rgba(29,53,87,0.3)'
                : 'rgba(17,19,24,0.8)',
              border: `1px solid ${msg.role === 'user'
                ? 'rgba(29,53,87,0.4)'
                : 'rgba(255,255,255,0.07)'}`,
              color: '#F1FAEE',
            }}
              dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
            />
          </div>
        ))}

        {/* Loading indicator */}
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
            disabled={loading}
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
            onClick={sendMessage}
            disabled={loading || !input.trim()}
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
  )
}
