import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const names = {
    dashboard: 'dashboard.index',
    reports: {
        index: 'reports.index',
        store: 'reports.store',
        create: 'reports.create',
        show: 'reports.show',
        details: {
            update: 'reports.details.update',
            store: 'reports.details.store',
            delete: 'reports.details.delete',
        },
    },
    employees: {
        list: 'employees.list',
    },
    login: {
        page: 'login',
        action: 'login.post',
    },
    logout: 'logout',
};
