import AppError from "./AppError"

export const isRequired = (value: any, fieldName: string, customMessage?: string) => {
    if (!value) {
        throw new AppError(400, customMessage || `${fieldName} is required`)
    }
}