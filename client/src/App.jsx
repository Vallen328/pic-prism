import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GsapTransition from './components/GsapTransition';
import { Toaster } from 'react-hot-toast'; 
import { Provider } from "react-redux";
import { store } from "../store/store";

function App() {
  return (
    <>
    <Provider store = {store}>
      <BrowserRouter>
        <Navbar />
        <GsapTransition />
        <Toaster /> 
      </BrowserRouter>
    </Provider>
    </>
  );
}

export default App;
