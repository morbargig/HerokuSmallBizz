import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment'
import { toUnicode } from 'punycode';
import alertify from 'alertify.js'


class Calendar extends Component {
    constructor() {
        super()
        this.state = {
            day: ""
        }

    }

    componentDidMount = () => {
        if (this.state.Besniss === undefined) {
            // this.returnCatgories()
            this.setState({ Besniss: this.props.state.business })
        }
    }

    returnCatgories = async () => {
        const res = await axios.get('/Besniss')
        this.setState({ Besniss: res.data }, function () { console.log(this.state.Besniss) })
    }

    calnder = (mor) => {
        let daysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        let bigResult = []
        let result1 = []
        let result2 = []
        let i = this.state.Besniss[0]
        let result = []
        let days = i.availableAppointments.map(a => Object.keys(a))



        const dayINeed = 2; // for Thursday
        const today = moment().isoWeekday();

        if (today <= dayINeed) {
            console.log(moment().isoWeekday(dayINeed))
        }
        // console.log(nextDay)


        // let today = moment(moment().format('L'), 'M/D/YYYY');
        // let newDayNumber = lastDay.diff(today, 'days') 
        // console.log(newDayNumber)


        console.log(moment().day(6))
        let thisSanday = moment().day(6)
        let todayy = new Date()

        let newDayNumber = thisSanday.diff(todayy, 'days') - 2
        let numberOfDaysHeWork = Object.keys(i.days).length
        console.log(numberOfDaysHeWork)
        // newDayNumber += 1
        console.log(newDayNumber)

        days = days.map(d => d[0]).splice(1, days.length - 1)
        console.log(days)
        if (mor === 2) {
            days = days.slice(newDayNumber + numberOfDaysHeWork, newDayNumber + numberOfDaysHeWork + numberOfDaysHeWork)
        } else if (mor === 1) {
            days = days.slice(newDayNumber, numberOfDaysHeWork + newDayNumber)
        } else {
            days = days.slice(0, newDayNumber)
        }
        console.log(days)
        days.sort()
        days = days.map(d => [moment(d).format('dddd'), d])


        console.log(days)
        // let days = Object.keys(i.days)
        // console.log(days)
        let obj = {}
        daysName.map(d => obj[d] = { name: d, isTrue: false })
        for (let a of days) {
            // daysName.forEach(d => a.includes(d) ? result.push({ name: d, isTrue: true }) : result.push({ name: d, isTrue: false }))
            // let name = "name"
            // let isTrue ="isTrue"
            // daysName.map(d => obj[d][isTrue] = false )

            //   days.map(c => 
            // console.log(days.includes(a))
            daysName.filter(d => a[0].match(d) ? obj[d] = { name: a[1], isTrue: true } : console.log("hjv"))
            //   daysName.map(d => a.match(d)  ?  obj[d]['isTrue'] = true : null )
            //   )   

        }
        console.log(obj)
        for (let i in obj) {
            console.log(i)

            obj[i].isTrue ? result.push(obj[i].name) : result.push("-")

        }
        console.log(result)
        return <tr>

            {result.map(r => <th>{r}</th>)}

        </tr>
    }

    // calnder2 = () => {

    // }

    // fn = () => {


    // }

    updateDay = (e) => {
        let value = e.target.value
        console.log(value)
        this.setState({ selectDay: value })
    }


    func = () => {
        if (this.state.Besniss !== undefined) {
            console.log(this.state.Besniss[0].availableAppointments.map(d => Object.keys(d)[0]))
            let days = this.state.Besniss[0].availableAppointments.map(d => Object.keys(d)[0])
            let length = days.length - 5
            // days = days.slice(1, length)
            console.log(days
                // <>

            )
            console.log(this.state.selectDay)
            if (this.state.selectDay === undefined) {
                this.setState({ selectDay: "regularDay" }, function () { console.log(this.state.selectDay) })
            }
            // this.render()
            return <select class="browser-default" name={"day"} value={this.state.selectDay} onChange={this.updateDay}  >
                < option value={'regularDay'} className={'regularDay'}  >  {'regularDay'}   </option>
                {days = days.splice(1, days.length - 1)}
                {days.map(d => < option value={d} className={d}  >  {d}  {moment(d).format('dddd')} </option>)}
            </select>
        }
    }
    // func2() {
    //     if (this.state.selectDay !== undefined) {
    //         return <select class="browser-default" value={this.state.hour} name={"fsdg"}  >
    //             < option value={"Selrcth hour"} className={"Selrcth hour"}  > {"Selrcth hour"} </option>
    //             {
    //                 this.state.selectDay.map(d => < option value={d} className={d}  > {d} </option>)}
    //         </select>
    //     }
    // }





