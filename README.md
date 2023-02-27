# VestedTransfer

`VestedTransfer` is a script that enables you to make multiple calls to the `VestedTransfer` extrinsic using Polkadot API.

## How to use

To use this script, follow the steps below:

1. Install the necessary dependencies by running `npm install`.
2. Create an `.env` file and set the following variables:


- `PROVIDER_URL`: The URL of the Polkadot node you are connecting to.
- `SENDER_PHRASE`: The mnemonic phrase of the account sending the transactions.
- `SENDER_ADDRESS`: The address of the account sending the transactions.

Replace the placeholder values with your actual values.

3. Modify the `vested.csv` file with the relevant data.
4. Run the script by typing `node script.js` in your terminal.
5. Once the process has completed, you can find the records saved in the `output.txt` file.

