#!/bin/bash

# This is an alternative approach if rbenv installation takes too long
# Note: This requires sudo access

# Install CocoaPods using sudo
sudo gem install cocoapods

# Verify CocoaPods installation
pod --version

echo "CocoaPods installation complete!"
