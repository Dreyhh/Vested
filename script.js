import { connect } from './ConnectToAPI.js';
import MakeAllTransactions from './MakeAllTransactions.js';


const filename = 'vested.csv'; // Name of the CSV file to read
const frequency = 10; // Frequency in milliseconds to send transactions
const startingRow = 0; // Row number of the CSV to start processing at (0 = second row, because we skip header row by default)

async function main() {
  const api = await connect(); 
  await MakeAllTransactions(filename, api, frequency, startingRow)
  console.log('\x1b[32m%s\x1b[0m',
  `Process has started. vesting transactions are being sent every ${frequency} ms ...`);
}

main();