import reviewModel from '../../review/model/review.schema.js';
import userModel from '../model/user.schema.js'
import jwt from 'jsonwebtoken'

// Get index page to login
export const getIndex = async (req, res) => {
    res.render('index', { 
        error: null, 
        success: false,
        message: null,
        userEmail: req.email ? req.email : null 
    });
}

// Post Login user
export const postLogin = async (req, res) => {
    
    const { email, password } = req.body
    const user = await userModel.findOne({ email: email, password: password })
    if (!user) {
        return res.render('index', { success: false, error: 'Invalid credentials', message: null })
    }

    // token
    const token = jwt.sign(
        { 
            userID: user._id, 
            email: email, 
            type: user.type
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );
    res.cookie('jwtToken', token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true }); 

    if (user.type === 'admin') {
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/user/dashboard');
    }
}

export const getRegister = async (req, res) => {
    const data = {
        name: '',
        email: '',
        password: '',
        type: ''
    }
    res.render('admin/register', { layout: 'admin_layout', success: false, error: null, data: data, activeLink : 'addUser' })
}

export const postRegister = async (req, res) => {
    try {
        const { name, email, password, type } = req.body;
        const newUser = await userModel.create({ name: name, email: email, password: password, type: type })
        const data = {
            name: '',
            email: '',
            password: '',
            type: ''
        }
        res.render('admin/register', { layout: 'admin_layout', success: true, message: 'User created successfully!', error: null, data: data, activeLink : 'addUser' })

    } catch (error) {
        console.log(error)
        if (error.message.includes('duplicate key error')) {
            return res.render('admin/register', { layout: 'admin_layout', success: false, message: null, error: 'Email already registered', data: req.body, activeLink : 'addUser' })
        }
        res.render('admin/register', { layout: 'admin_layout', success: false, message: null, error: error, data: req.body, activeLink : 'addUser' })
    }
}

export const getDashboard = async (req, res) => {
    console.log( req.type === 'admin' ? true : false)
    res.render('admin/admin-dashboard', { 
        layout: 'admin_layout', 
        activeLink: null, 
        isAdmin: req.type === 'admin' ? true : false
    })
}

export const getAllUsers = async (req, res) => {

    try {
        const users = await userModel.find();
        if(users.length > 0) {
            res.render('admin/all-users', { 
                layout: 'admin_layout', 
                activeLink : 'allUsers', 
                error: null, 
                users: users
            })
        } else {
            return res.render('admin/all-users', { 
                layout: 'admin_layout', 
                activeLink : 'allUsers', 
                error: 'Users not found',
                users: null
            })
        }
    } catch (error) {
        console.log(error)
        return res.render('admin/all-users', { 
            layout: 'admin_layout', 
            activeLink : 'allUsers', 
            error: error,
            users: null
        })
    }
    
}

export const getEditUser = async (req, res) => {

    try {
        const id = req.params.id
        const user = await userModel.findOne({ _id: id })

        if (!user) {
            return res.render('admin/edit-user', { 
                layout: 'admin_layout', 
                activeLink : 'allUsers', 
                success: false, 
                error: 'User not found', 
                message: null,
                data: null
            })
        }

        res.render('admin/edit-user', { 
            layout: 'admin_layout', 
            activeLink : 'allUsers',
            success: false, 
            error: null, 
            message: null ,
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.render('admin/edit-user', { 
            layout: 'admin_layout', 
            activeLink : 'allUsers', 
            success: false,
            error: error,
            message: null,
            data: null
        })
    }
}

export const postEditUser = async (req, res) => {

    try {
        const { id, name, email, password, type } = req.body;
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: id },
            { name: name, email: email, password: password, type: type },
            { runValidators: true, new: true }
        )
        console.log(updatedUser)
        res.render('admin/edit-user', { 
            layout: 'admin_layout', 
            activeLink : 'allUsers',
            success: true, 
            message: 'User updated successfully!' ,
            error: null, 
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        return res.render('admin/edit-user', { 
            layout: 'admin_layout', 
            activeLink : 'allUsers', 
            success: false,
            error: error,
            message: null,
            data: req.body
        })
    }
}


export const deleteUser = async (req, res) => {

    try {
        const id = req.params.id
        await userModel.findOneAndDelete({_id: id})
        res.redirect('/admin/user/all')
    } catch (error) {
        console.log(error)
        res.redirect('/admin/user/all')
    }
}

export const logout = async (req, res) => {
    res.clearCookie("jwtToken")
    res.redirect('/')
}

export const getUserDashboard = async (req, res) => {
    
    try {
        const pendingReviews = await reviewModel.find({ reviewerEmail: req.email, status: 'pending'});
        if(pendingReviews.length > 0) {
            res.render('user/user-dashboard', { 
                error: null, 
                data: pendingReviews,
                userEmail: req.email ? req.email : null 
            })
        } else {
            return res.render('user/user-dashboard', { 
                error: 'No pending reviews found',
                data: null,
                userEmail: req.email ? req.email : null 
            })
        }
    } catch (error) {
        console.log(error)
        return res.render('user/user-dashboard', { 
            error: error,
            data: null,
            userEmail: req.email ? req.email : null 
        })
    }
}