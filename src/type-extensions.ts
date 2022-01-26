import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface godwokenUserConfig {
    url: string;
    privateKey: string;
    rollupTypeHash: string;
    ethAccountLockCodeHash: string;
  }
  export interface HttpNetworkUserConfig {
    godwokenConfig?: godwokenUserConfig;
  }
  export interface HardhatNetworkUserConfig {
    godwokenConfig?: godwokenUserConfig;
  }

  export interface HttpNetworkConfig {
    godwokenConfig?: godwokenUserConfig;
  }
  export interface HardhatNetworkConfig {
    godwokenConfig?: godwokenUserConfig;
  }
}
