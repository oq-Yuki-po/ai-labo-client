import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Header from './components/Header/Header';

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
          問合せ
        </Route>
        <Route path="/">
          Top
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
