// Inisialisasi variabel
let database = null;
const tabelbody = document.getElementById('bodyTabel');
const editform = document.getElementById('form');
const overlay = document.getElementById('overlay');

// Ambil data dari JSON dan simpan ke localStorage
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('data', JSON.stringify(data));
    loaddata(); // Load data setelah selesai fetch
  })
  .catch(error => console.error('Error loading JSON:', error));

// Ambil data dari localStorage
let mydata = JSON.parse(localStorage.getItem('data'));

// Fungsi untuk memuat data ke tabel
function loaddata() {
  mydata = JSON.parse(localStorage.getItem('data'));

  // Pastikan semua ID bertipe number
  mydata.dataanggota = mydata.dataanggota.map(user => ({
    ...user,
    Id: parseInt(user.Id)
  }));

  tabelbody.innerHTML = '';
  let no = 1;
  mydata.dataanggota.forEach(user => {
    tabelbody.innerHTML += `
      <tr>
        <td>${no++}</td>
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
  });
}

// Variabel untuk menyimpan ID yang sedang diedit
let editId = null;

// Fungsi untuk menutup form
function close() {
  editform.style.display = 'none';
  overlay.style.display = 'none';
}

// Fungsi untuk membuka form edit
function edit(id) {
  mydata = JSON.parse(localStorage.getItem('data'));
  editform.style.display = 'flex';
  overlay.style.display = 'block';

  editId = parseInt(id); // Pastikan ID berupa number

  const userData = mydata.dataanggota.find(user => parseInt(user.Id) === editId);

  // Bangun ulang form edit
  editform.innerHTML = `
    <div class="header">
        <label>Edit Form</label>
        <img src="asset/close.png" width="12px" alt="" id="closebutton">
    </div>
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

  // Event close
  document.getElementById('closebutton').addEventListener('click', close);

  if (userData) {
    let [day, month, year] = userData.Tanggal.split("-");
    let dateObj = new Date(`${year}-${month}-${day}`);
    let formattedDate = dateObj.toISOString().split('T')[0];

    document.getElementById('id').value = userData.Id;
    document.getElementById('nama').value = userData.Nama;
    document.getElementById('tanggal').value = formattedDate;
    document.getElementById('Status').value = userData.Status;
  }
}

// Fungsi untuk menyimpan hasil edit
function saveEdit() {
  mydata = JSON.parse(localStorage.getItem('data'));
  const newNama = document.getElementById('nama').value;
  const newTanggal = document.getElementById('tanggal').value;
  const newStatus = document.getElementById('Status').value;

  let dateObj = new Date(newTanggal);
  let formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;

  const index = mydata.dataanggota.findIndex(user => parseInt(user.Id) === parseInt(editId));
  if (index !== -1) {
    mydata.dataanggota[index].Nama = newNama;
    mydata.dataanggota[index].Tanggal = formattedDate;
    mydata.dataanggota[index].Status = newStatus;

    localStorage.setItem('data', JSON.stringify(mydata));
    close();
    loaddata();
  } else {
    console.warn('ID tidak ditemukan:', editId);
  }
}

// Fungsi untuk menghapus data
function hapus(id) {
  mydata = JSON.parse(localStorage.getItem('data'));
  const index = mydata.dataanggota.findIndex(user => parseInt(user.Id) === parseInt(id));
  if (index !== -1) {
    mydata.dataanggota.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(mydata));
    loaddata();
  } else {
    console.warn('ID tidak ditemukan saat hapus:', id);
  }
}

// Fungsi untuk membuka form tambah data
function openform() {
  mydata = JSON.parse(localStorage.getItem('data'));
  editform.style.display = 'flex';
  overlay.style.display = 'block';

  // Bangun ulang form
  editform.innerHTML = `
    <div class="header">
        <label>Add Form</label>
        <img src="asset/close.png" width="12px" alt="" id="closebutton">
    </div>
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

  document.getElementById('closebutton').addEventListener('click', close);

  // Atur ID baru dan tanggal hari ini
  const newId = Math.max(...mydata.dataanggota.map(user => parseInt(user.Id))) + 1;
  document.getElementById('id').value = newId;

  let dateObj = new Date();
  let formattedDate = dateObj.toISOString().split('T')[0];
  document.getElementById('tanggal').value = formattedDate;
}

// Fungsi untuk menambahkan data baru
function add() {
  mydata = JSON.parse(localStorage.getItem('data'));
  const newId = parseInt(document.getElementById('id').value);
  const newNama = document.getElementById('nama').value;
  const newTanggal = document.getElementById('tanggal').value;
  const newStatus = document.getElementById('Status').value;

  if (newNama && newTanggal && newStatus) {
    let dateObj = new Date(newTanggal);
    let formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;

    mydata.dataanggota.push({
      Id: newId,
      Nama: newNama,
      Tanggal: formattedDate,
      Status: newStatus
    });

    localStorage.setItem('data', JSON.stringify(mydata));
    close();
    loaddata();
  } else {
    alert('Semua field harus diisi!');
  }
}