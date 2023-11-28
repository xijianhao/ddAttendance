import React, { useState, useEffect } from 'react';
import './index.less';
import axios from 'axios';
import { Form, Spin, Modal,Tag, TagColorEnum } from 'dingtalk-design-mobile';
import { Avatar } from 'dingtalk-design-mobile';
import * as dd from 'dingtalk-jsapi';
import dayjs from 'dayjs'

const Home: React.FC = () => {
  const query = new URLSearchParams(location.search);
  const [openConversationId] = useState(() => {
    return query.get('openConversationId') || '';
  });
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<any>([]);
  const [vacationTypeList, setVacationTypeList] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>({});
  const [form] = Form.useForm<{
    title: string;
  }>();

  // useEffect(() => {
  //   // 鉴权
  //   // alert(`----${query.get('corpid')}------` || 'xxxxxxx')
  //   axios
  //     .get('/api/getConfigData', {
  //       params: {
  //         // agentId: 'f14744e4-ddf5-4623-93cf-c637157f7e65',
  //         agentId: 'f14744e4-ddf5-4623-93cf-c637157f7e65',
  //         url: encodeURIComponent(location.href.split('#')[0]),
  //       },
  //     })
  //     .then((res: any) => {
  //       dd.config({
  //         nonceStr: res.data.nonceStr,
  //         timeStamp: res.data.timeStamp,
  //         signature: res.data.signature,
  //         appId: res.data.agentId, // 必填，应用ID
  //         type: 0,
  //         corpId: query.get('corpid') || 'xxxxxxx', // 必填，企业ID
  //         jsApiList: [
  //           'runtime.info',
  //           'biz.contact.choose',
  //           'device.notification.confirm',
  //           'device.notification.alert',
  //           'device.notification.prompt',
  //           'biz.ding.post',
  //           'biz.util.openLink',
  //         ], // 必填，需要使用的jsapi列表
  //       });
  //       // TODO: 需要在这里调用ddconfig
  //       dd.error(function (err) {
  //         alert(
  //           'dd error-------------' +
  //             'f14744e4-ddf5-4623-93cf-c637157f7e65' +
  //             JSON.stringify(err),
  //         );
  //       });
  //     });
  // }, []);

  // useEffect(() => {
  //   // 获取当前组织免登免登授权码 https://open.dingtalk.com/document/orgapp-client/obtain-the-micro-application-logon-free-authorization-code
  //   dd.runtime.permission
  //     .requestAuthCode({
  //       corpId: query.get('corpId') || query.get('corpid') || '', // 企业id
  //     })
  //     .then((info) => {
  //       const code = info.code; // 通过该免登授权码可以获取用户身份
  //       axios
  //         .get('/api/getUserInfo', {
  //           params: {
  //             requestAuthCode: code,
  //           },
  //         })
  //         .then((result) => {
  //           return result.data;
  //         })
  //         .then((res) => {
  //           // alert(`userdata: ${JSON.stringify(res.data)}`)
  //           setUserInfo(res.data);
  //         });
  //     })
  //     .catch((err) => {
  //       // alert('获取授权码失败：' + JSON.stringify(err));
  //     });
  // }, []);

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
                      const findData:any = vItem.users?.find((findItem:any) => findItem.userid === item.info.userid)
                      const day = (findData?.quota_num_per_day - findData?.used_num_per_day) /100
                      return (
                        <div key={vItem.leave_name} className='user-item'>
                          {day? <span style={{fontWeight: 700}}>{day}</span>: 0}
                        </div>
                      )
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
