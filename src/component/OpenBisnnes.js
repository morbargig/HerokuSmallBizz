import React, { Component } from 'react';
import firebase from '../config/firebase'
import { async } from 'q';
import axios from 'axios'

// import Checkbox from 'react-materialize/lib/Checkbox';
// import Select from 'react-materialize/lib/Checkbox';



class OpenBisnnes extends Component {
    constructor() {
        super()
        this.state = {
            newBusines: { location: { hight: 0, wight: 0 }, days: {} },
            ifLocation: 0,
            stringInput: ["name", "email", "password", "description", "owner", "payment", "country", "city", "address", "service"],
            numbersInput: ["price", "averageAppointmentTime"],
            daysList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            hoursList: ['0000', '0015', '0030', '0045', '0100', '0115', '0130', '0145', '0200', '0215', '0230', '0245', '0300', '0315',
                '0330', '0345', '0400', '0415', '0430', '0445', '0500', '0515', '0530', '0545', '0600', '0615', '0630',
                '0645', '0700', '0715', '0730', '0745', '0800', '0815', '0830', '0845', '0900', '0915', '0930', '0945', '1000', '1015',
                '1030', '1045', '1100', '1115', '1130', '1145', '1200', '1215', '1230', '1245', '1300', '1315', '1330', '1345', '1400',
                '1415', '1430', '1445', '1500', '1515', '1530', '1545', '1600', '1615', '1630', '1645', '1700', '1715', '1730', '1745', '1800',
                '1815', '1830', '1845', '1900', '1915', '1930', '1945', '2000', '2015', '2030', '2045', '2100', '2115', '2130',
                '2145', '2200', '2215', '2230', '2245', '2300', '2315', '2330', '2345'],
            BesniessSetupHours: ["startTimeTillBrake", "brakeStartTime", "breakEndTime", "endTime"],
            Catgories: [],
            CatgoriesOn: false
        }
    }


    async componentDidMount() {
        const res = await axios.get('/Catgories')
        let Catgories = res.data[0].Catgories
        // Catgories = Object.keys(Catgories)
        console.log(Catgories)

        this.setState({
            Catgories: Catgories, CatgoriesOn: true
        })
        console.log(this.state.Catgories)
    }


    updeBesniiesText = (e) => {
        let id = e.target.id
        let name = e.target.name
        let text = e.target.value
        console.log(text, name, id, e.target)
        if (id === 'hores') {
            if (text[2] + text[3] !== "00") {
                let min = parseInt(text[2] + text[3]) / 60
                text = text.slice(0, 2)
                text = parseInt(text)
                text = text + min
                console.log(text)
            } else {
                text = text.slice(0, 2)
                text = parseInt(text)
            }

        }
        let newBusines = { ...this.state.newBusines }
        newBusines[name] = text
        this.setState({
            newBusines: newBusines
        })
    }

    createNewBussnies = () => {
        //    let  newBusines = { ...this.state.newBusines }
        //    console.log(this.state.img)
        //     newBusines.imge = this.state.img
        console.log(this.state.newBusines.img)
        let CatgoriesOn = this.state.CatgoriesOn ? 1 : 0
        // console.log(newBusines[image])
        let imageLength = this.state.newBusines.img === undefined ? 0 : 1
        let length = this.state.stringInput.length + this.state.numbersInput.length + this.state.BesniessSetupHours.length + this.state.ifLocation + CatgoriesOn + imageLength + 3
        console.log(length)
        console.log(Object.keys(this.state.newBusines).length)
        if (Object.keys(this.state.newBusines).length === length || Object.keys(this.state.newBusines).length === length - 1) {
            let allFieldAreFull = true
            for (let i in this.state.newBusines) {
                console.log(this.state.newBusines[i])
                if (this.state.newBusines[i] === "") {
                    allFieldAreFull = false
                }
            }
            allFieldAreFull === true ? this.clearInputs() : alert("not all fields are proparly filled")
        } else { alert("sorry all field must be valid") }
        // ojj = {}
    }


    clearInputs = () => {
        firebase.auth().createUserWithEmailAndPassword(this.state.newBusines.email, this.state.newBusines.password).catch((error) => {
            console.log(error)
        })
        this.props.saveNew(this.state.newBusines, this.state.currentAddress)
        alert("work and need to open new busnies")
        this.state.newBusines = {}

    }

    appointmentComfirm = (e) => {
        // let days = "days"
        let name = e.target.name
        let text = e.target.value
        let checked = e.target.checked
        // this.state[name] = 0
        console.log(name, text)
        let newBusines = { ...this.state.newBusines }
        if (name === "appointmentComfirm") {
            newBusines[name] = !this.state.newBusines[name]
            // console.log(typeof text)
            this.setState({
                newBusines: newBusines
            })
        } else {

            newBusines.days[name] = !this.state.newBusines.days[name]
            // console.log(typeof text)
            this.setState({
                newBusines: newBusines
            }
                // , function () { console.log(this.state.newBusines[name]) }
            )
        }
    }

