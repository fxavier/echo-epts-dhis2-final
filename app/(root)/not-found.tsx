'use client';

import { Button } from '@/components/ui/button';
import { Construction, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
	return (
		<div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4'>
			<div className='max-w-md w-full text-center'>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.5 }}
					className='mb-8'
				>
					<Construction className='h-24 w-24 text-primary mx-auto' />
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					<h1 className='text-6xl font-bold text-gray-900 dark:text-white mb-4'>
						404
					</h1>
					<h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
						Página não encontrada
					</h2>
					<p className='text-gray-600 dark:text-gray-400 mb-8'>
						Desculpe, a página que você está procurando nao existe ou ainda não
						foi construída ou está em reforma.
					</p>

					<Link href='/'>
						<Button
							size='lg'
							className='bg-[#003566] hover:bg-[#001d3d] text-white inline-flex items-center gap-2'
						>
							<Home className='h-4 w-4' />
							Voltar ao Início
						</Button>
					</Link>
				</motion.div>
			</div>
		</div>
	);
}
