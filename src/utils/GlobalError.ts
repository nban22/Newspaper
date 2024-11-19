class GlobalError extends Error {
    statusCode: number;
    status: string;
    stack: string | undefined;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.stack = new Error().stack;
    }
}

export default GlobalError;