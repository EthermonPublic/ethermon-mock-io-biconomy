import Biconomy from "@biconomy/mexa";
import { worldNFTABI, worldNFTAddress } from "./worldNFT";

import Web3 from "web3";

const biconomyAPIKey = "jNakxE3Gg.5285ebc7-5ba8-4170-85af-f7f1bf06ec1d";
const maticProvider = "https://rpc-mainnet.matic.network/";

const biconomy = new Biconomy(new Web3.providers.HttpProvider(maticProvider), {
  apiKey: biconomyAPIKey,
  debug: true,
});
const web3Matic = new Web3(biconomy);
biconomy
  .onEvent(biconomy.READY, () => {
    console.log("Mexa is Ready");
  })
  .onEvent(biconomy.ERROR, (error, message) => {
    console.error(error, message);
  });

export const etheremonWorldNFTInstance = new web3Matic.eth.Contract(
  worldNFTABI,
  worldNFTAddress
);

export default web3Matic;
