import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import firebase from './config/firebase'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import SignUp from './component/SignUp'
import Home from './component/Home';
import About from './component/About';
import Catgoty from './component/Catgoty';
import Filter from './component/Filter';
import Bessiness from './component/Bessiness';
import OpenBisnnes from './component/OpenBisnnes';
import User from './component/User'
import { async } from 'q';
import Tset from './component/Calnder';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      name: '',
      phone: '',
      gender: 'male',
      city: '',
      uploadedImage: null,
      img: '',
      email: '',
      password: '',
      user: {},
      userNow: "",
      // loggedInUserName: '',
    }
  }

  componentDidMount = () => {
    // this.getEvents();
    this.authListener()
    this.returnCatgories()
  }
  
  // getEvents() {
  //   let that = this;
  //   function start() {
  //     gapi.client.init({
  //       'apiKey': GOOGLE_API_KEY
  //     }).then(function () {
  //       return gapi.client.request({
  //         'path': `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
  //       })
  //     }).then((response) => {
  //       let events = response.result.items
  //       that.setState({
  //         events
  //       }, () => {
  //         console.log(that.state.events);
  //       })
  //     }, function (reason) {
  //       console.log(reason);
  //     });
  //   }
  //   gapi.load('client', start)
  // }

  returnCatgories = async () => {
    const res = await axios.get('/Catgories')
    if (res.data[0] === undefined) {
      this.componentDidMount()
    } else {

      let Catgories = res.data[0].Catgories
      // Catgories = Object.keys(Catgories)
      console.log(Catgories)

      this.setState({
        Catgories: Catgories
      })
      console.log(this.state.Catgories)
    }
  }

  saveNewUserToDb = async () => {
    // await this.handleUpload()
    console.log(this.state.user.uid)
    console.log(this.state.img)
    let saveStatus = await axios.post('/addnewuser', {
      _id: this.state.user.uid,
      name: this.state.name,
      password: this.state.password,
      phone: this.state.phone,
      email: this.state.email,
      gender: this.state.gender,
      city: this.state.city,
      img: this.state.img
    })
    if (saveStatus.data == 'succes!') {
      alert('signed up successfully')
      this.setState({ ifBuisnuess: true })
    } else {
      alert('there was a problem with the sign up, please try again')
    }
  }

  saveNewBiz = async (object) => {
    // let name = "location"
    // let lat = "lat"
    // let lng = "lng"
    // console.log(location.lat,location.lng)
    // object[name][lat] = location.lat
    // object[name][lng] =location.lng
    console.log(object)
    let save = await axios.post('/addnewbusiness', object)
    if (save.data == 'succes!') {
      alert('signed up successfully')
    } else {
      alert('there was a problem with the sign up, please try again')
    }
  }




  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })

  }
  handleImage = (e) => {
    console.log("jhgchjhkjkljkhg")
    if (e.target.files[0]) {
      const image = e.target.files[0]
      this.setState({
        uploadedImage: image
      })
    }
  }

  handleUpload = () => {
    console.log("kjgjyfjukguyv")
    const { uploadedImage } = this.state
    if (this.state.uploadedImage === null) {
      alert('Please pick a valid image!')
    }
    else {
      const uploadTask = firebase.storage().ref(`images/${uploadedImage.name}`).put(uploadedImage)
      uploadTask.on('state_changed',
        (snapshot) => {
          // progress function
        },
        (error) => {
          console.log(error)
        },
        () => {
          firebase.storage().ref('images').child(uploadedImage.name).getDownloadURL().then(url => {
            this.setState({
              img: url
            })
            console.log(this.state.img)

          })
        }
      )
    }
    console.log(this.state)


  }





  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user, userEmail: user.email }, function () {
          console.log(this.state.user)
        })
      } else {
        this.setState({ user: null }, function () {
        })
      }
    })
  }

  reaseCatgories = () => {
    this.setState({ Catgories: undefined })
  }

  render() {
    return (
      <Router>
        <nav>
          <div class="nav-wrapper navBar #e53935 red darken-1">
            <a href="/About" class="brand-logo right"> smallBiz</a> {/* also a link but in html syntax */}
            <ul id="nav-mobile" class="left hide-on-med-and-down">

              {/* <li ><Link to="/SingUp">singup  </Link></li> */}
              <li ><Link to="/" >Home</Link></li>
              {/* <li ><Link to="/Test" >Mor Test</Link></li> */}
              <li ><Link to="/About">About </Link></li>
            </ul>
          </div>
        </nav>

        <div>
          {/* {this.state.user ? <Home Catgories={this.state.Catgories} /> : <SignUp />} */}
        </div>
        <Route path="/" exact render={() => this.state.user ? <Home returnCatgories={this.returnCatgories} reaseCatgories={this.reaseCatgories} state={this.state} Catgories={this.state.Catgories} userEmail={this.state.userEmail} /> : <User handle={this.handleChange} email={this.state.email} password={this.state.password} getName={this.getName} />} />
        <Route path="/Home" render={() => <Home returnCatgories={this.returnCatgories} reaseCatgories={this.reaseCatgories} state={this.state} Catgories={this.state.Catgories} userEmail={this.state.userEmail} />} />
        <Route path="/About" render={() => <About state={this.state} />} />
        <Route path="/Catgory" render={() => <Catgoty />} />
        <Route path="/Filter/:CatgoryName" exact render={({ match }) => <Filter name={match.params.CatgoryName} />} />
        <Route path="/SmallBizz/:BesniessName" exact render={({ match }) => <Bessiness state={this.state} name={match.params.BesniessName} />} />
        <Route path="/Signup" exact render={() => this.state.user ? <Home returnCatgories={this.returnCatgories} reaseCatgories={this.reaseCatgories} state={this.state} Catgories={this.state.Catgories} userEmail={this.state.userEmail} /> : <SignUp handle={this.handleChange} state={this.state} saveUser={this.saveNewUserToDb} getName={this.getName} handleImg={this.handleImage} upload={this.handleUpload} />} />
        <Route path="/OpenBisnnes" render={() => this.state.user ? <Home returnCatgories={this.returnCatgories} reaseCatgories={this.reaseCatgories} state={this.state} Catgories={this.state.Catgories} userEmail={this.state.userEmail} /> : <OpenBisnnes Catgories={this.state.Catgories} saveNew={this.saveNewBiz} state={this.state} handleImg={this.handleImage} upload={this.handleUpload} />} />
    <Route path="/Test" render={() => <Tset />}  />
      </Router >

    );
  }
}

export default App;
