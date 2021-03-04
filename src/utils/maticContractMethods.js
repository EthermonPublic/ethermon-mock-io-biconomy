import Web3 from "web3";

import {
  getExecuteMetaTransactionSignature,
  executeMetaTransaction,
} from "./maticHelper.js";
import {
  etheremonWorldNFTInstance,
  etheremonWorldNFTInstanceDirect,
} from "./maticContracts";

export const catchMonster = async (amount, classId, name, callbackFun) => {
  const account = window.ethereum.selectedAddress;
  var token = etheremonWorldNFTInstance;
  var functionSignature = token.methods
    .catchMonsterNFT(classId, name, Web3.utils.toWei(amount.toString()))
    .encodeABI();

  var signature = await getExecuteMetaTransactionSignature(
    token,
    functionSignature,
    account
  );
  executeMetaTransaction(
    token,
    functionSignature,
    account,
    signature.r,
    signature.s,
    signature.v
  )
    .on("confirmation", function (confirmationNumber, receipt) {
      if (confirmationNumber === 1) {
        console.log(receipt);
      }
    })
    .on("error", function (error, receipt) {
      console.log("ERROR_LOG|catch_monster_txn_fail|error=", error);
    });
};

export const isCatchable = async (classId) => {
  var token = etheremonWorldNFTInstance;

  const { catchable, price } = await token.methods.getPrice(classId).call();
  return { catchable, price: Web3.utils.fromWei(price, "ether") };
};
