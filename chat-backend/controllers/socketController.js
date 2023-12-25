const createError = require("http-errors");
module.exports = {
    authorizeUser : (socket,next)=>{
        if(!socket.request.session || !socket.request?.session?.user){
            console.log("Bad request");
            return next(createError(401,"Not authorized!"))
        }
        next();
    }
}