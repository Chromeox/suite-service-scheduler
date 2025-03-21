#!/bin/bash

# Set the installed Ruby version as global
rbenv global 3.1.6

# Reload rbenv
eval "$(rbenv init -)"

# Verify Ruby version
ruby -v

# Install CocoaPods
gem install cocoapods

# Verify CocoaPods installation
pod --version

echo "Ruby and CocoaPods setup complete!"
