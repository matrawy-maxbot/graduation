function generateId() {
    const now = new Date();
    const timestamp = now.getTime();
    const ProjectTimestamp = 1709416800000; // Date of (2024, 2, 3)
    const id = `${timestamp + ProjectTimestamp}`;
    console.log(ProjectTimestamp);
    return id;
}



export { generateId };