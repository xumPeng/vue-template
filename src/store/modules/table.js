export default {
    namespaced: true, // 启用命名空间

    state: {
        trainingAnalysisData: null, // 存储培训分析数据
    },

    actions: {
        // 解耦 context 中的commit 和传递来的 data
        // 接收到传递的数据后，调用 mutations 中的方法，将数据存储到state中
        updateTrainingAnalysisData({ commit }, data) {
            commit('setTrainingAnalysisData', data);
        },
    },

    mutations: {
        // 将传递来的数据存储到state中
        setTrainingAnalysisData(state, data) {
            state.trainingAnalysisData = data;
        },
    },
};