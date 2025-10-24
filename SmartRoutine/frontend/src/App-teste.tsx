import { useState } from 'react'

function App() {
const [darkMode, setDarkMode] = useState(false)

return (
  <div className={darkMode ? 'dark' : ''}>
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Olá, Tailwind CSS v4!
        </h1>
        
        <p className="text-muted-foreground mb-4">
          Projeto configurado com sucesso
        </p>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
        >
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-card border border-border p-4 rounded-lg">
            <h3>Card 1</h3>
            <p className="text-sm text-muted-foreground">Primary</p>
          </div>
          <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
            <h3>Card 2</h3>
            <p className="text-sm">Secondary</p>
          </div>
          <div className="bg-accent text-accent-foreground p-4 rounded-lg">
            <h3>Card 3</h3>
            <p className="text-sm">Accent</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}

export default App