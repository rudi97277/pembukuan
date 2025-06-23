import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout header="Vendor Fund Report">
            <div>
                <Head title="Dashboard" />
                <h1>Dashboard</h1>
            </div>
        </AppLayout>
    );
}
