import { Database } from './database.js';

const dbClient = new Database('localhost', 'root', '', 'graduation_project');

const DBselect = async (table, columns, condition, add_query) => {
    try {

        // Example usage:
        /*
        table = 'your_table';
        columns = ['column1', 'column2'];
        condition = { id: 1 };
        add_query = 'ORDER BY column1 DESC';
        */

        const result = await dbClient.select(table, columns, condition, add_query);
        return result;
    } catch (error) {
        console.error('Error selecting:', error);
    }
}

const DBinsert = async (table, data, add_query) => {
    try {

        // Example usage:
        /*
        table = 'your_table';
        data = {
            column1: 'value1',
            column2: 'value2',
            // Add more columns and values as needed
        };
        add_query = 'ON DUPLICATE KEY UPDATE column1 = VALUES(column1)'; // Optional additional query
        */

        await dbClient.insert(table, data, add_query);
        return true;
    } catch (error) {
        console.error('Error selecting:', error);
    }
}

const DBupdate = async (table, data, condition, add_query) => {
    try {

        // Example usage:
        /*
        table = 'your_table';
        data = {
            column1: 'new_value',
            // Add more columns and values as needed
        };
        condition = {
            id: 1, // Specify the condition for the WHERE clause
        };
        add_query = 'LIMIT 1'; // Optional additional query
        */

        await dbClient.update(table, data, condition, add_query);
        return true;
    } catch (error) {
        console.error('Error selecting:', error);
    }
}

const DBdelete = async (table, condition, add_query) => {
    try {

        // Example usage:
        /*
        table = 'your_table';
        condition = {
            id: 1, // Specify the condition for the WHERE clause
        };
        add_query = 'LIMIT 1';
        */

        await dbClient.delete(table, condition, add_query);
        return true;
    } catch (error) {
        console.error('Error selecting:', error);
    }
}

const DBquery = async (sql, values) => {
    try {

        // Example usage:
        /*
        sql = 'SELECT * FROM your_table WHERE id = ?';
        values = [1];
        */

        const q = await dbClient.query(sql, values);
        return q;
    } catch (error) {
        console.error('Error selecting:', error);
    }
}

