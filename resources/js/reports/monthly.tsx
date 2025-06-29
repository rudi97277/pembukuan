import { IDivisionData, TMeal, TMealCategory } from '@/types/dashboard';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { TableReport } from './table-report';

interface IMonthlyReportProps {
    period: string;
    division_data: Array<IDivisionData>;
    meal: TMealCategory;
    save: TMealCategory;
}

interface IDivisionTable {
    name: string;
    breakfast: number;
    lunch: number;
    dinner: number;
}
export function MonthlyReport(props: IMonthlyReportProps) {
    let divisionTable: {
        meal: Array<IDivisionTable>;
        save: Array<IDivisionTable>;
    } = { meal: [], save: [] };

    props.division_data.forEach((item) => {
        divisionTable.meal.push({
            name: item.name,
            breakfast: item.breakfast_meal,
            lunch: item.lunch_meal,
            dinner: item.dinner_meal,
        });

        divisionTable.save.push({
            name: item.name,
            breakfast: item.breakfast_save,
            lunch: item.lunch_save,
            dinner: item.dinner_save,
        });
    });

    const mealTypes = ['breakfast', 'lunch', 'dinner'] as TMeal[];
    var saveTotal = 0;
    var mealTotal = 0;
    const summary = mealTypes.map((type) => {
        saveTotal += props.save[type].total;
        mealTotal += props.meal[type].total;
        return {
            type: type.charAt(0).toUpperCase() + type.slice(1),
            meal: props.meal[type].total,
            save: props.save[type].total,
        };
    });
    summary.push({
        type: 'Total',
        meal: mealTotal,
        save: saveTotal,
    });

    return (
        <Document>
            <Page size="A4" style={{ padding: 40 }}>
                <Text style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Beryl Farm — Monthly Report</Text>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>Period: {props.period}</Text>
                <Text style={{ fontSize: 14, marginBottom: 20 }}>Generated on: {dayjs().format('D MMMM YYYY HH:mm:ss')}</Text>
                <View
                    style={{
                        height: 1,
                        backgroundColor: '#ccc',
                        marginBottom: 30,
                        width: '100%',
                    }}
                />

                <Text style={{ fontSize: 14, marginBottom: 10 }}>Total Summary (All Vendor)</Text>
                <TableReport
                    data={summary}
                    columns={[
                        {
                            key: 'division',
                            title: 'Meal Type',
                            dataIndex: 'type',
                        },
                        {
                            key: 'breakfast',
                            title: 'Meal Total',
                            dataIndex: 'meal',
                            type: 'number',
                        },
                        {
                            key: 'lunch',
                            title: 'Save Total',
                            dataIndex: 'save',
                            type: 'number',
                        },
                    ]}
                />

                <Text style={{ fontSize: 14, marginBottom: 10, marginTop: 20 }}>Division Summary (Meal)</Text>
                <TableReport
                    data={divisionTable.meal}
                    columns={[
                        {
                            key: 'division',
                            title: 'Division',
                            dataIndex: 'name',
                        },
                        {
                            key: 'breakfast',
                            title: 'Breakfast',
                            dataIndex: 'breakfast',
                            type: 'number',
                        },
                        {
                            key: 'lunch',
                            title: 'Lunch',
                            dataIndex: 'lunch',
                            type: 'number',
                        },
                        {
                            key: 'dinner',
                            title: 'Dinner',
                            dataIndex: 'dinner',
                            type: 'number',
                        },
                    ]}
                />

                <Text style={{ fontSize: 14, marginBottom: 10, marginTop: 20 }}>Division Summary (Save)</Text>
                <TableReport
                    data={divisionTable.save}
                    columns={[
                        {
                            key: 'division',
                            title: 'Division',
                            dataIndex: 'name',
                        },
                        {
                            key: 'breakfast',
                            title: 'Breakfast',
                            dataIndex: 'breakfast',
                            type: 'number',
                        },
                        {
                            key: 'lunch',
                            title: 'Lunch',
                            dataIndex: 'lunch',
                            type: 'number',
                        },
                        {
                            key: 'dinner',
                            title: 'Dinner',
                            dataIndex: 'dinner',
                            type: 'number',
                        },
                    ]}
                />
            </Page>
        </Document>
    );
}
