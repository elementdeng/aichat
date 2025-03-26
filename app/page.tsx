import ChatInterface from './components/ChatInterface'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        <ChatInterface />
      </div>
    </main>
  )
}
