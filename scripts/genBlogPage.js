const https = require('https');
const fs = require('fs');
const path = require('path');

// Fetch the Substack RSS feed
function fetchRSS() {
  return new Promise((resolve, reject) => {
    https.get('https://voltorik.substack.com/feed', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

// Generate HTML content from the RSS feed (basic XML parsing with regex)
function generateHTML(rss) {
  let htmlContent = '<h1>Latest Blog Posts</h1>\n';
  
  const items = rss.match(/<item>(.*?)<\/item>/gs);
  
  if (items) {
    items.forEach(item => {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1];
      const link = item.match(/<link>(.*?)<\/link>/)?.[1];
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];
      
      if (title && link && pubDate) {
        htmlContent += `
          <div>
            <h2><a href="${link}" target="_blank">${title}</a></h2>
            <p>Published on: ${new Date(pubDate).toLocaleDateString()}</p>
          </div>\n`;
      }
    });
  }

  return htmlContent;
}

// Save the HTML content to a file
function saveHTML(content) {
  const outputPath = path.join(__dirname, 'dist', 'index.html');
  const templatePath = path.join(__dirname, 'blogTemplate.html');

  let finalHTML = content;
  
  if (fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, 'utf8');
    finalHTML = template.replace('{{SUBSTACK_POSTS}}', content);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true }); // Ensure directory exists
  fs.writeFileSync(outputPath, finalHTML, 'utf8');
  console.log('Blog page generated successfully!');
}

// Main function to fetch the RSS feed and generate content
async function main() {
  try {
    const rss = await fetchRSS();
    const content = generateHTML(rss);
    saveHTML(content);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

