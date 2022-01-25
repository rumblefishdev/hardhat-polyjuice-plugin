import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface HttpNetworkUserConfig {
    privateKey?: string;
    rollupTypeHash?: string;
    ethAccountLockCodeHash?: string;
  }
  export interface HardhatNetworkUserConfig {
    privateKey?: string;
    rollupTypeHash?: string;
    ethAccountLockCodeHash?: string;
  }

  export interface HttpNetworkConfig {
    privateKey?: string;
    rollupTypeHash?: string;
    ethAccountLockCodeHash?: string;
  }
  export interface HardhatNetworkConfig {
    url?: string;
    privateKey?: string;
    rollupTypeHash?: string;
    ethAccountLockCodeHash?: string;
  }
}
