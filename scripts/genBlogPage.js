const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Fetch the Substack RSS feed
async function fetchRSS() {
  try {
    const response = await fetch('https://voltorik.substack.com/feed');
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    process.exit(1);
  }
}

// Generate HTML content from the RSS feed
function generateHTML(rss) {
  const dom = new JSDOM(rss, { contentType: "text/xml" });
  const document = dom.window.document;
  const items = document.querySelectorAll('item');

  let htmlContent = '<h1>Latest Blog Posts</h1>\n';

  items.forEach(item => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const pubDate = new Date(item.querySelector('pubDate').textContent);

    htmlContent += `
      <div>
        <h2><a href="${link}" target="_blank">${title}</a></h2>
        <p>Published on: ${pubDate.toLocaleDateString()}</p>
      </div>\n`;
  });

  return htmlContent;
}

// Save the HTML content to a file
function saveHTML(content) {
  
  const blogPath = path.join(__dirname, 'blog.html');

  if (fs.existsSync(blogPath)) {
    const blogPage = fs.readFileSync(blogPath, 'utf8');
    const newBlogPage = blogPage.replace('{{SUBSTACK_POSTS}}', content);
    fs.writeFileSync(blogPath, newBlogPage, 'utf8');
  } else {
    fs.writeFileSync(blogPath, content, 'utf8');
  }

  console.log('Blog page generated successfully!');
}

// Main function to fetch the RSS feed and generate content
async function main() {
  const rss = await fetchRSS();
  const content = generateHTML(rss);
  saveHTML(content);
}

main();

