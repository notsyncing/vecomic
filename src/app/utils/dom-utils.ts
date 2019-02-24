export class DomUtils {
  public static copyAttribute(attrName: string, fromElem: Element, toElem: Element): void {
    if (!fromElem.hasAttribute(attrName)) {
      toElem.removeAttribute(attrName);
    } else {
      toElem.setAttribute(attrName, fromElem.getAttribute(attrName));
    }
  }
}
