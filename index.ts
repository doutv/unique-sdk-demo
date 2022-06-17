import { Sdk } from "@unique-nft/sdk";
import { INamespace } from "protobufjs";
import {
  CreateCollectionArguments,
  SignTxResult,
  SubmitTxArguments,
  UnsignedTxPayload,
} from "@unique-nft/sdk/types";
import { ISubmittableResult } from "@polkadot/types/types/extrinsic";
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/extrinsics';
import { SdkSigner } from "@unique-nft/sdk/types";
import { createSigner } from "@unique-nft/sdk/sign";

export async function createSdk(): Promise<Sdk> {
  const options = {
    chainWsUrl: 'ws://150.109.145.144:9200/',
    ipfsGatewayUrl: 'https://ipfs.unique.network/ipfs/',
  }
  const signerOptions = {
    seed: '//Alice', // Signer seed phrase
  };
  const signer: SdkSigner = await createSigner(signerOptions);
  return await Sdk.create({
    ...options,
    signer,
  });
}

export async function createCollection(sdk: Sdk, address: string): Promise<number> {
  const constOnChainSchema: INamespace = {
    nested: {
      onChainMetaData: {
        nested: {
          NFTMeta: {
            fields: {
              FieldA: {
                id: 1,
                rule: 'required',
                type: 'string',
              },
              FieldB: {
                id: 2,
                rule: 'required',
                type: 'string',
              },
            },
          },
        },
      },
    },
  };

  const createArgs: CreateCollectionArguments = {
    name: 'My collection',
    description: 'my test collection',
    tokenPrefix: 'FOO',
    properties: {
      schemaVersion: 'Unique',
      constOnChainSchema,
    },
    address,
  };
  const txPayload: UnsignedTxPayload = await sdk.collections.create(createArgs);

  const signTxResult: SignTxResult = await sdk.extrinsics.sign(txPayload);

  const submitTxArgs: SubmitTxArguments = {
    signerPayloadJSON: txPayload.signerPayloadJSON,
    signature: signTxResult.signature
  };

  return new Promise(resolve => {
    let collectionId = 0;
    function resultCallback(result: ISubmittableResult) {
      const createdEvent = result.events.find(event => event.event.method === 'CollectionCreated');
      if (createdEvent) collectionId = +createdEvent.event.data[0];
      if (result.isCompleted) resolve(collectionId);
    }
    sdk.extrinsics.submit(submitTxArgs, resultCallback);
  })
}


const sdk = await createSdk();
const address = "unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx";
createCollection(sdk, address);