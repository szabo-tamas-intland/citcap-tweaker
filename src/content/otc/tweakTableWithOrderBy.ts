import {
  CellValueParser,
  CurrencyCellValueParser,
  DateCellValueParser,
  MultiplierCellValueParser,
} from "../utils/cellValueParser";

const currencyCellValueParser = new CurrencyCellValueParser();
const multiplierCellValueParser = new MultiplierCellValueParser();
const dateCellValueParser = new DateCellValueParser();

const allocationColumnIndex = 1;
const priceColumnIndex = 2;
export const multiplierIndex = 3;
const dateIndex = 5;

function getHeaderColumns(table: HTMLTableElement) {
  return table.querySelectorAll("thead th");
}

enum ArrowFilterClassNames {
  date = "date",
  price = "price",
  currency = "currency",
  multiplier = "multiplier",
}

export function tweakHistoryTableWithOrderBy(
  table: HTMLTableElement,
  rows: HTMLTableRowElement[],
  orderArrowsTemplate: Element,
  onSort: (rows: HTMLTableRowElement[]) => void
) {
  const headerColumns = getHeaderColumns(table);
  tweakTableWithOrderBy(
    table,
    rows,
    orderArrowsTemplate,
    headerColumns,
    onSort
  );
  const dateArrows = getOrderArrowsElement(
    table,
    orderArrowsTemplate,
    rows,
    dateIndex,
    dateCellValueParser,
    ArrowFilterClassNames.date,
    onSort
  );
  headerColumns[dateIndex].appendChild(dateArrows);
}

export function tweakOtcTableWithOrderBy(
  table: HTMLTableElement,
  rows: HTMLTableRowElement[],
  orderArrowsTemplate: Element,
  onSort: (rows: HTMLTableRowElement[]) => void
) {
  const headerColumns = getHeaderColumns(table);
  tweakTableWithOrderBy(
    table,
    rows,
    orderArrowsTemplate,
    headerColumns,
    onSort
  );
}

function tweakTableWithOrderBy(
  table: HTMLTableElement,
  rows: HTMLTableRowElement[],
  orderArrowsTemplate: Element,
  headerColumns: NodeListOf<Element>,
  onSort: (rows: HTMLTableRowElement[]) => void
) {
  const allocationArrows = getOrderArrowsElement(
    table,
    orderArrowsTemplate,
    rows,
    allocationColumnIndex,
    currencyCellValueParser,
    ArrowFilterClassNames.price,
    onSort
  );
  const priceArrows = getOrderArrowsElement(
    table,
    orderArrowsTemplate,
    rows,
    priceColumnIndex,
    currencyCellValueParser,
    ArrowFilterClassNames.currency,
    onSort
  );
  const multiplierArrows = getOrderArrowsElement(
    table,
    orderArrowsTemplate,
    rows,
    multiplierIndex,
    multiplierCellValueParser,
    ArrowFilterClassNames.multiplier,
    onSort
  );

  [...headerColumns].forEach((header) => {
    const alreadyAppendedArrows = header.querySelector(".order-arrows-content");
    if (alreadyAppendedArrows) {
      header.removeChild(alreadyAppendedArrows);
    }
  });

  headerColumns[allocationColumnIndex].appendChild(allocationArrows);
  headerColumns[priceColumnIndex].appendChild(priceArrows);
  headerColumns[multiplierIndex].appendChild(multiplierArrows);
}

const getOrderArrows = (orderArrowsTemplate: Element) => {
  const parser = new DOMParser();
  return parser.parseFromString(orderArrowsTemplate.innerHTML, "text/html");
};

const getOrderArrowsElement = (
  table: HTMLTableElement,
  orderArrowsTemplate: Element,
  rows: HTMLTableRowElement[],
  columnIndex: number,
  parser: CellValueParser<number>,
  className: string,
  onSort: (rows: HTMLTableRowElement[]) => void
) => {
  const orderArrows = getOrderArrows(orderArrowsTemplate);
  const body = orderArrows.body.querySelector(
    ".order-arrows-content"
  ) as Element;
  body.classList.add(className);
  const down = orderArrows.querySelector(".order-arrow-down");
  const up = orderArrows.querySelector(".order-arrow-up");

  const removeClassNames = () => {
    Object.values(ArrowFilterClassNames).forEach((_className) =>
      table.classList.remove(_className, "down", "up")
    );
  };

  up?.addEventListener("click", function () {
    removeClassNames();
    table.classList.add(className, "up");
    rows.sort((row1, row2) => {
      return (
        parser.parse(row1.cells[columnIndex]) -
        parser.parse(row2.cells[columnIndex])
      );
    });
    onSort(rows);
  });

  down?.addEventListener("click", function () {
    removeClassNames();
    table.classList.add(className, "down");
    rows.sort((row1, row2) => {
      return (
        parser.parse(row2.cells[columnIndex]) -
        parser.parse(row1.cells[columnIndex])
      );
    });
    onSort(rows);
  });

  return body;
};
