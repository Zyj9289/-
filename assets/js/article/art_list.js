// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
}
initTable()

// 获取文章列表数据的方法
function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败！')
            }
            // 调用模板引擎渲染页面分类的可选项
            var htmlStr = template('tpl-table', res)

            $('tbody').html(htmlStr)

            //调用分页函数
            renderpage(res.total)

        }
    })
}

// 定义美化时间的过滤器
template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}



// 定义补零的函数
function padZero(n) {
    return n > 9 ? n : '0' + n
}
initCate();
var form = layui.form;
//3.初始化分类
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            //调用模板引擎渲染分类可选项
            var str = template('tpl-cate', res)
            // console.log(str);
            $('[name=cate_id]').html(str)
            //通过layui重新渲染表单区域
            form.render()
        }
    })
}



//4.筛选功能
//为筛选表单绑定submit事件
$('#form-search').on('submit', function () {
    //组织表单迷人提交行为
    e.preventDefault()
    //获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    //为查询参数对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    //根据最新筛选条件，重新渲染表格的数据
    initTable()
})

//5.定义分页功能
var laypage = layui.laypage;
var render = layui.render
function renderpage(total) {
    //执行一个layPage实例
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
        elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum, // 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        // 分页发生切换的时候，触发 jump 回调
        // 触发 jump 回调的方式有两种：
        // 1. 点击页码的时候，会触发 jump 回调
        // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
        jump: function (obj, first) {
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            // console.log(first)
            console.log(first, obj.curr, obj.limit)
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            q.pagenum = obj.curr
            q.pagesize = obj.limit
            // 根据最新的 q 获取对应的数据列表，并渲染表格
            // initTable()
            //首次不执行
            if (!first) {
                initTable()
            }
        }
    })
}

//删除功能
$('tbody').on('click', '.btn-delete', function () {
    // 获取到文章的 id
    var id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.messages)
                }
                layer.msg('删除文章成功！')

                //页面汇总删除按钮个数等于1，页面大于1
                if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                initTable()
            }
        })

        layer.close(index)
    })
})
