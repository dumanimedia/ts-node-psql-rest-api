import asyncHandler from 'express-async-handler';
const notFound = asyncHandler(async (req, res, next) => {
    res.status(404);
    throw new Error(`Route not found - ${req.originalUrl}`);
});
async function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err.message;
    const stack = process.env.NODE_ENV === 'development' ? err.stack : '';
    res.status(statusCode).json({
        message,
        stack,
    });
}
export { notFound, errorHandler };
//# sourceMappingURL=middleware.js.map