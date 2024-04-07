import { MultiplierCellValueParser } from "../utils/cellValueParser";
import { chainFilterValues, offerFilterValues } from "./consts";
import { getTemplates } from "../utils/getTemplates";
import { MESSAGE_KEYS } from "../../types/messages";
import { renderFilters } from "./renderFilters";
import {
  multiplierIndex,
  tweakHistoryTableWithOrderBy,
  tweakOtcTableWithOrderBy,
} from "./tweakTableWithOrderBy";

const multiplierCellValueParser = new MultiplierCellValueParser();

chrome.runtime.onMessage.addListener(async function (request) {
  const templates = await getTemplates();

  if (request.key === MESSAGE_KEYS.OTC_OFFERS_REQUEST_FINISHED) {
    setTimeout(() => {
      tweakOTCOffersTable(templates);
    }, 100);
  }
  if (request.key === MESSAGE_KEYS.OTC_HISITORY_REQUEST_FINISHED) {
    setTimeout(() => {
      tweakOTCHistoryTable(templates);
    }, 100);
  }
});

async function tweakOTCOffersTable(templates: { [key: string]: Element }) {
  const table = getTable();
  const header = getHeader();
  const rows = getRows(table);
  await tweakOTCTable(templates, header, rows, 1);
  tweakOtcTableWithOrderBy(table, rows, templates.orderArrows, (sortedRows) => {
    sortedRows.forEach((r) => table.querySelector("tbody")?.appendChild(r));
  });
}

async function tweakOTCHistoryTable(templates: { [key: string]: Element }) {
  const table = getTable();
  const header = getHeader();
  const rows = getRows(table);
  await tweakOTCTable(templates, header, rows, 0);
  tweakHistoryTableWithOrderBy(
    table,
    rows,
    templates.orderArrows,
    (sortedRows) => {
      sortedRows.forEach((r) => table.querySelector("tbody")?.appendChild(r));
    }
  );
}

async function tweakOTCTable(
  templates: {
    [key: string]: Element;
  },
  header: Element,
  rows: HTMLTableRowElement[],
  chainSvgIndex: number
) {
  rows.forEach((row) => {
    if (row.cells[0].innerText === "BUY") {
      row.classList.add(offerFilterValues.buy);
    } else {
      row.classList.add(offerFilterValues.sell);
    }

    const multiplier = multiplierCellValueParser.parse(
      row.cells[multiplierIndex]
    );
    if (multiplier < 0.5) {
      row.classList.add("too-low-multiplier");
    }

    row.classList.add(getChain(row, chainSvgIndex));
  });
  renderFilters(templates.filters, header as Element);
}

function getChain(row: HTMLTableRowElement, chainSvgIndex: number) {
  const svg = row.cells[4].querySelectorAll("span > svg");
  if (!svg[chainSvgIndex]) {
    return "";
  }
  const path = svg[chainSvgIndex].querySelectorAll("path");

  if (path.length === 1) {
    return chainFilterValues.polygon;
  } else if (path.length === 2) {
    return chainFilterValues.BNB;
  } else {
    return chainFilterValues.ETH;
  }
}

function getHeader() {
  return document
    .evaluate(
      '//div/div/div[contains(@class, "header")][contains(text(), "Offers")]',
      document
    )
    .iterateNext() as Element;
}

function getTable() {
  return document
    .evaluate(
      `//div[div[div[contains(@class, "header")][contains(text(), "Offers")]]]/table`,
      document
    )
    .iterateNext() as HTMLTableElement;
}

function getRows(table: HTMLTableElement) {
  return [
    ...(table
      .querySelector("tbody")
      ?.querySelectorAll("tr") as NodeListOf<HTMLTableRowElement>),
  ];
}

export {};
