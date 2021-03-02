import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HomeComponent from './components/Home/Home'
import LoginComponent from './components/Login/Login'
import Header from './components/Header/Header'

const App = () => (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route exact path="/" component={LoginComponent}/>
          <Route path="/home/:name/:room" component={HomeComponent}/>
        </Switch>
      </div>
    </Router>
)

export default App
