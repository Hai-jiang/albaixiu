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

    // 当用户选择文件的时候
    // 当选择文件后,触发change事件
    $('#avatar').on('change', function () {
        // 用户选择的文件
        var formData = new FormData()
        // this.files[0] 指的就是上传后的文件
        formData.append('avatar', this.files[0])

        $.ajax({
            type: 'post',
            url: '/upload',
            data: formData,
            // 告诉 ajax 不要解析请求参数
            processData: false,
            // 告诉 ajax 不要设置请求参数的类型
            contentType: false,
            success: function (response) {
                // 实现头像预览功能
                $('#preview').attr('src', response[0].avatar)
                $('#hiddenAvatar').val(response[0].avatar)
            }
        })
    })
})