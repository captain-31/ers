import jwt from 'jsonwebtoken'
import '../../env.js'

const jwtAuth = (req, res, next) => {

    // 1. Read the token
    // const token = req.headers['authorization']
    // console.log(token)
    // // 2. If no token, return the error
    // if (!token) {
    //     console.log(1)
    //     return res.render('index', { error: null, success: false, message: null })
    //     // return res.status(401).send('Unauthorized')
    // }

    // // 3. check if token is valid
    // try {
    //     const payload = jwt.verify(token, process.env.JWT_SECRET)
    //     req.userId = payload.userID
    //     req.type = payload.type    
    //     if(req.type !== 'admin') {
    //         return res.render('index', { error: 'admin access required', success: false, message: null })
    //     }
    //     // console.log(payload)
    // } catch (error) {
    //     // 4. return error
    //     return res.render('index', { error: null, success: false, message: null })
    // }

    // // 5. call next middleware
    // next()
    // 1. Read the cookie header
    const cookieHeader = req.headers.cookie;
    
    // 2. If no cookie header, return error
    if (!cookieHeader) {
        return res.status(401).render('index', { error: 'No token provided', success: false, message: null });
    }
    
    // 3. Extract JWT token from cookie
    const cookies = cookieHeader.split(';').reduce((cookiesObject, cookie) => {
        const [key, value] = cookie.trim().split('=');
        cookiesObject[key] = value;
        return cookiesObject;
    }, {});
    
    const token = cookies.jwtToken;
    // console.log(token)

    // 4. If no token in cookie, return error
    if (!token) {
        return res.status(401).render('index', { error: 'No token provided', success: false, message: null });
    }

    // 5. Verify the JWT token
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userID;
        req.type = payload.type;
        req.email = payload.email;
        // if(req.type === 'employee') {
        //     res.render('user/dashboard')
        // }
        if (req.type !== 'admin') {
            if(req.type !== 'employee') {
                return res.render('index', { error: 'Admin access required', success: false, message: null });
            }
        }
    } catch (error) {
        // If token is invalid, return error
        return res.render('index', { error: 'Invalid token', success: false, message: null });
    }

    // 6. Call next middleware
    next();

}

export default jwtAuth