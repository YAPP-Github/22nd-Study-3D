// elem 저장
const elem = {
  head: document.getElementsByTagName("head")[0],
};

export default function addStyle(cssText: string) {
  if (!elem.head) {
    const head = document.getElementsByTagName("head");
    if (!head) throw new Error("head is null");
    elem.head = document.getElementsByTagName("head")[0];
  }

  const { head } = elem;
  const styleElement = document.createElement("style");

  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(cssText));

  head.appendChild(styleElement);
  return styleElement;
}
