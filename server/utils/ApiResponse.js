// utils/ApiResponse.js
const ApiResponse = {
    success: (res, data, message, statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },
// Response for error
    error: (res, message, statusCode = 500, error) => {
        return res.status(statusCode).json({
            success: false,
            message,
            error
        });
    }
};

module.exports = ApiResponse;
