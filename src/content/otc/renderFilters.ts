import {
  ONLY_BNB_CHAIN,
  ONLY_BUY_OFFERS,
  ONLY_ETH_CHAIN,
  ONLY_POLYGON_CHAIN,
  ONLY_SELL_OFFERS,
  chainFilterValues,
  offerFilterValues,
} from "./consts";

const OFFER_TYPE_NAME = "offerType";
const CHAIN_TYPE_NAME = "chainType";

const checkRadio = (document: Document, name: string, value: string) => {
  (
    document.querySelector(
      `input[name='${name}'][value='${value}']`
    ) as HTMLInputElement
  ).checked = true;
};

export async function renderFilters(template: Element, header: Element) {
  const parser = new DOMParser();
  const filtersDocument = parser.parseFromString(
    template.innerHTML,
    "text/html"
  );
  const container = header.parentElement?.parentElement;

  renderFilter(container as HTMLElement, filtersDocument, {
    options: [
      { containerClass: ONLY_BUY_OFFERS, value: offerFilterValues.buy },
      { containerClass: ONLY_SELL_OFFERS, value: offerFilterValues.sell },
    ],
    name: OFFER_TYPE_NAME,
  });

  renderFilter(container as HTMLElement, filtersDocument, {
    options: [
      { containerClass: ONLY_BNB_CHAIN, value: chainFilterValues.BNB },
      { containerClass: ONLY_ETH_CHAIN, value: chainFilterValues.ETH },
      { containerClass: ONLY_POLYGON_CHAIN, value: chainFilterValues.polygon },
    ],
    name: CHAIN_TYPE_NAME,
  });

  const filters = filtersDocument.body.querySelector(
    ".filter-content"
  ) as Element;
  const alreadyAppendedFilters = header.querySelector(".filter-content");
  if (alreadyAppendedFilters) {
    header.removeChild(alreadyAppendedFilters);
  }
  header?.appendChild(filters);
}

function renderFilter(
  container: HTMLElement,
  filtersDocument: Document,
  settings: FilterSettings
) {
  function filterChanged(event: Event) {
    container?.classList.remove(
      ...settings.options.map((option) => option.containerClass)
    );
    const option = settings.options.find(
      (option) => option.value === (event.target as HTMLInputElement).value
    );
    container?.classList.add(option?.containerClass as string);
  }

  let isAnyClassApplied = false;
  settings.options.forEach((setting) => {
    const isClassAppliedToContainer = container?.classList.contains(
      setting.containerClass
    );

    if (isClassAppliedToContainer) {
      checkRadio(filtersDocument, settings.name, setting.value);
      isAnyClassApplied = true;
    }
  });
  if (!isAnyClassApplied) {
    checkRadio(filtersDocument, settings.name, "all");
  }

  filtersDocument
    .querySelectorAll(`input[name='${settings.name}']`)
    .forEach((input) => {
      input.addEventListener("change", filterChanged);
    });
}

interface FilterSettings {
  options: { containerClass: string; value: string }[];
  name: string;
}
