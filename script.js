// Simple markdown parser: **bold**, *italic*, # heading, - list, [links](url)
function parseMarkdown(text) {
  // Headings
  text = text.replace(/^# (.+)$/gm, "<h3>$1</h3>");
  
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  
  // Italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Lists
  if (text.includes("- ")) {
    let lines = text.split("\n");
    let inList = false;
    let result = "";
    lines.forEach((line) => {
      if (line.startsWith("- ")) {
        if (!inList) {
          result += "<ul>";
          inList = true;
        }
        result += `<li>${line.slice(2)}</li>`;
      } else {
        if (inList) {
          result += "</ul>";
          inList = false;
        }
        result += line + "\n";
      }
    });
    if (inList) result += "</ul>";
    text = result;
  }

  return text;
}


// Detect if content is a file path (video/image)
function isAsset(path) {
    return /\.(png|jpg|jpeg|gif|mp4|webm|ogg|mov|m4v)$/i.test(path);
}


function createContentElement(item) {
  const div = document.createElement("div");

  // BLOG POST JSON
  if (item.endsWith(".json")) {
    div.className = "section-content blog-card";

    fetch(item)
      .then(res => res.json())
      .then(blog => {
        const link = document.createElement("a");
        link.href = `blog.html?post=${encodeURIComponent(item)}`;
        link.className = "blog-link";

        // wrapper for square thumbnail
        const thumbWrapper = document.createElement("div");
        thumbWrapper.className = "blog-thumb-wrapper";

        const img = document.createElement("img");
        img.src = blog.image || "";
        img.alt = blog.title || "Blog image";

        thumbWrapper.appendChild(img);

        const title = document.createElement("div");
        title.className = "blog-title";
        title.textContent = blog.title || "Untitled blog";

        link.appendChild(thumbWrapper);
        link.appendChild(title);

        div.appendChild(link);
      });
    
    return div;
}

  // NORMAL ASSET (image/video)
  if (isAsset(item)) {
    if (/\.(mp4|webm|ogg|mov)$/i.test(item)) {
      const video = document.createElement("video");
      video.src = item;
      video.controls = true;
      video.onerror = () => {
        div.textContent = "Oops! What you're looking for is missing.";
        div.className = "section-content missing";
      };
      div.appendChild(video);
      div.className = "section-content";
    } else {
      const img = document.createElement("img");
      img.src = item;
      img.alt = "Asset";
      img.onerror = () => {
        div.textContent = "Oops! What you're looking for is missing.";
        div.className = "section-content missing";
      };
      div.appendChild(img);
      div.className = "section-content";
    }
    return div;
  }

  // MARKDOWN CHARACTERS
  div.className = "section-content md-content";
  div.innerHTML = parseMarkdown(item);
  return div;
}



// Load JSON and render
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    // Header
    const profilePic = document.getElementById("profile-pic");
    profilePic.src = data.headshot || "";
    profilePic.onerror = () => (profilePic.style.display = "none");

    document.getElementById("portfolio-title").textContent = data.title;
    document.getElementById("portfolio-summary").textContent = data.summary;

    // Sections
    const container = document.getElementById("portfolio-sections");
    data.sections.forEach((section) => {
      const sectionEl = document.createElement("section");
      sectionEl.className = "portfolio-section";

      const titleEl = document.createElement("h2");
      titleEl.className = "section-title";
      titleEl.textContent = section.title;

      const tagsEl = document.createElement("p");
      tagsEl.className = "section-tags";
      section.tags.forEach((tag, idx) => {
        const span = document.createElement("span");
        span.textContent = tag;
        tagsEl.appendChild(span);
      });

      sectionEl.appendChild(titleEl);
      sectionEl.appendChild(tagsEl);

      const contentContainer = document.createElement("div");
      if (section.layout === "grid") contentContainer.className = "grid-layout";

      section.content.forEach((item) => {
        const contentEl = createContentElement(item);
        contentContainer.appendChild(contentEl);
      });

      sectionEl.appendChild(contentContainer);
      container.appendChild(sectionEl);
    });

    // Footer
    document.getElementById("portfolio-footer").textContent = data.footer;
  })
  .catch((err) => console.error("Error loading portfolio data:", err));
