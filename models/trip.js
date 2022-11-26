const {Schema, model} = require('mongoose')

const TripShema = new Schema({
    fromCity: {
        type: String,
        required: true
    },
    toCity: {
        type: String,
        required: true
    },
    timeStart: {
        type: Date,
        required: true
    },
    timeArrive: {
        type: Date,
        required: true
    },
    ticketCost: {
        type: Number,
        required: true
    }
})

module.exports = model('Trip', TripShema)