/**
 * https://github.com/processing/p5.js-sound/blob/v0.14/lib/p5.sound.js#L1765
 *
 * @param data
 * @param _frequencyRange
 * @returns {number} 0.0 ~ 1.0
 */
export const getFrequencyRangeValue = (data: Uint8Array, frequencyRange: number[]): number => {
  const nyquist = 48000 / 2
  const lowIndex = Math.round((frequencyRange[0] / nyquist) * data.length)
  const highIndex = Math.round((frequencyRange[1] / nyquist) * data.length)
  let total = 0
  let numFrequencies = 0

  for (let i = lowIndex; i <= highIndex; i++) {
    total += data[i]
    numFrequencies += 1
  }

  return total / numFrequencies / 255
}
