import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CBB5HFLDZUP2SM4JPNVGH5PAOEOZKH64ZI7N2XAL2KMSRVSINPMICOB7",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAGZG9uYXRlAAAAAAACAAAAAAAAAAVkb25vcgAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAAAAAAAGcmVmdW5kAAAAAAABAAAAAAAAAAVkb25vcgAAAAAAABMAAAAA",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAABAAAAAAAAAAVvd25lcgAAAAAAABMAAAAA",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAACAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAARnb2FsAAAACwAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAAAAAAl4bG1fdG9rZW4AAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAACWltYWdlX3VybAAAAAAAABAAAAAAAAAADG1pbl9kb25hdGlvbgAAAAsAAAAA",
            "AAAAAAAAAAAAAAAMZ2V0X2RvbmF0aW9uAAAAAQAAAAAAAAAFZG9ub3IAAAAAAAATAAAAAQAAAAs=",
            "AAAAAAAAAAAAAAAOZ2V0X2FsbF9kb25vcnMAAAAAAAAAAAABAAAD6gAAA+0AAAACAAAAEwAAAAs=",
            "AAAAAAAAAAAAAAAQZ2V0X21pbl9kb25hdGlvbgAAAAAAAAABAAAACw==",
            "AAAAAAAAAAAAAAAQZ2V0X3RvdGFsX3JhaXNlZAAAAAAAAAABAAAACw==",
            "AAAAAAAAAAAAAAARZ2V0X2NhbXBhaWduX2luZm8AAAAAAAAAAAAAAQAAA+0AAAAIAAAAEwAAAAsAAAAGAAAAEAAAABAAAAAQAAAACwAAAAQ=",
            "AAAAAAAAAAAAAAASaXNfZGVhZGxpbmVfcGFzc2VkAAAAAAAAAAAAAQAAAAE=",
            "AAAAAAAAAAAAAAATZ2V0X2NhbXBhaWduX3N0YXR1cwAAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAATZ2V0X2lzX2FscmVhZHlfaW5pdAAAAAAAAAAAAQAAAAE=",
            "AAAAAAAAAAAAAAAXZ2V0X3Byb2dyZXNzX3BlcmNlbnRhZ2UAAAAAAAAAAAEAAAAE"]), options);
        this.options = options;
    }
    fromJSON = {
        donate: (this.txFromJSON),
        refund: (this.txFromJSON),
        withdraw: (this.txFromJSON),
        initialize: (this.txFromJSON),
        get_donation: (this.txFromJSON),
        get_all_donors: (this.txFromJSON),
        get_min_donation: (this.txFromJSON),
        get_total_raised: (this.txFromJSON),
        get_campaign_info: (this.txFromJSON),
        is_deadline_passed: (this.txFromJSON),
        get_campaign_status: (this.txFromJSON),
        get_is_already_init: (this.txFromJSON),
        get_progress_percentage: (this.txFromJSON)
    };
}
