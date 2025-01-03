export type HexCode = `#${string}`

export enum UsermediaStatus {
  Success = 'success',
  Fail = 'fail',
  Unknown = 'unknown',
}

export enum VisualiserPreset {
  Webcam = 'webcam',
  Video = 'video',
}

export enum VisualiserTheme {
  Discodip = 'discodip',
  Grayscale = 'grayscale',
  Pastel = 'pastel',
  Purple = 'purple',
  Red = 'red',
}

export interface UsermediaOptions {
  audio: boolean
  video: boolean
}

export interface RGB {
  r: number
  g: number
  b: number
}

export const VISUALISER_THEME_COLORS: Record<VisualiserTheme, HexCode[]> = {
  [VisualiserTheme.Grayscale]: ['#555555'],
  [VisualiserTheme.Discodip]: [
    '#f0932b',
    '#eb4d4b',
    '#6ab04c',
    '#22a6b3',
    '#be2edd',
    '#4834d4',
    '#130f40',
  ],
  [VisualiserTheme.Purple]: [
    '#3B1E54',
    '#3B1E54',
    '#3B1E54',
    '#9B7EBD',
    '#9B7EBD',
    '#D4BEE4',
    '#EEEEEE',
  ],
  [VisualiserTheme.Pastel]: [
    '#A8D8EA',
    '#A8D8EA',
    '#A8D8EA',
    '#AA96DA',
    '#AA96DA',
    '#FCBAD3',
    '#FFFFD2',
  ],
  [VisualiserTheme.Red]: [
    '#E23E57',
    '#E23E57',
    '#E23E57',
    '#88304E',
    '#88304E',
    '#522546',
    '#311D3F',
  ],
} as const
