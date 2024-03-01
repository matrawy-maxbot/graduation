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

export { DBquery, DBselect, DBinsert, DBupdate, DBdelete};
