import { Provide, Config, Logger } from '@midwayjs/decorator';
import { makeHttpRequest, MidwayError } from '@midwayjs/core';
import { ILogger } from '@midwayjs/logger';
import dayjs from 'dayjs'

@Provide()
export class UserService {
  access_token: string;
  constructor(){
    this.access_token = ''
  }

  @Logger()
  logger: ILogger;

  @Config('coolAppConfig')
  demoConfig;

  @Config('users')
  users;

  @Config('managerUserId')
  managerUserId;

   /**
   * 获取用户信息
   */
  async getUserInfo(requestAuthCode: string) {
    try{
      const access_token = await this.getToken();
      const res: any = await makeHttpRequest(
        `https://oapi.dingtalk.com/user/getuserinfo?access_token=${access_token}&code=${requestAuthCode}`,
        {
          dataType: 'json',
          contentType: 'json',
        }
      );
      if(res.data && res.data.userid){
        const info = await this.getUserProfile(res.data.userid);
        if(info){
          return {
            name:info.name,
            userid: info.userid,
            avatar: info.avatar
          }
        }
      }
    } catch(error){
      console.log('userinfo-----',error)
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

   /**
   * 获取token
   */
  async getToken() {
    try {
      const result: any = await makeHttpRequest(
        `https://oapi.dingtalk.com/gettoken?appkey=${this.demoConfig.appKey}&appsecret=${this.demoConfig.appSecret}`,
        {
          dataType: 'json',
        }
      );
      if (result.status === 200) {
        return result.data.access_token;
      }
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

  async getUserProfile(uid: string) {
    try {
      const access_token = await this.getToken();
      const result: any = await makeHttpRequest( // https://open.dingtalk.com/document/orgapp-server/query-user-details
        `https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${access_token}`,
        {
          dataType: 'json',
          contentType: 'json',
          data: {
            language: 'zh_CN',
            userid: uid,
          },
          method: 'POST',
          headers: {
            'x-acs-dingtalk-access-token': access_token,
          },
        }
      );
      return result.data.result;
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

   /**
   * 获取用户信息新接口
   * https://open.dingtalk.com/document/orgapp-server/obtain-the-userid-of-a-user-by-using-the-log-free
   */
  async getUserInfoNew(requestAuthCode: string) {
    try {
      const access_token = await this.getToken();
      const result: any = await makeHttpRequest(
        `https://oapi.dingtalk.com/topapi/v2/user/getuserinfo?access_token=${access_token}`,
        {
          dataType: 'json',
          contentType: 'json',
          data: {
            code:requestAuthCode
          },
          method: 'POST',
          headers: {
            'x-acs-dingtalk-access-token': access_token,
          },
        }
      );
      return result.data.result;
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }


  // 获取假期列表
  async getVacationList() {
    let result = []
    for (const iterator of  this.users) {
      result.push({
        info: await this.getUser(iterator),
        approve_list: await this.getUserAttendance(iterator)
      })
    }
    return result
  }

  // 获取单个用户考勤数据
  async getUserAttendance(userid:string) {
    try {
      const access_token = await this.getToken();
      const result: any = await makeHttpRequest(
        `https://oapi.dingtalk.com/topapi/attendance/getupdatedata?access_token=${access_token}`,
        {
          dataType: 'json',
          data:{
            userid,
            work_date: dayjs().format('YYYY-MM-DD')
          }
        }
      );
      if (result.status === 200) {
        const {approve_list} = result.data.result
        return approve_list
      } 
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }
  // 获取单个用户基本信息
  async getUser(userid:string) {
    try {
      const access_token = await this.getToken();
      const result: any = await makeHttpRequest(
        `https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${access_token}`,
        {
          dataType: 'json',
          data:{
            userid,
          }
        }
      );
      if (result.status === 200) {
        const {avatar, name, mobile, hide_mobile, title, userid} = result?.data?.result
        return {
          avatar, name, mobile, hide_mobile, title, userid
        }
      } 

    } catch (error) {
      console.log('error---',error)
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

  // 获取假期类型列表
  async getVacationTypeList() {
    try {
      const access_token = await this.getToken();
      const result: any = await makeHttpRequest(
        `https://oapi.dingtalk.com/topapi/attendance/vacation/type/list?access_token=${access_token}`,
        {
          dataType: 'json',
          data:{
            op_userid: this.managerUserId, // 管理员userid
            vacation_source: 'all'
          }
        }
      );

        const resultArr = [];
    
      if (result.status === 200) {
        for (const iterator of result.data.result) {
          const qoutaResult: any = await makeHttpRequest(
            `https://oapi.dingtalk.com/topapi/attendance/vacation/quota/list?access_token=${access_token}`,
            {
              dataType: 'json',
              data:{
                leave_code: iterator.leave_code, 
                op_userid: this.managerUserId,
                userids:this.users,
                offset: 0,
                size: 50,
              }
            }
          );
          resultArr.push({
            ...iterator,
            users: qoutaResult.data.result.leave_quotas,
          })
        }
        return resultArr
      } 
      return resultArr

    } catch (error) {
      console.log('error---',error)
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }
}
