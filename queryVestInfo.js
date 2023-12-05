import { connect } from './ConnectToAPI.js';
import parseCsvFile from './parseCsvFile.js';
import fs from 'fs';
import BN from 'bn.js';
let idx = 0;
let frequency = 10;
let filename = 'vested.csv';
const timestamp = Date.now(); // Get current timestamp in milliseconds
const date = new Date(timestamp); // Create new Date object based on timestamp
const timeString = date.toLocaleTimeString(); // Format time as a string i
const iterateFile = async (filename, api, frequency, idx) => {
      try{
    // Read the contents of the CSV file if we haven't already done so
      if (!iterateFile.rows) {
        iterateFile.rows = await parseCsvFile(filename);
      }
      if (idx === 0) {
        fs.appendFileSync('queryOutput.csv',`Query to wss://c1.hashed.network made at ${timeString}\n`);
        fs.appendFileSync('queryOutput.csv',`Address,locked,perBlock,startingBlock\n`);
      }
  
      // Get the current row from the CSV file and process it using the Polkadot JS API
      const row = iterateFile.rows[idx];
      const rowsLen = iterateFile.rows.length;
      if (row) {
        idx++;
        await query(row, idx, api, rowsLen);
      } 
    } catch (error) {
      console.error(`Error processing CSV row: ${error}`);
    }
    
    // Call this function again after the specified frequency
    setTimeout(() => iterateFile(filename, api, frequency, idx), frequency);
  };

async function query(row, currentRowIndex, api, rowsLen){
    if(currentRowIndex  > rowsLen + 1){
        process.exit(0);
    }
    //const None = await api.createType('None', '');
    const [arg1, arg2, arg3, arg4] = row;
    const vesting = await api.query.vesting.vesting(arg1);
    let vestingInfo = vesting.toJSON();
    if(!vestingInfo){
        console.log(`Adress ${arg1} has no vesting schedule`);
        fs.appendFileSync('queryOutput.csv', `Adress ${arg1} has no vesting schedule\n`);
        currentRowIndex++; 
        if(currentRowIndex  > rowsLen +20){
            process.exit(0);
        }
        return;
    }
    vestingInfo[0].locked = parseInt(vestingInfo[0].locked,16)/1e18;
    vestingInfo[0].perBlock = vestingInfo[0].perBlock/1e18;
    vestingInfo[0].adress = arg1;
    fs.appendFileSync('queryOutput.csv', `${arg1},${vestingInfo[0].locked},${vestingInfo[0].perBlock},${vestingInfo[0].startingBlock}\n`)
    if(currentRowIndex  > rowsLen + 20){
        process.exit(0);
    }
    currentRowIndex++; 
    console.log(vestingInfo);
}

async function main() {
    const api = await connect(); 
    await iterateFile(filename, api, frequency, idx);
  }
  
  main();