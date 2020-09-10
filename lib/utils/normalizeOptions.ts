export interface NormalizedOption {
  caption: string;
}

export type Options =
  | string[]
  | { [key: string]: string | { caption: string } };

export type NormalizedOptions = { [key: string]: NormalizedOption };

const normalizeOptions = (options: Options) => {
  const result: NormalizedOptions = {};
  if (Array.isArray(options)) {
    options.forEach(opt => (result[opt] = { caption: opt }));
  } else {
    Object.keys(options).forEach(key => {
      const opt = options[key];
      result[key] = typeof opt === 'string' ? { caption: opt } : opt;
    });
  }
  return result;
};

export default normalizeOptions;
