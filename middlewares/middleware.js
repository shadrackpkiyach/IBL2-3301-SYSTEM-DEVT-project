
/**
 * Middleware function that checks if the user is logged in.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function in the chain.
 * @return {undefined} If the user is logged in, calls the next middleware function. Otherwise, returns a 401 status code.
 */

const isLoggedIn = async(req, res, next) => {
    if(req.user){
        return next()
    }       return res.status(401)
    
}
/**

* @function notLoggedIn
 * @param {Object} req - Express request object
@param {Object} res - Express response object
@param {function} next - Express next middleware function
@returns {function|Object} If the user is not logged in, calls the next middleware function. If the user is logged in, sends a 402 status code in the response.
*/
const notLoggedIn = async(req, res, next) => {
    if(!req.user) {
        return next()
    }  return res.status(402)
}
/**
*

@param {Object} req - The request object
@param {Object} res - The response object
@param {function} next - The next middleware function in the chain
@returns {function|Object} next() if the user is verified, else returns a 403 status code
*/
//prevents an unverified user from accessing '/home'
const isVerified = async(req, res, next) => {
    if(req.session.verified){
        return next()
    }  return res.status(403)
}

/**

@function
@async
Middleware function that checks if the user's session has been verified.
If not, the next middleware function is called. If the session has been verified, a 404 status is returned.
@param {Object} req - The request object
@param {Object} res - The response object
@param {function} next - The next middleware function
*/
//prevent verified User from accessing '/verify'
const notVerified = async(req, res, next) => {
    if(!req.session.verified){
        return next()
    }  return res.status(404)
}


module.exports = {
    isLoggedIn,
    isVerified,
    notVerified,
    notLoggedIn
}