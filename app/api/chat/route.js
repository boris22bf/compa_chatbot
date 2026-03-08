import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { reply: 'Por favor escribe un mensaje.' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `Eres Compa, un asistente virtual profesional, amigable y útil. 
          Tus características:
          - Respondes en español de manera clara y concisa
          - Eres paciente y educado
          - Das respuestas útiles y prácticas
          - Si no sabes algo, lo admites honestamente
          - Mantienes un tono profesional pero cercano
          
          ¡Tu objetivo es ayudar al usuario de la mejor manera posible!` 
        },
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error('Error en la API:', error)
    
    if (error.status === 401) {
      return NextResponse.json(
        { reply: '❌ Error: La API Key de OpenAI no es válida. Por favor verifica la configuración.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { reply: '😕 Lo siento, tuve un error interno. Por favor intenta de nuevo en unos momentos.' },
      { status: 500 }
    )
  }
}
