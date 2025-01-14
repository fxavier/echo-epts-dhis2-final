'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useDispatch } from 'react-redux';
import { setTheme as setReduxTheme } from '@/lib/store/themeSlice';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { setTheme, theme } = useTheme();
	const dispatch = useDispatch();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
		setTheme(newTheme);
		dispatch(setReduxTheme(newTheme));
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon'>
					<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => handleThemeChange('light')}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleThemeChange('dark')}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleThemeChange('system')}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
