function createClientsTable() {
    const clientsTable = document.createElement('table');
    clientsTable.id = 'clients-table';
    clientsTable.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Дата создания</th>
                <th>Телефон</th>
                <th>Регион</th>
                <th>Статус</th>
                <th>Удалить</th>
            </tr>
        </thead>
        <tbody>
            <!-- Таблица будет заполнена динамически -->
        </tbody>
    `;
    return clientsTable;
}