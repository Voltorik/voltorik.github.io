fetch('https://voltorik.substack.com/feed')
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const items = data.querySelectorAll("item");
    let html = "";
    items.forEach(el => {
      const title = el.querySelector("title").textContent;
      const link = el.querySelector("link").textContent;
      const pubDate = el.querySelector("pubDate").textContent;
      html += `<div><h2><a href="${link}">${title}</a></h2><p>${pubDate}</p></div>`;
    });
    document.getElementById("substack-posts").innerHTML = html;
  });


