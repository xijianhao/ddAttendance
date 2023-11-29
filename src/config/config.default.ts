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
    appKey: 'dingecnzjhkkjfdjfmz4',
    appSecret: 'EQeNOqBMNYbPV8QXpIer12mhy1k5XiKU8HHTelQLimN4h_IVHOWKK8YlougK50d6',
    robotCode: 'dingecnzjhkkjfdjfmz4',
    coolAppCode: 'COOLAPP-1-1026E9337E8C2107D8A6000N',
    messageCardTemplateId001: '9b705ffa-b47e-4952-bfa5-dabed67c8572',
    topCardTemplateId001: 'f582b8b8-a86c-4f5c-8b09-1f34af08833d'
  },

  users: ['264151115926190239', '130939444223857958'],

  managerUserId: '264151115926190239',
  coolAppConfig: config
  
} as MidwayConfig;
