GODWOKEN__KICKER_PATH=$(cat test-config.json | jq '."godwoken-kicker-path"' | tr -d '"')

echo $GODWOKEN__KICKER_PATH

pushd "$GODWOKEN__KICKER_PATH"

ls

make stop
