const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all API route files
const apiRoutes = glob.sync('src/app/api/**/route.ts');

// Process each file
apiRoutes.forEach(filePath => {
  console.log(`Processing ${filePath}...`);
  const fullPath = path.join(process.cwd(), filePath);
  
  // Read the file content
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if the file already has the static export directives
  if (!content.includes('export const dynamic =')) {
    // Find the first import statement and add our directives after it
    const importRegex = /^import.*?;(\r?\n)+/m;
    const importMatch = content.match(importRegex);
    
    if (importMatch) {
      const insertPosition = importMatch.index + importMatch[0].length;
      const newContent = 
        content.slice(0, insertPosition) + 
        '// For static export compatibility\n' +
        'export const dynamic = "force-static";\n\n' +
        content.slice(insertPosition);
      
      // Write the updated content back to the file
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`⚠️ Could not find import in ${filePath}`);
    }
  } else {
    console.log(`ℹ️ ${filePath} already has static export directives`);
  }
});

console.log('Done! All API routes updated for static export compatibility.');