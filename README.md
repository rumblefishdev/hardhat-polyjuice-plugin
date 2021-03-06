# hardhat-polyjuice-plugin

A plugin that allows hardhat-deploy integration with godwoken network using [Polyjuice Provider](https://github.com/nervosnetwork/polyjuice-provider)

## What

The goal of the plugin is to have the ability to take existing Ethereum Hardhat codebase and port it to Nervos Layer 2 network only by adding the plugin into existing codebase. All Hardhat commands and execution of Hardhat scripts used ex. for deployment should work after adding the plugin.

## Known Caveats(things you should be careful about!!)

- because `polyjuice-provider` doesn't support transfer of ethers, `deterministicDeployment` is not supported by this plugin now

- make sure that you first import `hardhat-deploy` in your config. This way the plugin will inject convertion of deploy arguments, so it supports using eth addresses and works well with `ethers`

- the following `gw_get_account_id_by_script_hash` Error is known to be a random error. If this appears make sure you enable `delayAfterDeploy` in config.

```bash
Error: result from jsonRPC gw_get_account_id_by_script_hash is null or undefined. unable to fetch account id from script hash 0x73d89c5d14c9d71bd9380f98fee2337dc517d19f3e41288ee9f78d25ed3e3aaf
```

you can learn more about that [here](https://github.com/nervosnetwork/polyjuice-provider#known-caveatsthings-you-should-be-careful-about-)

## Installation

```bash
npm install @rumblefishdev/hardhat-polyjuice-plugin hardhat-deploy
```

Import the plugin in your `hardhat.config.js`. Make sure that it's imported **after** `hardhat-deploy`:

```js
require("hardhat-deploy");
require("@rumblefishdev/hardhat-polyjuice-plugin");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-deploy";
import "@rumblefishdev/hardhat-polyjuice-plugin";
```

## Required plugins

- [hardhat-deploy](https://github.com/wighawag/hardhat-deploy)

## Tasks

This plugin creates no additional tasks.

## Configuration

This plugin extends the `HardhatUserConfig`'s `NetworkConfig` object with optional fields:

- `rollupTypeHash`,
- `ethAccountLockCodeHash`,
- `privateKey`

This is an example of how to set it in `hardhat.config.ts`:

```ts
export const config: HardhatUserConfig = {
  network: {
    godwoken: {
      url: string;
      godwokenConfig: {
        privateKey: string;
        rollupTypeHash: string;
        ethAccountLockCodeHash: string;
        delayAfterDeploy?: boolean | Number;
      }
    },
  },
};
```

You can find `ethAccountLockCodeHash`, `rollupTypeHash` and `url` on [localhost:6100](http://localhost:6100), if you're using [godwoken-kicker](https://github.com/RetricSu/godwoken-kicker), or [https://dev.ckb.tools/](https://dev.ckb.tools/).

`delayAfterDeploy` is an optional field, allowing a delay after deploying each contract. It can help with dealing with `gw_get_account_id_by_script_hash` Error. Setting it to `true` will add `10000ms` delay after every deploy, but you can also configure a number of ms that you want to wait.

## Usage

All set! You can run

```bash
npx hardhat deploy --network godwoken
```

or

```bash
yarn hardhat deploy --network godwoken
```

to deploy your contracts.

## Testing

You can find the `tests/smoke-test` folder, created to check if an update in `godwoken` chain or `@polyjuice-provider/ethers` package breaks the plugin functionality.

### Prerequisites

- Clone the [godwoken-kicker](https://github.com/RetricSu/godwoken-kicker) repo, make sure that the path is the same as stated in `test-config.json`. You can also see there's a dummy ethereum account provided
- [jq](https://stedolan.github.io/jq/download/)
- [curl](https://curl.se/download.html)
- [make](https://www.gnu.org/software/make/)

### Run smoke-test

Run

```bash
yarn smoke-test
```

It can take a while, especially if your godwoken is currently not up, it needs to build and run some containers. In that case, you will need to give the script root access (`make init` in `godwoken-kicker` requires that). The script will keep the chain running in case you want to try it several times. After you are done, run

```bash
yarn clean-up
```

to stop the containers.
