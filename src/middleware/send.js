const send = (status, res, message = "success", data = {}, exceptData = []) => {
    if (exceptData.length > 0) {
        Object.keys(data).forEach(key => {
            if (exceptData.includes(key)) delete data[key];
        });
    }
    res.status(status).write(Object.keys(data).length > 0 ? JSON.stringify({ message: message, data: data }) : JSON.stringify({ message: message }));
    res.end();
}

// example usage
// send(200, res, "User found", user, ['pass']);

export { send };