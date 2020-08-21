$(function () {
    //自定义校验规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1-6之间';
            }
        }
    })

    //想要是全局函数
    //2.用户渲染
    initUserInfo();
    //到处layer
    var layer = layui.layer;
    //封装
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)

                }
                //成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    //3.表单重置
    $("#btnReset").on('click', function (e) {
        e.preventDefault();
        //重新渲染
        initUserInfo();
    })

    //4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                // 如果失败
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //如果成功
                layer.msg("恭喜您，修改用户信息成功！")
                //调用父框架的全局方法
                window.parent.getUserInof();
            }
        })
    })
})

