// module.exports = (fn) => {
//     return (req,res,next) =>{
//         fn(req,res,next).catch(next);
//     };
// };



module.exports = (fn) => {
    if (typeof fn !== "function") {
        console.error("wrapasync received a non-function!", fn);
        throw new Error("wrapasync expected a function");
    }
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
