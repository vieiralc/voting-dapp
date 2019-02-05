import React, { Component } from 'react';
import Card from './Card';

import "../css/landing.css";

class Landing extends Component {
  render() {
    return (
      <div className="container-fluid land-container">
          
          <div className="row justify-content-center">
            
            <div className="col-md-6">
              <Card/>
            </div>

          </div>

      </div>
    )
  }
}

export default Landing;