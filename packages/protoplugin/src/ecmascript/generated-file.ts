// Copyright 2021-2022 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { DescEnum, DescFile, DescMessage } from "@bufbuild/protobuf";
import type { ImportSymbol } from "./import-symbol.js";
import { createImportSymbol } from "./import-symbol.js";
import { literalString, makeFilePreamble } from "./gencommon.js";
import type { RuntimeImports } from "./runtime-imports.js";
import { makeImportPathRelative } from "./import-path.js";

/**
 * All types that can be passed to GeneratedFile.print()
 */
export type Printable =
  | string
  | number
  | boolean
  | bigint
  | Uint8Array
  | ImportSymbol
  | DescMessage
  | DescEnum
  | Printable[];

/**
 * FileInfo represents an intermediate type using for transpiling TypeScript internally.
 */
export interface FileInfo {
  name: string;
  content: string;
  preamble?: string | undefined;
}

/**
 * Represents a JavaScript, TypeScript, or TypeScript declaration file.
 */
export interface GeneratedFile {
  /**
   * Create a standard preamble the includes comments at the top of the
   * protobuf source file (like a license header), as well as information
   * about the code generator and its version.
   *
   * The preamble is always placed at the very top of the generated file,
   * above import statements.
   */
  preamble(file: DescFile): void;

  /**
   * Add a line of code to the file.
   *
   * - string: Prints the string verbatim.
   * - number or boolean: Prints a literal.
   * - bigint: Prints an expression using protoInt64.parse().
   * - Uint8Array: Prints an expression that re-created the array.
   * - ImportSymbol: Adds an import statement and prints the name of the symbol.
   * - DescMessage or DescEnum: Imports the type if necessary, and prints the name.
   */
  print(...any: Printable[]): void;

  /**
   * Add a line of code to the file with tagged template literal.
   */
  printTag(fragments: TemplateStringsArray, ...values: Printable[]): void;

  /**
   * Reserves an identifier in this file.
   */
  export(name: string): ImportSymbol;

  /**
   * Import a message or enumeration generated by protoc-gen-es.
   */
  import(type: DescMessage | DescEnum): ImportSymbol;

  /**
   * Import any symbol from a file or package.
   *
   * The import path can point to a package, for example `@foo/bar/baz.js`, or
   * to a file, for example `./bar/baz.js`.
   *
   * Note that while paths to a file begin with a `./`, they must be
   * relative to the project root. The import path is automatically made
   * relative to the current file.
   */
  import(name: string, from: string): ImportSymbol;
}

export interface GenerateFileToFileInfo {
  getFileInfo(): FileInfo | undefined;
}

type CreateTypeImportFn = (desc: DescMessage | DescEnum) => ImportSymbol;

export function createGeneratedFile(
  name: string,
  importPath: string,
  createTypeImport: CreateTypeImportFn,
  runtimeImports: RuntimeImports,
  preambleSettings: {
    pluginName: string;
    pluginVersion: string;
    parameter: string | undefined;
    tsNocheck: boolean;
  },
  keepEmpty: boolean
): GeneratedFile & GenerateFileToFileInfo {
  let preamble: string | undefined;
  const el: El[] = [];
  return {
    preamble(file) {
      preamble = makeFilePreamble(
        file,
        preambleSettings.pluginName,
        preambleSettings.pluginVersion,
        preambleSettings.parameter,
        preambleSettings.tsNocheck
      );
    },
    print(...any) {
      printableToEl(any, el, createTypeImport, runtimeImports);
      el.push("\n");
    },
    printTag(fragments, ...values) {
      const printables: Printable[] = [];
      fragments.forEach((fragment, i) => {
        printables.push(fragment);
        if (fragments.length - 1 !== i) {
          printables.push(values[i]);
        }
      });

      printableToEl(printables, el, createTypeImport, runtimeImports);
      el.push("\n");
    },
    export(name) {
      return createImportSymbol(name, importPath);
    },
    import(typeOrName: DescMessage | DescEnum | string, from?: string) {
      if (typeof typeOrName == "string") {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return createImportSymbol(typeOrName, from!);
      }
      return createTypeImport(typeOrName);
    },
    getFileInfo() {
      const content = elToContent(el, importPath);
      if (!keepEmpty && content.length === 0) {
        return;
      }
      return {
        name,
        content,
        preamble,
      };
    },
  };
}

type El = ImportSymbol | string;

function elToContent(el: El[], importerPath: string): string {
  const c: string[] = [];
  const symbolToIdentifier = processImports(
    el,
    importerPath,
    (typeOnly, from, names) => {
      const p = names.map(({ name, alias }) =>
        alias == undefined ? name : `${name} as ${alias}`
      );
      const what = `{${p.join(", ")}}`;
      if (typeOnly) {
        c.push(`import type ${what} from ${literalString(from)};\n`);
      } else {
        c.push(`import ${what} from ${literalString(from)};\n`);
      }
    }
  );
  if (c.length > 0) {
    c.push("\n");
  }
  for (const e of el) {
    if (typeof e == "string") {
      c.push(e);
      continue;
    }
    const ident = symbolToIdentifier.get(e.id);
    if (ident != undefined) {
      c.push(ident);
    }
  }
  return c.join("");
}

