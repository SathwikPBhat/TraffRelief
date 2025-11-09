const { convertRawToJSON_usingJSON5 } = require('../utils/utils');

function customJsonParser(req, res, next) {
	const type = req.headers['content-type'] || '';
	if (type.includes('application/json')) {
		let data = '';
		req.setEncoding('utf8');
		req.on('data', chunk => {
			data += chunk;
		});

		req.on('end', () => {
			if (!data) {
				req.body = {};
				return next();
			}

			try {
				// try strict JSON first
				req.body = JSON.parse(data);
				return next();
			} catch (e) {
				// fallback to tolerant parser
				try {
					req.body = convertRawToJSON_usingJSON5(data);
					return next();
				} catch (err) {
					console.error('Custom JSON parser failed:', err.message);
					return res.status(400).json({ error: 'Invalid JSON format' });
				}
			}
		});

		req.on('error', (err) => {
			console.error('Request stream error in customJsonParser:', err);
			return res.status(400).json({ error: 'Invalid request body' });
		});
	} else {
		return next();
	}
}

module.exports = customJsonParser;

