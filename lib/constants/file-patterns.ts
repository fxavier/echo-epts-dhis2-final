export const FILE_PATTERNS = {
	MDS: {
		pattern: /MDS/i,
		startRow: 9,
	},
	DAH: {
		pattern: /DAH/i,
		startRow: 9,
	},
	TB1: {
		pattern: /TB1/i,
		startRow: 7,
	},
	TB4: {
		pattern: /TB4/i,
		startRow: 12,
	},
	DEFAULT: {
		startRow: 8,
	},
} as const;
