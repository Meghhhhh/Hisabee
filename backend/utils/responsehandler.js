const handleResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status,
        success: status < 400,
        message,
        data
    })
}

export default handleResponse;