import dotenv from 'dotenv';
import { ApiPromise, WsProvider } from '@polkadot/api';


export async function connect() {

    dotenv.config();
    console.log('Connecting to Polkadot node...');
      // Initialize the API
    const api = await ApiPromise.create({ 
      provider: new WsProvider (process.env.PROVIDER_URL)
    });
    // Wait for the API to become ready
    await api.isReady;
    console.log('\x1b[32m%s\x1b[0m','Connected to Polkadot node successfully!');
      api.on('disconnected', async () => {
        console.log(`API disconnected, attempting to reconnect...`);
    
        // Wait for 5 seconds before attempting to reconnect
        await new Promise(resolve => setTimeout(resolve, 5000));
    
        // Disconnect existing provider and attempt to connect to the same URL
        api.disconnect();
        connect();
      });
      return api;
    }

export default connect;