const fileRegex = /src\/Stories\/(.*)\.elm$/;
const compiler = require("node-elm-compiler");
const chokidar = require("chokidar");

const Tracker = (() => {
  // Maps a dependency's filepath to an object containing keys of story filepaths depending on it
  //
  // For example:
  // If module "A" imports "B" and "C", and module "D" also imports "C" this will be:
  // files == { "B": { "A": true }, "C": { "A": true, "D": true } }
  //
  // This makes it easy to say "Hey, looks like "C" changed– who's depending on that module?"
  //
  let files = {};

  // Anytime a dependency changes, this should run "touch" on any dependent stories
  let watcher = chokidar
    .watch([], { ignoreInitial: true })
    .on("all", (_event, pathOfWatchedDependency) => {
      let filepathsNeedingThisDep = Object.keys(
        files[pathOfWatchedDependency] || {}
      );
      filepathsNeedingThisDep.forEach(touchFile);
    });
  let touchFile = (filepath) =>
    fs.utimes(filepath, Date.now(), Date.now(), () => {});

  let track = async (filepath) =>
    compiler.findAllDependencies(filepath).then(addToFiles(filepath));

  let addToFiles = (filepath) => (newDependencies) => {
    newDependencies.forEach((depFilepath) => {
      files[depFilepath] = files[depFilepath] || {};
      files[depFilepath][filepath] = true;
    });

    watcher.add(newDependencies);
  };

  return {
    track,
  };
})();

export default function storybookElm() {
  return {
    name: "storybook-elm",
    enforce: "pre",
    async transform(code, id) {
      if (!fileRegex.test(id)) {
        return { code: code, map: null };
      }
      if (fileRegex.test(id)) {
        const modulePath = fileRegex.exec(id)[1];
        const fullModuleName = modulePath.split("/").join(".");

        try {
          const compiled = await compiler.compileToString(id, {
            optimize: false,
            debug: false,
          });
          const transformed = compiled
            .replace("(this)", "(globalThis)")
            .replace(
              `console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');`,
              ""
            );
          const code = `
          ${transformed}
          
          export default {
            title: "Basic"
          }
          
          export const Basic = () => {
            let node = document.createElement('div');
            let app;
            window.requestAnimationFrame(() => {
              if (app) {
                return
              }
              app = globalThis.Elm.Stories.Basic.init({ node })
              if (app.ports && app.ports.logAction) {
                app.ports.logAction.subscribe((msg) => {
                  controls.onAction(msg)
                })
              }
            })
            return node
          } 
          `;

          Tracker.track(id);

          return {
            code,
            map: null,
          };
        } catch (e) {
          console.error("Compiler Error", e);
          throw new Error(e);
        }
      }
    },
  };
}
