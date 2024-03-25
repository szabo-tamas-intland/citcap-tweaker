export abstract class CellValueParser<T> {
  abstract parse(cell: HTMLTableCellElement): T;
}

export class CurrencyCellValueParser extends CellValueParser<number> {
  parse(cell: HTMLTableCellElement): number {
    return parseInt(cell.innerText.replace(/[$,]/g, ""));
  }
}

export class MultiplierCellValueParser extends CellValueParser<number> {
  parse(cell: HTMLTableCellElement): number {
    return parseFloat(cell.innerText);
  }
}

export class DateCellValueParser extends CellValueParser<number> {
  parse(cell: HTMLTableCellElement): number {
    console.log(cell.innerText, new Date(cell.innerText).getTime());
    return new Date(cell.innerText).getTime();
  }
}
