const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AppointmentSchema = new Schema({
    userId: String,
    businessId: String,
    // userId: { type: Schema.Types.ObjectId, ref: 'User' },
    // businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
    date: String,
    time: String,
    rating: Number,
    appointmentComfirm: Boolean,
})

const Appointment = mongoose.model("Appointment", AppointmentSchema)
module.exports = Appointment







