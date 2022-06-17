import { SdkSigner } from "@unique-nft/sdk/types";
import { createSigner } from "@unique-nft/sdk/sign";
import { Sdk } from "@unique-nft/sdk";

async function createSdk() {
  const options = {
    chainWsUrl: 'wss://quartz.unique.network',
    ipfsGatewayUrl: 'https://ipfs.unique.network/ipfs/',
  }
  const signerOptions = {
    seed: '//Alice', // Signer seed phrase
  };
  const signer = await createSigner(signerOptions);
  return await Sdk.create({
    ...options,
    signer,
  });
}

const sdk = await createSdk();
