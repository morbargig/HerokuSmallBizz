import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import axios from 'axios'
import '../CSS/Filter.css'
import Button from '@material-ui/core/Button'
require('dotenv').config()
let request  = process.env.request

class Filter extends Component {
  constructor() {
    super()
    this.state = {
      businessess: []
    }
  }

  componentDidMount = async () => {
    this.getBusinesses()
  }

  getBusinesses = async () => {
    console.log(this.props.name)
    let businessess = await axios.get(`${request}getbyfield/${this.props.name}`)
    console.log(businessess.data)
    this.setState({ businessess: businessess.data }, function () {
      console.log(this.state)
    })
  }

  render() {
    const bizCategory = this.props.name
    console.log(this.state)

    return <div>
      <img id="filterImg" src="http://www.up2me.co.il/images/74638298.jpg" />
      <h2 id="catHead" className="center-align">{bizCategory}</h2>
      <div>
        <div className="row">
          {this.state.businessess.map(b => {
            return <div>
              <div id="filterGrid" className="col s3">
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <img id="catImg" src={b.img}></img>
                      <span id="cardTitle" className="card-title">{b.name}</span>
                      <Button className="waves-effect waves-dark btn" href={`/SmallBizz/${b.name}`}>Assign your appointment</Button>
                    </div>
                    <div className="flip-card-back">
                      <p id="catDescription"> {b.description}</p>
                      
                    </div>
                  </div>
                </div>
               </div>

            </div>
          })}
        </div>
      </div>
    </div>
  }

}

export default Filter;
