import './App.css'
import { EscapeRoom } from './components/EscapeRoom'

function App() {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1 className="app-shell__brand">Shrek the Escape Room</h1>
        <p className="app-shell__tagline">A fairytale trial — layer by layer</p>
      </header>
      <main className="app-shell__main">
        <EscapeRoom />
      </main>
    </div>
  )
}

export default App
