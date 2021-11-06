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
import FaceDetectionFromImage from './components/FaceDetection/FaceDetectionFromImage';
import FaceDetectionFromWebCam from './components/FaceDetection/FaceDetectionFromWebCam';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

function App() {
  return (
    <Router>
      <Box sx={{ height: '100vh' }}>
        <Header />
        <Switch>
          <Route path="/face-recognition">
            <FaceRecognition />
          </Route>
          <Route path="/face-detection-image">
            <FaceDetectionFromImage />
          </Route>
          <Route path="/face-detection-webcam">
            <FaceDetectionFromWebCam/>
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