function printableToEl(
  printables: Printable[],
  el: El[],
  createTypeImport: CreateTypeImportFn,
  runtimeImports: RuntimeImports
): void {
  for (const p of printables) {
    if (Array.isArray(p)) {
      printableToEl(p, el, createTypeImport, runtimeImports);
    } else {
      switch (typeof p) {
        case "string":
          el.push(p);
          break;
        case "number":
          el.push(literalNumber(p));
          break;
        case "boolean":
          el.push(p.toString());
          break;
        case "bigint":
          el.push(...literalBigint(p, runtimeImports));
          break;
        case "object":
          if (p instanceof Uint8Array) {
            el.push(literalUint8Array(p));
            break;
          }
          switch (p.kind) {
            case "es_symbol":
              el.push(p);
              break;
            case "message":
            case "enum":
              el.push(createTypeImport(p));
              break;
          }
          break;
        default:
          throw `cannot print ${typeof p}`;
      }
    }
  }
}

type MakeImportStatementFn = (
  typeOnly: boolean,
  from: string,
  names: { name: string; alias?: string }[]
) => void;

function processImports(
  el: El[],
  importerPath: string,
  makeImportStatement: MakeImportStatementFn
) {
  // identifiers to use in the output
  const symbolToIdentifier = new Map<string, string>();
  // symbols that need a value import (as opposed to a type-only import)
  const symbolToIsValue = new Map<string, true>();
  // taken in this file
  const identifiersTaken = new Set<string>();
  // foreign symbols need an import
  const foreignSymbols: ImportSymbol[] = [];

  // Walk through all symbols used and populate the collections above.
  for (const s of el) {
    if (typeof s == "string") {
      continue;
    }
    symbolToIdentifier.set(s.id, s.name);
    if (!s.typeOnly) {
      // a symbol is only type-imported as long as all uses are type-only
      symbolToIsValue.set(s.id, true);
    }
    if (s.from === importerPath) {
      identifiersTaken.add(s.name);
    } else {
      foreignSymbols.push(s);
    }
  }

  // Walk through all foreign symbols and make their identifiers unique.
  const handledSymbols = new Set<string>();
  for (const s of foreignSymbols) {
    if (handledSymbols.has(s.id)) {
      continue;
    }
    handledSymbols.add(s.id);
    if (!identifiersTaken.has(s.name)) {
      identifiersTaken.add(s.name);
      continue;
    }
    let i = 1;
    let alias: string;
    for (;;) {
      // We choose '$' because it is invalid in proto identifiers.
      alias = `${s.name}$${i}`;
      if (!identifiersTaken.has(alias)) {
        break;
      }
      i++;
    }
    identifiersTaken.add(alias);
    symbolToIdentifier.set(s.id, alias);
  }

  // Group foreign symbols (imports) by their source (from).
  type Imp = {
    types: Map<string, string | undefined>; // type-only imports, name to (optional) alias
    values: Map<string, string | undefined>; // value imports, name to (optional) alias
  };
  const sourceToImport = new Map<string, Imp>();
  for (const s of foreignSymbols) {
    let i = sourceToImport.get(s.from);
    if (i == undefined) {
      i = {
        types: new Map<string, string | undefined>(),
        values: new Map<string, string | undefined>(),
      };
      sourceToImport.set(s.from, i);
    }
    let alias = symbolToIdentifier.get(s.id);
    if (alias == s.name) {
      alias = undefined;
    }
    if (symbolToIsValue.get(s.id)) {
      i.values.set(s.name, alias);
    } else {
      i.types.set(s.name, alias);
    }
  }

  // Make import statements.
  const handledSource = new Set<string>();
  const buildNames = (map: Map<string, string | undefined>) => {
    const names: { name: string; alias?: string }[] = [];
    map.forEach((value, key) => names.push({ name: key, alias: value }));
    names.sort((a, b) => a.name.localeCompare(b.name));
    return names;
  };
  for (const s of foreignSymbols) {
    if (handledSource.has(s.from)) {
      continue;
    }
    handledSource.add(s.from);
    const i = sourceToImport.get(s.from);
    if (i == undefined) {
      // should never happen
      continue;
    }
    const from = makeImportPathRelative(importerPath, s.from);
    if (i.types.size > 0) {
      makeImportStatement(true, from, buildNames(i.types));
    }
    if (i.values.size > 0) {
      makeImportStatement(false, from, buildNames(i.values));
    }
  }

  return symbolToIdentifier;
}

function literalNumber(value: number): string {
  if (Number.isNaN(value)) {
    return "globalThis.Number.NaN";
  }
  if (value === Number.POSITIVE_INFINITY) {
    return "globalThis.Number.POSITIVE_INFINITY";
  }
  if (value === Number.NEGATIVE_INFINITY) {
    return "globalThis.Number.NEGATIVE_INFINITY";
  }
  return value.toString(10);
}

function literalBigint(value: bigint, runtimeImports: RuntimeImports): El[] {
  // Loose comparison will match between 0n and 0.
  if (value == (0 as unknown as bigint)) {
    return [runtimeImports.protoInt64, ".zero"];
  }
  return [
    runtimeImports.protoInt64,
    ".parse(",
    literalString(value.toString()),
    ")",
  ];
}

function literalUint8Array(value: Uint8Array): string {
  if (value.length === 0) {
    return "new Uint8Array(0)";
  }
  const strings: string[] = [];
  for (const n of value) {
    strings.push("0x" + n.toString(16).toUpperCase().padStart(2, "0"));
  }
  return `new Uint8Array([${strings.join(", ")}])`;
}
