import { Document, Page, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';

export function MonthlyReport() {
    const props = {
        period: 'April 2025',
        name: 'Yuli (admin)',
    };

    return (
        <Document>
            <Page size="A4" style={{ padding: 40 }}>
                <Text style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Beryl Farm — Monthly Report</Text>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>Period: {props.period}</Text>
                <Text style={{ fontSize: 14, marginBottom: 20 }}>
                    Generated on: {dayjs().format('DD MMMM YYYY')} by {props.name}
                </Text>
                <View
                    style={{
                        height: 1,
                        backgroundColor: '#ccc',
                        marginBottom: 30,
                        width: '100%',
                    }}
                />
                <Text style={{ fontSize: 14, marginBottom: 10 }}>Total Summary (All Vendor)</Text>
            </Page>
        </Document>
    );
}
