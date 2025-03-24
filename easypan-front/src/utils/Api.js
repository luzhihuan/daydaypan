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
    //获取所有目录
    loadAllFolder:'/file/loadAllFolder',


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
    //删除用户文件
    delFileAdmin: '/admin/delFile',


    //检查app
    checkUpdate: '/update/checkUpdate',

    //搜好友
    searchUser:'/contact/searchUser',
    //好友列表
    getUserContact:'/contact/getUserContact',
    //好友操作（加好友||删好友）
    delOrAddUserContact:'/contact/delOrAddUserContact',



    //好友操作（同意||拒绝）
    agreeOrReject:'/apply/agreeOrReject',
    //申请列表
    getApplyList:'/apply/getApplyList',

    //获取分享信息
    getShareInfo:'/showShare/getShareInfo',
    //检查提取码
    checkShareCode:'/showShare/checkShareCode',
    //获取分享登录信息
    getShareLoginInfo:'/showShare/getShareLoginInfo',
    //获取文件列表
    loadShareFileList:'/showShare/loadFileList',
    //获取下载路径
    createShareDownloadUrl:'/showShare/createDownloadUrl',
    //下载
    shareDownload:'/showShare/download',
    //取消分享
    cancelShareShare:'/showShare/cancelShare',
    //保存分享
    saveShare:'/showShare/saveShare',


    //版本发布
    update:'/update/publishUpdate',
    //审核列表
    loadFileJudgeList:'/judge/loadFileJudgeList',
    //审核通过
    handleFileJudge:'/judge/handleFileJudge'

}

export default api;
