import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { getStartingRow } from '@/lib/utils/file-utils';

export interface ExcelFile {
	name: string;
	sheets: XLSX.WorkSheet[];
	sheetNames: string[];
}

export async function readExcelFile(file: File): Promise<ExcelFile> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: 'array' });

				resolve({
					name: file.name,
					sheets: workbook.SheetNames.map((name) => workbook.Sheets[name]),
					sheetNames: workbook.SheetNames,
				});
			} catch (error) {
				toast.error(`Error reading file ${file.name}`);
				reject(error);
			}
		};
		reader.onerror = (error) => {
			toast.error(`Error reading file ${file.name}`);
			reject(error);
		};
		reader.readAsArrayBuffer(file);
	});
}

export function mergeExcelFiles(files: ExcelFile[]): XLSX.WorkBook {
	if (files.length === 0) {
		toast.error('No files to merge');
		throw new Error('No files to merge');
	}

	try {
		const baseFile = files[0];
		const workbook = XLSX.utils.book_new();

		baseFile.sheetNames.forEach((sheetName, index) => {
			const mergedData: string[][] = XLSX.utils.sheet_to_json(
				baseFile.sheets[index],
				{
					header: 1,
				}
			);

			// Merge additional files
			for (let i = 1; i < files.length; i++) {
				const currentFile = files[i];
				if (index < currentFile.sheets.length) {
					const currentSheet = currentFile.sheets[index];
					const currentData: string[][] = XLSX.utils.sheet_to_json(
						currentSheet,
						{
							header: 1,
						}
					);

					// Get starting row based on filename pattern
					const startRow = getStartingRow(currentFile.name);
					const dataToAppend = currentData.slice(startRow - 1);
					mergedData.push(...dataToAppend);
				}
			}

			const mergedSheet = XLSX.utils.aoa_to_sheet(mergedData);
			XLSX.utils.book_append_sheet(workbook, mergedSheet, sheetName);
		});

		toast.success('Files merged successfully');
		return workbook;
	} catch (error) {
		toast.error('Error merging files');
		throw error;
	}
}

export function saveWorkbook(workbook: XLSX.WorkBook, filename: string) {
	try {
		XLSX.writeFile(workbook, filename);
		toast.success(`File saved as ${filename}`);
	} catch (error) {
		toast.error('Error saving file');
		throw error;
	}
}
