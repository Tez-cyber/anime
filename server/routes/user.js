import express from 'express'
const router = express.Router()
import {
    registerUser,
    authUser,
    getUsers,
    getUserProfile,
    updateUserProfile
} from '../controllers/user_controller.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(protect, admin, getUsers).post(registerUser)
router.post('/login', authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

export default router
