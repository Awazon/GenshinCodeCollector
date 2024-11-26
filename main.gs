function get_html_from_url(url) {
  return UrlFetchApp.fetch(url).getContentText();
}

function extract_code_from_html(html) {
    const $ = Cheerio.load(html);
    const rows = $('table tr');
    const headers = [];
    const result = [];

    rows.each((rowIndex, row) => {
        const cells = $(row).children();
        const rowData = {};

        cells.each((colIndex, cell) => {
            // brタグを改行コードに変換後, テキスト部分のみ取得
            const cellText = $(cell).find('br').replaceWith('\n').end().text().trim();
            // 改行で分割し、それぞれをトリム処理
            const cellLines = cellText.split('\n').map(line => line.trim());

            if (rowIndex === 0) {
                // ヘッダー行の場合
                headers.push(cellLines);
            } else {
                // データ行の場合
                const columnName = headers[colIndex];
                rowData[columnName] = cellLines.length > 1 ? cellLines : cellLines[0]; // 単一行か複数行かで保存形式を分岐
            }
        });

        // ヘッダー行以外をデータに追加
        if (rowIndex !== 0) {
            result.push(rowData);
        }
    });

    return result;
}


function doGet(e) {
  let html = get_html_from_url("https://genshin-impact.fandom.com/wiki/Promotional_Code");
  let codes = extract_code_from_html(html);
  return ContentService.createTextOutput(JSON.stringify(codes)).setMimeType(ContentService.MimeType.JSON);
}
