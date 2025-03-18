const api = {

    //获取验证码
    checkCode: "/account/checkCode",
    //发送邮箱验证码
    sendEmailCode: "/account/sendEmailCode",
    //注册
    register: "/account/register",
    //登录
    login: "account/login",
    //重置密码
    resetPassword: "/account/resetPassword",
    //获取用户头像
    avatarUrl: '/account/getAvatar/',
    //更新用户头像
    updateUserAvatar: '/account/updateUserAvatar',
    //修改密码
    updatePassword: '/account/updatePassword',
    //退出登录
    loginOut: '/account/loginOut',
    //获取用户空间
    getUserSpace: '/account/getUseSpace',

    //获取文件列表
    loadFileList: '/file/loadFileList',
    //重命名
    rename: "/file/rename",
    //新建文件夹
    newFolder: "/file/newFolder",
    //获取文件夹信息
    getFolderInfo: "/file/getFolderInfo",
    //删除文件
    remove2Rec: "/file/remove2Rec",
    //移动文件
    changeFileFolder: "/file/changeFileFolder",
    //创建下载链接
    createDownloadUrl: "/file/createDownloadUrl",
    //下载
    download: "/file/download",
    //文件前面的小图标
    imageUrl: "/api/file/getImage/",
    //上传文件
    uploadFile: "/file/uploadFile",


    //分享文件
    shareFile: '/share/shareFile',
    //获取分享文件列表
    loadShareList: '/share/loadShareList',
    //取消分享
    cancelShare: '/share/cancelShare',


    //获取回收站列表
    loadRecycleList: '/recycle/loadRecycleList',
    //还原文件
    recoverFile: '/recycle/recoverFile',
    //彻底删除文件
    delFile: '/recycle/delFile',

    //获取系统设置
    getSysSettings: '/admin/getSysSettings',
    //保存系统设置
    saveSysSetting: '/admin/saveSysSetting',
    //用户列表
    loadUserList: '/admin/loadUserList',
    //更新用户状态
    updateUserStatus: '/admin/updateUserStatus',
    //更新用户空间
    updateUserSpace: '/admin/updateUserSpace',
    //获取所有用户文件
    loadAllFileList: '/admin/loadFileList',
    //获取所有用户目录
    getFolderInfoAdmin: '/admin/getFolderInfo',
    //获取文件（预览）
    // getFile/{userId}/{fileId}

//获取图片信息
// /ts/getVideoInfo/{userId}/{fileId}

//删除用户文件
    delFileAdmin: '/admin/delFile',

    //检查app
    checkUpdate: '/update/checkUpdate',

}

export default api;
