import React, { Component } from 'react';
import "../css/navbar.css";

class Navbar extends Component {
    render() {
      return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-center">

          <ul className="navbar-nav">
            <li className="nav-item"><a className="title" href="/">Voting Dapp</a></li>
          </ul>

        </nav>
      )
    }
}

export default Navbar