import React from 'react';

const HomePage = () => {
	return (
		<main className='flex-1 p-4 md:p-6'>
			<div className='mb-6 md:mb-8'>
				<h1 className='text-2xl md:text-3xl font-bold text-foreground'>
					Dashboard
				</h1>
				<p className='text-muted-foreground'>
					Welcome back to your admin dashboard.
				</p>
			</div>
			<div className='grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
				{[
					'Total Users',
					'Files Processed',
					'Files Mapped',
					'Files Uploaded',
				].map((title, i) => (
					<div
						key={title}
						className='rounded-xl border bg-card p-4 md:p-6 text-card-foreground shadow-sm'
					>
						<div className='flex items-center justify-between'>
							<p className='text-sm font-medium text-muted-foreground'>
								{title}
							</p>
							<div className='h-4 w-4 rounded-full bg-primary/10' />
						</div>
						<div className='mt-2'>
							<p className='text-xl md:text-2xl font-bold'>
								{i === 2 ? '172' : i === 3 ? '24' : (i + 1) * 4}
							</p>
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default HomePage;
