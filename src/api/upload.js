// 引入axios(axios的二次封装)
import request from '@/utils/request'

// 封装文件上传的API调用
export function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file); // 实现批量上传文件时

    return request({
        url: '/upload-assessment/', // 后端接口地址，定义在urls.py 
        method: 'post',
        data: formData, // 上传的文件数据（前面定义的formData）
        headers: {
            // 表示发送的数据是表单数据，不是json数据
            'Content-Type': 'multipart/form-data',
        },
    });
}