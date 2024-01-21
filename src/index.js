import clientsData from '../clients.json';
import Inputmask from 'inputmask';

document.addEventListener('DOMContentLoaded', function () {
    let clientsDataCopy = [...clientsData];

    const app = document.getElementById('app');

    app.appendChild(createSearchPanel());
    app.appendChild(createClientsTable());


    const searchInput = document.getElementById('searchInput');
    const filterDropdown = document.getElementById('filterDropdown');
    const tableBody = document.querySelector('#clients-table tbody');

    function updateTable() {
        tableBody.innerHTML = '';

        const searchText = searchInput.value.toLowerCase();
        const filterStatus = filterDropdown.value;

        clientsDataCopy.forEach(client => {
            if ((filterStatus === 'all' || client.status === filterStatus) &&
                (client.fullname.toLowerCase().includes(searchText) ||
                    client.phone.includes(searchText) ||
                    client.region.toLowerCase().includes(searchText))) {
                const row = document.createElement('tr');

                const formattedDate = new Date(client.created_at).toLocaleDateString('en-GB');

                row.innerHTML = `
                    <td class="client-id">${client.id}</td>
                    <td class="client-fullname">${client.fullname}</td>
                    <td>${formattedDate}</td>
                    <td>${client.phone}</td>
                    <td>${client.region}</td>
                    <td>${client.status}</td>
                    <td><button class="edit-btn" data-client-id="${client.id}">Редактировать</button></td>
                    <td><button class="delete-btn" data-client-id="${client.id}">Удалить</button></td>
                `;

                tableBody.appendChild(row);
            }
        });

        const clientFullnameElements = document.querySelectorAll('.client-fullname');
        clientFullnameElements.forEach(element => {
            element.addEventListener('click', () => {
                const clientId = element.closest('tr').querySelector('.client-id').textContent;
                openClientPage(clientId);
            });
        });
    }

    function openClientPage(clientId) {
        window.open(`client.html?id=${clientId}`, '_blank');
    }

    searchInput.addEventListener('input', updateTable);
    filterDropdown.addEventListener('change', updateTable);

    updateTable();

    const addClientButton = document.getElementById('addClientButton');
    const addClientForm = document.getElementById('addClientForm');

    addClientButton.addEventListener('click', function () {
        if (addClientForm.style.display === 'none' || addClientForm.style.display === '') {
            addClientForm.style.display = 'block';
        } else {
            addClientForm.style.display = 'none';
        }
    });

    addClientForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const newClient = {
            id: getNextClientId(),
            fullname: document.getElementById('fullname').value,
            created_at: new Date().toISOString(),
            phone: document.getElementById('phone').value,
            region: document.getElementById('region').value,
            status: document.getElementById('status').value,
        };

        addClient(newClient);
        addClientForm.reset();
        addClientForm.style.display = 'none';
        return false;
    });

    const fullnameInput = document.getElementById('fullname');
    const fullnameMask = new Inputmask({ regex: "[А-Яа-яЁё ]*", placeholder: '' });
    fullnameMask.mask(fullnameInput);

    const regionInput = document.getElementById('region');
    const regionMask = new Inputmask({ regex: "[А-Яа-яЁё ]*", placeholder: '' });
    regionMask.mask(regionInput);

    const phoneInput = document.getElementById('phone');
    const phoneMask = new Inputmask({ regex: "[0-9]*", placeholder: '' });
    phoneMask.mask(phoneInput);

    const statusDropdown = document.getElementById('status');
    statusDropdown.addEventListener('mousedown', function () {
        this.size = 2;
    });
    statusDropdown.addEventListener('change', function () {
        this.blur();
    });
    statusDropdown.addEventListener('blur', function () {
        this.size = 1;
    });
    document.addEventListener('mousedown', function (event) {
        if (!statusDropdown.contains(event.target)) {
            statusDropdown.size = 1;
        }
    });

    const editFullname = document.getElementById('editFullname');
    const editFullnameMask = new Inputmask({ regex: "[А-Яа-яЁё ]*", placeholder: '' });
    editFullnameMask.mask(editFullname);

    const editRegionInput = document.getElementById('editRegion');
    const editRegionMask = new Inputmask({ regex: "[А-Яа-яЁё ]*", placeholder: '' });
    editRegionMask.mask(editRegionInput);

    const editPhoneInput = document.getElementById('editPhone');
    const editPhoneMask = new Inputmask({ regex: "[0-9]*", placeholder: '' });
    editPhoneMask.mask(editPhoneInput);

    function addClient(client) {
        clientsDataCopy.push(client);
        updateTableWithData(clientsDataCopy);
    }

    function getNextClientId() {
        const lastClient = clientsDataCopy[clientsDataCopy.length - 1];
        return lastClient ? lastClient.id + 1 : 1;
    }

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(2);
    
        return `${day}/${month}/${year}`;
    }

    function updateTableWithData(data) {
        tableBody.innerHTML = '';

        data.forEach(client => {
            const formattedDate = formatDate(client.created_at);
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${client.id}</td>
            <td class="client-fullname">${client.fullname}</td>
            <td>${formattedDate}</td>
            <td>${client.phone}</td>
            <td>${client.region}</td>
            <td>${client.status}</td>
            <td><button class="edit-btn" data-client-id="${client.id}">Редактировать</button></td>
            <td><button class="delete-btn" data-client-id="${client.id}">Удалить</button></td>
            `;

            tableBody.appendChild(row);    
            row.querySelector('.client-fullname').addEventListener('click', () => {
                openClientPage(client.id);
            });

            const editButton = row.querySelector('.edit-btn');
            const deleteButton = row.querySelector('.delete-btn');

            if (editButton) {
                editButton.addEventListener('click', () => {
                    const clientId = editButton.dataset.clientId;
                    const clientToEdit = clientsDataCopy.find(client => client.id === parseInt(clientId));
                    fillEditForm(clientToEdit);
                    showEditForm();
                });
            }

            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                    const clientId = deleteButton.dataset.clientId;
                    showDeleteConfirmation(clientId);
                });
            }
        });
    }        

    const deleteClientForm = document.getElementById('deleteClientForm');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    tableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const clientIdElement = event.target.closest('tr').querySelector('.client-id');
            const clientId = clientIdElement ? clientIdElement.textContent : null;        
            if (clientId !== null) {
                showDeleteConfirmation(clientId);
            }
        } else if (event.target.classList.contains('edit-btn')) {
            const clientIdElement = event.target.closest('tr').querySelector('.client-id');
            const clientId = clientIdElement ? clientIdElement.textContent : null;
            if (clientId !== null) {
                const clientId = event.target.dataset.clientId;
                const clientToEdit = clientsDataCopy.find(client => client.id === parseInt(clientId));
                fillEditForm(clientToEdit);
                showEditForm();
            }
        }
    });

    confirmDeleteButton.addEventListener('click', function () {
        const clientId = deleteClientForm.dataset.clientId;
        deleteClient(clientId);
        hideDeleteConfirmationPopup();
    });    

    cancelDeleteButton.addEventListener('click', function () {
        hideDeleteConfirmationPopup();
    });    

    function deleteClient(clientId) {
        let updatedClientsData = [...clientsDataCopy].filter(client => client.id !== Number(clientId));
        updateTableWithData(updatedClientsData);
        clientsDataCopy = updatedClientsData;
    }    

    function showDeleteConfirmation(clientId) {
        const deleteClientPopup = document.getElementById('deleteClientPopup');
        const deleteConfirmationText = document.getElementById('deleteConfirmationText');
    
        deleteConfirmationText.textContent = `Вы действительно хотите удалить клиента с ID ${clientId}?`;
        deleteClientForm.dataset.clientId = clientId;
        deleteClientPopup.style.display = 'flex';
    }    

    function hideDeleteConfirmationPopup() {
        const deleteClientPopup = document.getElementById('deleteClientPopup');
        deleteClientPopup.style.display = 'none';
        deleteClientForm.dataset.clientId = null;
    }

    const editForm = document.getElementById('editForm');
    function fillEditForm(client) {
        editForm.originalClientData = { ...client };        
        document.getElementById('editFullname').value = client.fullname;
        document.getElementById('editPhone').value = client.phone;
        document.getElementById('editRegion').value = client.region;        
        const editStatusDropdown = document.getElementById('editStatus');
        if (editStatusDropdown && client.status) {
            for (var i = 0; i < editStatusDropdown.options.length; i++) {
                if (editStatusDropdown.options[i].value === client.status) {
                    editStatusDropdown.selectedIndex = i;
                    break
                }
            }
        }
        editForm.style.display = 'block';
        editForm.dataset.clientId = client.id;
    }

    function showEditForm() {
        const editStatusDropdown = document.getElementById('editStatus');
        editStatusDropdown.addEventListener('mousedown', function () {
            this.size = 2;
        });
        editStatusDropdown.addEventListener('change', function () {
            this.blur();
        });
        editStatusDropdown.addEventListener('blur', function () {
            this.size = 1;
        });
        document.addEventListener('mousedown', function (event) {
            if (!editStatusDropdown.contains(event.target)) {
                editStatusDropdown.size = 1;
            }
        });
        saveChangesBtn.addEventListener('click', function (event) {
            event.preventDefault();        
            try {
                const editedFullname = document.getElementById('editFullname').value;
                const editedPhone = document.getElementById('editPhone').value;
                const editedRegion = document.getElementById('editRegion').value;
                const editedStatus = document.getElementById('editStatus').value;
        
                const editedClientId = editForm.dataset.clientId;
        
                if (editedClientId !== undefined && editedClientId !== null) {
                    const editedClient = clientsDataCopy.find(client => client.id === parseInt(editedClientId));
        
                    if (editedClient) {        
                        editedClient.fullname = editedFullname;
                        editedClient.phone = editedPhone;
                        editedClient.region = editedRegion;
                        editedClient.status = editedStatus;
        
                        editForm.style.display = 'none';
                        updateTableWithData(clientsDataCopy);
                    } else {
                        console.error("Client not found for editing. ID:", editedClientId);
                    }
                } else {
                    console.error("Invalid or undefined client ID:", editedClientId);
                }
            } catch (error) {
                console.error("Error during saving changes:", error);
            }
        });
        const cancelChangesBtn = document.getElementById('cancelChangesBtn');
        cancelChangesBtn.addEventListener('click', function () {
            event.preventDefault();
            const clientId = editForm.dataset.clientId;
            const originalClient = clientsDataCopy.find(client => client.id === parseInt(clientId));

            if (originalClient && editForm.originalClientData) {
                originalClient.fullname = editForm.originalClientData.fullname;
                originalClient.phone = editForm.originalClientData.phone;
                originalClient.region = editForm.originalClientData.region;
                originalClient.status = editForm.originalClientData.status;


                editForm.style.display = 'none';
                updateTableWithData(clientsDataCopy);
            } else {
                console.error("Unable to cancel changes. Client or original data not found.");
            }
        });
    }   
});
    

