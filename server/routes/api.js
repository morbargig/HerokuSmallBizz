
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



let data = [
    {
        "location": {
            "hight": 31.7845196,
            "wight": 34.660278
        },
        "days": {
            "Sunday": true,
            "Tuesday": true,
            "Wednesday": true,
            "Thursday": true,
            "Friday": true
        },
        "name": "Snir Halfon",
        "email": "snir@walla.com",
        "password": "123456",
        "description": "best ever!",
        "img": "https://scontent-yyz1-1.cdninstagram.com/vp/6903e1186277b1657580c0550efb1f23/5D83E201/t51.2885-19/s150x150/55833138_789927684710950_8067812279866884096_n.jpg?_nc_ht=scontent-yyz1-1.cdninstagram.com&se=8",
        "owner": "Mor Bargig",
        "payment": "bmhb",
        "country": "israel",
        "city": "Tel Aviv",
        "address": " Elevation Academy",
        "service": "sex service",
        "price": 100,
        "averageAppointmentTime": 30,
        "appointmentComfirm": true,
        "field": "Other",
        "startTimeTillBrake": 11,
        "brakeStartTime": 12.5,
        "breakEndTime": 13.5,
        "endTime": 17
    },
    {
        "days": {
            "Sunday": true,
            "Tuesday": true,
            "Wednesday": true,
            "Thursday": true
        },
        "location": {
            "hight": 32.062840699999995,
            "wight": 34.7734829
        },
        "name": "Dor Ahrak",
        "email": "dorajrak@gmail.com",
        "password": "123456",
        "description": "barbershop we are located in moshav shtulim",
        "owner": "Dor Ahrak",
        "country": "Isael",
        "city": "Moshav Shtulim",
        "address": " Haela steert",
        "service": "haircut",
        "price": 100,
        "averageAppointmentTime": 30,
        "appointmentComfirm": true,
        "field": "Haircuts",
        "startTimeTillBrake": 9,
        "brakeStartTime": 12,
        "breakEndTime": 13,
        "endTime": 17,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2FLa-Barbershop.jpg?alt=media&token=a40f4002-322c-4527-afaa-62413dc6e502",
        "__v": 0,
        "rating": 10
    },
    {
        "days": {
            "Sunday": true,
            "Monday": true,
            "Wednesday": true,
            "Thursday": true
        },
        "location": {
            "hight": 0,
            "wight": 0
        },
        "name": "Gas Monkey Garage",
        "email": "gabi@gmail.com",
        "password": "123456",
        "description": "The best Mechanics in Israel. Located right on Tel-Aviv's famous Ben-Yehuda Street",
        "owner": "Gabi Berkovich",
        "country": "Israel",
        "city": "Tel-Aviv",
        "address": "Ben-Yehuda Street, 7",
        "service": "Carshop",
        "price": 50,
        "averageAppointmentTime": 45,
        "appointmentComfirm": true,
        "field": "Cars",
        "startTimeTillBrake": 6,
        "brakeStartTime": 12,
        "breakEndTime": 12.75,
        "endTime": 22,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2F%24_57.JPG?alt=media&token=bc30daa1-aa0d-4a52-a27e-6c7a87cca47f",
        "__v": 0
    },
    {
        "days": {
            "Sunday": true,
            "Monday": true,
            "Tuesday": true,
            "Wednesday": true
        },
        "location": {
            "hight": 32.066831,
            "wight": 34.7633005
        },
        "name": "A.C Bros",
        "email": "ac@gmail.com",
        "password": "acbros1234",
        "description": "We are two brothers working together to fix your A.C at the best price in the market!",
        "owner": "Yossi Meiri",
        "country": "Israel",
        "city": "Ashdod",
        "address": "Weizman Street 48",
        "service": "air conditioner fixing",
        "price": 20,
        "averageAppointmentTime": 40,
        "appointmentComfirm": true,
        "field": "Maintenance",
        "startTimeTillBrake": 6,
        "brakeStartTime": 13,
        "breakEndTime": 14.5,
        "endTime": 22.5,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2Fac.jpg?alt=media&token=a3f8da6f-23d8-4ab6-8442-097a93a6e55f"
    },
    {
        "days": {
            "Sunday": true,
            "Monday": true,
            "Tuesday": true,
            "Wednesday": true,
            "Thursday": true
        },
        "location": {
            "hight": 0,
            "wight": 0
        },
        "name": "Altruist Barbershop",
        "email": "altru@gmail.com",
        "password": "altru1234",
        "description": "We donate half of our incomes to charity!",
        "owner": "Yossi Altru",
        "country": "Israel",
        "city": "Netanya",
        "address": "Weizmann, 17",
        "service": "Hair and Beard styling",
        "price": 75,
        "averageAppointmentTime": 35,
        "field": "Barber Shop",
        "startTimeTillBrake": 7,
        "brakeStartTime": 14,
        "breakEndTime": 15,
        "endTime": 21,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2F20140930_124822.jpg?alt=media&token=ca54cd45-91e0-422d-9bcd-43fce6b74052"
    },
    {
        "days": {
            "Tuesday": true,
            "Wednesday": true,
            "Thursday": true
        },
        "location": {
            "hight": 32.0629157,
            "wight": 34.773520399999995
        },
        "name": "Amit Private Tutor",
        "email": "amit@gmail.com",
        "password": "amit1234",
        "description": "Hey! My name is Amit Rosenfeld and I`m a private Math and Physics tutor! With my help you will be at the top of your class!",
        "owner": "Amit Rosenfeld",
        "country": "Israel",
        "city": "Ramat-Gan",
        "address": "Neve Yakov Street 5",
        "service": "Tutor",
        "price": 35,
        "averageAppointmentTime": 30,
        "appointmentComfirm": true,
        "field": "Education",
        "startTimeTillBrake": 16.5,
        "brakeStartTime": 19,
        "breakEndTime": 19.75,
        "endTime": 21.5,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2FPrivate%20Tutor.jpg?alt=media&token=97c358bc-fd0f-4ed2-b798-e3f3be8d4bfa"
    },
    {
        "days": {
            "Sunday": true,
            "Monday": true,
            "Tuesday": true,
            "Wednesday": true
        },
        "location": {
            "hight": 32.066831,
            "wight": 34.7633005
        },
        "field": "Psychologist",
        "name": "David psychologist",
        "email": "david@gmail.com",
        "password": "david1234",
        "description": "Your soul is injured? Don't you have anyone to talk to? I have 12 years of experience with patients and I will help you, just make an appointment!",
        "owner": "David ",
        "country": "Hungary",
        "city": "Budapest",
        "address": "budapest12",
        "service": "Psychologist",
        "price": 200,
        "averageAppointmentTime": 30,
        "appointmentComfirm": true,
        "startTimeTillBrake": 8,
        "brakeStartTime": 13,
        "breakEndTime": 13.75,
        "endTime": 17,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2FPsychologist.jpg?alt=media&token=9611f1db-a302-40e4-8fd1-7321bc4dfa9f"
    },
    {
        "days": {
            "Sunday": true,
            "Monday": true,
            "Tuesday": true,
            "Wednesday": true,
            "Thursday": true
        },
        "location": {
            "hight": 32.0668317,
            "wight": 34.763235699999996
        },
        "name": "Dor Ahark Barbershop",
        "email": "Dorahrak@gmail.com",
        "password": "Dor1234",
        "description": "The best barbershop in Israel! ",
        "owner": "Dor Ahark",
        "country": "Israel",
        "address": "Haela street",
        "city": "Moshav Shtulim",
        "service": "Hair",
        "price": 100,
        "averageAppointmentTime": 45,
        "field": "Barber Shop",
        "startTimeTillBrake": 7.5,
        "brakeStartTime": 12.5,
        "breakEndTime": 13.5,
        "endTime": 22,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2Fbarber.jpg?alt=media&token=d0d5908d-c41c-40ae-892d-83ce9555dbfa",
        "appointmentComfirm": true
    },
    {
        "days": {
            "Sunday": true,
            "Monday": true,
            "Tuesday": true,
            "Thursday": true,
            "Friday": true
        },
        "location": {
            "hight": 0,
            "wight": 0
        },
        "name": "Hair for Kids",
        "email": "hair4kids@gmail.com",
        "password": "hair4kids1234",
        "description": "The best barbershop for kids! We have tv's, video-games and other cool things for your kid while he gets his hair done!",
        "owner": "David Azulay",
        "country": "Israel",
        "city": "Ashkelon",
        "address": "Jabotinsky Street , 16",
        "service": "Kid Hairstyling",
        "price": 80,
        "averageAppointmentTime": 45,
        "field": "Barber Shop",
        "startTimeTillBrake": 8.5,
        "brakeStartTime": 14,
        "breakEndTime": 15.5,
        "endTime": 22.5,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2F95389e73b992b1a2ad6c4f39a831cb56.jpg?alt=media&token=ff3d5f29-7383-4509-879b-c3445ddd1ffc"
    },
    {
        "days": {
            "Sunday": true,
            "Wednesday": true,
            "Thursday": true,
            "Friday": true
        },
        "location": {
            "hight": 32.066831,
            "wight": 34.7633005
        },
        "name": "Oha'ds garage",
        "email": "ohad@gmail.com",
        "password": "ohad1234",
        "description": "We'll fix your car at the cheapest price in an unmatched and uncompromising area, open many hours a day.",
        "owner": "Ohad",
        "country": "Japan",
        "city": "Tokyo",
        "address": "address in japan",
        "service": "fixing cars",
        "price": 50,
        "averageAppointmentTime": 30,
        "appointmentComfirm": true,
        "field": "Cars",
        "startTimeTillBrake": 10.5,
        "brakeStartTime": 14,
        "breakEndTime": 14.25,
        "endTime": 19.5,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2Fgarage.jpg?alt=media&token=acc446f1-a348-4f25-a7ce-bc3b38669bb0"
    },
    {
        "days": {
            "Sunday": true,
            "Wednesday": true,
            "Thursday": true,
            "Friday": true
        },
        "location": {
            "hight": 32.066831,
            "wight": 34.7633005
        },
        "name": "Oha'ds garage",
        "email": "ohad@gmail.com",
        "password": "ohad1234",
        "description": "We'll fix your car at the cheapest price in an unmatched and uncompromising area, open many hours a day.",
        "owner": "Ohad",
        "country": "Japan",
        "city": "Tokyo",
        "address": "address in japan",
        "service": "fixing cars",
        "price": 50,
        "averageAppointmentTime": 30,
        "appointmentComfirm": true,
        "field": "Cars",
        "startTimeTillBrake": 10.5,
        "brakeStartTime": 14,
        "breakEndTime": 14.25,
        "endTime": 19.5,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2Fgarage.jpg?alt=media&token=acc446f1-a348-4f25-a7ce-bc3b38669bb0"
    },
    {
        "days": {
            "Sunday": true,
            "Monday": true,
            "Tuesday": true,
            "Wednesday": true
        },
        "location": {
            "hight": 32.066831,
            "wight": 34.7633005
        },
        "name": "Sapir Nails",
        "email": "sapir@gmail.com",
        "password": "sapir1234",
        "description": "We will make your nails perfect, everyone will look at you. Use the most advanced equipment on the market",
        "owner": "Sapir",
        "country": "Israel",
        "city": "Beer Sheva",
        "address": "mazar binyamin 87",
        "service": "nails",
        "price": 60,
        "averageAppointmentTime": 20,
        "appointmentComfirm": true,
        "field": "Beauty",
        "startTimeTillBrake": 7.25,
        "brakeStartTime": 14.5,
        "breakEndTime": 16.25,
        "endTime": 21.5,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2F%D7%A6%D7%99%D7%A4%D7%95%D7%A8%D7%A0%D7%99%D7%99%D7%9D.jpg?alt=media&token=ad04c94a-c7e1-4e75-bba9-651e91fef54e"
    },
    {
        "days": {
            "Sunday": false,
            "Monday": true,
            "Tuesday": true,
            "Wednesday": true,
            "Thursday": true,
            "Friday": true
        },
        "location": {
            "hight": 0,
            "wight": 0
        },
        "name": "The SWAG Shop",
        "email": "swagshop@gmail.com",
        "password": "swag1234",
        "description": "At The SWAG Shop, getting a haircut is about the experience, not merely an act of maintenance.",
        "owner": "Michael Santiago Render",
        "country": "Georgia",
        "city": "Atlanta ",
        "address": "Edgewood Ave, 365",
        "service": "Hairstyling ",
        "price": 100,
        "averageAppointmentTime": 35,
        "field": "Barber Shop",
        "startTimeTillBrake": 6,
        "endTime": 22,
        "brakeStartTime": 12,
        "breakEndTime": 13,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2Fo.jpg?alt=media&token=913ebc93-3064-474a-9a0b-a8c3961d270d"
    },
    {
        "days": {
            "Sunday": true,
            "Monday": true,
            "Tuesday": true,
            "Wednesday": true,
            "Thursday": true
        },
        "location": {
            "hight": 32.066831,
            "wight": 34.7633005
        },
        "field": "Exterminators",
        "name": "Yoav exterminator",
        "email": "yoav@gmail.com",
        "password": "yoav1234",
        "description": "Stop being scared! No more insects! We'll get rid of all the bugs in your house at the best price!",
        "owner": "Yoav",
        "country": "Germany",
        "city": "Berlin",
        "address": "beralin23",
        "service": "Exterminators",
        "price": 60,
        "averageAppointmentTime": 50,
        "appointmentComfirm": true,
        "startTimeTillBrake": 10.25,
        "brakeStartTime": 14,
        "breakEndTime": 17.25,
        "endTime": 21.5,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2FExterminators.jpg?alt=media&token=9e7af519-c170-4865-a852-80eaac1a3e47"
    },
    {
        "days": {
            "Sunday": true,
            "Monday": true,
            "Wednesday": true,
            "Tuesday": true
        },
        "location": {
            "hight": 32.066831,
            "wight": 34.7633005
        },
        "name": "Yuval Tattoo",
        "email": "yuval@gmail.com",
        "password": "yuval1234",
        "description": "Our body is like a clean canvas. If you would like to fill that canvas with the best art out there, come to our shop and you will not be disappointed  guaranteed!",
        "owner": "Yuval Abulafia",
        "country": "Israel",
        "city": "Tel Aviv",
        "address": "Abarbanel Street 27",
        "service": "Tattoo Artist",
        "field": "Tattoo Artist",
        "price": 40,
        "averageAppointmentTime": 20,
        "appointmentComfirm": true,
        "startTimeTillBrake": 9,
        "brakeStartTime": 14,
        "breakEndTime": 14.5,
        "endTime": 18,
        "img": "https://firebasestorage.googleapis.com/v0/b/smallbiz-6c996.appspot.com/o/images%2FTattoo%20Artist.jpg?alt=media&token=4390ebe6-40df-46f8-ac80-98b2737ee899"
    }
]



setTimeout( async() => {
    // let data = require('../Data/data.json')
    console.log(data)
    for (let d of data) {
        d["price"] = 10
        d["averageAppointmentTime"] = 100
        let b1 = new Business(d)
        let dailySchedule = await getDailySchedule(d)
        let daysOfWork = Object.keys(b1.days)
        console.log(daysOfWork)
        let arr = []
        arr.push({ "regularDay": dailySchedule })
        let x = 0
        for (let i = 0; x < 10; i++) {
            console.log(moment((moment().add(x + i, 'day').format('L'))).format('dddd'))
            if (daysOfWork.find(d => d === moment((moment().add(i, 'day').format('L'))).format('dddd'))) {
                arr.push({ [moment().add(i, 'day').format('L')]: dailySchedule })
                console.log(moment((moment().add(i, 'day').format('L'))).format('dddd'), "is in")
                x++
            }
        }
        b1.availableAppointments = arr
        b1.save()
    }
}, 100)



module.exports = router
