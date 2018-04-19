import React from 'react';

//Component for the Navigation Bar at the top

export default function Navbar(props) {
  return (
    <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">User Experience</a>
        </div>
      </div>
  </nav>
  );
}
