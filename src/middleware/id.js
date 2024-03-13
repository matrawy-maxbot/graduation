function generateId() {
    const now = new Date();
    const timestamp = now.getTime();
    const ProjectTimestamp = 1709416800000; // Date of (2024, 2, 3)
    const id = `${timestamp + ProjectTimestamp}`;
    console.log(ProjectTimestamp);
    return id;
}

function generateFileName(type) {
    const now = new Date();
    const timestamp = now.getTime();
    const ProjectTimestamp = 1709416800000; // Date of (2024, 2, 3)
    const random = 1000 + Math.floor(Math.random() * 8999);
    const id = `${type}${timestamp + ProjectTimestamp}${random}`;
    console.log(ProjectTimestamp);
    return id;
}

export { generateId, generateFileName };