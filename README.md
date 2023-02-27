# Vested

`Vested` is a script that enables you to make multiple calls to the `VestedTransfer` extrinsic using Polkadot API.

## How to use

To use this script, follow the steps below:

1. Install the necessary dependencies by running `npm install`.
2. Create an `.env` file and set the following variables:


- `PROVIDER_URL`: The URL of the Polkadot node you are connecting to.
- `SENDER_PHRASE`: The mnemonic phrase of the account sending the transactions.
- `SENDER_ADDRESS`: The address of the account sending the transactions.

Replace the placeholder values with your actual values.

3. Modify the `vested.csv` file with the relevant data.
4. You can modify the frequency at which each call is made by modifying the `frequency` variable in `script.js` (in milliseconds).
5. Run the script by typing `node script.js` in your terminal.
6. Once the process has completed, you can find the records saved in the `output.txt` file.

## Considerations

Make sure to follow the .csv format:
first column: recipient address
second column: locked
third column: perBlock
fourth colum: startingBlock

Before actual transaction, make a test with small quantities.

Video:
https://drive.google.com/file/d/19vNBywAsojZSh1qjT_u7A8vnRWJ-J9gm/view
