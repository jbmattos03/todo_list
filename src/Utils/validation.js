function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
}

function isEmpty(value) {
        return value === null || value === undefined || value.trim() === "";
}

function isNullOrUndefined(value) {
        return value === null || value === undefined;
}

function isBlank(value) {
        return typeof value === "string" && value.trim() === "";
}

function isSqlQuery(value) {
        const sqlRegex = /(\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE)\b)/i;
        return sqlRegex.test(value);
}

export { isValidEmail, isEmpty, isBlank, isNullOrUndefined, isSqlQuery };