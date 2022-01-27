#!/usr/bin/bash
set -e

GODWOKEN__KICKER_PATH=$(cat test-config.json | jq '."godwoken-kicker-path"' | tr -d '"')
GODWOKEN__ETH_ADDRESS=$(cat test-config.json | jq '."godwoken-eth-address"' | tr -d '"')
GODWOKEN__PRIVATE_KEY=$(cat test-config.json | jq '."godwoken-private-key"' | tr -d '"')

set +e
GODWOKEN__IS_CHAIN_UP=$(curl -s localhost:6101 | jq .status)
set -e

if [ -z "$GODWOKEN__IS_CHAIN_UP" ]; then
  pushd $GODWOKEN__KICKER_PATH

  sudo make init
  make start

  # deposit 400 CKB to a deployer account
  curl http://localhost:6101/deposit?eth_address=$GODWOKEN__ETH_ADDRESS
  printf \n
  popd
fi

GODWOKEN__ETH_ACCOUNT_LOCK_CODE_HASH=$(curl -s http://localhost:6101/get_eth_account_lock | jq '.data.code_hash')
GODWOKEN__ROLLUP_TYPE_HASH=$(curl -s http://localhost:6101/get_rollup_type_hash | jq '.data')

pushd "tests/smoke-test"

rm -rf node_modules/
rm -rf deployments/

yarn --frozen-lockfile
yarn hardhat deploy --network godwoken

GODWOKEN__DEPLOYED_ADDRESS=$(cat deployments/godwoken/Token.json | jq '.address')
POST_DATA_JSON="
  {
    \"jsonrpc\":\"2.0\",
    \"id\":\"id\",
    \"method\":\"eth_getCode\",
    \"params\":[$GODWOKEN__DEPLOYED_ADDRESS, \"latest\"]
  }"
GODWOKEN__CONTRACT_CODE=$(curl -s -H "content-type: application/json" -d "${POST_DATA_JSON}" localhost:8024 | jq '.result')

if [ -z "$GODWOKEN__CONTRACT_CODE" ] || [ $GODWOKEN__CONTRACT_CODE = '"0x"' ]; then
  tput setaf 1
  printf "Something went wrong, contract address is corrupted! \n"
  tput sgr0
else
  tput setaf 2
  printf 'All good 🚀 \n'
  tput sgr0
fi
