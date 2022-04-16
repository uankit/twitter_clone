$(document).ready(() => {
  $.get("/api/posts", (results) => {
    outputPosts(results, $(".postsContainer"));
  });
});

function outputPosts(results, container) {
  container.html("");
  if (results.length == 0) {
    container.append("<span class='noResults'>There's nothing happening</span>");
  } else {
    results.forEach((result) => {
      const html = createPostHtml(result);
      container.append(html);
    });
  }
}
