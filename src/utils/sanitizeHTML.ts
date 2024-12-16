import sanitize from "sanitize-html";

export const sanitizeSummary = (dirty: string) => {
    return sanitize(dirty, {
        allowedTags: ["h2", "p", "span", "br"],
        allowedAttributes: {
            span: ["style"],
        },
    });
}

export const sanitizeContent = (dirty: string) => {
    return sanitize(dirty, {
        allowedTags: ["h2", "p", "br", "a", "img", "em"],
        allowedAttributes: {
            span: ["style"],
            a: ["href", "rel", "target", "style"],
            img: ["src", "alt", "width", "height"],
            em: ["style"],
        },
        allowedStyles: {
            "*": {
                "background-color": [/^rgb\(\d+, \d+, \d+\)$/i],
                "color": [/^rgb\(\d+, \d+, \d+\)$/i],
            },
        },
    });
}