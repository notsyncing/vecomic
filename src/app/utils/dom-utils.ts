export class DomUtils {
  public static copyAttribute(attrName: string, fromElem: Element, toElem: Element): void {
    if (!fromElem.hasAttribute(attrName)) {
      toElem.removeAttribute(attrName);
    } else {
      const newValue = fromElem.getAttribute(attrName);
      const oldValue = toElem.getAttribute(attrName);

      if (newValue === oldValue) {
        return;
      }

      toElem.setAttribute(attrName, newValue);
    }
  }
}
