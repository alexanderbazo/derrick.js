(function () {
    "use strict";
    /* global module */
    module.exports = function (grunt) {
        grunt.initConfig({
            pkg: grunt.file.readJSON("package.json"),
            eslint: {
                target: "src/"
            },
            yuidoc: {
                compile: {
                    name: "<%= pkg.name %>",
                    description: "<%= pkg.description %>",
                    version: "<%= pkg.version %>",
                    url: "<%= pkg.homepage %>",
                    options: {
                        paths: "src/",
                        outdir: "docs/"
                    }
                }
            },
            uglify: {
                my_target: {
                    files: {
                        "dist/derrick.min.js": "src/derrick.js",
                        "dist/derrick_worker.min.js": "src/derrick_worker.js"
                    }
                }
            },
            copy: {
                main: {
                    files: [
                        {
                            expand: true,
                            flatten: true,
                            src: ["dist/*"],
                            dest: "demo/js/libs/",
                            filter: "isFile"
                        }
                    ]
                }
            }
        });
        // dependencies
        grunt.loadNpmTasks("grunt-eslint");
        grunt.loadNpmTasks("grunt-contrib-yuidoc");
        grunt.loadNpmTasks("grunt-contrib-uglify");
        grunt.loadNpmTasks("grunt-contrib-copy");
        // tasks
        grunt.registerTask("default", ["eslint", "yuidoc", "uglify"]);
        grunt.registerTask("demo", ["default", "copy"]);
    };
}());
