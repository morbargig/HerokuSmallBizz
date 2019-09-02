
const express = require('express')
const router = express.Router()
const Business = require('../models/Business')
const User = require('../models/User')
const Appointment = require('../models/Appointment')
const moment = require('moment')
const Category = require('../models/CategorySchema')
// const mongoose = require('mongoose')
const nodemailer = require('nodemailer');

const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))



router.put('/makeapp/:bId/:uId', function (req, res) {
    let bId = req.params.bId
    let uId = req.params.uId
    let date = req.body.date
    let time = req.body.time
    let appointmentComfirm = req.body.appointmentComfirm
    console.log(date, time, uId, bId, req.body)

    Business.findOne({ _id: bId }).exec(function (err, buss) {
        let index = buss.availableAppointments.find(d => Object.keys(d)[0] === date)[date].indexOf(time)
        console.log(buss.availableAppointments.find(d => Object.keys(d)[0] === date)[date].splice(index, 1))
        console.log(buss.availableAppointments.find(d => Object.keys(d)[0] === date)[date])
        buss["rating"] !== undefined ? buss["rating"] += 10 : buss["rating"] = 10
        // buss["rating"] = 10
        // res.end()
        Business.findByIdAndUpdate({ _id: bId }, buss, function () {
            // console.log(buss, id)
            res.send('succes!')
        })
    })

    let obj = {
        userId: uId,
        businessId: bId,
        date: date,
        time: time,
        rating: 10,
        appointmentComfirm: appointmentComfirm,
    }
    new Appointment(obj).save()

})


newDay = () => {
    Business.find({}).exec(function (err, businesses) {
        for (let i of businesses) {
            let regularDay = i.availableAppointments[0].regularDay
            // console.log(regularDay)
            let length = i.availableAppointments.length
            // console.log(length)
            let lastDay = Object.keys(i.availableAppointments[length - 1])
            lastDay = moment(lastDay, 'L')
            // console.log(lastDay)
            let today = moment(moment().format('L'), 'M/D/YYYY');
            let newDayNumber = lastDay.diff(today, 'days') + 1
            // console.log(lastDay, today, newDayNumber)
            // console.log(newDayNumber)
            let newDay = moment().add(newDayNumber, 'day').format('L')
            // console.log(newDay)
            let x = moment(newDay).format('dddd')
            // console.log(x)
            let daysOfWork = Object.keys(i.days)
            // console.log(daysOfWork)
            !daysOfWork.find(d => d === x) ? newDayNumber += 1 : null
            // console.log(newDayNumber)
            i.availableAppointments.push({ [moment().add(newDayNumber, 'day').format('L')]: regularDay })
            i.availableAppointments.splice(1, 1)
            // console.log(i.availableAppointments)
            let id = i._id
            Business.findByIdAndUpdate({ _id: id }, i, function () {
            })
        }
    })
}



// newDay()

router.post('/addnewuser', function (req, res) {
    let u1 = new User(req.body)
    u1.save()
    res.send('succes!')
})






getCatgoties = async function () {
    let id = "5d62ea1f8cf5dc39488c1000"
    let obj = {
        id: id,
        Catgories: []
    }
    let obj1 = {}
    await Business.find({}).exec(function (err, businesses) {
        businesses.forEach(b =>
            obj1[b.field] = { name: b.field, img: b.img, description: b.description }
        )
        for (let i in obj1) {
            // let obj2 =  obj1[i] 
            obj.Catgories.push(obj1[i])
        }
        console.log(obj.Catgories)

        Category.findOneAndDelete({ id: id }, function (err, x) {
        })
        new Category(obj).save()
    })
}







router.get('/Catgories', function (req, res) {
    getCatgoties()
    Category.find({}).exec(function (err, Category) {
        // console.log(Category)
        res.send(Category)
    })
})



router.post('/addCatgories', function (req, res) {
    console.log(req.body)
    new Category(req.body).save()
    res.send('succes!')
})


router.get('/searchByCatagory/:Catagory/:text', (req, res) => {
    // let a = req.body
    let Catagory = req.params.Catagory
    let text = req.params.text
    // console.log(text,Catagory)
    if (Catagory === "rating") {
        Business.find({}, function (err, x) {
            let result = []
            x.map(u => u[Catagory] > parseInt(text) ? result.push(u) : console.log(u[Catagory]))
            console.log(result)
            res.send(result)
        })
    }
    else if (Catagory === "days") {
        Business.find({}, function (err, x) {
            let result = []
            for (let i of x) {
                let days = Object.keys(i[Catagory])
                for (let d of days) {
                    if (d.includes(text) || d === text) {
                        result.push(i)
                        break
                    }
                }
                // days.forEach( d => d.includes(text) || d === text ? result.push(i)  : console.log(d))
            }
            console.log(result)
            res.send(result)
        })
    }

    else if (Catagory === "price") {
        Business.find({}, function (err, x) {
            let result = []
            x.map(u => u[Catagory] < parseInt(text) ? result.push(u) : console.log(u[Catagory]))
            console.log(result)
            res.send(result)
        })
    } else {

        console.log(text, Catagory)
        Business.find({}, function (err, x) {
            let result = []
            x.map(u => u[Catagory].includes(text) || u[Catagory] === text ? result.push(u) : console.log(u[Catagory]))
            console.log(result)
            res.send(result)
        })
    }
})




