const fs = require('fs');
const json2csv = require('json2csv').parse; // For exporting to CSV, you can use json2csv module


class HTMLTableGenerator {

    constructor(data, options, conditionalStyles) {
        if (!data || !options) {
            throw new Error('Data and options are required');
        }

        this.validateInput(data, options);

        this.data = data;
        this.options = options;
        this.conditionalStyles = conditionalStyles || [];
    }

    validateInput(data, options) {
        if (typeof data !== 'object' || !Array.isArray(data.header) || !Array.isArray(data.content)) {
            throw new Error('Data must be an object with "header" and "content" arrays');
        }
        if (typeof options !== 'object') {
            throw new Error('Options must be an object');
        }
        ['titleHeaderBgColor', 'titleTextColor', 'headerBgColor', 'headerTextColor', 'tdPadding', 'tdFontWeight', 'tdColor'].forEach(option => {
            if (typeof options[option] !== 'string') {
                throw new Error(`Option "${option}" must be a string`);
            }
        });
    }

    createTableHTML() {
        const {
            titleHeaderBgColor,
            titleTextColor,
            headerBgColor,
            headerTextColor,
            tdPadding,
            tdFontWeight,
            tdColor
        } = this.options;
        
        const {
            header,
            content,
            title
        } = this.data;

        const tableHeader = `
      <table style="width: 100%; background-color: #f5f5f5; border-collapse: collapse; border: 2px solid ${headerBgColor};">
      <thead>
        <tr>
          <th style="font-weight: bold; text-align: center; background-color: ${titleHeaderBgColor}; color: ${titleTextColor}; padding: 10px; border: 2px solid ${titleHeaderBgColor};" colspan="${header.length}">${title}</th>
        </tr>
        <tr style="background-color: ${headerBgColor}; text-align: center;">
          ${header.map(text => `<th style="border: 2px solid ${headerBgColor}; padding: ${tdPadding}; color: ${headerTextColor};">${text}</th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

      const tableRows = this.data.content.map(row => {
        let conditionalStylesForRow = {};
        for (let { targetColumn, dependsOnColumn, rule, style } of this.conditionalStyles) {
            if (rule(row[dependsOnColumn])) {
                conditionalStylesForRow[targetColumn] = style;
            }
        }

        return `<tr style="background-color: #fff; text-align: center;">${this.data.header.map(header => {
            const cellValue = row[header];
            const style = conditionalStylesForRow[header] ? conditionalStylesForRow[header] : '';

            return `<td style="border: 2px solid ${headerBgColor}; padding: ${tdPadding}; font-weight: ${tdFontWeight}; color: ${tdColor}; ${style};">${cellValue}</td>`;
        }).join('')}</tr>`;
    }).join('');

        const tableFooter = `</tbody></table>`;

        return tableHeader + tableRows + tableFooter;
    }

    sortRows(column, order = 'asc') {
        if (!this.data.header.includes(column)) {
            throw new Error(`Invalid column name: ${column}`);
        }

        this.data.content.sort((a, b) => {
            if (order === 'asc') {
                if (a[column] < b[column]) return -1;
                if (a[column] > b[column]) return 1;
                return 0;
            } else if (order === 'desc') {
                if (a[column] > b[column]) return -1;
                if (a[column] < b[column]) return 1;
                return 0;
            } else {
                throw new Error(`Invalid order value: ${order}. Expected 'asc' or 'desc'.`);
            }
        });
    }

    filterRows(column, value) {
        if (!this.data.header.includes(column)) {
            throw new Error(`Invalid column name: ${column}`);
        }
        this.data.content = this.data.content.filter(row => row[column] === value);
    }

    exportToCSV(fileName) {
        const csv = json2csv(this.data.content);
        fs.writeFileSync(fileName, csv, 'utf8');
        console.log(`Data exported to ${fileName}`);
    }

    addColumn(columnName, valueFunction) {
        if (typeof columnName !== 'string') {
            throw new Error('Column name must be a string');
        }
        if (typeof valueFunction !== 'function') {
            throw new Error('Value function must be a function');
        }
    
        this.data.header.push(columnName);
        for (const row of this.data.content) {
            row[columnName] = valueFunction(row);
        }
    }

}

module.exports = HTMLTableGenerator;