import {
  CellValueParser,
  CurrencyCellValueParser,
  DateCellValueParser,
  MultiplierCellValueParser,
} from "./cellValueParser";

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
    orderArrowsTemplate,
    rows,
    dateIndex,
    dateCellValueParser,
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
    orderArrowsTemplate,
    rows,
    allocationColumnIndex,
    currencyCellValueParser,
    onSort
  );
  const priceArrows = getOrderArrowsElement(
    orderArrowsTemplate,
    rows,
    priceColumnIndex,
    currencyCellValueParser,
    onSort
  );
  const multiplierArrows = getOrderArrowsElement(
    orderArrowsTemplate,
    rows,
    multiplierIndex,
    multiplierCellValueParser,
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

const getOrderArrowsElement = <T>(
  orderArrowsTemplate: Element,
  rows: HTMLTableRowElement[],
  columnIndex: number,
  parser: CellValueParser<number>,
  onSort: (rows: HTMLTableRowElement[]) => void
) => {
  const orderArrows = getOrderArrows(orderArrowsTemplate);
  const down = orderArrows.querySelector(".order-arrow-down");
  const up = orderArrows.querySelector(".order-arrow-up");

  up?.addEventListener("click", function () {
    rows.sort((row1, row2) => {
      return (
        parser.parse(row1.cells[columnIndex]) -
        parser.parse(row2.cells[columnIndex])
      );
    });
    onSort(rows);
  });

  down?.addEventListener("click", function () {
    rows.sort((row1, row2) => {
      return (
        parser.parse(row2.cells[columnIndex]) -
        parser.parse(row1.cells[columnIndex])
      );
    });
    onSort(rows);
  });

  return orderArrows.body.querySelector(".order-arrows-content") as Element;
};
