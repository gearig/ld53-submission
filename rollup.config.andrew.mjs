import * as dev from "./rollup.config.dev.mjs"

export default {
    ...dev.default,
    input: [
        './src/andrew.ts'
    ]
}
