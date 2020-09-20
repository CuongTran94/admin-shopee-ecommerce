// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
              authority: ['admin'],
            },
            {
              name: 'list.category',
              icon: 'table',
              path: '/category',
              component: './Category',
              authority: ['admin'],
            },
            {
              name: 'list.product',
              icon: 'profile',
              path: '/product',
              component: './Product',
              authority: ['admin'],
              routes: [
                {
                  name: 'published',
                  icon: 'table',
                  path: '/product/published',
                  component: './Product/components/ListProduct',
                  authority: ['admin'],
                },
                {
                  name: 'unpublished',
                  icon: 'table',
                  path: '/product/unpublished',
                  component: './Product/components/ListProduct',
                  authority: ['admin'],
                },
                {
                  name: 'create',
                  icon: 'table',
                  path: '/product/create',
                  component: './Product/components/CreateForm',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: 'list.order',
              icon: 'profile',
              path: '/order',
              component: './Order',
              authority: ['admin'],
            },
            {
              name: 'list.slider',
              icon: 'smile',
              path: '/slider',
              component: './Slider',
              authority: ['admin'],
            },
            {
              name: 'list.blog',
              icon: 'dashboard',
              path: '/blog',
              component: './Blog',
              authority: ['admin'],
              routes: [
                {
                  name: 'create',
                  icon: 'table',
                  path: '/blog/create',
                  component: './Blog/components/CreateForm',
                  authority: ['admin'],
                },
                {
                  name: 'list',
                  icon: 'table',
                  path: '/blog/list',
                  component: './Blog/components/List',
                  authority: ['admin'],
                },
                {
                  icon: 'table',
                  path: '/blog/update/:slug',
                  component: './Blog/components/CreateForm',
                  authority: ['admin'],
                },
              ],
            },

            {
              name: 'list.transaction',
              icon: 'crown',
              path: '/transaction',
              component: './Transaction',
              authority: ['admin'],
            },
            // {
            //   name: '查询表格',
            //   icon: 'smile',
            //   path: '/listtablelist',
            //   component: './ListTableList',
            // },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
