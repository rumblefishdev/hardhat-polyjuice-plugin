import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface HttpNetworkUserConfig {
    privateKey?: string;
  }
  export interface HardhatNetworkUserConfig {
    privateKey?: string;
  }

  export interface HttpNetworkConfig {
    privateKey?: string;
  }
  export interface HardhatNetworkConfig {
    url?: string;
    privateKey?: string;
  }
}
