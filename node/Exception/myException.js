class MyException extends Error {
    constructor(message) {
        super(message);
        console.log("MyException：", message);
        // this.MyException(message);
    }
    // 构造函数
    MyException(message) {
        console.log("MyException：", message);
    }
}

module.exports = MyException;
