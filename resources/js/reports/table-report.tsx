import { StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

type Column<T> = {
    key: string;
    title: string;
    type?: 'string' | 'number' | 'date';
    dataIndex: keyof T;
}
interface ITableReportProps<T> {
    data: Array<T>;
    withNumber?: boolean;
    columns: Column<T>[];
}

export function TableReport<T>(props: ITableReportProps<T>) {
    const { data, columns } = props;
    const styles = StyleSheet.create({
        table: {
            borderRadius: 10,
            width: '100%',
            border: '1px solid #eee',
        },
        row: {
            flexDirection: 'row',
            borderBottom: '1px solid #eee',
        },
        header: {
            backgroundColor: '#f3f4f6',
            fontWeight: 'bold',
        },
        cell: {
            width: `${(props.withNumber === true ? 90 : 100) / props.columns.length}%`,
            padding: 8,
            fontSize: 8,
        },
    });


    const getValue = (item: T, dataIndex: keyof T): string => (typeof item === 'object' && item !== null ? (item[dataIndex] as string) : '');

    const formatter = (item: T, col: Column<T>) => {
        const value = getValue(item, col.dataIndex);

        switch (col.type) {
            case 'number':
                return Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(value))
            case 'date':
                return dayjs(value).locale('id').format('DD MMMM YYYY');
            default:
                return value;
        }
    }

    return (
        <View style={[styles.table]} wrap={true}>
            <View
                style={[
                    styles.row,
                    styles.header,
                    {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        fontSize: 8,
                    },
                ]}
                break={false}
            >
                {props.withNumber && (
                    <Text key="no" style={{ ...styles.cell, width: 30 }}>
                        No
                    </Text>
                )}
                {columns.map((col, index) => (
                    <Text key={`${col.key}${index}`} style={styles.cell}>
                        {col.title}
                    </Text>
                ))}
            </View>

            {data.map((item, idx) => (
                <View key={idx} style={[styles.row]} wrap={true}>
                    {props.withNumber && (
                        <Text key={`no-${idx}`} style={{ ...styles.cell, width: 30 }}>
                            {idx + 1}
                        </Text>
                    )}
                    {columns.map((col, index) => (
                        <Text key={`${col.key}${index}`} style={styles.cell}>
                            {formatter(item, col)}
                        </Text>
                    ))}
                </View>
            ))}
        </View>
    );
}
