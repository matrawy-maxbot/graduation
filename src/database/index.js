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

const DBupdate = async (table, data, condition, conditionMulti = "AND", add_query) => {
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

        await dbClient.update(table, data, condition, conditionMulti, add_query);
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

        const databaseName = "graduation_project";
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
        
        INSERT INTO \`${databaseName}\`.\`admins\` (id, name, phone, pass, avatar) 
        VALUES 
        (12345, 'Alice Johnson', '+1234567890', 'alice_pass123', 'https://example.com/alice_avatar.jpg'),
        (54321, 'Bob Smith', '+1987654321', 'bob_password!', 'https://example.com/bob_avatar.jpg'),
        (98765, 'Emily Davis', '+1122334455', 'emily1234', 'https://example.com/emily_avatar.jpg'),
        (24680, 'Michael Brown', '+5555555555', 'mike_pass_123', 'https://example.com/michael_avatar.jpg'),
        (13579, 'Sophia Wilson', '+9876543210', 'sophiaPass!', 'https://example.com/sophia_avatar.jpg');

        
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
        
        INSERT INTO \`${databaseName}\`.\`appointments\` (id, name, phone, age, sex, city, description, photos, owner_id, doctor_id, department, app_date) 
        VALUES 
        (1001, 'John Doe', '+1234567890', 35, 0, 'New York', 'Regular check-up', 'https://example.com/photo1.jpg,https://example.com/photo2.jpg', 24601, 13579, 0, '2024-03-03'),
        (1002, 'Jane Smith', '+1987654321', 28, 1, 'Los Angeles', 'Allergic reactions', 'https://example.com/photo3.jpg', 13579, 98765, 1, '2024-03-04'),
        (1003, 'Michael Johnson', '+1122334455', 45, 0, 'Chicago', 'Back pain issues', 'https://example.com/photo4.jpg', 98765, 54321, 2, '2024-03-05'),
        (1004, 'Emily Brown', '+5555555555', 20, 1, 'Houston', 'Dental consultation', 'https://example.com/photo5.jpg,https://example.com/photo6.jpg', 54321, 24680, 3, '2024-03-06'),
        (1005, 'David Wilson', '+9876543210', 50, 0, 'San Francisco', 'Vision problems', 'https://example.com/photo7.jpg', 12345, 12345, 4, '2024-03-07');


        
         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`chat\` (
            \`id\` varchar(50) NOT NULL,
            \`source\` varchar(50) NOT NULL,
            \`destination\` varchar(50) NOT NULL,
            \`content\` text DEFAULT NULL,
            \`file\` varchar(200) DEFAULT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`chat\` ADD PRIMARY KEY (\`id\`);        
        
        INSERT INTO \`${databaseName}\`.\`chat\` (id, source, destination, content, file) 
        VALUES 
          (2001, 12345, 13579, 'Hi Elena, I would like to schedule an appointment for next week.', NULL),
          (2002, 54321, 24680, 'Dr. Wilson, could you please review my latest test results?', 'attachment1.pdf'),
          (2003, 98765, 24601, 'Laura, can you confirm my appointment time for tomorrow?', NULL),
          (2004, 13579, 54321, 'Bob, I need to reschedule our meeting to Friday afternoon.', NULL),
          (2005, 24680, 12345, 'Alice, could you provide me with more details about the upcoming event?', NULL);

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
        
        INSERT INTO \`${databaseName}\`.\`doctors\` (id, name, phone, pass, avatar, speciality, expertment) 
        VALUES 
          (13579, 'Elena Rodriguez', '+1122334455', 'elena_pass123', 'https://example.com/elena_avatar.jpg', 'Computer Science', 'Machine Learning'),
          (98765, 'Daniel Garcia', '+1234567890', 'daniel_password!', 'https://example.com/daniel_avatar.jpg', 'Electrical Engineering', 'Robotics'),
          (54321, 'Sophie Clark', '+1987654321', 'sophie1234', 'https://example.com/sophie_avatar.jpg', 'Biotechnology', 'Genetic Engineering'),
          (24680, 'James Wilson', '+5555555555', 'james_pass_123', 'https://example.com/james_avatar.jpg', 'Medicine', 'Clinical Trials'),
          (12345, 'Isabella Brown', '+9876543210', 'isabellaPass!', 'https://example.com/isabella_avatar.jpg', 'Physics', 'Quantum Mechanics');
        

         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`notifications\` (
            \`id\` varchar(50) NOT NULL,
            \`source\` varchar(50) NOT NULL,
            \`destination\` varchar(50) NOT NULL,
            \`content\` text NOT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`notifications\` ADD PRIMARY KEY (\`id\`);        
        
        INSERT INTO \`${databaseName}\`.\`notifications\` (id, source, destination, content) 
        VALUES 
        (3001, 12345, 13579, 'Hi Elena, I would like to schedule an appointment for next week.'),
        (3002, 54321, 24680, 'Dr. Wilson, could you please review my latest test results?'),
        (3003, 98765, 24601, 'Laura, can you confirm my appointment time for tomorrow?'),
        (3004, 13579, 54321, 'Bob, I need to reschedule our meeting to Friday afternoon.'),
        (3005, 24680, 12345, 'Alice, could you provide me with more details about the upcoming event?');


         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`ratings\` (
            \`id\` int(11) NOT NULL,
            \`doctor_id\` varchar(50) NOT NULL,
            \`user_id\` varchar(50) NOT NULL,
            \`rating\` tinyint(1) NOT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`ratings\` ADD PRIMARY KEY (\`id\`);
        
        ALTER TABLE \`${databaseName}\`.\`ratings\` MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8 ;        
        
        INSERT INTO \`${databaseName}\`.\`ratings\` (id, doctor_id, user_id, rating) 
        VALUES 
        (4001, 13579, 12345, 4.5),
        (4002, 24680, 54321, 3.8),
        (4003, 24601, 98765, 4.2),
        (4004, 54321, 13579, 4.0),
        (4005, 12345, 24680, 4.7);


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
        
        INSERT INTO \`${databaseName}\`.\`report\` (id, doctor_id, appointment_id, user_id, diagnosis, reasons, advices, medicines, treatments) 
        VALUES 
          (5001, 13579, 1001, 24601, 'High blood pressure', 'Routine check-up', 'Increase physical activity, reduce sodium intake', 'Lisinopril, Hydrochlorothiazide', 'Regular exercise, dietary changes'),
          (5002, 98765, 1002, 13579, 'Allergic rhinitis', 'Seasonal allergies', 'Avoid allergens, nasal corticosteroids', 'Fluticasone nasal spray', 'Avoid allergens, medication as needed'),
          (5003, 54321, 1003, 98765, 'Lumbar strain', 'Prolonged sitting, heavy lifting', 'Physical therapy, pain management', 'Ibuprofen, Heat therapy', 'Physical therapy sessions, rest'),
          (5004, 24680, 1004, 54321, 'Cavity detected', 'Toothache, sensitivity', 'Dental filling, oral hygiene', 'Composite filling material', 'Dental filling procedure, oral hygiene instructions'),
          (5005, 12345, 1005, 12345, 'Myopia', 'Blurry vision, difficulty focusing', 'Corrective lenses, eye exercises', 'Prescription eyeglasses', 'Regular eye exams, use of prescribed eyewear');
        

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
        
        INSERT INTO \`${databaseName}\`.\`schedules\` (doctor_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday) 
        VALUES 
        (13579, '08:00-12:00', '09:00-13:00', '08:30-12:30', '09:30-13:30', '08:00-12:00', '09:00-13:00', NULL),
        (24680, '10:00-14:00', NULL, '10:30-14:30', '09:00-13:00', '08:30-12:30', '09:00-13:00', '10:00-14:00'),
        (54321, '08:00-12:00', '08:30-12:30', '09:00-13:00', '08:00-12:00', '09:30-13:30', '08:30-12:30', '08:00-12:00'),
        (98765, '09:00-13:00', '08:00-12:00', '09:30-13:30', '08:30-12:30', '09:00-13:00', '08:00-12:00', '09:00-13:00'),
        (12345, NULL, '08:00-12:00', '09:00-13:00', '08:30-12:30', '09:00-13:00', '08:00-12:00', '09:00-13:00');
        

         CREATE TABLE IF NOT EXISTS \`${databaseName}\`.\`users\` (
            \`id\` varchar(100) NOT NULL,
            \`name\` varchar(55) NOT NULL,
            \`phone\` varchar(20) NOT NULL,
            \`pass\` varchar(50) NOT NULL,
            \`avatar\` varchar(50) DEFAULT NULL,
            \`created_at\` timestamp NOT NULL DEFAULT current_timestamp()
        );
        
        ALTER TABLE \`${databaseName}\`.\`users\` ADD PRIMARY KEY (\`id\`), ADD UNIQUE KEY \`phone\` (\`phone\`);
        
        INSERT INTO \`${databaseName}\`.\`users\` (id, name, phone, pass, avatar) 
        VALUES 
        (24601, 'Laura White', '+1122334455', 'laura_pass123', 'https://example.com/laura_avatar.jpg'),
        (13579, 'David Miller', '+1234567890', 'david_password!', 'https://example.com/david_avatar.jpg'),
        (98765, 'Emma Thompson', '+1987654321', 'emma1234', 'https://example.com/emma_avatar.jpg'),
        (54321, 'Kevin Lee', '+5555555555', 'kevin_pass_123', 'https://example.com/kevin_avatar.jpg'),
        (12345, 'Rachel Adams', '+9876543210', 'rachelPass!', 'https://example.com/rachel_avatar.jpg');

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
