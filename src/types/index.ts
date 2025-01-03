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
