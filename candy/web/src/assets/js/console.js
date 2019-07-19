
const isConsole = false;
export function consoleFn() {
  if (isConsole) {
    console.log(...arguments)
  }
}
