set -e

GODWOKEN__KICKER_PATH=$(cat test-config.json | jq '."godwoken-kicker-path"' -r)

pushd "$GODWOKEN__KICKER_PATH"

make stop
