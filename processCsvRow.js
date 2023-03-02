//Description: This file contains the function that processes a single row of the CSV file and sends the transaction to the blockchain.
// It is used by the MakeAllTransactions.js file to process each row of the CSV file.
import dotenv from 'dotenv';
import { Keyring } from '@polkadot/api';
import fs from 'fs';
import BN from 'bn.js';
let successCount = 0;
let failCount = 0;
// Define an async function to process a single row of the CSV file using the Polkadot JS API
const processCsvRow = async (row, currentRowIndex, api, rowsLen) => {

    dotenv.config();
    const senderPublicKey = process.env.SENDER_ADDRESS;
    const senderPhrase = process.env.SENDER_PHRASE;
    const [arg1, arg2, arg3, arg4] = row;
    // Initialize the keyring with the sender's account
    const keyring = new Keyring({ type: 'sr25519' });
    const senderPair = keyring.addFromUri(senderPhrase);


    //Parse the row data  
    const recipientAddress = arg1;
    const locked =  convertToHASH(arg2, currentRowIndex);
    const perBlock = convertToHASH(arg3, currentRowIndex);
    const startingBlock = new BN(arg4);

    // Get the vesting information for the account
    const vesting = await api.query.vesting.vesting(recipientAddress);
    const vested = vesting.toJSON();
    if (vested){
    // Check if the account has an active vesting schedule
      console.log(`Skipping ${recipientAddress}, he already has an active vesting schedule`);
      console.log(`Locked: ${vested[0]['locked']}`);
      failCount++;
      fs.appendFileSync('output.txt', `User ${recipientAddress} was skipped, he already has an active vesting schedule\n`); 
      printEndMessage(rowsLen);
      return;
    }
    const vestingInfo = await api.createType('VestingInfo', { locked: locked, perBlock: perBlock, startingBlock: startingBlock});
    // Create a new transfer extrinsic using the vestedTransfer method from the pallet_vesting module
    const tx = await api.tx.vesting.vestedTransfer(recipientAddress, vestingInfo);
    
    const unsub = await tx.signAndSend(senderPair, { nonce: -1 }, async ({ events = [], status }) => {
      if (status.isFinalized) {
        const finalizedStatus = await status.asFinalized;
        
        console.log('\x1b[33m%s\x1b[0m', `###Sending VestTransfer to user ${recipientAddress} (row # ${currentRowIndex})###`);
        console.log(`Transaction has been sent`);
        console.log(`Transaction included at blockHash ${finalizedStatus}`);
       ``
    let result = '';
    events.slice(-1).forEach(({ event: { method, section } }) => {
        result += `\t${section}.${method}:\t${status}\n`;
    });
    
        if (result.includes("Success")) {
          console.log('\x1b[32m%s\x1b[0m', 'Transaction succeeded');
          fs.appendFileSync('output.txt', `Row: ${currentRowIndex},recipientAddress: ${recipientAddress},Transaction succeeded at: ${finalizedStatus}\n`);
          successCount++;
        } else {
          console.log('\x1b[31m%s\x1b[0m', 'Transaction failed!');
          fs.appendFileSync('output.txt', `Row: ${currentRowIndex},recipientAddress: ${recipientAddress},Transaction Failed at: ${finalizedStatus}\n`);
          failCount++;
        }
        printEndMessage(rowsLen);
        unsub();
      }
    
      //events.forEach(({ event: { method, section } }) => {
        //console.log(`\t${section}.${method}:\t${status}`);
      //});
    
    });

     
    };

  function printEndMessage(rowsLen) {
    if (successCount + failCount >= rowsLen){
      const boxWidth = 40;
      console.log('+' + '-'.repeat(boxWidth - 2) + '+');
      console.log('\x1b[33m%s\x1b[0m',`Total transactions sent: ${successCount + failCount}`);
      console.log('\x1b[32m%s\x1b[0m',`Successful transactions: ${successCount}`);
      console.log('\x1b[31m%s\x1b[0m',`Failed transactions: ${failCount}`);
      console.log('\x1b[33m%s\x1b[0m',`Records saved to output.txt`);
      console.log('+' + '-'.repeat(boxWidth - 2) + '+');
      process.exit(0);
      }
  }

  function convertToHASH(arg, idx) {

    if (arg < 0.000002) {
      failCount++;
      throw new Error(`At Row #${idx}: Vesting amount too low.\nWaiting for other transactions to complete...`);
    }

    if(isNaN(arg)){
      failCount++;
      throw new Error(`At Row #${idx}: Vesting amount is not a number.\nWaiting for other transactions to complete...`);
    }
    
    const precision = 1e12; // Use 12 decimal places of precision
    const bn = new BN(10).pow(new BN(18));
    let intNum;
  
    // Check if the input is a float
    if (!Number.isInteger(arg)) {
      intNum = Math.round(arg * precision);
    } else {
      // Convert integer to float by dividing by the precision
      intNum = arg / precision;
    }
  
    // Create a BN from the integer and multiply with the given BN
    const result = bn.mul(new BN(intNum));
  
    // Divide the result by the precision to get the final float value
    return result.divRound(new BN(precision));
  }

export default processCsvRow;