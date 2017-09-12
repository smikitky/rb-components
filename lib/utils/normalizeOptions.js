export default function normalizeOptions(options) {
	const result = {};
	if (Array.isArray(options)) {
		options.forEach(opt => result[opt] = { caption: opt });
	}
	Object.keys(result).forEach(key => {
		if (typeof result[key] === 'string') {
			result[key] = { caption: result[key] };
		}
	});
	return result;
}