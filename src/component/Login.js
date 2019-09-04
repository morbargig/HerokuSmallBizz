import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import firebase from '../config/firebase'


class Login extends Component {

    login = (e) => {
        e.preventDefault()
        firebase.auth().signInWithEmailAndPassword(this.props.email, this.props.password).catch((error) => {
            console.log(error)
        })
        // this.props.getName()
    }

    render() {
        return <div className='col-md-6'>
            <div>
                <h3>
                    Welcome to SmallBiz THE platform for small businesses
                </h3>
                <br></br>
                <h1>Login: </h1>
                <div>
                    <label>Email Address</label>
                    <input placeholder='Enter email' value={this.props.email} onChange={this.props.handle} type='email' name='email' />

                </div>
                <div>
                    <label>Password</label>
                    <input placeholder='Password' value={this.props.password} onChange={this.props.handle} type='password' name='password' />
                    <button onClick={this.login} className='btn btn-primary'>Login</button>

                </div>
                <h1>Don`t have a user?</h1>
                <br></br>
                <Link to="/Signup" className='btn btn-success'>CLICK HERE</Link>
            </div>
        </div>
    }
}

export default Login