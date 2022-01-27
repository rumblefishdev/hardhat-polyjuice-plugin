import "hardhat-deploy";
import "../../src";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const config = {
  solidity: "0.8.9",
  namedAccounts: { deployer: { default: 0 } },
  networks: {
    godwoken: {
      url: process.env.GODWOKEN__URL,
      godwokenConfig: {
        ethAccountLockCodeHash:
          process.env.GODWOKEN__ETH_ACCOUNT_LOCK_CODE_HASH,
        rollupTypeHash: process.env.GODWOKEN__ROLLUP_TYPE_HASH,
        privateKey: process.env.GODWOKEN__PRIVATE_KEY,
      },
    },
  },
};

export default config;
