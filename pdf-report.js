// ==========================================
// COMDAL - EXPORT & COPY
// Word (.docx), Excel (.xlsx) and clipboard copy.
// No external libraries: .docx / .xlsx are just ZIP files of XML,
// so a tiny ZIP writer below is enough.
// ==========================================

(function () {
    "use strict";

    var reportContentEl = document.getElementById("reportContent");
    var docxBtn = document.getElementById("downloadDocxBtn");
    var xlsxBtn = document.getElementById("downloadXlsxBtn");
    var copyBtn = document.getElementById("copyReportBtn");

    if (!reportContentEl || !docxBtn || !xlsxBtn || !copyBtn) {
        console.error("Comdal export: required buttons are missing in index.html.");
        return;
    }


    // ---------- 1. READ THE REPORT FROM THE PAGE ----------
    // Result: [{ title, items: [{ kind, label, text, source, url, missing }] }]
    // kind: "kv" (Company Details row), "fact" (research finding), "text", "link" (source list)

    function clean(text) {
        return String(text || "").replace(/\s+/g, " ").trim();
    }

    function collectReport() {
        var sections = [];
        var current = null;

        function ensureSection() {
            if (!current) {
                current = { title: "", items: [] };
                sections.push(current);
            }
            return current;
        }

        Array.prototype.forEach.call(reportContentEl.children, function (node) {
            var tag = node.tagName;

            if (tag === "H3") {
                current = { title: clean(node.textContent), items: [] };
                sections.push(current);
                return;
            }

            var section = ensureSection();

            if (node.matches("article.research-result")) {
                var headingEl = node.querySelector("h4");
                var label = headingEl ? clean(headingEl.textContent) : "";
                var listItems = node.querySelectorAll("li");

                if (listItems.length) {
                    Array.prototype.forEach.call(listItems, function (li) {
                        var p = li.querySelector("p");
                        var small = li.querySelector("small");
                        section.items.push({
                            kind: "fact",
                            label: label,
                            text: clean(p ? p.textContent : li.textContent),
                            source: small ? clean(small.textContent).replace(/^Source:\s*/i, "") : "",
                            url: ""
                        });
                    });
                } else {
                    var para = node.querySelector("p");
                    section.items.push({
                        kind: headingEl ? "fact" : "text",
                        label: label,
                        text: clean(para ? para.textContent : ""),
                        source: "",
                        url: "",
                        missing: !!headingEl
                    });
                }
            } else if (tag === "UL" || tag === "OL") {
                Array.prototype.forEach.call(node.children, function (li) {
                    var p = li.querySelector("p");
                    var a = li.querySelector("a");
                    section.items.push({
                        kind: a ? "link" : "text",
                        label: "",
                        text: clean(p ? p.textContent : li.textContent),
                        source: "",
                        url: a ? a.href : ""
                    });
                });
            } else if (tag === "DIV") {
                Array.prototype.forEach.call(node.querySelectorAll("p"), function (p) {
                    var strong = p.querySelector("strong");
                    var label = strong ? clean(strong.textContent).replace(/:$/, "") : "";
                    var value = clean(p.textContent);
                    if (strong) value = clean(value.slice(clean(strong.textContent).length));
                    section.items.push({ kind: "kv", label: label, text: value, source: "", url: "" });
                });
            } else if (tag === "P") {
                section.items.push({ kind: "text", label: "", text: clean(node.textContent), source: "", url: "" });
            }
        });

        return sections.filter(function (section) {
            return section.items.length > 0 || section.title;
        });
    }

    function companyName() {
        return window.comdalCurrentCompany || "Company";
    }

    function reportDateText() {
        return new Date().toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
    }

    function safeFileName(extension) {
        var base = companyName().replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40) || "Company";
        return "Comdal_" + base + "_Report." + extension;
    }


    // ---------- 2. MINIMAL ZIP WRITER (stored, no compression) ----------

    var crcTable = (function () {
        var table = new Uint32Array(256);
        for (var n = 0; n < 256; n++) {
            var c = n;
            for (var k = 0; k < 8; k++) {
                c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            }
            table[n] = c >>> 0;
        }
        return table;
    })();

    function crc32(bytes) {
        var crc = 0xFFFFFFFF;
        for (var i = 0; i < bytes.length; i++) {
            crc = crcTable[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    function makeZip(files) {
        var encoder = new TextEncoder();
        var now = new Date();
        var dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
        var dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

        var chunks = [];
        var central = [];
        var offset = 0;

        files.forEach(function (file) {
            var nameBytes = encoder.encode(file.name);
            var data = encoder.encode(file.content);
            var crc = crc32(data);

            var local = new DataView(new ArrayBuffer(30));
            local.setUint32(0, 0x04034B50, true);
            local.setUint16(4, 20, true);
            local.setUint16(6, 0x0800, true);      // UTF-8 names
            local.setUint16(8, 0, true);           // stored
            local.setUint16(10, dosTime, true);
            local.setUint16(12, dosDate, true);
            local.setUint32(14, crc, true);
            local.setUint32(18, data.length, true);
            local.setUint32(22, data.length, true);
            local.setUint16(26, nameBytes.length, true);
            local.setUint16(28, 0, true);

            var entry = new DataView(new ArrayBuffer(46));
            entry.setUint32(0, 0x02014B50, true);
            entry.setUint16(4, 20, true);
            entry.setUint16(6, 20, true);
            entry.setUint16(8, 0x0800, true);
            entry.setUint16(10, 0, true);
            entry.setUint16(12, dosTime, true);
            entry.setUint16(14, dosDate, true);
            entry.setUint32(16, crc, true);
            entry.setUint32(20, data.length, true);
            entry.setUint32(24, data.length, true);
            entry.setUint16(28, nameBytes.length, true);
            entry.setUint32(42, offset, true);

            chunks.push(new Uint8Array(local.buffer), nameBytes, data);
            central.push(new Uint8Array(entry.buffer), nameBytes);

            offset += 30 + nameBytes.length + data.length;
        });

        var centralSize = central.reduce(function (sum, part) { return sum + part.length; }, 0);

        var end = new DataView(new ArrayBuffer(22));
        end.setUint32(0, 0x06054B50, true);
        end.setUint16(8, files.length, true);
        end.setUint16(10, files.length, true);
        end.setUint32(12, centralSize, true);
        end.setUint32(16, offset, true);

        return chunks.concat(central, [new Uint8Array(end.buffer)]);
    }

    function downloadBlob(parts, mimeType, fileName) {
        var blob = new Blob(parts, { type: mimeType });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    }

    function xmlEscape(text) {
        return String(text)
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }


    // ---------- 3. WORD (.docx) ----------

    var W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

    function wRun(text, opts) {
        opts = opts || {};
        var props = "";
        if (opts.bold) props += "<w:b/>";
        if (opts.italic) props += "<w:i/>";
        if (opts.color) props += '<w:color w:val="' + opts.color + '"/>';
        if (opts.size) props += '<w:sz w:val="' + opts.size + '"/>';
        if (opts.underline) props += '<w:u w:val="single"/>';

        return "<w:r>" + (props ? "<w:rPr>" + props + "</w:rPr>" : "") +
            '<w:t xml:space="preserve">' + xmlEscape(text) + "</w:t></w:r>";
    }

    function wPara(runs, opts) {
        opts = opts || {};
        var props = "";
        if (opts.style) props += '<w:pStyle w:val="' + opts.style + '"/>';
        if (opts.keepNext) props += "<w:keepNext/>";
        if (opts.spacing) props += '<w:spacing w:before="' + (opts.spacing[0]) + '" w:after="' + (opts.spacing[1]) + '"/>';
        if (opts.indent) props += '<w:ind w:left="' + opts.indent[0] + '" w:hanging="' + opts.indent[1] + '"/>';

        return "<w:p>" + (props ? "<w:pPr>" + props + "</w:pPr>" : "") + runs + "</w:p>";
    }

    function buildDocumentXml(sections) {
        var body = "";

        body += wPara(wRun("Company Research Report", { }), { style: "Title" });
        body += wPara(wRun(companyName(), { bold: true, size: 30, color: "3569A8" }), { spacing: [0, 40] });
        body += wPara(wRun("Generated by Comdal on " + reportDateText(), { italic: true, color: "718096", size: 18 }), { spacing: [0, 200] });

        sections.forEach(function (section) {
            if (section.title) {
                body += wPara(wRun(section.title), { style: "Heading1" });
            }

            var lastLabel = null;

            section.items.forEach(function (item) {
                if (item.kind === "kv") {
                    body += wPara(
                        wRun(item.label + ": ", { bold: true, color: "142B4A" }) + wRun(item.text),
                        { spacing: [0, 60] }
                    );
                    return;
                }

                if (item.kind === "fact") {
                    if (item.label !== lastLabel) {
                        body += wPara(wRun(item.label), { style: "Heading2" });
                        lastLabel = item.label;
                    }

                    if (item.missing) {
                        body += wPara(wRun(item.text, { italic: true, color: "718096" }), { indent: [360, 0] });
                        return;
                    }

                    body += wPara(wRun("•\t" + item.text), { indent: [360, 360], spacing: [0, 20] });

                    if (item.source) {
                        body += wPara(
                            wRun("Source: " + item.source, { italic: true, color: "718096", size: 17 }),
                            { indent: [360, 0], spacing: [0, 100] }
                        );
                    }
                    return;
                }

                if (item.kind === "link") {
                    body += wPara(wRun("•\t" + item.text, { bold: true }), { indent: [360, 360], spacing: [0, 0], keepNext: true });
                    body += wPara(wRun(item.url, { color: "245B99", underline: true, size: 17 }), { indent: [360, 0], spacing: [0, 100] });
                    return;
                }

                // plain text / list item
                var isListItem = section.items.length > 1 && item.kind === "text" && !item.label && section.title === "Selected Research Topics";
                body += isListItem
                    ? wPara(wRun("•\t" + item.text), { indent: [360, 360], spacing: [0, 20] })
                    : wPara(wRun(item.text), { spacing: [0, 100] });
            });
        });

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<w:document xmlns:w="' + W_NS + '"><w:body>' + body +
            '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
            '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>' +
            "</w:sectPr></w:body></w:document>";
    }

    var DOCX_STYLES =
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:styles xmlns:w="' + W_NS + '">' +
        '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>' +
        '<w:color w:val="263445"/><w:sz w:val="21"/></w:rPr></w:rPrDefault>' +
        '<w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="288" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>' +
        '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
        '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>' +
        '<w:pPr><w:spacing w:after="60"/></w:pPr><w:rPr><w:b/><w:color w:val="142B4A"/><w:sz w:val="48"/></w:rPr></w:style>' +
        '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>' +
        '<w:pPr><w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="3569A8"/></w:pBdr>' +
        '<w:spacing w:before="360" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr>' +
        '<w:rPr><w:b/><w:color w:val="142B4A"/><w:sz w:val="30"/></w:rPr></w:style>' +
        '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>' +
        '<w:pPr><w:keepNext/><w:spacing w:before="160" w:after="40"/><w:outlineLvl w:val="1"/></w:pPr>' +
        '<w:rPr><w:b/><w:color w:val="3569A8"/><w:sz w:val="23"/></w:rPr></w:style>' +
        "</w:styles>";

    function buildDocx(sections) {
        return makeZip([
            {
                name: "[Content_Types].xml",
                content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
                    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
                    '<Default Extension="xml" ContentType="application/xml"/>' +
                    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
                    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
                    "</Types>"
            },
            {
                name: "_rels/.rels",
                content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
                    "</Relationships>"
            },
            {
                name: "word/_rels/document.xml.rels",
                content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
                    "</Relationships>"
            },
            { name: "word/styles.xml", content: DOCX_STYLES },
            { name: "word/document.xml", content: buildDocumentXml(sections) }
        ]);
    }


    // ---------- 4. EXCEL (.xlsx) ----------

    function buildRows(sections) {
        var rows = [["Section", "Field", "Information", "Source / Link"]];

        sections.forEach(function (section) {
            var title = section.title || "Report";

            section.items.forEach(function (item) {
                if (item.kind === "link") {
                    rows.push([title, "", item.text, item.url]);
                } else if (item.kind === "fact" && item.missing) {
                    rows.push([title, item.label, item.text, ""]);
                } else {
                    rows.push([title, item.label, item.text, item.source || item.url || ""]);
                }
            });
        });

        return rows;
    }

    function columnLetter(index) {
        return String.fromCharCode(65 + index);
    }

    function buildSheetXml(rows) {
        var widths = [28, 30, 90, 40];

        var cols = widths.map(function (width, i) {
            return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + width + '" customWidth="1"/>';
        }).join("");

        var sheetRows = rows.map(function (row, rowIndex) {
            var cells = row.map(function (value, colIndex) {
                var text = String(value || "").slice(0, 32000);
                var style = rowIndex === 0 ? 1 : 0;
                var ref = columnLetter(colIndex) + (rowIndex + 1);
                return '<c r="' + ref + '" s="' + style + '" t="inlineStr"><is><t xml:space="preserve">' + xmlEscape(text) + "</t></is></c>";
            }).join("");
            return '<row r="' + (rowIndex + 1) + '">' + cells + "</row>";
        }).join("");

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
            '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
            "<cols>" + cols + "</cols><sheetData>" + sheetRows + "</sheetData>" +
            '<autoFilter ref="A1:D' + rows.length + '"/></worksheet>';
    }

    var XLSX_STYLES =
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>' +
        '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts>' +
        '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
        '<fill><patternFill patternType="solid"><fgColor rgb="FF142B4A"/><bgColor indexed="64"/></patternFill></fill></fills>' +
        '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
        '<cellXfs count="2">' +
        '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
        '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
        "</cellXfs>" +
        '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

    function buildXlsx(sections) {
        return makeZip([
            {
                name: "[Content_Types].xml",
                content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
                    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
                    '<Default Extension="xml" ContentType="application/xml"/>' +
                    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
                    '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
                    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
                    "</Types>"
            },
            {
                name: "_rels/.rels",
                content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
                    "</Relationships>"
            },
            {
                name: "xl/workbook.xml",
                content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
                    '<sheets><sheet name="Report" sheetId="1" r:id="rId1"/></sheets></workbook>'
            },
            {
                name: "xl/_rels/workbook.xml.rels",
                content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
                    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
                    "</Relationships>"
            },
            { name: "xl/styles.xml", content: XLSX_STYLES },
            { name: "xl/worksheets/sheet1.xml", content: buildSheetXml(buildRows(sections)) }
        ]);
    }


    // ---------- 5. COPY TO CLIPBOARD ----------

    function buildPlainText(sections) {
        var lines = [
            "COMPANY RESEARCH REPORT - " + companyName(),
            "Generated by Comdal on " + reportDateText(),
            ""
        ];

        sections.forEach(function (section) {
            if (section.title) {
                lines.push("== " + section.title.toUpperCase() + " ==");
            }

            var lastLabel = null;

            section.items.forEach(function (item) {
                if (item.kind === "kv") {
                    lines.push(item.label + ": " + item.text);
                } else if (item.kind === "fact") {
                    if (item.label !== lastLabel) {
                        lines.push("", item.label + ":");
                        lastLabel = item.label;
                    }
                    lines.push(item.missing ? "  " + item.text : "  - " + item.text + (item.source ? " (Source: " + item.source + ")" : ""));
                } else if (item.kind === "link") {
                    lines.push("- " + item.text + " - " + item.url);
                } else {
                    lines.push(item.text);
                }
            });

            lines.push("");
        });

        return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
    }

    function fallbackCopy(text) {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();

        var ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (error) {
            ok = false;
        }

        area.remove();
        return ok;
    }

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                // fall through to the old method
            }
        }
        return fallbackCopy(text);
    }


    // ---------- 6. BUTTON EVENTS ----------

    function report() {
        var sections = collectReport();
        if (!sections.length) {
            notify("warning", "Create a report first, then export it.");
            return null;
        }
        return sections;
    }

    function notify(type, message) {
        if (typeof showBanner === "function") {
            showBanner(type, message);
        } else {
            console.warn(message);
        }
    }

    function flashLabel(button, text) {
        var original = button.dataset.originalLabel || button.textContent;
        button.dataset.originalLabel = original;
        button.textContent = text;
        clearTimeout(button._flashTimer);
        button._flashTimer = setTimeout(function () {
            button.textContent = original;
        }, 2000);
    }

    docxBtn.addEventListener("click", function () {
        var sections = report();
        if (!sections) return;

        try {
            downloadBlob(
                buildDocx(sections),
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                safeFileName("docx")
            );
        } catch (error) {
            console.error("Comdal DOCX export failed:", error);
            notify("error", "Could not create the Word file. Please try again.");
        }
    });

    xlsxBtn.addEventListener("click", function () {
        var sections = report();
        if (!sections) return;

        try {
            downloadBlob(
                buildXlsx(sections),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                safeFileName("xlsx")
            );
        } catch (error) {
            console.error("Comdal XLSX export failed:", error);
            notify("error", "Could not create the Excel file. Please try again.");
        }
    });

    copyBtn.addEventListener("click", async function () {
        var sections = report();
        if (!sections) return;

        var ok = await copyText(buildPlainText(sections));
        flashLabel(copyBtn, ok ? "Copied ✓" : "Copy failed");

        if (!ok) {
            notify("error", "Could not copy automatically. Please select the report text and copy it manually.");
        }
    });

    // exposed for testing / reuse
    window.ComdalExport = { collectReport: collectReport, buildPlainText: buildPlainText };
})();