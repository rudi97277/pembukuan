import { type BreadcrumbItem } from '@/types';
import { ConfigProvider } from 'antd';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState, type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const AppContext = createContext<TAppContext | undefined>(undefined);

type TAppContext = {
    collapsed: boolean;
    setCollapsed: Dispatch<SetStateAction<boolean>>;
    isMobile: boolean;
    setIsMobile: Dispatch<SetStateAction<boolean>>;
};

export const AppProvider = ({ children }: AppLayoutProps) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setCollapsed(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <AppContext.Provider value={{ collapsed, setCollapsed, isMobile, setIsMobile }}>
            <ConfigProvider
                theme={{
                    components: {
                        Segmented: {
                            itemSelectedBg: '#FF6A00',
                            itemSelectedColor: 'white',
                        },
                        Switch: {},
                        Layout: {
                            siderBg: '#26252C',
                            headerBg: '#FFFFFF',
                        },
                    },
                    token: {
                        colorPrimary: '#FF6A00',
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useSideBar must be used within an AppProvider');
    }
    return context;
};
