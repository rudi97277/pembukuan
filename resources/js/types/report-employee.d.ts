import { TSortDirection } from '@/components/sort';

export interface IReportEmployee {
    id: number;
    name: string;
    division: string;
    date: string;
    claim_total: number;
    save_total: number;
}

export interface IReportEmployeeProps {
    period: string;
    division: string;
    keyword: string;
    divisions: Array<{ value: string; label: string }>;
    sorted: Partial<Record<keyof IReportDetail, TSortDirection>>;
    data: Array<IReportEmployee>;
}

export interface IReportEmployeeFetch {
    keyword?: string;
    period?: string;
    division?: string;
    page?: number;
    page_size?: number;
}
