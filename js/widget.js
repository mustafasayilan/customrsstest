(function() {
  const RSS_URL = 'https://ms.nada.org/nada/nada_headlines_rss';

  function fetchRSSData(itemsPerPage = 5) {
    let url = `${RSS_URL}?items_per_page=${itemsPerPage}`;

    fetch(url)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        let items = data.querySelectorAll('item');
        let container = document.getElementById('rss-widget-container');
        items.forEach(item => {
          let title = item.querySelector('title').textContent;
          let link = item.querySelector('link').textContent;
          let description = item.querySelector('description').textContent;

          let itemHTML = `
                    <div class="rss-item">
                        <h3><a href="${link}" target="_blank">${title}</a></h3>
                        <p>${description}</p>
                    </div>
                `;
          container.innerHTML += itemHTML;
        });
      })
  }

  window.loadRSSWidget = function(itemsPerPage) {
    fetchRSSData(itemsPerPage);
  }

})();
