export function trunkOutput(output: string | undefined, maxLength: number) {
  if (output && output.length > maxLength) {
    return output.substr(0, maxLength) + "e" + (output.length - maxLength);
  }
  return output;
}
