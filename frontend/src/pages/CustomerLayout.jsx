import Navbar from '../components/Navbar'

export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-dvh bg-brand-backgroundLight">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:py-6">
        {children}
      </main>
    </div>
  )
}