    makeAnAppointment = (e) => {

        let value = e.target.value
        let time = value

        let date = this.state.selectDay
        this.props.makeAnAppointment(date, time)


    }






    render() {
        return <div>
            {/* <h5>Calendar for the next 10 days</h5> */}
            <div class="container-cal col-sm-4 col-md-7 col-lg-4 mt-5">
                {/* <div class="cardfsf"> */}
                <h3 class="card-header" id="monthAndYear"></h3>
                <table class="table table-bordered table-responsive-sm" id="calendar">
                    <thead>
                        <tr>
                            <th>Sun</th>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            {/* {this.state.Besniss ?  this.state.Besniss[0].name : null} */}
                            <th>Sat</th>
                        </tr>
                    </thead>
                    {this.state.Besniss !== undefined ? this.calnder()
                        : null}
                    {this.state.Besniss !== undefined ? this.calnder(1)
                        : null}
                    {this.state.Besniss !== undefined ? this.calnder(2)
                        : null}
                    <tbody id="calendar-body">

                    </tbody>
                </table>
                <div class="form-inline">

                    {/* <button class="btn btn-outline-primary col-sm-3" id="previous" onclick="previous()">Previous</button> */}

                    {/* <button class="btn btn-outline-primary col-sm-3" id="next" onclick="next()">Next</button> */}
                </div>
                <br />
                {this.func()}
                <select class="browser-default" name={this.state.selectDay} onChange={this.makeAnAppointment}  >
                    < option value={undefined} className={undefined}  > {"Select hour"} </option>
                    {console.log(this.state.selectDay)}
                    {this.state.selectDay !== undefined ? this.state.Besniss[0].availableAppointments.filter(d => Object.keys(d)[0] === this.state.selectDay)[0][this.state.selectDay].map(c => < option value={c} className={c} onChange={this.makeAnAppointment}>{c} </option>)
                        : null}
                </select>

                {/* {<select class="browser-default" name={"fsdg"}  >

{
< option value={"Fsdf"} className={"gsdg"}  > {"gsdgdsg"} </option>}
</select>} */}
                {/* <form class="form-inline">
                        <label class="lead mr-2 ml-2" for="month">Jump To: </label>
                        <select class="form-control col-sm-4" name="month" id="month" onchange="jump()">
                        <option value="0" >Jan}</option>
                        <option value='1'>Feb</option>
                        <option value='2'>Mar</option>
                        <option value='3'>Apr</option>
                        <option value='4'>May</option>
                        <option value='5'>Jun</option>
                        <option value='6'>Jul</option>
                        <option value='7'>Aug</option>
                        <option value='8'>Sep</option>
                        <option value='9'>Oct</option>
                        <option value='10'>Nov</option>
                        <option value='11'>Dec</option>
                        </select>
                        

                        <label for="days"></label><select class="form-control col-sm-4" name="year" id="year" onchange="jump()">
                        
                        <option value='2019'>2019</option>
                            <option value='2020'>2020</option>
                            <option value='2021'>2021</option>
                            <option value='2022'>2022</option>
                            <option value='2023'>2023</option>
                            <option value='2024'>2024</option>
                            <option value='2025'>2025</option>
                            <option value='2026'>2026</option>
                            <option value='2027'>2027</option>
                            <option value='2028'>2028</option>
                            <option value='2029'>2029</option>
                            <option value='2030'>2030</option>
                        </select></form> */}
                <script src="scripts.js"></script>

                {/* <!-- Optional JavaScript for bootstrap --> */}
                {/* <!-- jQuery first, then Popper.js, then Bootstrap JS --> */}
                {/* <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
                        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
                        crossorigin="anonymous"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"
                    integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ"
                        crossorigin="anonymous"></script>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"
                        integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm"
                    crossorigin="anonymous"></script> */}
                {/* </div> */}
            </div>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
                integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous"></link>
        </div >
    }

}

export default Calendar;
