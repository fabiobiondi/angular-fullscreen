#!/bin/bash


# Get to the root project
if [[ "_" == "_${PROJECT_DIR}" ]]; then
  SCRIPT_DIR=$(dirname $0)
  PROJECT_DIR=$(cd ${SCRIPT_DIR} && pwd)
  export PROJECT_DIR
fi;

if [[ ! -f "${PROJECT_DIR}/package.json" ]]; then
  echo "Invalid project dir: file 'package.json' not found in ${PROJECT_DIR}"
  echo "-> Make sure to run the script inside his directory, or export env variable 'PROJECT_DIR'"
  exit 1
fi;

echo "Preparing project environment.."
PROJECT_NAME="angular-fullscreen-toggle"
REPO="e-is/angular-fullscreen-toggle"
REPO_API_URL="https://api.github.com/repos/${REPO}"
REPO_PUBLIC_URL="https://github.com/${REPO}"

NODEJS_VERSION=10

# Install node JS (using NVM)
export NVM_DIR="$HOME/.nvm"
if [[ -d "${NVM_DIR}" ]]; then

    # Load NVM
    . ${NVM_DIR}/nvm.sh

    # Switch to expected version
    nvm use ${NODEJS_VERSION}

    # Or install it
    if [[ $? -ne 0 ]]; then
        nvm install ${NODEJS_VERSION}
        if [[ $? -ne 0 ]]; then
            exit 1;
        fi
    fi
else
    echo "nvm (Node version manager) not found (directory ${NVM_DIR} not found). Please install, and retry"
    exit 1
fi


# Install project dependencies
if [[ ! -d "${PROJECT_DIR}/node_modules" ]]; then
    echo "Installing project dependencies..."
    cd ${PROJECT_DIR}
    yarn
fi

### Get current version (package.json)
current=$(grep -oP "version\": \"\d+.\d+.\d+((a|b)[0-9]+)?" package.json | grep -m 1 -oP "\d+.\d+.\d+((a|b)[0-9]+)?")
if [[ "_$current" == "_" ]]; then
  echo "Unable to read the current version in 'package.json'. Please check version format is: x.y.z (x and y should be an integer)."
  exit 1;
fi
echo "Current version: $current"


# Check version format
if [[ ! $2 =~ ^[0-9]+.[0-9]+.[0-9]+((a|b)[0-9]+)?$ ]]; then
  echo "Wrong version format"
  echo "Usage:"
  echo " > ./release.sh [pre|rel] <version> <release_description>"
  echo "with:"
  echo " - pre: use for pre-release"
  echo " - rel: for full release"
  echo " - version: x.y.z"
  echo " - release_description: a comment on release"
  exit 1
fi
VERSION=$2

# Update the package version
case "$1" in
  rel|pre)
    echo "new build version: ${VERSION}"

    # Change the version in files: 'package.json' and 'config.xml'
    sed -i "s/version\": \"$current\"/version\": \"${VERSION}\"/g" package.json

    ;;
  *)
    echo "No task given"
    exit 1
    ;;
esac

# Launch build
gulp build --release
[[ $? -ne 0 ]] && exit 1 # Stop if failed


# Commit and push
echo "Executing git push, with tag: v$2"
description="$4"
if [[ "_$description" == "_" ]]; then
   description="Release v${VERSION}"
fi

# Create the tag
cd ${PROJECT_DIR} || exit 1
git reset HEAD
git add package.json release.sh dist/angular-fullscreen-toggle.js dist/angular-fullscreen-toggle.min.js dist/maps/angular-fullscreen-toggle.min.js.map
[[ $? -ne 0 ]] && exit 1 # Stop if failed
git commit -m "${VERSION}"
git tag -f -a "${VERSION}" -m "${description}"

# Push the tag
git push -f origin "${VERSION}"

# Push the master branch
git push -f origin
[[ $? -ne 0 ]] && exit 1 # Stop if failed

# Publish on npm repo
if [[ "$1" == "pre" ]]; then
  npm publish . --dry-run
  [[ $? -ne 0 ]] && exit 1 # Stop if failed

else
  npm login
  [[ $? -ne 0 ]] && exit 1 # Stop if failed
  npm publish . --access public
fi
