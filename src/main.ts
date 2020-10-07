import { BankAccountNumberScanner } from './bocr/bank-account-number-scanner';

const scanner = new BankAccountNumberScanner();
const testFilePath = process.argv[2];

console.log(`Parsing file "${testFilePath}"...`);

scanner.scanFile(testFilePath).then((result) => {
    console.log('Parsing complete.');

    if (result === null) {
        console.error('An error occured while parsing the file.');
        return;
    }
    if (result.length === 0) {
        console.log('No bank account numbers have been recognized in the given file.');
    } else {
        console.log('The following bank account numbers have been recognized:');
        result.forEach((r) => console.log(r));
    }
});
