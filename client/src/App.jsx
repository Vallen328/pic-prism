import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import GsapTransition from './components/GsapTransition';

function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <GsapTransition />
      {/* Add your Footer here */}
    </BrowserRouter>
    </>
  )
}

export default App
