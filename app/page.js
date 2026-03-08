'use client'

import { useState, useRef, useEffect } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat])

  const sendMessage = async (text = message) => {
    if (!text.trim()) return

    const newChat = [...chat, { role: 'user', content: text }]
    setChat(newChat)
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      const data = await response.json()

      setChat([...newChat, { role: 'assistant', content: data.reply }])
    } catch (error) {
      setChat([...newChat, { role: 'assistant', content: '😕 Lo siento, tuve un error. Por favor intenta de nuevo.' }])
    }

    setLoading(false)
  }

  const clearChat = () => {
    setChat([])
  }

  const suggestions = [
    '¿Qué puedes hacer por mí?',
    'Cuéntame un chiste',
    '¿Cuál es la capital de Francia?',
    'Ayúdame a escribir un email',
  ]

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>🤖 Compa Pro</h1>
        <p>Tu asistente personal con Inteligencia Artificial</p>
      </header>

      <div className="chat-messages">
        {chat.length === 0 ? (
          <div className="welcome-message">
            <h2>👋 ¡Hola! Soy Compa</h2>
            <p>Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?</p>
            <div className="welcome-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-chip"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role}`}
              >
                {msg.role === 'assistant' && (
                  <div className="message-avatar">🤖</div>
                )}
                <div className="message-content">
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="message-avatar">👤</div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat-input-container">
        {chat.length > 0 && (
          <button className="clear-chat" onClick={clearChat}>
            🗑️ Limpiar
          </button>
        )}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu mensaje..."
          className="chat-input"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !message.trim()}
          className="send-button"
        >
          📤 Enviar
        </button>
      </div>
    </div>
  )
}
