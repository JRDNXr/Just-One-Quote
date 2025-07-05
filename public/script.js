const fs = require('fs');

const inputPath = './quotes.txt';
const outputPath = './quotes.json';

const raw = fs.readFileSync(inputPath, 'utf8');
const lines = raw.split('\n').filter(Boolean);

const quotes = lines.map(line => {
    const [quote, author] = line.split('|');
    return {
        quote: quote.trim(),
        author: author ? author.trim() : null
    };
});

fs.writeFileSync(outputPath, JSON.stringify(quotes, null, 2));
console.log(`✅ Converted ${quotes.length} quotes to JSON.`);