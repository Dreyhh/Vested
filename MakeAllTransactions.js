import parseCsvFile from './parseCsvFile.js';
import processCsvRow from './processCsvRow.js';

let counts = [0,0];
// Define an async function to process the next row in the CSV file
const MakeAllTransactions = async (filename, api, frequency, currentRowIndex) => {
    try {
      // Read the contents of the CSV file if we haven't already done so
      if (!MakeAllTransactions.rows) {
        MakeAllTransactions.rows = await parseCsvFile(filename);
      }
  
      // Get the current row from the CSV file and process it using the Polkadot JS API
      const row = MakeAllTransactions.rows[currentRowIndex];
      const rowsLen = MakeAllTransactions.rows.length;
      if (row) {
        currentRowIndex++;
        counts = await processCsvRow(row, currentRowIndex, api, rowsLen);
      } 
    } catch (error) {
      console.error(`Error processing CSV row: ${error}`);
    }
  
    setTimeout(() => MakeAllTransactions(filename, api, frequency, currentRowIndex), frequency);
  };

export default MakeAllTransactions;