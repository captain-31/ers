import express from 'express'
import { 
    addReview, getAllReviews, getEditReview, postAddReview, postEditReview, getAssignReview, postAssignReview, getUserAddReview, postUserAddReview
} from '../controller/review.controller.js'
import jwtAuth from '../../../middlewares/jwt.middleware.js'


const reviewRouter = express.Router()

// user routes
reviewRouter.get('/user/review/:id', jwtAuth, getUserAddReview)
reviewRouter.post('/user/review/add', jwtAuth, postUserAddReview)

// admin routes
reviewRouter.get('/admin/review/add', jwtAuth, addReview)
reviewRouter.post('/admin/review/add', jwtAuth, postAddReview)
reviewRouter.get('/admin/review/all', jwtAuth, getAllReviews)

reviewRouter.get('/admin/review/edit/:id', jwtAuth, getEditReview)
reviewRouter.post('/admin/review/edit/', jwtAuth, postEditReview)
reviewRouter.get('/admin/review/assign', jwtAuth, getAssignReview)
reviewRouter.post('/admin/review/assign/', jwtAuth, postAssignReview)




export default reviewRouter