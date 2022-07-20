import type { FC } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';

import { DownOutlined, HeartFilled, LoginOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Dropdown,
  Layout,
  List,
  Menu,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Typography
} from 'antd';
import { useRouter } from 'next/router';
import type { AlignType } from 'rc-table/lib/interface';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface DataType {
  key: React.Key;
  name: string;
  isFavorite: boolean;
}

const Homepage: FC = () => {
  const router = useRouter();
  const [fruits, setFruits] = useState([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [favoriteFruit, setFavoriteFruit] = useState<Array<string>>([]);
  const [visible, setVisible] = useState(false);
  const [spin, setSpin] = useState(true);
  const user = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem('user');
  }, []);

  // get from local storage
  const lsFavFruit = useMemo(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const val = window.localStorage.getItem('favoriteFruit');
    return val && JSON.parse(val) || [];
  }, []);

  const getFavoriteFruit = useCallback(() => {
    setFavoriteFruit(lsFavFruit[user as string]);
  }, [lsFavFruit, user]);

  // Fetch fruit data
  const fetchFruits = useCallback(async () => {
    try {
      const res: Response = await fetch('api/fruits', {
        method: 'GET'
      });

      if (res.ok) {
        const list = await res.json();
        setFruits(list.data);
      }
    } catch (e) {
      message.error('oops!');
    }
  }, []);

  useEffect(() => {
    fetchFruits();
    getFavoriteFruit();
    if (user) setSpin(false);
  }, [fetchFruits, getFavoriteFruit, user]);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [router, user]);

  const mapData = useCallback(async () => {
    const result: DataType[] = [];
    await fruits.map((fruit, i) => {
      let isFavorite = false;
      if (favoriteFruit?.includes(fruit)) isFavorite = true;
      result.push({
        key: i,
        name: fruit,
        isFavorite
      });
    });

    setDataSource(result);
  }, [favoriteFruit, fruits]);

  useEffect(() => {
    mapData();
  }, [mapData]);

  const handleClick = useCallback((name: string, isFavorite: boolean) => () => {
    let temp = favoriteFruit || [];
    if (isFavorite) {
      temp = favoriteFruit?.filter(fruit => fruit != name);
    } else {
      temp?.push(name);
    }

    setFavoriteFruit(temp);
    const localStorageFruits = {
      ...lsFavFruit,
      [user as string]: temp
    };
    window.localStorage.setItem('favoriteFruit', JSON.stringify(localStorageFruits));
    mapData();
  }, [favoriteFruit, lsFavFruit, mapData, user]);

  const handleClickModal = useCallback(() => {
    setVisible(prev => !prev);
  }, []);

  const columns = [
    {
      title: 'Fruit Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as AlignType
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center' as AlignType,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type='primary'
            danger={record.isFavorite}
            onClick={handleClick(record.name, record.isFavorite)}
          >
            {record.isFavorite ? 'Remove from' : 'Add to'} Favorite
          </Button>
        </Space>
      )
    }
  ];

  const handleLogout = useCallback(() => {
    if (typeof window != 'undefined') {
      window.localStorage.removeItem('user');
      router.reload();
    };

  }, [router]);

  const menu = useMemo(() => (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 5
            }}>
              <Text>
                Favorite Fruit
              </Text>
              <Badge count={favoriteFruit?.length} />
            </div>
          ),
          icon: <HeartFilled />,
          onClick: handleClickModal
        },
        {
          key: '2',
          label: (
            <Text>
              Logout
            </Text>
          ),
          icon: <LoginOutlined />,
          onClick: handleLogout
        }
      ]}
    />
  ), [favoriteFruit?.length, handleClickModal, handleLogout]);

  const renderList = useCallback((item: string) => {
    return (
      <List.Item style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 4
      }}>
        {item}
        <Button danger onClick={handleClick(item, true)}>Remove</Button>
      </List.Item>
    );
  }, [handleClick]);

  return (
    <Layout style={{
      height: '100vh'
    }}>
      <Header>
        <Text style={{
          float: 'left',
          color: 'azure',
          fontSize: 20,
          fontWeight: 600
        }}>
          ReturnKey
        </Text>
        <Menu
          theme='dark'
          mode='horizontal'
        />
        <Dropdown overlay={menu}>
          <Space style={{
            float: 'right',
            color: 'whitesmoke',
            fontSize: 15
          }}>
            Profile
            <DownOutlined />
          </Space>
        </Dropdown>
      </Header>
      <Spin spinning={spin} size='large'>
        <Content style={{ padding: '50px 50px' }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              pageSize: 7
            }} />;
          <Modal
            title="My Favorite Fruits"
            visible={visible}
            onOk={handleClickModal}
            onCancel={handleClickModal}
          >
            <List
              bordered
              dataSource={favoriteFruit}
              renderItem={renderList}
            />
          </Modal>
        </Content>
      </Spin>
      <Footer style={{ textAlign: 'center' }}>tmrikza ©2022 Created for returnKey test</Footer>
    </Layout >
  );
};

export default Homepage;