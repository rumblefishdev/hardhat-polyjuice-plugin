import { RequestArguments } from "hardhat/types";
import {
  PolyjuiceWallet,
  PolyjuiceJsonRpcProvider,
} from "@polyjuice-provider/ethers";
import { EventEmitter } from "stream";
import omit from "lodash/omit";

export class WrappedPolyjuiceProvider extends EventEmitter {
  polyjuiceProvider: PolyjuiceJsonRpcProvider;
  polyjuiceWallet: PolyjuiceWallet;

  constructor(
    web3Url: string,
    rollupTypeHash: string,
    ethAccountLockCodeHash: string,
    privateKey: string
  ) {
    super();
    const polyjuiceConfig = { web3Url, rollupTypeHash, ethAccountLockCodeHash };
    this.polyjuiceProvider = new PolyjuiceJsonRpcProvider(
      polyjuiceConfig,
      polyjuiceConfig.web3Url
    );
    this.polyjuiceWallet = new PolyjuiceWallet(
      privateKey,
      polyjuiceConfig,
      this.polyjuiceProvider
    );
  }

  public async request(args: RequestArguments) {
    if (args.method === "eth_accounts") {
      return [this.polyjuiceWallet.address];
    }

    // if (args.method === "eth_estimateGas") {
    //   return BigNumber.from("0x7d00");
    // }

    if (args.method === "eth_sendTransaction") {
      const params = args.params as any[];
      const newParams = { ...omit(params[0], "gas") };

      const result = await this.polyjuiceWallet.sendTransaction(newParams);

      return result.hash;
    }

    const result = await this.polyjuiceProvider.send(
      args.method,
      args.params as any[]
    );
    // console.log({ result });
    // if (result && Object.keys(result).includes("failed_reason")) {
    //   throw new Error("dupa");
    // }
    return result;
  }
}
