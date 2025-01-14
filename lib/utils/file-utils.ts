import { FILE_PATTERNS } from '@/lib/constants/file-patterns';

export function getStartingRow(filename: string): number {
	for (const [key, value] of Object.entries(FILE_PATTERNS)) {
		if (key === 'DEFAULT') continue;
		if ('pattern' in value && value.pattern.test(filename)) {
			return value.startRow;
		}
	}
	return FILE_PATTERNS.DEFAULT.startRow;
}
