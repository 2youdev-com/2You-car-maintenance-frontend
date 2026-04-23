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

const SUGGESTIONS = [
  'اعرض بياناتي',
  'إيه مواعيدي؟',
  'عايز أحجز موعد صيانة',
  'اعرض سجل صيانة سيارتي',
  'إيه الزيوت المتاحة عندكم؟',
  'عندي عربية جديدة عايز أضيفها',
]

export default function CustomerChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages])
  useEffect(() => { inputRef.current?.focus() }, [])

  const sendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim()
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

    if (inputRef.current) {
      inputRef.current.style.height = '2.75rem'
    }

    try {
      const data = await apiFetch<{ reply: string; history: ChatMessage[] }>('/chat/customer', {
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
      let errorMsg = 'حصلت مشكلة في الاتصال. حاول تاني.'
      if (err && typeof err === 'object') {
        if ('reply' in err) errorMsg = (err as { reply: string }).reply
        else if ('error' in err) errorMsg = (err as { error: string }).error
      }

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
    e.target.style.height = '2.75rem'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 flex flex-col" style={{ height: 'calc(100vh - 8.5rem)' }}>
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
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-arabic hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={13} />
            مسح
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-3 min-h-0">
        {messages.length === 0 && (
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
            disabled={loading}
            rows={1}
            className="flex-1 bg-transparent text-foreground text-[13px] outline-none resize-none font-arabic px-2 py-1.5 border-0"
            style={{ height: '2.75rem', maxHeight: '9.375rem', lineHeight: '1.7' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
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
    </div>
  )
}
