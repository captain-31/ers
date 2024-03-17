import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "can't be blank"],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        unique: true
    },
    type: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee'
    },
    password: {
        type: String,
        required: [true, "can't be blank"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const userModel = mongoose.model('User', userSchema)

export default userModel