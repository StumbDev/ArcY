{ pkgs ? import <nixpkgs> {} }:

let
  nodejs = pkgs.nodejs_20;
  yarn = pkgs.yarn.override { inherit nodejs; };
in
pkgs.mkShell {
  name = "arcy-dev";
  buildInputs = with pkgs; [
    # Node.js and package management
    nodejs
    yarn

    # Build tools
    pkg-config
    gnumake
    gcc

    # Development tools
    git
    ripgrep
    fd
    
    # TypeScript and development dependencies
    nodePackages.typescript
    nodePackages.typescript-language-server
    nodePackages.prettier
    
    # Required for native modules
    python3
    
    # System dependencies
    openssl
    zlib
    
    # Optional but useful tools
    watchman # For file watching
    jq # For JSON processing
  ];

  shellHook = ''
    export PATH="$PWD/node_modules/.bin:$PATH"
    
    # Ensure npm uses the correct global directory
    export npm_config_prefix="$PWD/.npm-global"
    export PATH="$npm_config_prefix/bin:$PATH"
    
    # Set development environment variables
    export NODE_ENV=development
    export ARCY_DEV=true
    
    # Create necessary directories
    mkdir -p .npm-global
    mkdir -p .cache
    
    # Print welcome message
    echo "🚀 Welcome to Arcy development environment!"
    echo "Node.js version: $(node --version)"
    echo "Yarn version: $(yarn --version)"
    echo ""
    echo "Available commands:"
    echo "  yarn install    - Install dependencies"
    echo "  yarn start     - Start Arcy"
    echo "  yarn build     - Build the project"
    echo "  yarn test      - Run tests"
    echo ""
  '';

  # Environment variables
  ELECTRON_OVERRIDE_DIST_PATH = "${pkgs.electron}/libexec/electron";
  LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
    pkgs.stdenv.cc.cc.lib
    pkgs.openssl
    pkgs.zlib
  ];

  # Allow native node modules to work
  NIX_LDFLAGS = "-L${pkgs.openssl.out}/lib -L${pkgs.zlib.out}/lib";
  NIX_CFLAGS_COMPILE = "-I${pkgs.openssl.dev}/include -I${pkgs.zlib.dev}/include";
}
