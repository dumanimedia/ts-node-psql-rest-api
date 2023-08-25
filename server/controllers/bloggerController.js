import asyncHandler from 'express-async-handler';
const fetchAllBloggers = asyncHandler(async (req, res) => {
    res.json('Get All bloggers');
});
export { fetchAllBloggers };
//# sourceMappingURL=bloggerController.js.map