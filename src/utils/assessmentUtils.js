export function formatAssessmentResult(value) {
    switch (value) {
        case 3:
            return '优秀';
        case 2:
            return '合格';
        case 1:
            return '不合格';
        default:
            return '其他';
    }
}
