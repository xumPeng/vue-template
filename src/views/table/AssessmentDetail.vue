<template>
    <div class="app-container">

        <el-table class="custom-table" v-if="detailData" :data="[detailData]" border fit highlight-current-row stripe
            table-layout="fixed">
            <!-- 忽略 id 和 file_name 字段 -->
            <el-table-column label="记录日期" prop="record_date" width="120" align="center"></el-table-column>
            <el-table-column label="乘务组" prop="crew_group" width="80" align="center"></el-table-column>
            <el-table-column label="姓名" prop="name" width="100" align="center"></el-table-column>
            <el-table-column label="工作证号" prop="work_certificate_number" width="120" align="center"></el-table-column>
            <el-table-column label="车型" prop="train_model" width="100" align="center"></el-table-column>
            <el-table-column label="考核项目" prop="assessment_item" width="100" align="center"></el-table-column>
            <el-table-column label="评估结果" prop="assessment_result" fixed="left" width="100" align="center">
                <template v-slot:default="scope">
                    {{ formatAssessmentResult(scope.row.assessment_result) }}
                </template>
            </el-table-column>

            <!-- 为动态生成的列设置宽度可能需要更多逻辑，因为可能需要根据内容动态调整宽度 -->
            <!-- v-for 在遍历对象时的参数顺序为 (value, key)，这意味着首先得到的是属性的值，其次才是属性名 -->
            <!-- 后期会对 additional_data 这个 jsonfield 进行一些赋值和修改 这段代码需要用到额外的计算属性以正确显示字段 :label="key"-->
            <el-table-column v-for="(value, key) in detailData.additional_data" :key="key" :label="key"
                :prop="`additional_data.${key}`" width="130" align="center">
                <template v-slot:default="scope">
                    <div v-if="!scope.row.additional_data[key]" class="highlight-red">未测评</div>
                    <div v-else>{{ scope.row.additional_data[key] }}</div>
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
import { getDetailById } from '@/api/table';
import { formatAssessmentResult } from '@/utils/assessmentUtils';

export default {
    data() {
        return {
            detailData: null, // 用于存储获取到的详情数据
        };
    },

    mounted() {
        this.loadDetailData();
    },

    methods: {
        // 调用通用的转换函数
        formatAssessmentResult(value) {
            return formatAssessmentResult(value);
        },

        // 获取详情数据
        loadDetailData() {
            // 从 URL 中获取该 id 参数
            const id = this.$route.params.id;
            getDetailById(id)
                .then(response => {
                    this.detailData = response.data;
                })
                .catch(error => {
                    console.error("错误获取数据", error);
                    // 根据需要处理错误
                });
        },
    },
};
</script>
<style scoped>
.app-container {
    padding: 20px;
}

.highlight-red {
    background-color: #ffebee;
    /* 浅红色背景 */
    color: #d32f2f;
    /* 深红色文本，以确保对比度和可读性 */
    padding: 4px 4px;
    /* 添加一些内边距 */
    border-radius: 4px;
    /* 圆角边框 */
    border: 1px solid #f44336;
    /* 红色边框 */
    font-weight: bold;
    /* 加粗字体增加突出效果 */
    text-align: center;
    /* 文本居中显示 */
}
</style>