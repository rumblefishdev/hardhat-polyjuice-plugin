import { RequestArguments } from "hardhat/types";
import {
  PolyjuiceWallet,
  PolyjuiceJsonRpcProvider,
} from "@polyjuice-provider/ethers";
import { EventEmitter } from "stream";
import { BigNumber } from "ethers";

export class WrappedPolyjuiceProvider extends EventEmitter {
  polyjuiceProvider: PolyjuiceJsonRpcProvider;
  polyjuiceWallet: PolyjuiceWallet;

  constructor(web3Url: string, privateKey: string) {
    super();
    const polyjuiceConfig = { web3Url };
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

    if (args.method === "eth_estimateGas") {
      return { result: BigNumber.from("0x7d00") };
    }

    if (args.method === "eth_sendTransaction") {
      const params = args.params as any[];
      const result = await this.polyjuiceWallet.sendTransaction({
        data: params[0].data,
      });
      return result.hash;
    }

    const result = await this.polyjuiceProvider.send(
      args.method,
      args.params as any[]
    );
    return result;
  }
}
