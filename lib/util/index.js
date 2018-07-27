export const readFileDataUrl = file => {
    return new Promise(function (res, rej) {
        var FR = new FileReader();
        FR.onload = function () {
            res(this.result);
        };
        FR.readAsDataURL(file);
    });
};