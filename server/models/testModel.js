const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    id: String,
    text: String
});

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [optionSchema],
    correctOptionId: String,
    explanation: String,
    tags: [String]
});

const testSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    examType: String,
    organization: String,
    metadata: mongoose.Schema.Types.Mixed,
    questions: [questionSchema],
    status: { type: String, enum: ['pending','ready','failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
