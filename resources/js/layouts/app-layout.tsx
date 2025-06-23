import { names } from '@/lib/utils';
import { CloseOutlined, DashboardFilled, SnippetsOutlined } from '@ant-design/icons';
import { usePage } from '@inertiajs/react';
import MenuFold from '@svg/menu-fold.svg';
import { Divider, Drawer, Flex, Image, Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';
import { type ReactNode } from 'react';
import { useAppContext } from './app-provider';
import MenuItem from './menu-item';

interface AppLayoutProps {
    children: ReactNode;
    header?: string;
}

const menus = [
    {
        title: 'Dashboard',
        href: route(names.dashboard, {}, false),
        icon: <DashboardFilled />,
    },
    {
        title: 'Fund Report',
        href: route(names.reports.index, {}, false),
        icon: <SnippetsOutlined />,
    },
];

export default function AppLayout({ children, header }: AppLayoutProps) {
    const page = usePage();
    const { collapsed, setCollapsed, isMobile } = useAppContext();
    const selectedIndex: string[] = menus.map((item, idx) => (page.url.startsWith(item.href) ? idx.toString() : ''));

    const Menus = (
        <Menu
            theme="dark"
            className="bg-[#26252C]!"
            defaultSelectedKeys={selectedIndex}
            items={menus.map((item, idx) => ({
                key: idx,
                icon: item.icon,
                label: <MenuItem title={item.title} href={item.href} />,
            }))}
        />
    );

    const CloseButton = (
        <Image
            className="ms-auto"
            src={MenuFold}
            preview={false}
            onClick={() => {
                setCollapsed(!collapsed);
            }}
        />
    );

    const DesktopHeader = (
        <div className="flex h-[62px] items-center justify-center px-4 font-bold text-white">
            {!collapsed ? <p className="text-lg">Beryl's Farm</p> : ''}
            {!isMobile && (
                <Flex className="cursor-pointer" justify={collapsed ? 'center' : 'end'} flex={1}>
                    {CloseButton}
                </Flex>
            )}
        </div>
    );

    return (
        <Layout className="overflow-hidden">
            <Sider trigger={null} collapsed={collapsed} className={`hidden sm:block`}>
                {DesktopHeader}
                {Menus}
            </Sider>
            {isMobile && (
                <Drawer
                    placement="left"
                    closeIcon={<CloseOutlined style={{ color: 'white' }} />}
                    classNames={{ body: 'bg-[#26252C]', header: 'bg-[#26252C]' }}
                    open={!collapsed}
                    title={<p className="text-lg text-white">Beryl's Farm</p>}
                    onClose={() => setCollapsed(true)}
                    width={200}
                    className="block sm:hidden"
                >
                    {Menus}
                </Drawer>
            )}
            <Layout className="h-screen overflow-y-hidden">
                <Header style={{ paddingLeft: 16, fontSize: 18 }}>
                    <Flex align="center" gap={5}>
                        {isMobile ? CloseButton : ''}
                        {header}
                    </Flex>
                </Header>
                <Divider className="m-0!" />
                <Content
                    style={{
                        background: '#FFFFFF',
                        height: '100dvh',
                        overflowX: 'hidden',
                        overflowY: 'scroll',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
