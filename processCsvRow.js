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
    const locked = new BN(arg2);
    const perBlock = new BN(arg3);
    const startingBlock = new BN (arg4);

    // Get the nonce for the sender's account
    const nonce = await api.query.system.account(senderPublicKey)
    const vestingInfo = await api.createType('VestingInfo', { locked: locked, perBlock: perBlock, startingBlock: startingBlock});
    // Create a new transfer extrinsic using the vestedTransfer method from the pallet_vesting module
    const tx = await api.tx.vesting.vestedTransfer(recipientAddress, vestingInfo);
    
    const unsub = await tx.signAndSend(senderPair, { nonce: -1 }, async ({ events = [], status }) => {
      //console.log(`Current status is ${status.type}`);
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
        if (successCount + failCount >= rowsLen){
            const boxWidth = 40;
            console.log('+' + '-'.repeat(boxWidth - 2) + '+');
            console.log('\x1b[33m%s\x1b[0m',`Total transactions sent: ${successCount + failCount}`);
            console.log('\x1b[32m%s\x1b[0m',`Successful transactions: ${successCount}`);
            console.log('\x1b[31m%s\x1b[0m',`Failed transactions: ${failCount}`);
            console.log('\x1b[33m%s\x1b[0m',`Records saved to output.txt`);
            console.log('+' + '-'.repeat(boxWidth - 2) + '+');
            process.exit();
            }
        unsub();
      }
    
      //events.forEach(({ event: { method, section } }) => {
        //console.log(`\t${section}.${method}:\t${status}`);
      //});
    
    });

     
    };

export default processCsvRow;