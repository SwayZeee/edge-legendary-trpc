# TypeScript Setup

## Execute the following commands to setup a (basic) TypeScript project
```
npm init -y
```

```
npm i -D typescript nodemon ts-node
```

```
npx tsc --init
```

## Update package.json scripts
```
"start": "node ./dist/index.js",
"dev": "nodemon ./src/index.ts", // may need adjustments, see examples
"build": "tsc"
```

## Update tsconfig.json compilerOptions
```
 "outDir": "./dist",
```