import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { APP_DESCRIPTION, SERVER_URL } from '@/lib/constants';
import { APP_NAME } from '@/lib/constants';
import { ThemeProvider } from '@/components/theme-provider';
import { ReduxProvider } from '@/lib/store/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		template: '%s | ' + APP_NAME,
		default: APP_NAME,
	},
	description: APP_DESCRIPTION,
	metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${inter.className} antialiased`}>
				<ReduxProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