router.post('/addnewbusiness', async function (req, res) {
    req.body.price = parseInt(req.body.price)
    req.body.averageAppointmentTime = parseInt(req.body.averageAppointmentTime)
    let b1 = new Business(req.body)
    let dailySchedule = await getDailySchedule(req.body)
    let daysOfWork = Object.keys(b1.days)
    console.log(daysOfWork)
    let arr = []
    let x = 0
    for (let i = 0; x < 10; i++) {
        // console.log(moment((moment().add(x + i, 'day').format('L'))).format('dddd'))
        if (daysOfWork.find(d => d === moment((moment().add(i, 'day').format('L'))).format('dddd'))) {
            arr.push({ [moment().add(i, 'day').format('L')]: dailySchedule })
            console.log(moment((moment().add(i, 'day').format('L'))).format('dddd'), "is in")
            x++
        }
    }

    arr.push({ "regularDay": dailySchedule })

    b1.availableAppointments = arr
    b1.save()
    res.send('succes!')
})

getDailySchedule = function (object) {

    let dailySchedule = []
    counter = object.averageAppointmentTime
    let num1 = object.startTimeTillBrake * 60
    let num2 = object.breakEndTime * 60


    let numberOfAppointmentsBeforeBreak = Math.floor((object.brakeStartTime - object.startTimeTillBrake) / (object.averageAppointmentTime / 60))
    let numberOfAppointmentsAfterBreak = Math.floor((object.endTime - object.breakEndTime) / (object.averageAppointmentTime / 60))
    for (let i = 0; i < numberOfAppointmentsBeforeBreak; i++) {
        dailySchedule.push(`${Math.floor(num1 / 60)}:${num1 % 60}`)
        num1 += counter
    }
    for (let i = 0; i < numberOfAppointmentsAfterBreak; i++) {
        dailySchedule.push(`${Math.floor(num2 / 60)}:${num2 % 60}`)
        num2 += counter
    }

    return dailySchedule
}

router.post('/addnewappointment', function (req, res) {
    let a1 = new Appointment(req.body)
    a1.save()
    res.send('succes!')
})




router.get('/Besniss', (req, res) => {
    Business.find({}).exec(function (err, Besniss) {


        res.send(Besniss)
    })
})


router.get('/getuser/:email', (req, res) => {
    let key = Object.keys(req.params)[0]
    let value = req.params[key]
    console.log(key, value)
    User.findOne({ [key]: value }).exec(function (err, user) {
        console.log(user)
        res.send(user)
    })
})

router.get('/getbyfield/:field', function (req, res) {
    let key = Object.keys(req.params)[0]
    let value = req.params[key]
    Business.find({ [key]: value }).exec(function (err, response) {
        console.log(response)
        res.send(response)
    })
})



router.get('/getbyname/:name', function (req, res) {
    Business.find({ name: req.params.name }).exec(function (err, response) {
        res.send(response)
    })
})


router.post('/sendEmail', (req, res) => {
    console.log("got To server")
    const helperOptions = req.body
    let transport = {
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: 'bargigshop@gmail.com',
            pass: 'bargig18765432',
        },
        tls: { rejectUnauthorized: false }
    }
    let transporter = nodemailer.createTransport(transport);
    transporter.sendMail(helperOptions, (err, info) => {
        if (err) { return console.log(err) }
        else { return console.log(info) }
    })
    console.log('email sent!')
    res.send("Email Sent")
})





// setTimeout( async() => {
//     // let data = require('../Data/data.json')
//     console.log(data)
//     for (let d of data) {
//         d["price"] = 10
//         d["averageAppointmentTime"] = 100
//         let b1 = new Business(d)
//         let dailySchedule = await getDailySchedule(d)
//         let daysOfWork = Object.keys(b1.days)
//         console.log(daysOfWork)
//         let arr = []
//         arr.push({ "regularDay": dailySchedule })
//         let x = 0
//         for (let i = 0; x < 10; i++) {
//             console.log(moment((moment().add(x + i, 'day').format('L'))).format('dddd'))
//             if (daysOfWork.find(d => d === moment((moment().add(i, 'day').format('L'))).format('dddd'))) {
//                 arr.push({ [moment().add(i, 'day').format('L')]: dailySchedule })
//                 console.log(moment((moment().add(i, 'day').format('L'))).format('dddd'), "is in")
//                 x++
//             }
//         }
//         b1.availableAppointments = arr
//         b1.save()
//     }
// }, 100)


// setTimeout()



module.exports = router
