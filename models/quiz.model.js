const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    question: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    a: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    b: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    c: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    d: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    r: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;