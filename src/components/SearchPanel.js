function createSearchPanel() {
    const searchPanel = document.createElement('div');
    searchPanel.innerHTML = `
        <label for="searchInput">Поиск:</label>
        <input type="text" id="searchInput" placeholder="Введите текст">
        <label for="filterDropdown">Фильтр по статусу:</label>
        <select id="filterDropdown">
            <option value="all">Все статусы</option>
            <option value="Активен">Активен</option>
            <option value="Неактивен">Неактивен</option>
            <option value="Неактивен">Приостановлен</option>
        </select>
    `;
    return searchPanel;
}