'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
	LayoutDashboard,
	Users,
	Settings,
	ChevronLeft,
	BarChart3,
	FileArchiveIcon,
	MapIcon,
	UploadIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

const menuItems = [
	{ icon: LayoutDashboard, label: 'Dashboard', href: '/' },
	{ icon: FileArchiveIcon, label: 'Files Processing', href: '/files' },
	{ icon: MapIcon, label: 'Variables Mapping', href: '/mapping' },
	{ icon: BarChart3, label: 'Analytics', href: '/analytics' },
	{ icon: UploadIcon, label: 'Upload', href: '/upload' },
	{ icon: Users, label: 'Users', href: '/users' },
	{ icon: Settings, label: 'Settings', href: '/settings' },
];

const Sidebar = () => {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();
	const isSmallScreen = useMediaQuery('(max-width: 768px)');

	useEffect(() => {
		if (isSmallScreen) {
			setCollapsed(true);
		}
	}, [isSmallScreen]);
	return (
		<div
			className={cn(
				'relative min-h-screen border-r bg-card px-3 py-8 duration-300',
				collapsed ? 'w-16' : 'w-64'
			)}
		>
			<Button
				variant='ghost'
				size='icon'
				className={cn(
					'absolute -right-4 top-7 z-50 h-8 w-8 rounded-full border bg-background',
					isSmallScreen && 'md:hidden'
				)}
				onClick={() => setCollapsed(!collapsed)}
			>
				<ChevronLeft
					className={cn('h-4 w-4 duration-200', collapsed && 'rotate-180')}
				/>
			</Button>

			<div className='mb-8 flex items-center justify-center'>
				<LayoutDashboard className='h-8 w-8 text-primary' />
				{!collapsed && <span className='ml-3 text-xl font-bold'>Admin</span>}
			</div>

			<nav className='space-y-2'>
				{menuItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
							'hover:bg-accent hover:text-accent-foreground',
							pathname === item.href
								? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
								: 'text-muted-foreground'
						)}
					>
						<item.icon className='h-4 w-4' />
						{!collapsed && <span className='ml-3'>{item.label}</span>}
					</Link>
				))}
			</nav>
		</div>
	);
};

export default Sidebar;
