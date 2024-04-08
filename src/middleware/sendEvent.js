import env from '../config/index.js';

const sendEvent = (event, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            fetch('http://localhost:8080/sendEventWS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'wsAuth': 'Bearer ' + env.websocketToken,
                    'Event': event
                },
                body: JSON.stringify(data)
            }).then(function (response) {
                if(response.status >= 200 && response.status < 300) {
                    console.log("the Fetch has been sent successfully");
                    resolve(true);
                } else {
                    reject(response);
                }
                console.log("the Fetch response : ", (response.status >= 200 && response.status < 300) ? "success" : "error");
            })
            .catch(function (error) {
                throw error;
            });
        } catch (err) {
            console.error("the Fetch error : ", err);
            reject(false);
        }
    });
};

export { sendEvent };