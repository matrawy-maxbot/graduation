import bcrypt from 'bcrypt';

async function hash(data, saltRounds = 10) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await bcrypt.hash(data, saltRounds);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    }); 
}

async function compare(data, hash) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await bcrypt.compare(data, hash);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

export { hash, compare };