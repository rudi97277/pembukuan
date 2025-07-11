export type TMeal = 'breakfast' | 'lunch' | 'dinner';
export type TMealSaveMini = 'meal' | 'claim' | 'save';
export type TMealData = {
    total: number;
    data: Array<number>;
    trend: 'up' | 'down';
};

export type TMealCategory = Record<TMeal, TMealData>;

export interface IDivisionData {
    key: string;
    name: string;
    breakfast_meal: number;
    breakfast_save: number;
    lunch_meal: number;
    lunch_save: number;
    dinner_meal: number;
    dinner_save: number;
}

export interface ITrend {
    graph: Array<{ name: string; Meal: number; Save: number }>;
    meal: number;
    claim: number;
    save: number;
}

export interface IDashboardProps {
    meal: TMealCategory;
    save: TMealCategory;
    claim: TMealCategory;
    division_data: Array<IDivisionData>;
    period: string;
    trend: ITrend;
}
