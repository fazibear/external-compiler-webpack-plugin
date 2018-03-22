const { exec } = require('child_process');
const glob = require('glob');
const colors = require('colors');

function ExternalCompilerPlugin(params) {
  this.external = params.compiler;
  this.params = params.params || [];
  this.path = params.path;
}

ExternalCompilerPlugin.prototype.apply = function(compiler) {
  compiler.hooks.beforeCompile.tapAsync('ExternalCompilerPlugin', function(param, callback){
    console.log('Starting ' + colors.green(this.external) + ' compiler...');
    console.log();
    glob(this.path, function(er, files) {
      files.forEach((file) => param.compilationDependencies.add(file));
    }.bind(this))
    exec(this.external, (error, stdout, stderr) => {
      console.log(stdout);
      console.log(colors.red(stderr));
      callback();
    });

  }.bind(this));
};

module.exports = ExternalCompilerPlugin;
