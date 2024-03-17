import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({

    review: {
        type: String
    },
    reviewerEmail: {
        type: String,
        lowercase: true,
        required: [true, "reviewer email can't be blank"],
    },
    revieweeEmail: {
        type: String,
        lowercase: true,
        required: [true, "reviewee email can't be blank"],
    },
    initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "id of user who created review is required"]
    },
    status: {
        type: String,
        enum: ['pending', 'complete'],
        default: 'pending'
    },
    submittedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const reviewModel = mongoose.model('Review', reviewSchema)

export default reviewModel