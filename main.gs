function get_html_from_url(url) {
  return UrlFetchApp.fetch(url).getContentText();
}

function extract_code_from_html(html) {
    const $ = Cheerio.load(html);
    const rows = $('table tr');
    const headings = [];
    const data = [];

    rows.each((rowIndex, row) => {
        const cells = $(row).children();
        const rowData = {};

        cells.each((colIndex, cell) => {
            const cellText = $(cell).text().trim();
            const splitText = cellText.split('\n').map(item => item.trim());

            if (rowIndex === 0) {
                // ヘッダー行
                headings.push(splitText.join(' '));
            } else {
                // データ行
                rowData[headings[colIndex] || `Column${colIndex + 1}`] = splitText.length > 1 ? splitText : splitText[0];
            }
        });

        if (rowIndex !== 0) {
            data.push(rowData);
        }
    });

    return data;
}

function doGet(e) {
  let html = get_html_from_url("https://genshin-impact.fandom.com/wiki/Promotional_Code");
  let codes = extract_code_from_html(html);
  return ContentService.createTextOutput(JSON.stringify(codes)).setMimeType(ContentService.MimeType.JSON);
}
