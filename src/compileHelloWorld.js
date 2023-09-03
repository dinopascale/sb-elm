var compiler = require("node-elm-compiler");

compiler
  .compile(["./HelloWorld.elm"], {
    output: "compiled-hello-world.js",
    optimize: true,
    debug: false,
  })
  .on("close", function (exitCode) {
    console.log("Finished with exit code", exitCode);
  });
