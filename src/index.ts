import { extendEnvironment, extendConfig } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { BackwardsCompatibilityProviderAdapter } from "hardhat/internal/core/providers/backwards-compatibility";
import "./type-extensions";
import { WrappedPolyjuiceProvider } from "./provider";

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

extendEnvironment((hre) => {
  const { network } = hre;
  if (network.name === "godwoken") {
    const wrappedPolyjuiceProvider = new WrappedPolyjuiceProvider(
      network.config.url!,
      network.config.privateKey!
    );

    hre.network.provider = new BackwardsCompatibilityProviderAdapter(
      wrappedPolyjuiceProvider
    );
  }
});
