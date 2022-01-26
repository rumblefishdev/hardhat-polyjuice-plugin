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
      if (network.godwokenConfig) {
        config.networks[networkName].godwokenConfig = network.godwokenConfig;
      }
    }
  }
);

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  const { godwokenConfig } = hre.network.config;
  if (godwokenConfig) {
    const polyjuiceConfig = {
      web3Url: godwokenConfig.url,
      rollupTypeHash: godwokenConfig.rollupTypeHash,
      ethAccountLockCodeHash: godwokenConfig.ethAccountLockCodeHash,
    };

    const wrappedPolyjuiceProvider = new WrappedPolyjuiceProvider(
      polyjuiceConfig,
      godwokenConfig.privateKey
    );

    patchDeploy(hre, wrappedPolyjuiceProvider);

    hre.network.provider = new BackwardsCompatibilityProviderAdapter(
      wrappedPolyjuiceProvider
    );
  }
});
