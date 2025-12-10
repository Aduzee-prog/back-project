const mongoose = require('mongoose')

let campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Campaign title is required!'],
        trim: true,
    },

    description: {
        type: String,
        required: [true, 'Campaign description is required!'],
    },

    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ngo',
        required: [true, 'NGO ID is required!'],
    },

    goalAmount: {
        type: Number,
        required: [true, 'Goal amount is required!'],
        min: 1,
    },

    raisedAmount: {
        type: Number,
        default: 0,
        min: 0,
    },

    status: {
        type: String,
        enum: ['pending', 'active', 'rejected'],
        default: 'pending',
    },

    donors: [
        {
            donorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'donor',
            },
            amount: {
                type: Number,
                required: true,
                min: 1,
            },
            donatedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    totalDonorsCount: {
        type: Number,
        default: 0,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    approvedAt: {
        type: Date,
        default: null,
    },

    rejectionReason: {
        type: String,
        default: null,
    },
})

module.exports = mongoose.model('campaign', campaignSchema)
