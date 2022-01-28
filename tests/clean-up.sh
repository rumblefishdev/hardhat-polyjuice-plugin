GODWOKEN__KICKER_PATH=$(cat test-config.json | jq '."godwoken-kicker-path"' -r)

pushd "$GODWOKEN__KICKER_PATH"

ls

make stop
