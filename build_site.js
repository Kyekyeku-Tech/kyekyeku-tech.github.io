const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const output = path.join(root, "_site");
const excludedDirectories = new Set([".git", ".github", ".vscode", "_site"]);

function pageSlug(filename) {
    return path.basename(filename, ".html")
        .toLowerCase()
        .replace(/&/g, "-and-")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
}

function rewriteHref(match, prefix, quote, originalUrl, _closingQuote, routeByFilename) {
    const url = originalUrl.replace(/&amp;/g, "&");
    const parts = url.match(/^([^?#]+)(\?[^#]*)?(#.*)?$/);
    if (!parts || /^[a-z][a-z\d+.-]*:/i.test(parts[1]) || parts[1].startsWith("//")) {
        return match;
    }

    const filename = path.posix.basename(parts[1]).toLowerCase();
    const route = routeByFilename.get(filename);
    if (!route && filename !== "index.html") {
        return match;
    }

    const target = filename === "index.html" ? "/" : `/${route}/`;
    return `${prefix}${quote}${target}${parts[2] || ""}${parts[3] || ""}${quote}`;
}

function addBaseUrl(content) {
    if (/<base\b/i.test(content)) return content;
    const head = /<head\b[^>]*>/i.exec(content);
    if (head) {
        const insertionPoint = head.index + head[0].length;
        return `${content.slice(0, insertionPoint)}<base href="/">${content.slice(insertionPoint)}`;
    }
    return `<head><base href="/"></head>\n${content}`;
}

function copySourceTree() {
    fs.mkdirSync(output, { recursive: true });
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        if (excludedDirectories.has(entry.name) || entry.name === path.basename(__filename)) continue;
        fs.cpSync(path.join(root, entry.name), path.join(output, entry.name), { recursive: true });
    }
}

function build() {
    const pages = fs.readdirSync(root)
        .filter(filename => filename.toLowerCase().endsWith(".html"));
    const routeByFilename = new Map(
        pages
            .filter(filename => filename.toLowerCase() !== "index.html")
            .map(filename => [filename.toLowerCase(), pageSlug(filename)])
    );

    copySourceTree();

    for (const filename of pages) {
        if (filename.toLowerCase() === "index.html") continue;
        const route = routeByFilename.get(filename.toLowerCase());
        const routeDirectory = path.join(output, route);
        fs.mkdirSync(routeDirectory, { recursive: true });
        const page = fs.readFileSync(path.join(root, filename), "utf8");
        fs.writeFileSync(path.join(routeDirectory, "index.html"), addBaseUrl(page));
    }

    const rewriteLinks = (content) => content.replace(
        /(\bhref\s*=\s*)(["'])([^"']+)(["'])/gi,
        (match, prefix, quote, url, closingQuote) => {
            if (quote !== closingQuote) return match;
            return rewriteHref(match, prefix, quote, url, closingQuote, routeByFilename);
        }
    );

    function rewriteOutput(directory) {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const filePath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                rewriteOutput(filePath);
            } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
                fs.writeFileSync(filePath, rewriteLinks(fs.readFileSync(filePath, "utf8")));
            }
        }
    }

    rewriteOutput(output);
    console.log(`Built ${pages.length} extension-free page routes in ${output}`);
}

build();
