$(function () {
    // 当表单发生提交行为的时候
    $('#userForm').on('submit', function () {
        // 获取用户信息,使用serialize方法获取表单信息,并将表单内容转换为字符串
        var formData = $(this).serialize()
        // 向服务器端发送添加用户请求
        $.ajax({
            type: 'post',
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
    $('#modifyBox').on('change', '#avatar', function () {
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

    // 向服务端发送请求,索要用户数据
    $.ajax({
        type: 'get',
        url: '/users',
        success: function (response) {
            // console.log(response)
            // 使用模板引擎将数据和HTML字符串进行拼接
            var html = template('userTpl', {data: response})
            // 将拼接好的字符串显示在页面中
            $('#userBox').html(html)
        }
    })

    // 通过事件委托的方式为编辑按钮添加点击事件
    $('#userBox').on('click', '.edit', function () {
        // 获取被点击用户的id值
        var id = $(this).attr('data-id')
        // 根据id获取用户的详细信息
        $.ajax({
            type: 'get',
            url: '/users/' + id,
            success: function (response) {
                var html = template('modifyTpl', response)
                // 将拼接好的字符串显示在页面中
                $('#modifyBox').html(html)
            }
        })
    })

    // 修改表单,添加表单提交事件
    $('#modifyBox').on('submit', '#modifyForm', function () {
        // 获取用户在表单中输入的内容
        var formData = $(this).serialize()
        // 获取要修改的那个用户的id值
        var id = $(this).attr('data-id')
        // 发送请求,修改用户信息
        $.ajax({
            type: 'put',
            url: '/users/' + id,
            data: formData,
            success: function (response) {
                // 修改用户信息成功,重新加载页面
                location.reload()
            }
        })
        // 阻止表单默认提交
        return false
    })


    // 当删除按钮被点击的时候
    $('#userBox').on('click', '.delete', function () {
        if (confirm('您确认要删除该用户吗')) {
            // 获取到即将要删除的用户id
            var id = $(this).attr('data-id')
            // 向服务器端发送请求,删除用户
            $.ajax({
                type: 'delete',
                url: '/users/' + id,
                success: function () {
                    location.reload()
                }
            })
        }
    })

    // 获取全选按钮
    var selectAll = $('#selectAll')
    // 获取批量删除按钮
    var deleteMany = $('#deleteMany')

    // 当全选按钮的状态发生改变时
    selectAll.on('change', function () {
        // 获取到全选按钮当前状态
        var status = $(this).prop('checked')

        if (status) {
            // 显示批量删除按钮
            deleteMany.show()
        } else {
            deleteMany.hide()
        }

        // 获取到所有用户并将用户的状态和全选按钮保持一致
        $('#userBox').find('input').prop('checked', status)
    })

    // 当用户前面的复选框状态发生改变时
    $('#userBox').on('change', '.userStatus', function () {
        // 获取所有用户,对所有用户进行过滤
        // 判断选中的用户数量和所有用户的数量是否一致
        // 一致说明全选,否则说明不是全选
        var inputs = $('#userBox').find('input')

        if (inputs.lenght == inputs.filter(':checked').length) {
            selectAll.prop('checked', true)
        } else {
            selectAll.prop('checked', false)
        }

        // 如果选中的复选框的数量大于0,就说明有选中的复选框
        if (inputs.filter(':checked').length > 0) {
            // 显示批量删除按钮
            deleteMany.show()
        } else {
            deleteMany.hide()
        }
    })

    // 为批量删除按钮添加点击事件
    deleteMany.on('click', function () {
        var ids = []
        // 获取选中的用户
        var checkedUser = $('#userBox').find('input').filter(':checked')

        // 循环复选框,从复选框元素的身上获取data-id的属性的值
        checkedUser.each(function (index, element) {
            ids.push($(element).attr('data-id'))
        })

        if (confirm('您确认要进行批量删除操作吗')) {
            $.ajax({
                type: 'delete',
                url: '/users/' + ids.join('-'),
                success: function () {
                    location.reload()
                }
            })
        }
    })
})