$(function () {
    // 当表单发生提交行为的时候
    $('#userForm').on('submit', function () {
        // 获取用户信息,使用serialize方法获取表单信息,并将表单内容转换为字符串
        var formData = $(this).serialize()
        // 向服务器端发送添加用户请求
        $.ajax({
            tyoe: 'post',
            url: '/users',
            data: formData,
            success: function () {
                // 刷新页面
                location.reload()
            },
            error: function () {
                alert('用户添加失败')
            }
        })
        // 阻止表单默认添加行为
        return false
    })
})