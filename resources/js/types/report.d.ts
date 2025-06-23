import { TSortDirection } from '@/components/sort';

export interface IReport {
    key: string;
    id: number;
    period: string;
    is_complete: boolean;
    working_days: number;
    details: Array<{
        date: string;
    }>;
}

export interface IReportProps {
    paginated: {
        last_page: number;
        per_page: number;
        current_page: number;
        data: Array<IReport>;
    };
    year: string;
    keyword: string;
    sorted: Partial<Record<keyof IReport, TSortDirection>>;
}

export interface IReportFetch {
    keyword?: string;
    year?: string;
    page?: number;
    page_size?: number;
}
