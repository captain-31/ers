import reviewModel from "../model/review.schema.js";

export const addReview = async (req, res) => {
    // console.log(req.session.email)
    const data = {
        revieweeEmail: '',
        review: '',
        initiatedBy: req.userId,
        reviewerEmail: req.email
    }
    // console.log(data)
    res.render('admin/add-review', { 
        layout: 'admin_layout', 
        success: false, 
        error: null, 
        data: data, 
        activeLink : 'addReview' 
    })
}

export const postAddReview = async (req, res) => {
    
    console.log(req.body)

    try {
        const { initiatedBy, reviewerEmail, revieweeEmail, review } = req.body;
        const newReview = await reviewModel.create({ 
            review: review, 
            reviewerEmail: reviewerEmail, 
            revieweeEmail: revieweeEmail, 
            initiatedBy: initiatedBy,
            status: 'complete',
            submittedAt: Date.now()
        })

        const data = {
            initiatedBy: initiatedBy,
            reviewerEmail: reviewerEmail,
            revieweeEmail: '',
            review: ''
        }
        res.render('admin/add-review', { 
            layout: 'admin_layout', 
            success: true, 
            message: 'Review added successfully!', 
            error: null, 
            data: data, 
            activeLink : 'addReview' 
        })

    } catch (error) {
        console.log(error)
        res.render('admin/add-review', { 
            layout: 'admin_layout', 
            success: false, 
            message: null, 
            error: error, 
            data: req.body, 
            activeLink : 'addReview' 
        })
    }
}

export const getAllReviews = async (req, res) => {

    try {
        const reviews = await reviewModel.find();
        if(reviews.length > 0) {
            res.render('admin/all-reviews', { 
                layout: 'admin_layout', 
                activeLink : 'allReviews', 
                error: null, 
                reviews: reviews
            })
        } else {
            return res.render('admin/all-reviews', { 
                layout: 'admin_layout', 
                activeLink : 'allReviews', 
                error: 'Users not found',
                reviews: null
            })
        }
    } catch (error) {
        console.log(error)
        return res.render('admin/all-reviews', { 
            layout: 'admin_layout', 
            activeLink : 'allReviews', 
            error: error,
            reviews: null
        })
    }
    
}

export const getEditReview = async (req, res) => {

    try {
        const id = req.params.id
        const review = await reviewModel.findOne({ _id: id })
        console.log(review)

        if (!review) {
            return res.render('admin/edit-review', { 
                layout: 'admin_layout', 
                activeLink : 'allReviews', 
                success: false, 
                error: 'Review not found', 
                message: null,
                data: null
            })
        }

        res.render('admin/edit-review', { 
            layout: 'admin_layout', 
            activeLink : 'allReviews',
            success: false, 
            error: null, 
            message: null ,
            data: review
        })
    } catch (error) {
        console.log(error)
        return res.render('admin/edit-review', { 
            layout: 'admin_layout', 
            activeLink : 'allReviews', 
            success: false,
            error: error,
            message: null,
            data: null
        })
    }
}

export const postEditReview = async (req, res) => {

    try {
        const { id , review  } = req.body;
        const updatedReview = await reviewModel.findOneAndUpdate(
            { _id: id },
            { review: review },
            { runValidators: true, new: true }
        )
        console.log(updatedReview)
        res.render('admin/edit-review', { 
            layout: 'admin_layout', 
            activeLink : 'allReviews',
            success: true, 
            message: 'Review updated successfully!' ,
            error: null, 
            data: updatedReview
        })
    } catch (error) {
        console.log(error)
        return res.render('admin/edit-review', { 
            layout: 'admin_layout', 
            activeLink : 'allReviews', 
            success: false,
            error: error,
            message: null,
            data: req.body
        })
    }
}

export const getAssignReview = async (req, res) => {
    
    const data = {
        revieweeEmail: '',
        reviewerEmail: '',
        initiatedBy: req.userId
    }

    res.render('admin/assign-review', { 
        layout: 'admin_layout', 
        success: false, 
        error: null, 
        data: data, 
        activeLink : 'assignReview' 
    })
}



export const postAssignReview = async (req, res) => {
    try {
        const { initiatedBy, reviewerEmail, revieweeEmail } = req.body;
        const newReview = await reviewModel.create({ 
            initiatedBy: initiatedBy, 
            reviewerEmail: reviewerEmail, 
            revieweeEmail: revieweeEmail,
            status: 'pending'
         })
        const data = {
            initiatedBy: initiatedBy,
            reviewerEmail: '',
            revieweeEmail: ''
        }
        res.render('admin/assign-review', { 
            layout: 'admin_layout', 
            success: true, 
            message: 'Review assigned successfully!', 
            error: null, 
            data: data, 
            activeLink : 'assignReview' 
        })

    } catch (error) {
        console.log(error)
        return res.render('admin/assign-review', { 
            layout: 'admin_layout', 
            success: false,
            error: error,
            message: null,
            data: req.body, 
            activeLink : 'assignReview' 
        })
    }
}

export const getUserAddReview = async (req, res) => {

    try {
        const id = req.params.id
        const review = await reviewModel.findOne({ _id: id })
        console.log(review)
        if (!review) {
            return res.render('user/review-user', { 
                success: false, 
                error: 'Review not found',
                message: null,
                data: null,
                userEmail: req.email ? req.email : null 
            })
        }
        res.render('user/review-user', { 
            success: false, 
            error: null, 
            message: null ,
            data: review,
            userEmail: req.email ? req.email : null 
        })
    } catch (error) {
        console.log(error)
        return res.render('user/review-user', { 
            success: false,
            error: error,
            message: null,
            data: null,
            userEmail: req.email ? req.email : null 
        })
    }

}

export const postUserAddReview = async (req, res) => {
    try {
        const { id , review  } = req.body;
        const updatedReview = await reviewModel.findOneAndUpdate(
            { _id: id },
            { review: review, status: 'complete', submittedAt:Date.now()  },
            { runValidators: true, new: true }
        )
        console.log(updatedReview)
        res.render('user/review-user', {
            success: true, 
            message: 'Review added successfully!' ,
            error: null, 
            data: updatedReview,
            userEmail: req.email ? req.email : null 
        })
    } catch (error) {
        console.log(error)
        return res.render('user/review-user', { 
            success: false,
            error: error,
            message: null,
            data: req.body,
            userEmail: req.email ? req.email : null 
        })
    }
}