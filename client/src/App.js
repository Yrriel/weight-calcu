import React, { Fragment } from 'react';
import './App.css';

import InputItem from './components/InputItem';
import MainHeader from './components/Header';

function App() {
  return(
    <Fragment>
      <div className='container'>
        <MainHeader/>
        <InputItem/>
      </div>
    </Fragment>
  );

}

export default App;
