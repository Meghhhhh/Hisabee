const handleResponse = (res, status, success, message, data = null) => {
    return res.status(status).json({
        status,
        success,
        message,
        data
    })
}

export default handleResponse;