export async function getTemplates() {
  const html = await fetch(chrome.runtime.getURL("/templates.html"));
  const htmlContent = await html.text();
  const parser = new DOMParser();
  const templatesDocument = parser.parseFromString(htmlContent, "text/html");
  return [...templatesDocument.querySelectorAll("script")].reduce(
    (acc, script) => {
      acc[script.id] = script;
      return acc;
    },
    {} as { [key: string]: Element }
  );
}
