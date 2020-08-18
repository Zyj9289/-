//先写一个入口函数
$(function () {
    //1.当点击注册页面时候，显示登录页面，隐藏注册页面
    $('#link_reg').on('click', function () {
        $('.reg_box').show();
        $('.login_box').hide();
    })
    //2.当点击注册页面时候，显示注册页面，隐藏登录页面
    $('#link_login').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    })
    //3.自定义验证规则
    var form = layui.form;
    form.verify({
        //密码规则
        pwd:
            [
                /^[\S]{6,12}$/
                , '密码必须6到16位，且不能出现空格'
            ],
        repwd: function (value) {
            {
                //确认密码
                var pwd = $('.reg_box [name = password]').val()
                if (pwd != value) {
                    return '两次密码不一样'
                }
            }
        }

    })
    //4.注册功能
    var layer = layui.layer;
    $("#form_reg").on('submit', function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $(".reg_box [name=username]").val(),
                password: $(".reg_box [name=password]").val(),
            },
            success: function (res) {
                //返回状态判断
                console.log(res.status);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //提交成功后处理代码
                layer.msg('注册成功，请登录！')
                //手动切换到登录表单
                $('#link_login').click();
                //重置form表单
                $('#form_reg')[0].reset()
            }
        })
    })
    //5.登录功能，给form标签绑定事件，button按钮提交事件
    $('#form_login').submit(function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                //校验返回状态
                if (res.status != 0) {
                    return layer.msg(res.message)

                }
                //提示信息，保存token，跳转页面
                layer.msg('恭喜你，登陆成功！')
                //保存token,未来接口要使用
                localStorage.setItem('token', res.token);
                //跳转
                location.href = '/index.html'
            }
        })
    })

})