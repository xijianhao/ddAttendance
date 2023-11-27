import React, { useState, useEffect } from 'react';
import './index.less';
import axios from 'axios';
import {
  Form,
  Toast,
} from 'dingtalk-design-mobile';
import { Avatar } from 'dingtalk-design-mobile';
import * as dd from 'dingtalk-jsapi';

const Home: React.FC = () => {
  const query = new URLSearchParams(location.search);
  const [openConversationId] = useState(() => {
    return query.get('openConversationId') || '';
  });
  const [userList, setUserList] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>({});
  const [form] = Form.useForm<{
    title: string;
  }>();

  useEffect(() => {
    // 鉴权
    // alert(`----${query.get('corpid')}------` || 'xxxxxxx')
    axios.get('/api/getConfigData', {
      params: {
        // agentId: 'f14744e4-ddf5-4623-93cf-c637157f7e65',
        agentId: 'f14744e4-ddf5-4623-93cf-c637157f7e65',
        url: encodeURIComponent(location.href.split('#')[0])
      }
    }).then((res: any) => {
     
      dd.config({
        nonceStr: res.data.nonceStr,
        timeStamp: res.data.timeStamp,
        signature: res.data.signature,
        appId: res.data.agentId, // 必填，应用ID
        type: 0,
        corpId: query.get('corpid') || 'xxxxxxx', // 必填，企业ID
        jsApiList: [
          'runtime.info',
          'biz.contact.choose',
          'device.notification.confirm',
          'device.notification.alert',
          'device.notification.prompt',
          'biz.ding.post',
          'biz.util.openLink',
        ] // 必填，需要使用的jsapi列表
      });
      // TODO: 需要在这里调用ddconfig
      dd.error(function (err) {
        alert('dd error-------------' + 'f14744e4-ddf5-4623-93cf-c637157f7e65' + JSON.stringify(err));
      });
    })
  }, []);

  useEffect(() => {
    // 获取当前组织免登免登授权码 https://open.dingtalk.com/document/orgapp-client/obtain-the-micro-application-logon-free-authorization-code
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
            // alert(`userdata: ${JSON.stringify(res.data)}`)
            setUserInfo(res.data);
          });
      })
      .catch((err) => {
        // alert('获取授权码失败：' + JSON.stringify(err));
      });
  }, []);


  useEffect(() => {
    axios.post('/api/getVacationList').then((res) => {
      setUserList(res.data.data)
    })
  }, [])

  const handleSubmit = React.useCallback(async () => {
    const { title } = form.getFieldsValue();
    axios
      .post('/api/sendText', {
        txt: title,
        openConversationId,
      })
      .then((res) => {
        Toast.success({ content: '发送消息成功' });
      })
      .catch((err) => {
        Toast.fail({ content: err.message });
      });
  }, [openConversationId]);

  const sendTopCard = React.useCallback(async () => {
    axios
      .post('/api/sendTopCard', {
        openConversationId,
      })
      .then((res) => {
        Toast.success({ content: '发送群吊顶卡片成功' });
      })
      .catch((err) => {
        Toast.fail({ content: err.message });
      });
  }, []);

  const sendMessageCard = React.useCallback(async () => {
    axios
      .post('/api/sendMessageCard', {
        txt: '',
        openConversationId,
      })
      .then((res) => {
        Toast.success({ content: '发送互动卡片成功' });
      })
      .catch((err) => {
        Toast.fail({ content: err.message });
      });
  }, []);

  return (
    <div className="main">
      {
        userList.map((item:any) => (
          <div>
             <Avatar size="default" src={item.info.avatar} />
            <div>{item.info.name}</div>
          </div>
        ))
      }
    </div>
  );
};
export default Home;
