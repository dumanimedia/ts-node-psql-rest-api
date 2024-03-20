import asyncHandler from "express-async-handler";
const getHomeResponse = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: "This is the get route's Response on the home route",
    });
});
export default {
    getHomeResponse,
};
