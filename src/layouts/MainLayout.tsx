import { Layout, Menu } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('apiKey');  // 改为移除 apiKey
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 24px', 
        background: '#fff', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1>BLV 监控系统</h1>
        <LogoutOutlined onClick={handleLogout} style={{ fontSize: 20 }} />
      </Header>
      <Layout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            style={{ height: '100%' }}
            items={[
              {
                key: 'dashboard',
                icon: <DashboardOutlined />,
                label: '监控面板',
                onClick: () => navigate('/dashboard')
              },
              {
                key: 'settings',
                icon: <SettingOutlined />,
                label: '系统设置',
                onClick: () => navigate('/settings')
              },
            ]}
          />
        </Sider>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
