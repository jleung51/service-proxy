#!/bin/sh

cd $(dirname $0)
./cleanup.sh

cp -r setup-files/ env-setup/
echo "Feel free to modify any of the files in this directory; they will be ignored by Git." > 'env-setup/README.md'

echo "Setup complete. Navigate into the directory 'env-setup/' and continue following the instructions from the README."
