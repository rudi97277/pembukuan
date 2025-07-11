import { names } from '@/lib/utils';
import { CloseOutlined, DashboardFilled, LoginOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';
import MenuFold from '@svg/menu-fold.svg';
import { Button, Divider, Drawer, Flex, Image, Layout, Menu, Typography } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';
import { JSX, type ReactNode } from 'react';
import { useAppContext } from './app-provider';
import MenuItem from './menu-item';

interface AppLayoutProps {
    children: ReactNode;
    header?: string | ReactNode | JSX.Element;
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

interface IAuth {
    user: {
        name: string;
        email: string;
    };
}

export default function AppLayout({ children, header }: AppLayoutProps) {
    const page = usePage();
    const auth = page.props.auth as IAuth;
    const { collapsed, setCollapsed, isMobile } = useAppContext();
    const selectedIndex: string[] = menus.map((item, idx) => (page.url.startsWith(item.href) ? idx.toString() : ''));

    const Menus = (
        <Menu
            theme="dark"
            className="bg-[#26252C]!"
            defaultSelectedKeys={selectedIndex}
            onClick={() => {
                isMobile && setCollapsed(true);
            }}
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
                <div className="relative">
                    {DesktopHeader}
                    {Menus}
                </div>
                <div className="absolute bottom-0 w-full p-2 font-semibold text-white">
                    <div
                        style={{ background: '#4B556396', backdropFilter: 'blur(21.700000762939453px)' }}
                        className="flex w-full flex-row items-center justify-center gap-2 rounded-xl p-2"
                    >
                        {collapsed ? (
                            ''
                        ) : (
                            <>
                                <div className="flex size-8 items-center justify-center rounded-full border">
                                    <UserOutlined />
                                </div>
                                <div className="flex flex-col">
                                    <Typography.Text ellipsis style={{ maxWidth: 100, color: 'white' }}>
                                        {auth.user.name}
                                    </Typography.Text>
                                    <p>Admin</p>
                                </div>
                            </>
                        )}
                        <Button type="text" className="p-0!" onClick={() => router.post(route(names.logout), {}, { preserveScroll: true })}>
                            <LoginOutlined style={{ color: '#FF6A00' }} />
                        </Button>
                    </div>
                </div>
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
                <Header style={{ paddingLeft: 28, fontSize: 18 }}>
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
