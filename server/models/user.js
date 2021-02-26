import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
    {
        name:{type: String, required: true},
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password:{type: String, required: true},
        mobile: {type: String},
        nationality: {type: String},
        admin: {type: Boolean, required: true, default: false}
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema)
export default User