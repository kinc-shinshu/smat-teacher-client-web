export function parse(text) {
  let result = text.replace(/\*/g, "\\times");
  result = result.replace(/\//g, "\\div");
  result = result.replace(/\+-/g, "\\pm");
  result = result.replace(/-\+/g, "\\mp");
  const ss = result.match(/#{.+?}/g);
  if (ss != null) {
    for (let s of ss) {
      let k = s.match(/[^#]+/g);
      result = result.replace(s, "\\sqrt{" + k[0].slice(1, -1) + "}");
    }
  }
  const fs = result.match(/\[.+?]%\[.+?]/g);
  if (fs != null) {
    for (let f of fs) {
      let k = f.match(/[^%]+/g);
      result = result.replace(
        f,
        "\\frac{" + k[0].slice(1, -1) + "}{" + k[1].slice(1, -1) + "}"
      );
    }
  }
  result = result.replace(/@|#|\$|%|&/, "");
  return result;
}
