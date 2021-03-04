import web3Matic from "./maticContracts/index.js";
import Web3 from "web3";
const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "functionSignature", type: "bytes" },
];

let globalDomainData = {
  name: "ETHERMON",
  version: "1",
};

const callbackToPromise = (userAddress, dataToSign) => {
  console.log(web3Matic.currentProvider);
  const web3 = new Web3(window.ethereum);
  return new Promise((res, rej) => {
    web3.eth.currentProvider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [userAddress, dataToSign],
      },
      async function (error, response) {
        console.log(error, response);
        if (error) {
          rej(error);
        } else {
          res(response);
        }
      }
    );
  });
};

export const getExecuteMetaTransactionSignature = async (
  contract,
  functionSignature,
  userAddress,
  domainData
) => {
  if (!domainData) {
    domainData = globalDomainData;
    domainData["verifyingContract"] = contract._address;
  }
  domainData["chainId"] = 137;

  let nonce = await contract.methods.getNonce(userAddress).call();

  let message = {};
  message.nonce = parseInt(nonce);
  message.from = userAddress;
  message.functionSignature = functionSignature;

  const dataToSign = JSON.stringify({
    types: {
      EIP712Domain: domainType,
      MetaTransaction: metaTransactionType,
    },
    domain: domainData,
    primaryType: "MetaTransaction",
    message: message,
  });

  var response = await callbackToPromise(userAddress, dataToSign);
  let { r, s, v } = getSignatureParameters(response.result);

  return { r, s, v };
};

export const executeMetaTransaction = (
  contract,
  functionSignature,
  userAddress,
  r,
  s,
  v
) => {
  return contract.methods
    .executeMetaTransaction(userAddress, functionSignature, r, s, v)
    .send({
      from: userAddress,
    });
};

const getSignatureParameters = (signature) => {
  if (!web3Matic.utils.isHexStrict(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }
  var r = signature.slice(0, 66);
  var s = "0x".concat(signature.slice(66, 130));
  var v = "0x".concat(signature.slice(130, 132));
  v = web3Matic.utils.hexToNumber(v);
  if (![27, 28].includes(v)) v += 27;
  return {
    r: r,
    s: s,
    v: v,
  };
};
