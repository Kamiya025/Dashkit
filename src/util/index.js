export const baseUrl = "http://180.93.175.236:3000";
export const stringToRGB = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.toUpperCase().charCodeAt(i) + ((hash << 5) - hash);

    }
    var color = '';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        color += ('8' + value.toString(16)).substring(-2);
    }

    return color.substring(0, 6);
}
export const stringToLinkImg = (str) => {
    var backgroundColor = stringToRGB(str);
    var text = str.toString().substring(0, 1).toUpperCase()
    var url = `https://via.placeholder.com/300/${backgroundColor}/fff.jpg?text=${text}`;
    return url;
}
export const statusRequestToIcon = (str) => {
    var obj = {
        IN_PROGRESS_REQUEST: require('../asset/task_in_progress.png'),
        COMPLETE: require('../asset/task_done.png'),
        CANCEL_REQUEST: require('../asset/task_cancel.png'),
        OPEN_REQUEST: require('../asset/request.png'),
        CLOSE: require('../asset/task_close.png'),
        RE_INPROGRESS: require('../asset/task_in_progress.png'),
        REOPEN_REQUEST: require('../asset/reopen_task.png')
    }
    return obj[str];
}
export const statusTransitionBackground = (str) => {
    str = str.toUpperCase().replace(/ /g, "_").replace(/-/g, "_")
    let objColor =
    {
        IN_PROGRESS: '#2c7be5',
        CANCEL: '#95aac9',
        COMPLETE: '#008000',
        CLOSE: '#e63757',
        RE_INPROGRESS: '#2c7be5',
        RE_IN_PROGRESS: '#2c7be5',
        RE_OPEN: '#2c7be5',
        IN_PROGRESS_REQUEST: '#2c7be5',
        COMPLETE: '#008000',
        CANCEL_REQUEST: '#95aac9',
        OPEN_REQUEST: '#2c7be5',
        CLOSE: '#e63757',
        RE_INPROGRESS: '#2c7be5',
        REOPEN_REQUEST: '#2c7be5'
    }
    return objColor[str];
}
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
