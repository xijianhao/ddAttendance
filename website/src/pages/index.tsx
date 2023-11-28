import React, { useState, useEffect } from 'react';
import './index.less';
import axios from 'axios';
import { Spin, Modal,Tag, TagColorEnum } from 'dingtalk-design-mobile';
import { Avatar } from 'dingtalk-design-mobile';
import * as dd from 'dingtalk-jsapi';

const managerList = ['130939444223857958'] // 管理员

const Home: React.FC = () => {
  const query = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({})
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
            return result.data;
          })
          .then((res) => {
            setCurrentUser({
              ...res.data,
            });
          });
      })
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
    })
  }, [])

  return (
    <div className="main">
      <div className="header">
        <div className="header-title">运维组</div>
        <div className="header-content" >
          {vacationTypeList.map((item:any) => (
            <div className="header-item">
              {item.leave_name}
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
              <div key={item.info.name} className='userBox'>
                <div
                  className="user"
                  style={{
                    cursor: !item.approve_list?.length ? '' : 'pointer',
                  }}
                  onClick={() => {
                    if (!item.approve_list?.length) {
                      return;
                    } else {
                      Modal.alert(<div>
                        {item.info.name} 
                      </div>, <div>
                          <div style={{marginBottom: '8px'}}><Tag size="medium" color={TagColorEnum.Warning}>{item.approve_list[0].sub_type} {item.approve_list[0].duration}天</Tag></div>
                          <div>{item.approve_list[0].begin_time}</div>
                          <div>～</div>
                          <div>{item.approve_list[0].end_time}</div>

                      </div>, [
                        {
                          text: '关闭',
                        },
                      ]);
                    }
                  }}
                >
                  <Avatar size="default" src={item.info.avatar} />
                  <div
                    style={{
                      color: !item.approve_list?.length ? '#049DD9' : '#ff9200',
                    }}
                  >
                    {item.info.name}
                  </div>
                </div>
                <div className='user-content'>
                  {
                    vacationTypeList.map((vItem:any) => {
                      if(managerList.includes(currentUser.userid)){
                        const findData:any = vItem.users?.find((findItem:any) => findItem.userid === item.info.userid)
                        const day = (findData?.quota_num_per_day - findData?.used_num_per_day) /100
                        return (
                          <div key={vItem.leave_name} className='user-item'>
                            {day? <span style={{fontWeight: 700}}>{day}</span>: '-'}
                          </div>
                        )
                      }else{
                        const findData:any = vItem.users?.find((findItem:any) => findItem.userid === currentUser.userid && (item.info.userid === currentUser.userid))
                        const day = (findData?.quota_num_per_day - findData?.used_num_per_day) / 100
                        return (
                          <div key={vItem.leave_name} className='user-item'>
                            {day? <span style={{fontWeight: 700}}>{day}</span>: '-'}
                          </div>
                        )
                      }
                 
                    })
                  }
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
