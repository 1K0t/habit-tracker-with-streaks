const ts = require("typescript");
const path = require("path");

async function readInput() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

function runTypeCheck(configPath) {
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    console.error(
      ts.formatDiagnostic(configFile.error, {
        getCanonicalFileName: (x) => x,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine,
      }),
    );
    return;
  }

  const parseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    onUnRecoverableConfigFileDiagnostic: () => {},
  };

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    path.dirname(configPath),
  );

  const compilerOptions = {
    ...parsed.options,
    noEmit: true,
  };

  const program = ts.createProgram(parsed.fileNames, compilerOptions);
  const allDiagnostics = ts.getPreEmitDiagnostics(program);

  if (allDiagnostics.length > 0) {
    const formatHost = {
      getCanonicalFileName: (p) => p,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    };

    return ts.formatDiagnostics(allDiagnostics, formatHost);
  }

  return null;
}

async function main() {
  const input = await readInput();
  const file = input.tool_response?.filePath || input.tool_input?.file_path;

  if (!file || !/\.(ts|tsx)$/.test(file)) {
    process.exit(0);
  }

  const typeChecks = runTypeCheck("./tsconfig.json");
  if (typeChecks) {
    console.error(typeChecks);
    process.exit(2);
  }
}

main();
