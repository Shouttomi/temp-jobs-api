
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  let customError = {
    //setting defaults if values are not there

    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  

  if (err.code && err.code === 11000) {

    //this gives us array of keys for the object
    //Object.keys(err.keyValue)
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    
    customError.statusCode = 400
  }

  if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map((item)=> item.message).join(',')
   customError.statusCode = 400
  }
  
  if(err.name === 'CastError'){
    customError.msg = `no item found with id: ${err.value}`
    customError.statusCode = 404
  }

  
 /*  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }) */
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
