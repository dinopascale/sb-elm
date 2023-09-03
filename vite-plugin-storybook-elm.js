const fileRegex = /src\/Stories\/(.*)\.elm$/;
const compiler = require("node-elm-compiler");

export default function storybookElm() {
  return {
    name: "storybook-elm",
    async transform(code, id) {
      if (!fileRegex.test(id)) {
        return { code: code, map: null };
      }
      if (fileRegex.test(id)) {
        try {
          const compiled = await compiler.compileToString(id, {});
          return {
            code: `${compiled}`,
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
