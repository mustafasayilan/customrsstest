document.addEventListener("DOMContentLoaded", function() {
  const RSS_URL = "%%DOMAIN_PLACEHOLDER%%/nada/headlines_json";

  function escapeHTML(str) {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  }

  function loadTheme(theme) {
    const themeStyles = {
      "dark": "%%DOMAIN_PLACEHOLDER%%/NADA_rss_widget/css/dark",
      "light": "%%DOMAIN_PLACEHOLDER%%/NADA_rss_widget/css/light",
      "main": "%%DOMAIN_PLACEHOLDER%%/NADA_rss_widget/css/main"
    };

    if (themeStyles[theme]) {
      let linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = themeStyles[theme];
      document.head.appendChild(linkElement);
    }
  }

  function fetchRSSData(settings) {
    let url = `${RSS_URL}?items_per_page=${settings.itemsPerPage}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        let items = data;
        let container = document.createElement("div");
        container.className = "rss-feed";
        let itemsDiv = document.createElement("div");
        itemsDiv.className = "rss-items";

        items.forEach(item => {
          let title = settings.showTitle ? item.title : '';
          let link = "https://www.nada.com" + item.node_url;
          let description = settings.showDescription ? (escapeHTML(item.body).length > 100 ? escapeHTML(item.body).substring(0, 100) + "..." : escapeHTML(item.body)) : '';
          let date = settings.showDate ? item.changed : '';
          let author = settings.showAuthor ? item.author_name : '';
          let image = settings.showImage ? item.image_uri.replace("public://", "https://www.nada.com/sites/default/files/") : '';

          let itemHTML = `
                        <div class="rss-item" style="background-image: url('${image}')">
                            <div class="rss-text-content">
                                <h3><a href="${link}" target="_blank">${title}</a></h3>
                                <p class="rss-description">${description}</p>
                                <div class="rss-meta">
                                    <span class="rss-date">${date}</span>
                                    <span class="rss-author">${author}</span>
                                </div>
                            </div>
                        </div>
                    `;

          itemsDiv.innerHTML += itemHTML;
        });

        // Öğe sayısına bağlı olarak grid-template-columns değerini ayarla
        itemsDiv.style.gridTemplateColumns = `repeat(${items.length}, 1fr)`;

        container.appendChild(itemsDiv);
        document.querySelector(".NADAWidget").appendChild(container);
      });
  }

  window.getNADAWidget = function(settings) {
    loadTheme(settings.theme);
    fetchRSSData(settings);
  };
});
