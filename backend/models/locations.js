const mongoose = require('mongoose')


const locationSchema = new mongoose.Schema({
    zipcode: {
        type: String,
        // required: [true, "Zipcode must be provided"]
    },
    dateStamp: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('Location', locationSchema)