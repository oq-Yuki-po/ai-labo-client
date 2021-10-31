import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Box from '@mui/material/Box'

import Header from './components/Header/Header';
import Contact from './components/Contact/Contact';
import Top from './components/Top/Top';
import Face from './components/Face/Face';

function App() {
  return (
    <Router>
      <Box sx={{ height: '100vh' }}>
        <Header />
        <Switch>
          <Route path="/face-recognition">
            Face Recognition
          </Route>
          <Route path="/face-detection">
            <Face />
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
      </Box>
    </Router>
  );
}

export default App;
