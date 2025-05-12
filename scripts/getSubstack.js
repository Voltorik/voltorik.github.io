const url = 'https://volt-blogsite-backend.onrender.com/api/substack'
  fetch(url)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const items = data.querySelectorAll("item");
    let html = "";
    items.forEach(el => {
      const title = el.querySelector("title").textContent;
      const link = el.querySelector("link").textContent;
      const pubDate = formatDate(el.querySelector("pubDate").textContent);
        html += `<li class='substack-post'><a href="${link}" 
            target="_blank">${title}</a> - ${pubDate}</div>`;
    });
    document.getElementById("substack-posts").innerHTML = html;
  });
  
  function formatDate(rssDate) {
    const date = new Date(rssDate);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
    });
    return formattedDate;
  }
