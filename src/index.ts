import { extendEnvironment, extendConfig } from "hardhat/config";
import {
  HardhatConfig,
  HardhatRuntimeEnvironment,
  HardhatUserConfig,
} from "hardhat/types";
import { BackwardsCompatibilityProviderAdapter } from "hardhat/internal/core/providers/backwards-compatibility";
import { WrappedPolyjuiceProvider } from "./provider";
import { patchDeploy } from "./deploy";
import "./type-extensions";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const userNetworks = userConfig.networks;
    if (userNetworks === undefined) {
      return;
    }
    for (const networkName in userNetworks) {
      if (networkName === "hardhat") {
        continue;
      }
      const network = userNetworks[networkName]!;
      if (network.privateKey) {
        config.networks[networkName].privateKey = network.privateKey;
      }
    }
  }
);

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  const { network } = hre;
  if (network.name === "godwoken") {
    if (
      !network.config.rollupTypeHash ||
      !network.config.ethAccountLockCodeHash
    ) {
      throw new Error("Please provide godwoken network config!");
    }
    const wrappedPolyjuiceProvider = new WrappedPolyjuiceProvider(
      network.config.url!,
      network.config.rollupTypeHash,
      network.config.ethAccountLockCodeHash,
      network.config.privateKey!
    );

    patchDeploy(hre, wrappedPolyjuiceProvider);

    hre.network.provider = new BackwardsCompatibilityProviderAdapter(
      wrappedPolyjuiceProvider
    );
  }
});
