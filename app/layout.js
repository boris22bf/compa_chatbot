import './globals.css'

export const metadata = {
  title: 'Compa Pro - Tu Asistente IA',
  description: 'Chatbot profesional con inteligencia artificial',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
