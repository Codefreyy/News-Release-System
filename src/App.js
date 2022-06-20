import Child from './Child'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  useEffect(() => {
    axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E6%AD%A6%E6%B1%89&ci=57&channelId=4").then(res => {
      console.log(22);
      console.log(res.data);
    })
  })


  return <div>
    app
    <ul>
      <li>11111</li>
      <li>22222</li>
    </ul>
    <Child />
  </div>
}

export default App