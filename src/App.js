import './App.css'
import IndexRouter from './router/IndexRouter'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <IndexRouter />
      </HashRouter>
    </Provider>
  )
}

export default App