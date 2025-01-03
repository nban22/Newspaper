class AppError extends Error {
    statusCode: number;
    status: string;
    stack: string | undefined;
    renderErrorPage: boolean;

    constructor(statusCode: number, message: string, renderErrorPage=false) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.stack = new Error().stack;
        this.renderErrorPage = renderErrorPage;
    }
}

export default AppError;