let database = null

const tabelbody = document.getElementById('bodyTabel')
const closebutton = document.getElementById('closebutton')
const editform = document.getElementById('form')
const overlay = document.getElementById('overlay')

closebutton.addEventListener('click', close)

fetch('data.json')
.then(response => response.json())
.then(data => {
  localStorage.setItem('data', JSON.stringify(data))
})
.catch(error => console.error('Error loading JSON:', error));

let mydata = JSON.parse(localStorage.getItem('data'))

function loaddata(){
  tabelbody.innerHTML = ''
  let a = 1
  mydata.dataanggota.forEach(user => {
    tabelbody.innerHTML += 
    `<tr>
          <td>${a}</td>
          <td>${user.Id}</td>
          <td>${user.Nama}</td>
          <td>${user.Tanggal}</td>
          <td>${user.Status.replace('_', ' ')}</td>
          <td>
            <button onclick="edit(${user.Id})">Edit</button>
            <button onclick="hapus(${user.Id})">Hapus</button>
          </td>
      </tr>`
    a++
  });
}

let editId = null; 

function edit(id) {
  editform.style.display = 'flex';
  overlay.style.display = 'block';

  editId = id;
  const userData = mydata.dataanggota.find(user => user.Id === id);

if (userData) {
  let [day, month, year] = userData.Tanggal.split("-");
  let dateObj = new Date(`${month}/${day}/${year}`);

  // Format to YYYY-MM-DD
  let formattedDate = dateObj.toISOString().split('T')[0];

  document.getElementById('id').value = id;
  document.getElementById('nama').value = userData.Nama;
  document.getElementById('tanggal').value = formattedDate;  // Correct format
  document.getElementById('Status').value = userData.Status;
}
}

function saveEdit() {
  const newNama = document.getElementById('nama').value;
  const newTanggal = document.getElementById('tanggal').value;
  const newStatus = document.getElementById('Status').value;

  let dateObj = new Date(newTanggal);

  // Convert to YYYY-MM-DD\
  let formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth()+1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
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
function hapus(id) {
  const index = mydata.dataanggota.findIndex(user => user.Id === id);
  if (index !== -1) {
    mydata.dataanggota.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(mydata));
    loaddata();
  }
}
function close(){
  editform.style.display = 'none';
  overlay.style.display = 'none';
}

loaddata()