'use client';

import { Bell, MessageSquare, Search } from 'lucide-react';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ThemeToggle from './theme-toggle';
const Header = () => {
	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/95 background-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex h-16 items-center gap-4 px-6'>
				<div className='flex flex-1 items-center gap-4'>
					<div className='relative w-96'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input placeholder='Pesquisar....' className='pl-8' />
					</div>
				</div>
				<ThemeToggle />
				<div className='flex items-center gap-4'>
					<Button variant='ghost' size='icon' className='relative'>
						<MessageSquare className='h-5 w-5' />
						<span className='absolute -right-0 5 -top-0 5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground'>
							5
						</span>
					</Button>
					<Button variant='ghost' size='icon' className='relative'>
						<Bell className='h-5 w-5' />
						<span className='absolute -right-0 5 -top-0 5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground'>
							3
						</span>
					</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
