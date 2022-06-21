import './App.css'
import IndexRouter from './router/IndexRouter'
import { HashRouter } from 'react-router-dom'

function App() {
  return (
    <div>
      <HashRouter>
        <IndexRouter />
      </HashRouter>

    </div>
  )
}

export default App