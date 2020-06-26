export interface NormalizedOption {
  caption: string;
}

export type Options =
  | string[]
  | { [key: string]: string | { caption: string } };

export type NormalizedOptions = { [key: string]: NormalizedOption };

const normalizeOptions = (options: Options): NormalizedOptions => {
  const result = {};
  if (Array.isArray(options)) {
    options.forEach(opt => (result[opt] = { caption: opt }));
  } else {
    Object.keys(options).forEach(key => {
      if (typeof options[key] === 'string') {
        result[key] = { caption: options[key] };
      } else {
        result[key] = options[key];
      }
    });
  }
  return result;
};

export default normalizeOptions;
