import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import React from 'react';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='flex min-h-screen max-h-screen overflow-hidden'>
			<Sidebar />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<Header />
				<div className='flex-1 overflow-y-auto'>{children}</div>
				<Footer />
			</div>
		</div>
	);
}
