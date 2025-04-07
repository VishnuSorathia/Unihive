#!/bin/bash

# 🏁 START: Define Paths
PROJECT_DIR="/Users/vishnusorathia/Documents/unihive/uniehiv"
BACKUP_DIR="$PROJECT_DIR/dependency_backup"
NPM_GLOBAL_DIR="$PROJECT_DIR/.npm-global"

echo "🚀 Starting Cleanup Process..."
echo "📂 Project Directory: $PROJECT_DIR"

# 🔄 Create backup folder
mkdir -p "$BACKUP_DIR"

# 📦 Backup existing dependencies
echo "📦 Backing up dependencies..."
cp -r "$PROJECT_DIR/node_modules" "$BACKUP_DIR/node_modules_backup"
cp "$PROJECT_DIR/package.json" "$BACKUP_DIR/package.json_backup"

# 🗑️ Remove Global npm Packages
echo "🗑️ Removing global npm packages..."
sudo npm uninstall -g expo-cli @angular/cli @react-native-community/cli npm npx

# 🍺 Remove Homebrew Packages (except node, git, sqlite)
echo "🍺 Removing unnecessary Homebrew packages..."
brew list | grep -v "node\|npm\|sqlite\|git" | xargs brew uninstall --force

# 🗑️ Remove pip and Python packages
echo "🐍 Removing global Python & Pip packages..."
brew uninstall pipx
rm -rf ~/.local/pipx
brew uninstall python@3.13

# 🗑️ Remove Java (Temurin JDK)
echo "🗑️ Removing Java (Temurin JDK)..."
brew uninstall --cask temurin
rm -rf /Library/Java/JavaVirtualMachines

# 🗑️ Remove leftover caches and directories
echo "🗑️ Cleaning up caches..."
brew cleanup
rm -rf /Users/vishnusorathia/Library/Caches/Homebrew
rm -rf ~/.npm
rm -rf ~/.config/yarn

# 🔧 Set up local npm for the project
echo "📦 Configuring local npm environment..."
mkdir -p "$NPM_GLOBAL_DIR"
npm config set prefix "$NPM_GLOBAL_DIR"
export PATH="$NPM_GLOBAL_DIR/bin:$PATH"

# 📦 Reinstall only project dependencies
echo "📦 Reinstalling project dependencies..."
cd "$PROJECT_DIR"
npm install

# ✅ Verify installed packages
echo "✅ Installed packages:"
npm list --depth=0

# 🎯 Restart terminal to apply changes
echo "🔄 Restarting terminal to apply changes..."
exec $SHELL

