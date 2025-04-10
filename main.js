const apiUrl = 'https://mockapi.io/clone/67f7941d2466325443e9cecd';

async function loadContacts() {
  const res = await fetch(apiUrl);
  const data = await res.json();
  const container = document.getElementById('contacts');
  container.innerHTML = '';

  data.forEach(contact => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow flex justify-between items-center';

    const info = document.createElement('div');
    info.textContent = `${contact.name} — ${contact.phone}`;

    const buttons = document.createElement('div');
    buttons.className = 'flex gap-2';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i data-lucide="trash" class="w-5 h-5"></i>';
    deleteBtn.className = 'p-2 bg-red-500 text-white rounded hover:bg-red-600';
    deleteBtn.onclick = async () => {
      await fetch(`${apiUrl}/${contact.id}`, { method: 'DELETE' });
      loadContacts();
    };

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i data-lucide="pencil" class="w-5 h-5"></i>';
    editBtn.className = 'p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600';
    editBtn.onclick = async () => {
      const newName = prompt('Новое имя:', contact.name);
      const newPhone = prompt('Новый телефон:', contact.phone);
      if (newName && newPhone) {
        await fetch(`${apiUrl}/${contact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName, phone: newPhone })
        });
        loadContacts();
      }
    };

    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);

    div.appendChild(info);
    div.appendChild(buttons);

    container.appendChild(div);
  });

  lucide.createIcons(); 
}

document.getElementById('addField').addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'flex gap-2';
  div.innerHTML = `
    <input type="text" name="name" placeholder="Имя" required class="w-1/2 p-2 border rounded" />
    <input type="text" name="phone" placeholder="Телефон" required class="w-1/2 p-2 border rounded" />
  `;
  document.getElementById('contactFields').appendChild(div);
});

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const names = document.querySelectorAll('input[name="name"]');
  const phones = document.querySelectorAll('input[name="phone"]');
  let valid = true;

 
  for (let i = 0; i < names.length; i++) {
    const name = names[i].value;
    const phone = phones[i].value;

  
    if (!name || !phone || !/^\d+$/.test(phone)) {
      valid = false;
      break;
    }
  }

  if (valid) {
    document.getElementById('errorMessage').classList.add('hidden');

    
    for (let i = 0; i < names.length; i++) {
      const name = names[i].value;
      const phone = phones[i].value;

      if (name && phone) {
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone })
        });
      }
    }

    document.getElementById('contactForm').reset();
    document.getElementById('contactFields').innerHTML = `
      <div class="flex gap-2">
        <input type="text" name="name" placeholder="Имя" required class="w-1/2 p-2 border rounded" />
        <input type="text" name="phone" placeholder="Телефон" required class="w-1/2 p-2 border rounded" />
      </div>
    `;

    loadContacts();
  } else {
    document.getElementById('errorMessage').classList.remove('hidden');
  }
});

loadContacts();