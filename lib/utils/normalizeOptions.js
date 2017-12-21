export default function normalizeOptions(options) {
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
}
