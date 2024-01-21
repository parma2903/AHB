document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');

    if (clientId) {
        fetch('clients.json')
            .then(response => response.json())
            .then(clientsData => {
                const client = clientsData.find(client => client.id === parseInt(clientId, 10));

                if (client) {                    
                    document.getElementById('clientName').textContent = `Имя Фамилия: ${client.fullname}`;
                    const formattedDate = new Date(client.created_at).toLocaleDateString('en-GB');
                    document.getElementById('clientCreatedAt').textContent = `Дата создания: ${formattedDate}`;
                    document.getElementById('clientPhone').textContent = `Телефон: ${client.phone}`;
                    document.getElementById('clientRegion').textContent = `Регион: ${client.region}`;
                    document.getElementById('clientStatus').textContent = `Статус: ${client.status}`;
                } else {
                    console.error('Клиент с указанным идентификатором не найден.');
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных о клиентах:', error);
            });
    } else {
        console.error('Идентификатор клиента не найден в URL.');
    }
});