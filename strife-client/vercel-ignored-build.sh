#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "release" ]] ; then
    # Proceed with the build
    echo "✅ - Build can proceed"
    if [[git diff HEAD^ HEAD --quiet .]] ; then
        exit 0;
    else
        exit 1;
    fi
else
  # Don't build
    echo "🛑 - Build cancelled"
    exit 0;
fi