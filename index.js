var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Sdk } from "@unique-nft/sdk";
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/extrinsics';
import { createSigner } from "@unique-nft/sdk/sign";
export function createSdk() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            chainWsUrl: 'ws://150.109.145.144:9200/',
            ipfsGatewayUrl: 'https://ipfs.unique.network/ipfs/',
        };
        const signerOptions = {
            seed: '//Alice', // Signer seed phrase
        };
        const signer = yield createSigner(signerOptions);
        return yield Sdk.create(Object.assign(Object.assign({}, options), { signer }));
    });
}
export function createCollection(sdk, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const constOnChainSchema = {
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
        const createArgs = {
            name: 'My collection',
            description: 'my test collection',
            tokenPrefix: 'FOO',
            properties: {
                schemaVersion: 'Unique',
                constOnChainSchema,
            },
            address,
        };
        const txPayload = yield sdk.collections.create(createArgs);
        const signTxResult = yield sdk.extrinsics.sign(txPayload);
        const submitTxArgs = {
            signerPayloadJSON: txPayload.signerPayloadJSON,
            signature: signTxResult.signature
        };
        return new Promise(resolve => {
            let collectionId = 0;
            function resultCallback(result) {
                const createdEvent = result.events.find(event => event.event.method === 'CollectionCreated');
                if (createdEvent)
                    collectionId = +createdEvent.event.data[0];
                if (result.isCompleted)
                    resolve(collectionId);
            }
            sdk.extrinsics.submit(submitTxArgs, resultCallback);
        });
    });
}
const sdk = await createSdk();
const address = "unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx";
createCollection(sdk, address);
