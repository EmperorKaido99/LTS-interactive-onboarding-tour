/**
 * Management training screens (Reviewer / Evaluator / Assessor) share one login page and
 * one details page. The role comes from the link: ?profile=reviewer|evaluator|assessor
 * (default: reviewer).
 *
 *  - Elements marked data-role have "Reviewer" / "reviewer" replaced with the chosen role.
 *  - Links marked data-profile-link keep the chosen profile on the next page.
 *  - window.MGMT_PROFILE holds the profile key for scripts on the page.
 */
(function () {
  var ROLES = { reviewer: "Reviewer", evaluator: "Evaluator", assessor: "Assessor" };
  var key = new URLSearchParams(window.location.search).get("profile");
  if (!ROLES[key]) key = "reviewer";
  var role = ROLES[key];
  window.MGMT_PROFILE = key;

  function swap(text) {
    return text.replace(/Reviewer|reviewer/g, function (m) {
      return m === "Reviewer" ? role : key;
    });
  }

  document.title = swap(document.title);

  document.querySelectorAll("[data-role]").forEach(function (el) {
    if (el.tagName === "INPUT") {
      el.value = swap(el.value);
      return;
    }
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) node.nodeValue = swap(node.nodeValue);
  });

  document.querySelectorAll("[data-profile-link]").forEach(function (a) {
    a.setAttribute("href", a.getAttribute("href").split("?")[0] + "?profile=" + key);
  });
})();
