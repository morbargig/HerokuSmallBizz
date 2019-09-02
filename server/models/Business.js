const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BusinessSchema = new Schema({
    name: String,
    email: String,
    password: String,
    description: String,
    img: String,
    owner: String,
    // payment: String,
    appointmentComfirm: Boolean,
    country: String,
    city: String,
    location : Object,
    address: String,
    field: String,
    service: String,
    price: Number,
    averageAppointmentTime: Number,
    rating: Number,
    days: {
        type: {},
        default: { sunday: false, monday: false, thusday: false, wednesday: false, thursday: false, friday: false, saturday: false }
    },
    startTimeTillBrake: Number,
    brakeStartTime: Number,
    breakEndTime: Number,
    endTime: Number,
    availableAppointments: { type: Array, default: [{ key: "value" }] },
    // image : String
})

const Business = mongoose.model("Business", BusinessSchema)
module.exports = Business

