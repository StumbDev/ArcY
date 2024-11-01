module.exports = {
    entry: './dist/cli.js',
    target: 'node18',
    output: {
        path: './build/bin',
        filename: 'arcy'
    },
    pkg: {
        assets: [
            'web/dist/**/*',
            'dist/**/*.js'
        ],
        scripts: [
            'dist/**/*.js'
        ]
    },
    compression: 'gzip',
    environment: {
        NODE_ENV: 'production'
    }
}; 