    getGeoLocation = () => {
        let r = window.confirm("Do you agree?")
        if (r == true) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        let location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                        let hight = location.lat
                        let wight = location.lng
                        let newBusines = { ...this.state.newBusines }
                        newBusines.location.hight = hight
                        newBusines.location.wight = wight
                        console.log(newBusines)
                        // console.log(hight,wight)
                        this.setState({
                            newBusines: newBusines,
                            ifLocation: 1
                        }, function () {
                            // console.log(this.state.currentAddress.lng)
                        })
                    }
                )
            }
        } else {
            alert("so we will uesed on your adrees that you fill in before")
        }
    }
    // addImg = (e) =>{
    //     e = e.target.parentElement
    //     console.log(e)
    // }

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
                async () => {
                    await firebase.storage().ref('images').child(uploadedImage.name).getDownloadURL().then(url => {
                        console.log(url)
                        let newBusines = { ...this.state.newBusines }
                        newBusines.img = url
                        this.setState({
                            newBusines: newBusines,
                            img: url
                        })
                        console.log(this.state.img)

                    })
                }
            )
        }
        console.log(this.state)
    }



    render() {
        let Catgories = this.state.Catgories
        let stringInput = this.state.stringInput
        let numbersInput = this.state.numbersInput
        let daysList = this.state.daysList
        let BesniessSetupHours = this.state.BesniessSetupHours
        let hoursList = this.state.hoursList
        return <div>Helle this is where you are gonna put your besniess data and wait for us to confferm your request
              <h5> Add New Business </h5>

            {stringInput.map(i => <label>{i} <input name={`${i}`} type="text" value={this.state.newBusines[i]} onChange={this.updeBesniiesText} placeholder={`${i}`} /> </label>)}
            <h5>numbers</h5>
            {numbersInput.map(i => <label>{i} <input name={`${i}`} type="number" value={this.state.newBusines[i]} onChange={this.updeBesniiesText} placeholder={`${i}`} /> </label>)}

            <form action="#">
                <label>
                    <input name="appointmentComfirm" type="checkbox" value={false} onChange={this.appointmentComfirm} />
                    <span>appointmentComfirm </span>
                </label>
            </form>
            <h5> day you are working </h5>
            {daysList.map(d => <label> {d}
                <input name={d} type="checkbox" value={true} onChange={this.appointmentComfirm} indeterminate />
                {/* <input name={d} type="checkbox" value={true} onChange={this.appointmentComfirm} /> */}
                <span></span>
            </label>)}
            <h5> select work hours </h5>
            {this.state.CatgoriesOn ?
                <div>
                    {/* <label>Busniess Catgiry Select</label>
                    <datalist class="browser-default" name="field" onChange={this.updeBesniiesText}>
                        <option value="" disabled selected>Choose your Catgory</option>
                        {Catgories.map(c => <option value={c.name}> {c.name}</option>)}
                    </datalist> */}

                    <div>
                        Catgory: <datalist id="searchCatgory" className='select-input' name="field" onChange={this.updeBesniiesText}>
                            {Catgories.map(c => <option value={c.name}>{c.name} </option>)}
                        </datalist>
                        <input autoComplete="on" list="searchCatgory" name="field"
                            value={this.state.newBusines.field}
                            placeholder='Catgory' onChange={this.updeBesniiesText} className='select-input' />
                    </div> </div>
                : <div>
                    Catgory: <datalist id="searchCatgory" className='select-input' name="field" onChange={this.updeBesniiesText}>
                        {Catgories.map(c => <option value={c.name}>{c.name} </option>)}
                    </datalist>
                    <input autoComplete="on" list="searchCatgory" name="field"
                        value={this.state.newBusines.field}
                        placeholder='Catgory' onChange={this.updeBesniiesText} className='select-input' />
                </div>
            }


            {BesniessSetupHours.map(b =>
                <div>
                    <label>{b}
                        <datalist id="searchHores" className='select-input' name={b} onChange={this.updeBesniiesText}>
                            <option disabled selected>Choose your {b}</option>
                            {hoursList.map(h => <option value={h}> {h}</option>)}
                        </datalist> </label>
                    <input autoComplete="on" id="hores" list="searchHores" name={b}
                        placeholder='Hours' onChange={this.updeBesniiesText} className='select-input' />
                </div>
            )}
            <label>Photo</label>
            <div>
                <input id="file" type="file" onChange={this.handleImage} />
                <button onClick={this.handleUpload}> Upload Image</button>
            </div>

            <br></br>
            <button onClick={this.getGeoLocation}> Do you want us to get your location for your business </button>
            <button onClick={this.createNewBussnies}>Add New Business <i class="material-icons right">send</i> </button>

        </div>
    }
}

export default OpenBisnnes;
