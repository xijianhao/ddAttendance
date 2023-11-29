import { MidwayConfig } from '@midwayjs/core';
import config from './coolapp.config.json';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1666057949427_562',
  koa: {
    port: 7001,
  },
  view: {
    defaultViewEngine: 'nunjucks',
  },
  staticFile: {
    dirs: {
      default: {
        prefix: '/',
        dir: 'website/static',
      },
    }
  },
  // https://open-dev.dingtalk.com/fe/app#/appMgr/inner/h5/1873844213/18?schemaCode=iwjjs&code=COOLAPP-1-101E899DD92E210424AE0001
  demo: {
    appKey: 'dingntyfomwvj0dior3m',
    appSecret: 'WLL2tj39UTjq_NZVMZtILRS6q2vmj5JTobVZPtBdkJjRAQzVbyZjMwKjEOyOIeDv',
    robotCode: 'dingntyfomwvj0dior3m',
    coolAppCode: 'COOLAPP-1-10262E84C04221046C9A0009',
    messageCardTemplateId001: '9b705ffa-b47e-4952-bfa5-dabed67c8572',
    topCardTemplateId001: 'f582b8b8-a86c-4f5c-8b09-1f34af08833d'
  },

  users: ['130939444223857958', '264151115926190239', '033904470626099278'],

  managerUserId: '130939444223857958',
// 6ec52b95-54d1-486d-8fb0-e2915c5077c1 年假
// 3cea0cf2-0de4-4e07-840b-d7782a096802 调休
// 6303f237-7574-4346-aa60-d6083895df9a 事假
  coolAppConfig: config
  
} as MidwayConfig;
