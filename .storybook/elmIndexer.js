import fs from "fs/promises";
import path from "path";
const compiler = require("node-elm-compiler");
import { loadCsf } from "@storybook/csf-tools";

const ElmIndexer = {
  test: /src\/Stories\/(.*)\.elm$/,
  index: async (fileName, opts) => {
    const compiled = await compiler.compileToString(fileName, {
      optimize: false,
      debug: false,
    });
    const code = `      
      export default {
        title: "Example/Qualcosa"
      }
      
      export const H1 = () => {
        let node = document.createElement('div')
        let app;
        window.requestAnimationFrame(() => {
          if(app) {
            return;
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
    const csf = loadCsf(code, { ...opts, fileName }).parse();
    const { indexInputs } = csf;
    return indexInputs.map((input) => {
      return { ...input };
    });
  },
};

export default ElmIndexer;
