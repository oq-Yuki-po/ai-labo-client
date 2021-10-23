import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Header from './components/Header/Header';
import Contact from './components/Contact/Contact';
import Top from './components/Top/Top';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/face">
          顔認証
        </Route>
        <Route path="/ocr">
          OCR
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/">
          <Top />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
