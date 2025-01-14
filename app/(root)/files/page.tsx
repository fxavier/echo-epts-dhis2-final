'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileSpreadsheet, Upload, X } from 'lucide-react';
import {
	readExcelFile,
	mergeExcelFiles,
	saveWorkbook,
	type ExcelFile,
} from '@/lib/excel';

export default function FilesPage() {
	const [files, setFiles] = useState<ExcelFile[]>([]);
	const [outputFilename, setOutputFilename] = useState('merged_excel');

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
				'.xlsx',
			],
			'application/vnd.ms-excel': ['.xls'],
		},
		onDrop: async (acceptedFiles) => {
			try {
				const newFiles = await Promise.all(
					acceptedFiles.map((file) => readExcelFile(file))
				);
				setFiles((prev) => [...prev, ...newFiles]);
				toast.success('Files added successfully');
			} catch {
				toast.error('Error reading files');
			}
		},
	});

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleMerge = () => {
		if (files.length < 2) {
			toast.error('Please add at least two files to merge');
			return;
		}

		try {
			const workbook = mergeExcelFiles(files);
			saveWorkbook(workbook, `${outputFilename}.xlsx`);
			toast.success('Files merged successfully');
		} catch {
			toast.error('Error merging files');
		}
	};

	return (
		<main className='flex-1 p-6'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold text-primary'>File Processing</h1>
				<p className='text-muted-foreground'>
					Merge your files here. Merge files of the same type at a time (for
					example: IMER)
				</p>
			</div>

			<div className='grid gap-6'>
				<Card className='p-6'>
					<div
						{...getRootProps()}
						className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
							isDragActive ? 'border-primary bg-primary/5' : 'border-border'
						}`}
					>
						<input {...getInputProps()} />
						<Upload className='mx-auto h-12 w-12 text-muted-foreground' />
						<p className='mt-2 text-sm text-muted-foreground'>
							Drag & drop Excel files here, or click to select files
						</p>
					</div>

					{files.length > 0 && (
						<div className='mt-6 space-y-4'>
							<h2 className='text-lg font-semibold'>Uploaded Files</h2>
							<div className='space-y-2'>
								{files.map((file, index) => (
									<div
										key={index}
										className='flex items-center justify-between p-3 bg-secondary rounded-lg'
									>
										<div className='flex items-center space-x-2'>
											<FileSpreadsheet className='h-5 w-5' />
											<span>{file.name}</span>
										</div>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => removeFile(index)}
										>
											<X className='h-4 w-4' />
										</Button>
									</div>
								))}
							</div>
						</div>
					)}

					<div className='mt-6 space-y-4'>
						<div className='flex space-x-4'>
							<Input
								placeholder='Output filename'
								value={outputFilename}
								onChange={(e) => setOutputFilename(e.target.value)}
								className='max-w-xs'
							/>
							<Button onClick={handleMerge} disabled={files.length < 2}>
								Merge Files
							</Button>
						</div>
					</div>
				</Card>
			</div>
		</main>
	);
}
