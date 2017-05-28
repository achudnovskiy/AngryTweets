import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './Container'

class App extends React.Component {
  render () {
    return (
      <AppContainer />
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('main')
);
