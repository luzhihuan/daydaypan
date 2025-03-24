import {createRouter, createWebHistory} from 'vue-router'
import VueCookies from "vue-cookies";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/Login.vue'),
        },
        {
            path: '/',
            name: 'Framework',
            component: () => import('@/views/Framework.vue'),
            children: [
                {
                    path: '/main/:category',
                    name: '首页',
                    meta: {
                        needLogin: true,
                        menuCode: 'main'
                    },
                    component: () => import('@/views/main/Main.vue')
                },
                {
                    path: '/myshare',
                    name: '我的分享',
                    meta: {
                        needLogin: true,
                        menuCode: 'share'
                    },
                    component: () => import('@/views/share/Share.vue')
                },
                {
                    path: '/recycle',
                    name: '回收站',
                    meta: {
                        needLogin: true,
                        menuCode: 'recycle'
                    },
                    component: () => import('@/views/recycle/Recycle.vue')
                },
                {
                    path: '/friends/addFriends',
                    name: '添加好友',
                    meta: {
                        needLogin: true,
                        menuCode: 'friends'
                    },
                    component: () => import('@/views/friends/AddFriends.vue')
                },
                {
                    path: '/friends/myFriends',
                    name: '我的好友',
                    meta: {
                        needLogin: true,
                        menuCode: 'friends'
                    },
                    component: () => import('@/views/friends/MyFriends.vue')
                },
                {
                    path: '/friends/applyFriends',
                    name: '好友申请',
                    meta: {
                        needLogin: true,
                        menuCode: 'friends'
                    },
                    component: () => import('@/views/friends/ApplyFriends.vue')
                },
                // {
                //     path: '/friends/friendsMessage',
                //     name: '好友消息',
                //     meta: {
                //         needLogin: true,
                //         menuCode: 'friends'
                //     },
                //     component: () => import('@/views/friends/FriendsMessage.vue')
                // },
                {
                    path: '/settings/sysSettings',
                    name: '系统设置',
                    meta: {
                        needLogin: true,
                        menuCode: 'settings',
                    },
                    component: () => import('@/views/admin/SysSettings.vue')
                },
                {
                    path: '/settings/userList',
                    name: '用户管理',
                    meta: {
                        needLogin: true,
                        menuCode: 'settings',
                    },
                    component: () => import('@/views/admin/UserList.vue')
                },
                {
                    path: '/settings/fileList',
                    name: '用户文件',
                    meta: {
                        needLogin: true,
                        menuCode: 'settings'
                    },
                    component: () => import('@/views/admin/FileList.vue')
                },
                {
                    path: '/settings/appPublish',
                    name: '版本发布',
                    meta: {
                        needLogin: true,
                        menuCode: 'settings'
                    },
                    component: () => import('@/views/admin/AppPublish.vue')
                },
                {
                    path: '/settings/checkShareUrl',
                    name: '审核列表',
                    meta: {
                        needLogin: true,
                        menuCode: 'settings'
                    },
                    component: () => import('@/views/admin/CheckShareUrl.vue')
                },
            ]
        },
        {
            path: '/shareCheck/:shareId',
            name: '分享校验',
            component: () => import('@/views/webShare/ShareCheck.vue'),
        },
        {
            path: '/share/:shareId',
            name: '分享',
            component: () => import('@/views/webShare/Share.vue'),
        },
    ],
})

// router.beforeEach((to, from, next) => {
//     const userInfo = VueCookies.get('userInfo');
//     const settingsRoutes = [
//         '/settings/fileList',
//         '/settings/userList',
//         '/settings/sysSettings'
//     ];
//
//     // 拦截所有设置相关路由
//     if (settingsRoutes.includes(to.path)) {
//         if (!userInfo?.isAdmin) {
//             next('/main/all');  // 非管理员重定向到首页
//             return;
//         }
//     }
//     next();
// });

export default router
