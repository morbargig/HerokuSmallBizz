import React, { Component } from 'react';
import axios from 'axios'
import { googleMap, withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import moment from 'moment'
import alertify from 'alertify.js'
import Maps from './Maps';
import Calendar from './Calnder';
require('dotenv').config()

const API_KEY = process.env.API_KEY

require('dotenv').config()


class Bessiness extends Component {
  constructor() {
    super()
    this.state = {
      business: [],
      displayAppo: false,
    }
  }


  componentDidMount = async () => {
    await this.getBusinesses()
  }

  getBusinesses = async () => {
    let business = await axios.get(`/getbyname/${this.props.name}`)
    this.setState({ business: business.data }, function () {
    })
  }

  changeDisplay = () => {
    this.setState({ displayAppo: !this.state.displayAppo })
  }

 
  makeAnAppointment = async (x,y) => {
    let time = y
    let date = x
    let appointmentComfirm = this.state.business[0].appointmentComfirm
    let object = { date: date, time: time, appointmentComfirm: appointmentComfirm }
    await axios.put(`/makeapp/${this.state.business[0]._id}/${this.props.state.user.uid}`, object)
    await this.makeRequestToMail(this.props.state.userEmail, time, date, this.state.business[0].name)
    await alertify
      .alert("Congratulations!! the appointment is set, count to 3 and check your email :)")
    window.location.reload()
  }

  makeRequestToMail = async (email, time, date, business) => {
    console.log("got To APP.js")
    let mail = {
      from: `Bargig Shop < bargigshop@gmail.com>`,
      to: email,
      subject: `You made it! you have an appointment`,
      text: `we've created for you an appointment at ${date} in ${time} for ${business}`
    }
    await axios.post('/sendEmail', mail)
  }

  func = () => {

    let days = this.state.business[0].availableAppointments.map(d => Object.keys(d)[0])
    let length = days.length - 5
    days = days.slice(1, length)
    console.log(days)
    return <div className="anim">
     
      {days.map(d => <div className={d} >
        <h6>{d} {moment(d).format('dddd')} </h6>

        <select class="browser-default" name={d} onChange={this.makeAnAppointment} >
          {this.state.business[0].availableAppointments.find(h => Object.keys(h)[0] === d
          )[d].map(c => { return <option value={c} className={c} onChange={this.makeAnAppointment}>{c} </option> })}
        </select>
      </div>)}
    </div>
  }
  googleMapLocation = () => {
    let b = this.state.business[0]
    window.open(`http://google.com/maps/search/${b.city + " " + b.address}%E2%80%AD/@${b.location.hight},${b.location.wight}`)
  }

  googleEarthLocation = () => {
    let b = this.state.business[0]

    window.open(` https://earth.google.com/web/search/${b.address.replace(" ", "%20") + "," + b.city.replace(" ", "%20")}@${b.location.hight},${b.location.wight},34.10008876a,4820.53237024d,35y,0.00000001h,45.00123153t,-0r/data=CigiJgokCYXl_8M40D9AEbv3D5wdxT9AGUKWKNz_WEFAIe-0dx4IUEFA `)
  }

  render() {
    // const MapWrapped = withScriptjs(withGoogleMap(Maps))
    console.log(this.state.business)
    return (<div className="stores">
      {this.state.business.map(b => {
        return <div className="details">
          <h2>{b.name}</h2>
          <img src={b.img} class="busImg"></img>
          <p>{b.description}</p>
          <p> <a> Address : </a>  {b.city}, {b.address}</p>
          <p> <a> Price :  </a> {b.price} ₪ </p>

          <a onClick={this.googleMapLocation} href={`/SmallBizz/${b.name}`}
          // {`https://www.google.com/maps/place/${b.name}%E2%80%AD/@${b.location.hight},${b.location.wight},12.49z/data=!4m5!3m4!1s0x151d4ca6193b7c1f:0xc1fb72a2c0963f90!8m2!3d${b.location.hight}!4d${b.location.wight}`}
          > See Google Map Location for {b.name} </a>  <br></br><br></br>

          <a onClick={this.googleEarthLocation} href={`/SmallBizz/${b.name}`}
          // {`https://earth.google.com/web/search/${b.address.replace(" ","%20") + ","+ b.city.replace(" ","%20")},+%d7%99%d7%a9%d7%a8%d7%90%d7%9c/@${b.location.hight},${b.location.wight},34.10008876a,4820.53237024d,35y,0.00000001h,45.00123153t,-0r/data=CigiJgokCUxm5g1E0D9AEbOQ9uUoxT9AGfLygoz_WEFAIZR2uc0HUEFA`}      
          > See Google Erath Location for {b.name} </a> <br></br><br></br>
   
          <a className="waves-effect waves-light btn-small" onClick={this.changeDisplay}>Make an appointment</a>
        </div>

        {/* </div> */ }
      })}
      {/* <div class="devsite-rating-stars"><div class="devsite-rating-star gc-analytics-event material-icons devsite-rating-star-outline" data-rating-val="1" data-category="Site-Wide Custom Events" data-label="Star Rating 1" track-metadata-score="1" track-type="feedback" track-name="rating" track-metadata-position="header" role="button" aria-label="Site content star ratings, rating 1 out of 5"></div><div class="devsite-rating-star gc-analytics-event material-icons devsite-rating-star-outline" data-rating-val="2" data-category="Site-Wide Custom Events" data-label="Star Rating 2" track-metadata-score="2" track-type="feedback" track-name="rating" track-metadata-position="header" role="button" aria-label="Site content star ratings, rating 2 out of 5"></div><div class="devsite-rating-star gc-analytics-event material-icons devsite-rating-star-outline" data-rating-val="3" data-category="Site-Wide Custom Events" data-label="Star Rating 3" track-metadata-score="3" track-type="feedback" track-name="rating" track-metadata-position="header" role="button" aria-label="Site content star ratings, rating 3 out of 5"></div><div class="devsite-rating-star gc-analytics-event material-icons devsite-rating-star-outline" data-rating-val="4" data-category="Site-Wide Custom Events" data-label="Star Rating 4" track-metadata-score="4" track-type="feedback" track-name="rating" track-metadata-position="header" role="button" aria-label="Site content star ratings, rating 4 out of 5"></div><div class="devsite-rating-star gc-analytics-event material-icons devsite-rating-star-outline" data-rating-val="5" data-category="Site-Wide Custom Events" data-label="Star Rating 5" track-metadata-score="5" track-type="feedback" track-name="rating" track-metadata-position="header" role="button" aria-label="Site content star ratings, rating 5 out of 5"></div></div> */}
      {/* <div>sjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjs</div> */}
      {/* <div>ss</div> */}
      <div className="appo">
        {this.state.displayAppo && this.state.business[0] ? <Calendar state={this.state} makeAnAppointment={this.makeAnAppointment} /> : null}</div>
    </div>)
  }
}

export default Bessiness;
