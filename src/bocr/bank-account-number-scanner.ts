import * as fs from 'fs';
import { DIGITS } from './scanner-constants';

export class BankAccountNumberScanner {
    private readonly lineBreakDelimiter = '\n';
    private readonly returnDelimiter = '\r';
    private readonly characterColumnHeight = 3;
    private readonly characterColumnWidth = 3;
    private readonly maxDigits = 9;

    async scanFile(path: string): Promise<string[] | null> {
        try {
            const fileResult = await fs.promises.readFile(path, { encoding: 'utf-8' });
            return this.analyzeCode(fileResult);
        } catch (error) {
            console.error('Error: No file found under given path.');
            return null;
        }
    }

    analyzeCode(fileContent: string | null): string[] {
        const codeLines = this.codeContentToLineArray(fileContent);
        const result: string[] = [];

        for (let i = 0; i < codeLines.length; i += this.characterColumnHeight) {
            const accountNumberCharacters = [codeLines[i], codeLines[i + 1], codeLines[i + 2]];
            const row = this.analyzeRow(accountNumberCharacters);
            result.push(row);
        }

        return result;
    }

    private codeContentToLineArray(fileContent: string | null): string[] {
        if (fileContent === null || fileContent.length === 0) {
            return [];
        }

        const isBlankLine = (s: string) => [this.returnDelimiter, this.lineBreakDelimiter, ''].includes(s);
        const trimLineEnd = (s: string) => s.substring(0, s.length - (s.length % this.characterColumnWidth));

        const lines = fileContent
            .split(this.lineBreakDelimiter)
            .filter((l) => !isBlankLine(l))
            .map((l) => trimLineEnd(l));
        return lines;
    }

    private analyzeRow(row: string[]): string {
        let result = '';

        for (let i = 0; i < this.maxDigits; i++) {
            const startFrom = i * this.characterColumnHeight;
            const sign = [
                row[0].substring(startFrom, startFrom + this.characterColumnWidth),
                row[1].substring(startFrom, startFrom + this.characterColumnWidth),
                row[2].substring(startFrom, startFrom + this.characterColumnWidth),
            ];

            if (this.isEmptySign(sign)) {
                continue;
            }

            const resultNumber = this.signToNumber(sign);
            if (resultNumber === undefined) {
                return 'Error in data.';
            } else {
                result += resultNumber;
            }
        }

        return result;
    }

    private signToNumber(sign: string[]): string | undefined {
        const result = Object.keys(DIGITS).find((k) => this.areStringArraysEqual(sign, DIGITS[k]));
        return result;
    }

    private areStringArraysEqual(a: string[], b: string[]): boolean {
        const isEqual = a.length === b.length && a.every((val, index) => val === b[index]);
        return isEqual;
    }

    private isEmptySign(sign: string[]): boolean {
        return sign.every((s) => s === undefined || s === '');
    }
}
