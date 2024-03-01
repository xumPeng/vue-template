<template>
    <div class="classification-container">
        <!-- 顶部展现文件选项 -->
        <h2 style="text-align: center;">步骤归类</h2>
        <div class="file-names-container">
            <div class="file-name-item" v-for="fileName in uniqueFileNames" :key="fileName"
                @click="selectFileName(fileName)">
                <!-- 循环展示上传的文件名 -->
                <i class="el-icon-files"></i>
                <h3>{{ fileName }}</h3>
            </div>
        </div>
        <div v-if="showNoDataMessage" class="no-data">无数据</div>

        <!-- 展示字段并保存分类到数据库中 -->
        <div v-if="selectedFileName" class="additional-data-container">
            <h3>为文件名 {{ selectedFileName }} 的操作分类:</h3>
            <div class="data-container">
                <div class="data-item" v-for="key in Object.keys(selectedAdditionalData)" :key="key">
                    <!-- 循环展示 addition_data 中的操作字段 -->
                    <div>{{ key }}</div>
                    <!-- 下拉选择框去分类 -->
                    <el-select v-model="classifications[key]" clearable placeholder="请选择分类">
                        <el-option label="识故问题" value="识故问题"></el-option>
                        <el-option label="操作问题" value="操作问题"></el-option>
                        <el-option label="安全问题" value="安全问题"></el-option>
                    </el-select>
                </div>
            </div>

            <!-- 保存分类的按钮 -->
            <div class="button-container">
                <el-button type="primary" @click="saveClassifications" :disabled="!isAllClassified" :loading="loading"
                    size="big">
                    保存分类
                    <i class="el-icon-check el-icon--right"></i>
                </el-button>
            </div>
        </div>

    </div>
</template>

<script>
import { AllTrainingData } from '@/api/table';
import { SaveClassification, fetchCategories } from '@/api/settings';