const DBinit = async () => {
    try {

        const databaseName = "testGraduation";
        let sql = `
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`admins\` (
            \`id\` varchar(100) NOT NULL,
            \`name\` varchar(55) NOT NULL,
            \`phone\` varchar(20) NOT NULL,
            \`pass\` varchar(50) NOT NULL,
            \`avatar\` varchar(50) DEFAULT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`admins\` ADD PRIMARY KEY (\`id\`), ADD UNIQUE KEY \`phone\` (\`phone\`);
        
        INSERT INTO \`${databaseName}\`.\`admins\`(\`id\`, \`name\`, \`phone\`, \`pass\`, \`avatar\`, \`created_at\`) SELECT \`id\`, \`name\`, \`phone\`, \`pass\`, \`avatar\`, \`created_at\` FROM \`graduation_project\`.\`admins\`;
        
        
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`appointments\` (
            \`id\` varchar(100) NOT NULL,
            \`name\` varchar(55) NOT NULL,
            \`phone\` varchar(20) NOT NULL,
            \`age\` int(2) NOT NULL,
            \`sex\` int(1) NOT NULL DEFAULT 0 COMMENT \'0 for Male, 1 for Female\',
            \`city\` varchar(30) NOT NULL,
            \`description\` mediumtext DEFAULT NULL,
            \`photos\` varchar(1000) DEFAULT NULL,
            \`owner_id\` varchar(100) NOT NULL,
            \`doctor_id\` varchar(100) NOT NULL,
            \`department\` int(2) NOT NULL,
            \`app_date\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`appointments\` ADD PRIMARY KEY (\`id\`);
        
        INSERT INTO \`${databaseName}\`.\`appointments\`(\`id\`, \`name\`, \`phone\`, \`age\`, \`sex\`, \`city\`, \`description\`, \`photos\`, \`owner_id\`, \`doctor_id\`, \`department\`, \`app_date\`, \`created_at\`) SELECT \`id\`, \`name\`, \`phone\`, \`age\`, \`sex\`, \`city\`, \`description\`, \`photos\`, \`owner_id\`, \`doctor_id\`, \`department\`, \`app_date\`, \`created_at\` FROM \`graduation_project\`.\`appointments\`;
        
        
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`chat\` (
            \`id\` varchar(50) NOT NULL,
            \`source\` varchar(50) NOT NULL,
            \`destination\` varchar(50) NOT NULL,
            \`content\` text DEFAULT NULL,
            \`file\` varchar(200) DEFAULT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`chat\` ADD PRIMARY KEY (\`id\`);
        
        INSERT INTO \`${databaseName}\`.\`chat\`(\`id\`, \`source\`, \`destination\`, \`content\`, \`file\`, \`created_at\`) SELECT \`id\`, \`source\`, \`destination\`, \`content\`, \`file\`, \`created_at\` FROM \`graduation_project\`.\`chat\`;
        
        
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`doctors\` (
            \`id\` varchar(100) NOT NULL,
            \`name\` varchar(55) NOT NULL,
            \`phone\` varchar(20) NOT NULL,
            \`pass\` varchar(50) NOT NULL,
            \`avatar\` varchar(50) DEFAULT NULL,
            \`speciality\` int(2) NOT NULL,
            \`expertment\` varchar(20) NOT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`doctors\` ADD PRIMARY KEY (\`id\`), ADD UNIQUE KEY \`phone\` (\`phone\`);
        
        INSERT INTO \`${databaseName}\`.\`doctors\`(\`id\`, \`name\`, \`phone\`, \`pass\`, \`avatar\`, \`speciality\`, \`expertment\`, \`created_at\`) SELECT \`id\`, \`name\`, \`phone\`, \`pass\`, \`avatar\`, \`speciality\`, \`expertment\`, \`created_at\` FROM \`graduation_project\`.\`doctors\`;
        
        
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`notifications\` (
            \`id\` varchar(50) NOT NULL,
            \`source\` varchar(50) NOT NULL,
            \`destination\` varchar(50) NOT NULL,
            \`content\` text NOT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`notifications\` ADD PRIMARY KEY (\`id\`);
        
        INSERT INTO \`${databaseName}\`.\`notifications\`(\`id\`, \`source\`, \`destination\`, \`content\`, \`created_at\`) SELECT \`id\`, \`source\`, \`destination\`, \`content\`, \`created_at\` FROM \`graduation_project\`.\`notifications\`;
        
        
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`ratings\` (
            \`id\` int(11) NOT NULL,
            \`doctor_id\` varchar(50) NOT NULL,
            \`user_id\` varchar(50) NOT NULL,
            \`rating\` tinyint(1) NOT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`ratings\` ADD PRIMARY KEY (\`id\`);
        
        ALTER TABLE \`${databaseName}\`.\`ratings\` MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8 ;
        
        INSERT INTO \`${databaseName}\`.\`ratings\`(\`id\`, \`doctor_id\`, \`user_id\`, \`rating\`, \`created_at\`) SELECT \`id\`, \`doctor_id\`, \`user_id\`, \`rating\`, \`created_at\` FROM \`graduation_project\`.\`ratings\`;
        
        
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`report\` (
            \`id\` varchar(50) NOT NULL,
            \`doctor_id\` varchar(50) NOT NULL,
            \`appointment_id\` varchar(50) NOT NULL,
            \`user_id\` varchar(50) NOT NULL,
            \`diagnosis\` text DEFAULT NULL,
            \`reasons\` text DEFAULT NULL,
            \`advices\` text DEFAULT NULL,
            \`medicines\` text DEFAULT NULL,
            \`treatments\` text DEFAULT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`report\` ADD PRIMARY KEY (\`id\`);
        
        INSERT INTO \`${databaseName}\`.\`report\`(\`id\`, \`doctor_id\`, \`appointment_id\`, \`user_id\`, \`diagnosis\`, \`reasons\`, \`advices\`, \`medicines\`, \`treatments\`, \`created_at\`) SELECT \`id\`, \`doctor_id\`, \`appointment_id\`, \`user_id\`, \`diagnosis\`, \`reasons\`, \`advices\`, \`medicines\`, \`treatments\`, \`created_at\` FROM \`graduation_project\`.\`report\`;
        
        
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`schedules\` (
            \`doctor_id\` varchar(50) NOT NULL,
            \`sunday\` varchar(12) DEFAULT NULL,
            \`monday\` varchar(12) DEFAULT NULL,
            \`tuesday\` varchar(12) DEFAULT NULL,
            \`wednesday\` varchar(12) DEFAULT NULL,
            \`thursday\` varchar(12) DEFAULT NULL,
            \`friday\` varchar(12) DEFAULT NULL,
            \`saturday\` varchar(12) DEFAULT NULL
        );
        
        ALTER TABLE \`${databaseName}\`.\`schedules\` ADD PRIMARY KEY (\`doctor_id\`);
        
        INSERT INTO \`${databaseName}\`.\`schedules\`(\`doctor_id\`, \`sunday\`, \`monday\`, \`tuesday\`, \`wednesday\`, \`thursday\`, \`friday\`, \`saturday\`) SELECT \`doctor_id\`, \`sunday\`, \`monday\`, \`tuesday\`, \`wednesday\`, \`thursday\`, \`friday\`, \`saturday\` FROM \`graduation_project\`.\`schedules\`;
        
        
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`users\` (
            \`id\` varchar(100) NOT NULL,
            \`name\` varchar(55) NOT NULL,
            \`phone\` varchar(20) NOT NULL,
            \`pass\` varchar(50) NOT NULL,
            \`avatar\` varchar(50) DEFAULT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`users\` ADD PRIMARY KEY (\`id\`), ADD UNIQUE KEY \`phone\` (\`phone\`);
        
        INSERT INTO \`${databaseName}\`.\`users\`(\`id\`, \`name\`, \`phone\`, \`pass\`, \`avatar\`, \`created_at\`) SELECT \`id\`, \`name\`, \`phone\`, \`pass\`, \`avatar\`, \`created_at\` FROM \`graduation_project\`.\`users\`;
        `;

        await dbClient.query('CREATE DATABASE IF NOT EXISTS ' + databaseName);
        sql = await dbClient.escape(sql.replace(/\n/g, "").replace(/\s+/g, " "));
        sql = sql.slice(1, -1).replace(/\\/g, "");
        await dbClient.query(sql, [], true);
        return true;
    } catch (error) {
        console.error('Error selecting:', error);
    }
}

export { DBquery, DBselect, DBinsert, DBupdate, DBdelete, DBinit};
