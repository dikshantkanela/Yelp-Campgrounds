const catchAsync =  (fn)=> (req,res,next)=>{
    return fn(req,res,next).catch(next((e)=>e));
}

module.exports = catchAsync;