const fs = require('fs');
const path = require('path');

// Paths
const INPUT_FILE = path.join(__dirname, '../src/Utils/Dictionary/dictWithDefs.txt');
const OUTPUT_FILE = path.join(__dirname, '../src/Utils/Dictionary/definitions.js');

console.log('Processing dictionary file...');
console.log('Input:', INPUT_FILE);
console.log('Output:', OUTPUT_FILE);

try {
  // Read the dictionary file
  const content = fs.readFileSync(INPUT_FILE, 'utf8');

  // Parse the tab-separated content
  const lines = content.split('\n');
  const definitions = {};
  let processedCount = 0;

  for (const line of lines) {
    if (!line.trim()) continue; // Skip empty lines

    const tabIndex = line.indexOf('\t');
    if (tabIndex === -1) continue; // Skip malformed lines

    const word = line.substring(0, tabIndex).trim();
    const definition = line.substring(tabIndex + 1).trim();

    if (word && definition) {
      definitions[word] = definition;
      processedCount++;
    }
  }

  console.log(`Processed ${processedCount} definitions`);

  // Create the output as an ES module
  // We use JSON.stringify to ensure proper escaping
  const output = `// Auto-generated file - do not edit manually
// Generated from dictWithDefs.txt
// Total definitions: ${processedCount}

export const definitions = ${JSON.stringify(definitions, null, 0)};
`;

  // Write the output file
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

  // Get file sizes for reporting
  const inputSize = (fs.statSync(INPUT_FILE).size / 1024 / 1024).toFixed(2);
  const outputSize = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);

  console.log('✓ Dictionary processing complete!');
  console.log(`  Input size: ${inputSize} MB`);
  console.log(`  Output size: ${outputSize} MB`);
  console.log(`  Output file: ${OUTPUT_FILE}`);

} catch (error) {
  console.error('Error processing dictionary:', error);
  process.exit(1);
}
