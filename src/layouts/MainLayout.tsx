import { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useMediaQuery } from '../hooks/useMediaQuery';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('apiKey');
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '监控面板',
      onClick: () => {
        navigate('/dashboard');
        setDrawerOpen(false);
      }
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => {
        navigate('/settings');
        setDrawerOpen(false);
      }
    },
  ];

  const currentPath = location.pathname.replace('/', '') || 'dashboard';

  const renderMenu = () => (
    <Menu
      mode={isMobile ? "vertical" : "inline"}
      selectedKeys={[currentPath]}
      items={menuItems}
      style={{ height: '100%', borderRight: 0 }}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 16px', 
        background: '#fff', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
          />
        )}
        <h1 style={{ 
          margin: 0, 
          fontSize: isMobile ? '18px' : '20px',
          flex: 1,
          textAlign: isMobile ? 'center' : 'left'
        }}>
          BLV 监控系统
        </h1>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        />
      </Header>

      <Layout style={{ marginTop: 64 }}>
        {isMobile ? (
          <Drawer
            title="菜单"
            placement="left"
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            bodyStyle={{ padding: 0 }}
          >
            {renderMenu()}
          </Drawer>
        ) : (
          <Sider
            width={200}
            theme="light"
            style={{
              overflow: 'auto',
              height: 'calc(100vh - 64px)',
              position: 'fixed',
              left: 0,
              top: 64,
              bottom: 0,
            }}
          >
            {renderMenu()}
          </Sider>
        )}

        <Layout style={{ 
          padding: '24px',
          marginLeft: isMobile ? 0 : 200
        }}>
          <Content style={{
            background: '#fff',
            padding: isMobile ? 16 : 24,
            borderRadius: 8,
          }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
