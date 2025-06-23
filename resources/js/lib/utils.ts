import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const names = {
    dashboard: 'dashboard',
    reports: {
        index: 'reports.index',
        store: 'reports.store',
        create: 'reports.create',
        show: 'reports.show',
        details: {
            update: 'reports.details.update',
            store: 'reports.details.store',
        },
    },
};
