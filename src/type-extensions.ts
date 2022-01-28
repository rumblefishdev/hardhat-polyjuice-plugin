import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface godwokenUserConfig {
    privateKey: string;
    rollupTypeHash: string;
    ethAccountLockCodeHash: string;
    delayAfterDeploy?: boolean | Number;
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
    url?: string;
    godwokenConfig?: godwokenUserConfig;
  }
}
