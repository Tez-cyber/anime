import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password, mobile, nationality} = req.body
  
    const userExists = await User.find({ $or : [{username}, {email}]})
  
    if (userExists.length > 0) {
      res.status(400)
      throw new Error('User already exists')
    }
    
    let hashPass = await bcrypt.hash(password, 10)
    const user = await User.create({
        name,
        email,
        password: hashPass,
        username,
        mobile,
        nationality
    })
  
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        })
    }else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
  
    const user = await User.findOne({ email })
    if(user){
        let validUser = await bcrypt.compare(password, user.password)
        if(validUser){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                mobile: user.mobile,
                nationality: user.nationality,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })
        }else{
            res.status(401)
            throw new Error('Invalid email or password')
        }
    }else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
  
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            username: user.username,
            nationality: user.nationality,
            isAdmin: user.isAdmin,
        })
    }else {
        res.status(404)
        throw new Error('User not found')
    }
})
  
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
  
    if (user) {
        user.name = req.body.name || user.name
        user.username = req.body.username || user.username
        user.mobile = req.body.mobile || user.mobile
        user.nationality = req.body.nationality || user.nationality
  
        const updatedUser = await user.save()
  
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            nationality: updatedUser.nationality,
            token: generateToken(updatedUser._id),
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})
  
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find({})
  
    res.json({ users})
})  

export {
    registerUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    getUsers
}