export default {
    name: 'AssessmentClassification',
    data() {
        return {
            assessments: [], // 存储获取到的所有数据
            uniqueFileNames: [], // 存储去重后的文件名
            selectedFileName: '', // 存储用户当前选择的文件名
            selectedAdditionalData: {}, // 存储用户选择的文件名对应的 additional_data
            classifications: {}, // 存储用户对 additional_data 中的字段进行的分类（跟后端数据库交互）
            loading: false, // 保存的按钮是否在加载状态
            dataCategories: {}, // 存储从接口获取的分类数据
            showNoDataMessage: false, // 控制无数据提示的显示
            noDataTimer: null, // 定时器标识
        };
    },

    mounted() {
        this.fetchAllData(); // 获取所有数据
        this.fetchDataCategories(); // 获取先前分类后的数据
        // 在组件挂载后设置定时器
        this.noDataTimer = setTimeout(() => {
            if (this.uniqueFileNames.length === 0) {
                this.showNoDataMessage = true; // 显示无数据提示
            }
        }, 2000); // 2秒后执行
    },

    beforeDestroy() {
        // 在组件销毁前清除定时器
        if (this.noDataTimer) {
            clearTimeout(this.noDataTimer);
        }
    },

    computed: {
        // 检查所有分类是否都已经选择，若有没选择的框就不能点击保存这个button
        isAllClassified() {
            return Object.values(this.classifications).every(value => value !== '');
        },
    },

    methods: {
        // 获取所有表格数据
        fetchAllData() {
            AllTrainingData().then(response => {
                // 存储获取到的所有数据
                this.assessments = response.data;
                // 展示唯一的文件名
                this.extractUniqueFileNames();
            }).catch(error => {
                console.error("Error fetching data: ", error);
            });
        },

        // 获取分类数据
        async fetchDataCategories() {
            try {
                const response = await fetchCategories();
                const categories = response.data;
                // 转换数据格式以便易于访问，将其转换为以文件名为键的对象
                this.dataCategories = categories.reduce((acc, item) => {
                    // 将文件名作为键，分类信息作为值赋值给acc
                    acc[item.file_name] = item.classifications;
                    return acc;
                }, {});
            } catch (error) {
                console.error("Error fetching data categories: ", error);
            }
        },

        // 展示唯一的文件名，并且升序排列
        extractUniqueFileNames() {
            // 使用 Set 来存储唯一获取到的 assessments 中的 文件名
            const fileNames = new Set(this.assessments.map(item => item.file_name));
            // uniqueFileNames 展示唯一的文件名（循环展示）
            this.uniqueFileNames = Array.from(fileNames).sort((a, b) => {
                // 分离数字和文本部分
                const matchA = a.match(/(\d+)([a-zA-Z]+)(\d*)/);
                const matchB = b.match(/(\d+)([a-zA-Z]+)(\d*)/);

                // 比较主要数字部分
                const numA = parseInt(matchA[1], 10);
                const numB = parseInt(matchB[1], 10);

                if (numA !== numB) {
                    return numA - numB;
                }

                // 如果主要数字部分相同，比较文本部分
                if (matchA[2] !== matchB[2]) {
                    return matchA[2].localeCompare(matchB[2]);
                }

                // 如果文本部分也相同，比较次要数字部分
                const subNumA = matchA[3] ? parseInt(matchA[3], 10) : 0;
                const subNumB = matchB[3] ? parseInt(matchB[3], 10) : 0;

                return subNumA - subNumB;
            });

        },

        // 获取用户点击的fileName
        selectFileName(fileName) {
            // 保存用户选择的文件名
            this.selectedFileName = fileName;
            // 使用 find 方法获取用户点击的 fileName 对应的 assessment
            const selectedAssessment = this.assessments.find(item => item.file_name === fileName);
            // 确保selectedAssessment存在，并且有additional_data
            if (selectedAssessment && selectedAssessment.additional_data) {
                // 使用Object.entries将对象转换为键值对数组，然后使用slice跳过前两个条目
                const dataEntries = Object.entries(selectedAssessment.additional_data).slice(2);
                // // 将剩余的条目转换回对象格式
                this.selectedAdditionalData = dataEntries.reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});
            } else {
                this.selectedAdditionalData = {};
            }
            // 初始化 classifications
            this.initializeClassifications();
            // 根据 dataCategories 和 selectedFileName 来填充 classifications
            this.fillClassificationsFromDataCategories();
        },

        // 初始化分类
        initializeClassifications() {
            this.classifications = {};
            Object.keys(this.selectedAdditionalData).forEach(key => {
                this.$set(this.classifications, key, '');
            });
        },

        // 填充 classifications
        fillClassificationsFromDataCategories() {
            if (this.dataCategories[this.selectedFileName]) {
                // 获取当前文件名对应的分类信息
                const classificationsData = this.dataCategories[this.selectedFileName];
                // 遍历selectedAdditionalData中的所有key
                Object.keys(this.selectedAdditionalData).forEach(key => {
                    // 检查dataCategories中是否有对应的分类信息
                    if (classificationsData[key]) {
                        // 直接使用从dataCategories获取的分类信息来更新classifications
                        this.classifications[key] = classificationsData[key];
                    }
                });
            }
        },

        // 调用保存分类信息
        async saveClassifications() {
            // 如果没有选择所有分类，展示错误信息
            if (!this.isAllClassified) {
                this.$message.error({
                    message: '所有字段都必须分类，请完成分类后再保存。',
                    duration: 2000,
                    showClose: true
                });
                return;
            }

            this.loading = true; // 开始加载

            try {
                await SaveClassification({
                    file_name: this.selectedFileName,
                    classifications: this.classifications
                });
                this.$message({
                    type: 'success',
                    message: '分类信息已保存',
                    duration: 2000,
                    showClose: true
                });
                // 成功保存后刷新页面
                window.location.reload();
            } catch (error) {
                console.error("Error saving classifications: ", error);
                this.$message.error({
                    message: '保存分类信息失败，请重试。',
                    duration: 2000,
                    showClose: true
                });
            } finally {
                this.loading = false; // 无论请求成功还是失败，button 上均停止加载
            }
        },

    },
};
</script>

<style scoped>
.file-names-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}

.file-name-item {
    display: flex;
    justify-content: center;
    /* 确保子项在容器中水平居中 */
    align-items: center;
    /* 确保子项在容器中垂直居中 */
    gap: 10px;
    /* 图标和文件名之间的间距 */
    cursor: pointer;
    padding: 10px;
    border: 2px solid #eee;
    border-radius: 4px;
    transition: transform 0.3s ease;
    width: 200px;
}

.file-name-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.no-data {
    text-align: center;
    margin-top: 20px;
}

.additional-data-container {
    padding: 20px;
}

.data-container {
    display: flex;
    /* 使用flex布局 */
    flex-wrap: wrap;
    /* 允许换行 */
    gap: 20px;
    /* 项目之间的间隔 */
}

.data-item {
    min-width: 300px;
    /* 保留这个设置以确保最小宽度 */
    margin-bottom: 20px;
    padding: 10px;
    display: flex;
    /* 添加flex布局来更好地控制子元素 */
    flex-direction: column;
    /* 使子元素垂直排列 */

}

.data-item>div {
    width: 100%;
    /* 使key字段和el-select的宽度相同 */
    margin-bottom: 10px;
    /* 在key字段和el-select框之间添加10px的间距 */
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>