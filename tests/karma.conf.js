module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../',

        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'stylesheets/Common.css',
            'stylesheets/BusyIndicator.css',
            'stylesheets/Tooltip.css',
            'stylesheets/TwoStageButton.css',
            'stylesheets/Window.css',
            'bower_components/jquery/jquery.js',
            'bower_components/jquery.maskedinput/jquery.maskedinput.js',
            'bower_components/underscore/underscore.js',
            'js/Util.js',
            'js/Core/EventEmitter.js',
            'js/Events/CancellableEvent.js',
            'js/Events/ValueChangedEvent.js',
            'js/Control.js',
            'js/DialogControl.js',
            'js/InputControl.js',
            'js/BusyIndicator.js',
            'js/Tooltip.js',
            'js/TwoStageButton.js',
            'js/Window.js',
            'tests/Specs/BusyIndicator.Tests.js',
            'tests/Specs/TwoStageButton.Tests.js'
        ],

        // list of files to exclude
        exclude: [],

        preprocessors: {
            'js/*.js': ['coverage']
        },

        // use dots reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress'
        // CLI --reporters progress
        reporters: ['progress', 'junit', 'coverage'],

        junitReporter: {
            // will be resolved to basePath (in the same way as files/exclude patterns)
            outputFile: 'test-results.xml'
        },

        // web server port
        // CLI --port 9876
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // CLI --log-level debug
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        // CLI --auto-watch --no-auto-watch
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 5000
        captureTimeout: 20000,

        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun: false,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500,

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-coverage'
        ]
    });
};