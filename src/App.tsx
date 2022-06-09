import React, { useEffect, useState, lazy } from 'react'
import {
  BrowserRouter as Router,
} from "react-router-dom";
import Layouts from './components/Layout'
import './App.css';


const App = () => {
  return (
    <Router>
      <Layouts></Layouts>
    </Router>
    
  );
}

export default App;
