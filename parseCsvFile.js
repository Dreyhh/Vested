// Description: This file contains the function that reads the CSV file and returns its contents as an array of rows.
// It is used by the MakeAllTransactions.js file to read the CSV file and process each row.


import fs from 'fs';
import readline from 'readline';
// Create a new Promise-based function to read the CSV file and return its contents as an array of rows
/**
 * Parses a CSV file and returns an array of arrays, where each inner array represents a row of data from the CSV file.
 * @param {string} filename - The name of the CSV file to read.
 * @returns {Promise<Array<Array<string>>>} - A promise that resolves to an array of arrays representing the rows of data from the CSV file.
 */
const parseCsvFile = async (filename) => {
    try {
      const rl = readline.createInterface({
        input: fs.createReadStream(filename),
        crlfDelay: Infinity
      });
      // Skip first line
       await rl[Symbol.asyncIterator]().next();
       const rows = [];
  
  
      for await (const line of rl) {
        rows.push(line.split(','));
      }
      console.log('CSV file read successfully, starting transaction processing...');
      //console.log(rows);
      return rows;
      
    } catch (err) {
      console.error(`Error reading CSV file: ${err}`);
      throw err;
    }
  };

export default parseCsvFile;