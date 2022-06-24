import './App.css'
import IndexRouter from './router/IndexRouter'
import { HashRouter } from 'react-router-dom'

function App() {
  return (

    <HashRouter>
      <IndexRouter />
    </HashRouter>

  )
}

export default App