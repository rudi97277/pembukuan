import { TSortDirection } from '@/components/sort';

export interface IReportDetailProps {
    date: string;
    division: string;
    report_id: number;
    keyword: string;
    used_dates: Array<{ date: string }>;
    divisions: Array<{ value: string; label: string }>;
    sorted: Partial<Record<keyof IReportDetail, TSortDirection>>;
    paginated: {
        last_page: number;
        per_page: number;
        current_page: number;
        data: Array<IReportDetail>;
    };
}
export interface IReportDetail {
    key: string;
    name: string;
    id: number;
    division: string;
    breakfast: TMealSave;
    lunch: TMealSave;
    dinner: TMealSave;
    is_claim_save: boolean;
    quantity: number;
}

export interface IReportDetailFetch {
    keyword?: string;
    date?: string;
    division?: string;
    page?: number;
    page_size?: number;
}
