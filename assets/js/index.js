//入口函数
$(function () {
    //1.获取用户信息
    getUserInof();
    //退出功能
    var layer = layui.layer
    $('#btnOut').on('click', function () {
        //eg1
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //删除本地存储的toekn
            localStorage.removeItem('token')
            //跳转到登录页面
            location.href = '/login.html'
            layer.close(index);
        });
    })
})
//获取用户信息（封装到入口函数外面)
//原因：后面其他页面要调用
var layer = layui.layer;
function getUserInof() {
    //发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers表示请求头配置对象
        // headers: {
        //     //重新登陆，因为token过期事件12小时
            //设置请求头登录信息
        //     Authorization: localStorage.getItem
        //         ("token") || ""
        // },
        success: function (res) {
            //判读状态码
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            //请求成功，渲染用户信息
            renderAvatar(res.data);
        }
    })
}
//封装用户信息渲染
function renderAvatar(user) {
    //1.用户名(昵称优先，没有用username)
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    //2.用户头像
    if (user.user_pic !== null) {
        //有头像
        $('layui-nav-img').show().attr('src', user.user_pic);
        $('.user-avatar').hide();
    } else {
        //没有头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);
    }
}
