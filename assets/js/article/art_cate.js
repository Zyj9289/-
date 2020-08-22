
initArtCateList()
// 获取文章分类的列表
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            var str = template('tpl-table', res)
            $('tbody').html(str)
        }
    })
}
// 为添加类别按钮绑定点击事件
var indexAdd = null
$('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#dialog-add').html()
    })
})
//添加分类弹出层表单提交（事件委托）
$('body').on('submit', '#form-add', function (e) {
    //阻止表单默认提交行为
    e.preventDefault()
    //发送ajax请求
    $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('新增分类失败')
            }
            initArtCateList()
            layer.msg('新增分类成功')
            //根据索引，关闭对应的弹出层
            layer.close(indexAdd)
        }
    })
})



// 点击编辑按钮（弹出一个修改文章分类信息的层）
var indexEdit = null;
var form = layui.form;
$('tbody').on('click', '.btn-edit', function () {
    //利用框架代码，显示提示添加文章类别区域
    indexEdit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '修改文章分类',
        content: $('#dialog-edit').html()
    })
    var id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
    $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + id,
        success: function (res) {
            form.val('form-edit', res.data)
        }
    })
})
//修改提交按钮
$('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('更新分类数据失败！')
            }
            layer.msg('更新分类数据成功！', { time: 1000 }, function () {
                layer.close(indexEdit)
                initArtCateList()
            })

        }
    })
})


//删除按钮
$('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('删除分类成功！', { time: 1000 }, function () {
                    initArtCateList()
                layer.close(index)
                })
                
            }
        })
    })
})




