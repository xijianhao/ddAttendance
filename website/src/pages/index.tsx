import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Modal, Tag, TagColorEnum } from 'dingtalk-design-mobile';
import { Avatar } from 'dingtalk-design-mobile';
import './index.less';
import * as dd from 'dingtalk-jsapi';

const managerList = ['130939444223857958']; // 管理员

const Home: React.FC = () => {
  const query = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [userList, setUserList] = useState<any>([]);
  const [vacationTypeList, setVacationTypeList] = useState<any>([]);

  useEffect(() => {
    dd.runtime.permission
      .requestAuthCode({
        corpId: query.get('corpId') || query.get('corpid') || '', // 企业id
      })
      .then((info) => {
        const code = info.code; // 通过该免登授权码可以获取用户身份
        axios
          .get('/api/getUserInfo', {
            params: {
              requestAuthCode: code,
            },
          })
          .then((result) => {
            setCurrentUser({
              ...result.data.data,
            });
          });
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .post('/api/getVacationList')
      .then((res) => {
        setUserList(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.post('/api/getVacationTypeList').then((res) => {
      setVacationTypeList(res.data.data);
    });
  }, []);

  return (
    <div className="main">
      <div className="title">
        <span> 当前用户：</span>
        <Avatar size="small" src={currentUser.avatar} className='title-avatar' />
        <span>{currentUser.name}</span>
      </div>
      <div className="header">
        <div className="header-title">
          <div className="header-title-right">类型</div>
          <div className="header-title-left">人员</div>
        </div>
        <div className="header-content">
          {vacationTypeList.map((item: any) => (
            <div className="header-item">
              <div> {item.leave_name.slice(0, 2)}</div>
              <Tag
                size="small"
                color="#fff"
                fill="outline"
                style={{ border: 'none' }}
              >
                <span>{item.leave_view_unit}</span>
              </Tag>
            </div>
          ))}
        </div>
      </div>
      <div>
        {loading ? (
          <Spin text="加载中" fixed />
        ) : (
          <div>
            {userList.map((item: any) => (
              <div key={item.info.name} className="userBox">
                <div
                  className="user"
                  style={{
                    cursor: !item.approve_list?.length ? '' : 'pointer',
                  }}
                  onClick={() => {
                    if (!item.approve_list?.length) {
                      return;
                    } else {
                      Modal.alert(
                        <div>{item.info.name}</div>,
                        <div>
                          <div style={{ marginBottom: '10px' }}>
                            <Tag size="medium" color={TagColorEnum.Warning}>
                              {item.approve_list[0].sub_type}{' '}
                              {item.approve_list[0].duration}天
                            </Tag>
                          </div>
                          <Tag size="medium">
                            {item.approve_list[0].begin_time}
                          </Tag>
                          <div>～</div>
                          <Tag size="medium">
                            {item.approve_list[0].end_time}
                          </Tag>
                        </div>,
                        [
                          {
                            text: '关闭',
                          },
                        ],
                      );
                    }
                  }}
                >
                  <Avatar
                    size={!item.approve_list?.length ? 'default' : 'small'}
                    src={item.info.avatar}
                  />
                  <div
                    style={{
                      color: !item.approve_list?.length ? '#049DD9' : '#ff9200',
                    }}
                  >
                    {item.info.name}
                  </div>
                  <div className="user-status">
                    {item?.approve_list[0]?.sub_type}
                  </div>
                </div>
                <div className="user-content">
                  {vacationTypeList.map((vItem: any) => {
                    const findData = managerList.includes(currentUser.userid)
                      ? vItem.users?.find(
                          (findItem: any) =>
                            findItem.userid === item.info.userid,
                        )
                      : vItem.users?.find(
                          (findItem: any) =>
                            findItem.userid === item.info.userid,
                        );
                    // const findData = managerList.includes(currentUser.userid)
                    // ? vItem.users?.find((findItem:any) => findItem.userid === item.info.userid)
                    // : vItem.users?.find((findItem:any) => findItem.userid === currentUser.userid && (item.info.userid === currentUser.userid))

                    let num = 0;
                    if (findData?.quota_num_per_hour) {
                      num =
                        (findData?.quota_num_per_hour -
                          findData?.used_num_per_hour) /
                        100;
                    }
                    if (findData?.quota_num_per_day) {
                      num =
                        (findData?.quota_num_per_day -
                          findData?.used_num_per_day) /
                        100;
                    }
                    return (
                      <div key={vItem.leave_name} className="user-item">
                        {num ? (
                          <span style={{ fontWeight: 700 }}>{num}</span>
                        ) : (
                          '-'
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
