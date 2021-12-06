
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import WalletConnect from "@walletconnect/client";
import { IInternalEvent } from "@walletconnect/types";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";

import { ChainType, apiGetAccountAssets } from './api/algoApi'
import { IAssetData } from '../helpers/types';
import AccountAssets from '../components/AccountBalance';

interface IResult {
  method: string;
  body: Array<
    Array<{
      txID: string;
      signingAddress?: string;
      signature: string;
    } | null>
  >;
}
interface IAppState {
  // connector: WalletConnect | null;
  fetching: boolean;
  // connected: boolean;
  showModal: boolean;
  pendingRequest: boolean;
  signedTxns: Uint8Array[][] | null;
  pendingSubmissions: Array<number | Error>;
  uri: string;
  // accounts: string[];
  // address: string;
  result: IResult | null;
  chain: ChainType;
  // assets: IAssetData[];
}



const Home = () => {

  // const initialStateValues = {
  //   connector: null,
  //   fetching: false,
  //   connected: false,
  //   showModal: false,
  //   pendingRequest: false,
  //   signedTxns: null,
  //   pendingSubmissions: [],
  //   uri: "",
  //   accounts: [],
  //   address: "",
  //   result: null,
  //   chain: ChainType.TestNet,
  //   assets: [],
  // }
  const [initialState, setInitialState] = useState<IAppState>({
    // connector: null,
    fetching: false,
    // connected: false,
    showModal: false,
    pendingRequest: false,
    signedTxns: null,
    pendingSubmissions: [],
    uri: "",
    // accounts: [],
    // address: "",
    result: null,
    chain: ChainType.TestNet,
    // assets: [],
  });

  // const [connector, setConnector] = useState<WalletConnect | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [address, setAddress] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [assets, setAssets] = useState<IAssetData[]>([]);


  const walletConnectInit = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";
    // create new connector
    const connectorValue = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    // setInitialState({ ...initialState, connector: connector });
    // setConnector(connectorValue);
    window['connector'] = connectorValue;
    // check if already connected
    if (!connectorValue.connected) {
      // create new session
      await connectorValue.createSession();
    }

    // subscribe to events
    // setTimeout(async () => {
    //   console.log('ini', initialState);
    await subscribeToEvents();
    // }, 5000);
  };



  const subscribeToEvents = () => {
    let connector = window['connector'];

    if (!connector) {
      return;
    }

    connector.on("session_update", async (error, payload) => {
      console.log(`connector.on("session_update")`);
      debugger;

      if (error) {
        throw error;
      }

      const { accounts } = payload.params[0];
      onSessionUpdate(accounts);
    });

    connector.on("connect", (error, payload) => {
      console.log(`connector.on("connect")`);
      debugger;
      if (error) {
        throw error;
      }

      onConnect(payload);
    });

    connector.on("disconnect", (error, payload) => {
      console.log(`connector.on("disconnect")`);
      debugger;

      if (error) {
        throw error;
      }

      onDisconnect();
    });

    if (connector.connected) {
      const { accounts } = connector;
      const address = accounts[0];
      setConnected(true);
      setAddress(address);
      setAccounts(accounts);
      onSessionUpdate(accounts);
    }

    // setConnector(connector);

    // setInitialState({ ...initialStat });
  };

  const onSessionUpdate = async (accounts: string[]) => {
    const address = accounts[0];
    // await setInitialState({ ...initialState, accounts: accounts, address: address });
    setAccounts(accounts);
    setAddress(address);
    await getAccountAssets(address);
  };

  const getAccountAssets = async (addressParam) => {
    const { chain } = initialState;
    // setInitialState({ ...initialState, fetching: true });
    try {
      debugger;
      // get account balances
      const assets = await apiGetAccountAssets(chain, addressParam);

      // await setInitialState({ ...initialState, fetching: false });
      await setAssets(assets);
      setAddress(addressParam);
    } catch (error) {
      debugger;
      console.error(error);
      // await setInitialState({ ...initialState, fetching: false });
    }
  };
  const onConnect = async (payload: IInternalEvent) => {
    debugger;
    const { accounts } = payload.params[0];
    const address = accounts[0];
    // await setInitialState({
    //   ...initialState,
    // });
    await setConnected(true);
    await setAccounts(accounts);
    await setAddress(address);
    getAccountAssets(address);
  };

  const onDisconnect = async () => {
    // setInitialState(initialStateValues);
    window['connector'] = null;
    setAccounts([]);
    setAddress("");
    setConnected(false);
    setAssets([]);
    let connector = window['connector']
    if (connector) {
      connector.killSession();
    }
  };

  // const seeConsole = () => {
  //   console.log('stateValues', address, accounts, window['connector']);
  // }

  return (

    <div className={styles.homeContainer}>
      {
        !connected &&
        <>
          <button type="button" onClick={walletConnectInit} className={styles.homeButton}>Connect to wallet</button>
          {/* <button onClick={seeConsole}>See console</button> */}
        </>
      }
      {
        connected && address &&
        <div className={styles.connectionWrapper}>
          <h3>You are now connected to the wallet.</h3>
          <button type="button" onClick={onDisconnect} className={styles.homeButton}>Disconnect Wallet</button>
          <p style={{ wordBreak: "break-all" }}>Wallet Address: {address}</p>
        </div>
      }

      {
        connected && assets.length > 0 &&
        <>
          <AccountAssets assets={assets} />
        </>
      }
    </div>


  )

}

export default Home;