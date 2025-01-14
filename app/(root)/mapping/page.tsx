'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { read, utils, writeFile } from 'xlsx';

// Adjust imports for shadcn/ui to match your local structure
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // shadcn/ui progress component
import { useToast } from '@/hooks/use-toast'; // shadcn/ui toast hook

export default function MappingPage() {
	// --- DHIS2 Credentials State
	const [dhis2Url, setDhis2Url] = useState('');
	const [dhis2Username, setDhis2Username] = useState('');
	const [dhis2Password, setDhis2Password] = useState('');

	// --- File handling State
	const [excelFile, setExcelFile] = useState<File | null>(null);

	// --- Progress State (0 - 100)
	const [progress, setProgress] = useState(0);

	// --- Toast from shadcn/ui
	const { toast } = useToast();

	// --- Drag & Drop Setup
	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			setExcelFile(acceptedFiles[0]);
			setProgress(0); // Reset progress whenever a new file is selected
		}
	};
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: {
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
				'.xlsx',
			],
			'application/vnd.ms-excel': ['.xls'],
		},
	});

	/**
	 * Main function to process the Excel file sheet by sheet.
	 *  - We only look at row 8 in each sheet, from column 6 onward.
	 *  - For each non-blank cell in row 8, we fetch the dataElement ID from DHIS2
	 *    and write that ID into row 9 of the same column.
	 */
	const handleProcessExcel = async () => {
		if (!excelFile) {
			toast({
				variant: 'destructive',
				title: 'No file selected',
				description: 'Please select an Excel file before processing.',
			});
			return;
		}

		if (!dhis2Url || !dhis2Username || !dhis2Password) {
			toast({
				variant: 'destructive',
				title: 'Missing credentials',
				description: 'Please fill in all DHIS2 credentials before processing.',
			});
			return;
		}

		try {
			// 1. Read the file in array buffer format
			const fileData = await excelFile.arrayBuffer();

			// 2. Parse workbook using xlsx
			const workbook = read(fileData, { type: 'array' });

			// We'll calculate total columns (cells) across all sheets that need to be processed
			let totalDataCells = 0;
			let processedCells = 0;

			// For each sheet, we read from row=8, col=6 onward
			const sheetNames = workbook.SheetNames;

			/**
			 * PRE-CALC STEP:
			 * Count how many columns have data in row 8 across all sheets,
			 * from col=6 onward, up to a max column (e.g., col=200).
			 */
			sheetNames.forEach((sheetName) => {
				const worksheet = workbook.Sheets[sheetName];

				const row = 8; // row 8 in Excel (1-based)
				const colStart = 6; // column 6 in Excel (1-based)
				const colMax = 200; // how many columns to check beyond colStart

				// rowIndex (0-based) => row - 1
				const rowIndex = row - 1;

				for (let col = colStart; col < colStart + colMax; col++) {
					// colIndex (0-based) => col - 1
					const colIndex = col - 1;
					const cellAddress = utils.encode_cell({
						r: rowIndex,
						c: colIndex,
					});
					const cellValue = worksheet[cellAddress]?.v;
					if (!cellValue) break; // stop scanning columns if blank cell
					totalDataCells++;
				}
			});

			/**
			 * PROCESS STEP:
			 * For each sheet, read row=8 from col=6 onward => fetch ID => write to row=9.
			 */
			for (const sheetName of sheetNames) {
				const worksheet = workbook.Sheets[sheetName];

				const row = 8; // read from row 8
				const rowIndex = row - 1;
				const colStart = 6; // start from col 6
				const colIDRow = 9; // write ID in row 9
				const colMax = 200;

				for (let col = colStart; col < colStart + colMax; col++) {
					const colIndex = col - 1;
					const cellAddress = utils.encode_cell({
						r: rowIndex,
						c: colIndex,
					});
					const cellValue = worksheet[cellAddress]?.v;

					if (!cellValue) break; // if blank, no more columns to process

					// Attempt to fetch the dataElement ID from DHIS2
					const dataElementName = String(cellValue).trim();
					const dataElementId = await fetchDataElementId(
						dhis2Url,
						dhis2Username,
						dhis2Password,
						dataElementName
					);

					// Write the found ID (or "Not found") into row 9, same column
					const outCellAddress = utils.encode_cell({
						r: colIDRow - 1, // row 9 => 0-based index = 8
						c: colIndex,
					});
					worksheet[outCellAddress] = {
						t: 's', // 's' = string cell type
						v: dataElementId || 'Not found',
					};

					// Update progress
					processedCells++;
					const currentProgress = Math.round(
						(processedCells / totalDataCells) * 100
					);
					setProgress(currentProgress);
				}
			}

			// 3. Once all sheets are processed, write the updated workbook to a new file
			const outputFileName = 'updated-data.xlsx';
			writeFile(workbook, outputFileName);

			// Show a success toast
			toast({
				title: 'Processing complete',
				description: 'All data mapped. Your updated file is now downloading.',
			});
		} catch (error: any) {
			console.error('Error processing Excel file:', error);
			toast({
				variant: 'destructive',
				title: 'Processing error',
				description: error?.message || String(error),
			});
		}
	};

	/**
	 * Helper function to fetch a dataElement ID by name from DHIS2 using Basic Auth.
	 * Example: GET /api/dataElements?filter=displayName:eq:{dataElementName}
	 */
	async function fetchDataElementId(
		baseUrl: string,
		username: string,
		password: string,
		dataElementName: string
	): Promise<string | null> {
		try {
			// Remove trailing slash if any
			const urlRoot = baseUrl.replace(/\/$/, '');
			// Example endpoint with filter
			const url = `${urlRoot}/api/dataElements?filter=displayName:eq:${encodeURIComponent(
				dataElementName
			)}&fields=id,displayName&pageSize=1`;

			const response = await fetch(url, {
				headers: {
					Authorization: 'Basic ' + btoa(`${username}:${password}`),
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				console.error('DHIS2 request failed:', response.statusText);
				return null;
			}

			const data = await response.json();
			const dataElements = data?.dataElements;
			if (Array.isArray(dataElements) && dataElements.length > 0) {
				return dataElements[0].id;
			}
			return null;
		} catch (err) {
			console.error('Error fetching dataElement:', err);
			return null;
		}
	}

	return (
		<main className='flex-1 p-6'>
			{/* Page Header */}
			<div className='mb-8'>
				<h1 className='text-3xl font-bold text-primary'>Connect to DHIS2</h1>
				<p className='text-muted-foreground'>
					Manage your DHIS2 data element mapping here.
				</p>
			</div>

			{/* Cards Container */}
			<div className='grid gap-6'>
				{/* Card #1: DHIS2 Credentials */}
				<Card>
					<CardHeader>
						<CardTitle>DHIS2 Settings</CardTitle>
						<CardDescription>Configure your DHIS2 credentials.</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<Label htmlFor='dhis2-url'>DHIS2 URL</Label>
							<Input
								id='dhis2-url'
								type='text'
								placeholder='https://dhis2.echomoz.org/'
								value={dhis2Url}
								onChange={(e) => setDhis2Url(e.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor='dhis2-username'>DHIS2 Username</Label>
							<Input
								id='dhis2-username'
								type='text'
								placeholder='admin'
								value={dhis2Username}
								onChange={(e) => setDhis2Username(e.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor='dhis2-password'>DHIS2 Password</Label>
							<Input
								id='dhis2-password'
								type='password'
								placeholder='admin'
								value={dhis2Password}
								onChange={(e) => setDhis2Password(e.target.value)}
							/>
						</div>
					</CardContent>
					<CardFooter />
				</Card>

				{/* Card #2: Excel File Import & Process */}
				<Card>
					<CardHeader>
						<CardTitle>Excel File Import</CardTitle>
						<CardDescription>
							Drag & drop an Excel file or click to select one, then process row
							8 (columns 6 onward) on each sheet.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{/* File Drop Area */}
						<div
							{...getRootProps()}
							className={`mb-4 flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors
                ${
									isDragActive
										? 'border-green-400 bg-green-50'
										: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
								}
                cursor-pointer
              `}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<p className='text-green-600'>Drop the file here...</p>
							) : (
								<p>Drag & drop your Excel file here, or click to select it.</p>
							)}
						</div>

						{/* Show selected file name */}
						{excelFile && (
							<p className='mb-2 font-semibold text-gray-700'>
								Selected File: {excelFile.name}
							</p>
						)}

						{/* Progress Bar */}
						{progress > 0 && (
							<div className='my-4'>
								<Label>Overall Progress</Label>
								<Progress value={progress} className='mt-2 w-full' />
								<p className='text-sm'>{progress}% complete</p>
							</div>
						)}

						{/* Process Button */}
						<Button onClick={handleProcessExcel}>Process Excel File</Button>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
