import { Heart } from 'lucide-react';
import React from 'react';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='border-t bg-card/95 text-muted-foreground'>
			<div className='mx-auto px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<span className='text-sm'>
							© {currentYear} EHO Project. All rights reserved.
						</span>
					</div>
					<div className='flex items-center space-x-4 text-sm'>
						<a href='#' className='hover:text-foreground transition-colors'>
							Privacy Policy
						</a>
						<span className='text-muted-foreground/60'>•</span>
						<a href='#' className='hover:text-foreground transition-colors'>
							Terms of Service
						</a>
						<span className='text-muted-foreground/60'>•</span>
						<span className='flex items-center gap-1'>
							Made with <Heart className='h-4 w-4 text-primary' /> by EHO SI
							Team
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
