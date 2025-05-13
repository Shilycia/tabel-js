// Initialize variables
let database = null;
const tabelbody = document.getElementById('bodyTabel');
const editform = document.getElementById('form');
const overlay = document.getElementById('overlay');

// Add event listener to close button
overlay.addEventListener('click', close);

// Fetch data from JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('data', JSON.stringify(data));
  })
  .catch(error => console.error('Error loading JSON:', error));

// Get data from local storage

// Function to load data into table
function loaddata() {
  
  let mydata = JSON.parse(localStorage.getItem('data'));
  tabelbody.innerHTML = '';
  let a = 1;
  mydata.dataanggota.forEach(user => {
    tabelbody.innerHTML += `
      <tr>
        <td>${a}</td>
        <td>${user.Id}</td>
        <td>${user.Nama}</td>
        <td>${user.Tanggal}</td>
        <td>${user.Status.replace('_', ' ')}</td>
        <td>
          <button onclick="edit(${user.Id})" class="edit">Edit</button>
          <button onclick="hapus(${user.Id})" class="hapus">Hapus</button>
        </td>
      </tr>
    `;
    a++;
  });
}

// Variable to store edit ID
let editId = null;

// Function to edit data
function edit(id) {
  
  let mydata = JSON.parse(localStorage.getItem('data'));
  editform.style.display = 'flex';
  overlay.style.display = 'block';

  // Clear previous form data
  editform.innerHTML = `
    <div class="header">
        <label>Edit Form</label>
        <img src="asset/close.png" width="12px" alt="" id="closebutton">
    </div>
  `;

  // Add form fields
  editform.innerHTML += `
    <div class="input">
      <input type="text" id="id" placeholder="Id" readonly>
      <input type="text" id="nama" placeholder="Nama">
      <input type="date" id="tanggal" placeholder="Tanggal">
      <select id="Status">
        <option value="Pekerja_Tetap">Pekerja Tetap</option>
        <option value="Pekerja_Kontrak">Pekerja Kontrak</option>
      </select>
    </div>
    <button onclick="saveEdit()">Save</button>
  `;

  
  const closebutton = document.getElementById('closebutton');
  closebutton.addEventListener('click', close);

  editId = id;
  const userData = mydata.dataanggota.find(user => user.Id === id);

  if (userData) {
    let [day, month, year] = userData.Tanggal.split("-");
    let dateObj = new Date(`${month}/${day}/${year}`);

    // Format to YYYY-MM-DD
    let formattedDate = dateObj.toISOString().split('T')[0];

    document.getElementById('id').value = id;
    document.getElementById('nama').value = userData.Nama;
    document.getElementById('tanggal').value = formattedDate; // Correct format
    document.getElementById('Status').value = userData.Status;
  }
}

// Function to add new data
function add() {
  
  let mydata = JSON.parse(localStorage.getItem('data'));
  const newId = document.getElementById('id').value;
  const newNama = document.getElementById('nama').value;
  const newTanggal = document.getElementById('tanggal').value; // Correct format
  const newStatus = document.getElementById('Status').value;

  if (newNama && newTanggal && newStatus) {
    mydata.dataanggota.push({
      Id: newId,
      Nama: newNama,
      Tanggal: newTanggal,
      Status: newStatus
    });

    localStorage.setItem('data', JSON.stringify(mydata));
    close()
    loaddata();
  }
}

// Function to open form for adding new data
function openform() {
  editform.style.display = 'flex';
  overlay.style.display = 'block';

  // Clear previous form data
  editform.innerHTML = `
    <div class="header">
        <label>Add Form</label>
        <img src="asset/close.png" width="12px" alt="" id="closebutton">
    </div>
  `;

  // Add form fields
  editform.innerHTML += `
    <div class="input">
      <input type="text" id="id" placeholder="Id" readonly>
      <input type="text" id="nama" placeholder="Nama">
      <input type="date" id="tanggal" placeholder="Tanggal">
      <select id="Status">
        <option value="Pekerja_Tetap">Pekerja Tetap</option>
        <option value="Pekerja_Kontrak">Pekerja Kontrak</option>
      </select>
    </div>
    <button onclick="add()">Save</button>
  `;
  
  const closebutton = document.getElementById('closebutton');
  closebutton.addEventListener('click', close);

  const newId = Math.max(...mydata.dataanggota.map(user => user.Id)) + 1;
  document.getElementById('id').value = newId;

  let dateObj = new Date();

    // Format to YYYY-MM-DD
  let formattedDate = dateObj.toISOString().split('T')[0];
  document.getElementById('tanggal').value = formattedDate;
}

// Function to save edited data
function saveEdit() {
  
  let mydata = JSON.parse(localStorage.getItem('data'));
  const newNama = document.getElementById('nama').value;
  const newTanggal = document.getElementById('tanggal').value;
  const newStatus = document.getElementById('Status').value;

  let dateObj = new Date(newTanggal);

  // Convert to YYYY-MM-DD
  let formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
  const index = mydata.dataanggota.findIndex(user => user.Id === editId);
  if (index !== -1) {
    mydata.dataanggota[index].Nama = newNama;
    mydata.dataanggota[index].Tanggal = formattedDate;
    mydata.dataanggota[index].Status = newStatus;

    localStorage.setItem('data', JSON.stringify(mydata));
    close();
    loaddata();
  }
}

// Function to delete data
function hapus(id) {
  
  let mydata = JSON.parse(localStorage.getItem('data'));
  const index = mydata.dataanggota.findIndex(user => user.Id === id);
  if (index !== -1) {
    mydata.dataanggota.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(mydata));
    loaddata();
  }
}

// Function to close form
function close() {
  editform.style.display = 'none';
  overlay.style.display = 'none';
}

// Load data into table
loaddata();