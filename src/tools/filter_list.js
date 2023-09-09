export default function (data){
  const { sorted, elem: sortableTableElem } = this.components.sortableTable;
  const { body } = this.components.sortableTable.subElements;
  const { id, order } = sorted;

  sortableTableElem.classList.add("sortable-table_loading");

  const { subElements } = this.components.sortPanel;
  const { filterName, filterStatus } = subElements;
  const { value: filterNameValue } = filterName;
  const { value: filterStatusValue } = filterStatus;

  const filteredData = filterData(data, filterNameValue, filterStatusValue) 
  body.innerHTML = this.components.sortableTable.getTableRows(filteredData);

  sortableTableElem.classList.remove("sortable-table_loading");

  function filterData(data, filterNameValue, filterStatusValue) {
    const arr = [...data];
    const filteredData = arr.filter(element => {
      const nameIdx = element.name.toLocaleLowerCase().indexOf(filterNameValue.toLocaleLowerCase());
      let telIdx = -1;
      if (element.tel) {telIdx = element.tel.indexOf(filterNameValue)}
      return (nameIdx >= 0 || telIdx >= 0) &&
      (
      (element.status === filterStatusValue || filterStatusValue === '') ||
      (element.type === filterStatusValue || filterStatusValue === '')
      )
    })
    return filteredData
  }
}