/** Saves text as a file in the browser's downloads. */
export function downloadFile(name: string, text: string, type = 'application/json'): void {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
  const link = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(link);
  link.click();
  link.remove();
  // Give the download a moment to start before letting go of the file.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
