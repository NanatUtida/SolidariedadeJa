const formCadastro = document.getElementById('form-cadastro');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const btnLimpar = document.getElementById('btn-limpar');
const listaUsuarios = document.getElementById('lista-usuarios');
const btnExcluirTodos = document.getElementById('btn-excluir-todos');
const inputBusca = document.getElementById('busca');
const btnPesquisar = document.getElementById('btn-pesquisar');

function obterUsuarios() {
  const usuariosString = localStorage.getItem('usuarios_projeto2');
  if (usuariosString) {
    return JSON.parse(usuariosString);
  } else {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  localStorage.setItem('usuarios_projeto2', JSON.stringify(usuarios));
}

function obterDataAtual() {
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

function renderizarLista(usuariosParaRenderizar) {
  listaUsuarios.innerHTML = '';
  
  const usuarios = usuariosParaRenderizar || obterUsuarios();

  usuarios.forEach(function(usuario, index) {
    const li = document.createElement('li');
    const divInfo = document.createElement('div');
    divInfo.className = 'user-info';
    const spanData = document.createElement('span');
    spanData.className = 'user-date';
    spanData.textContent = 'Enviado em: ' + usuario.dataEnvio;
    const spanNome = document.createElement('span');
    spanNome.className = 'user-name';
    spanNome.textContent = usuario.nome;
    const spanEmail = document.createElement('span');
    spanEmail.className = 'user-email';
    spanEmail.textContent = usuario.email;
    divInfo.appendChild(spanData);
    divInfo.appendChild(spanNome);
    divInfo.appendChild(spanEmail);
    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'btn-danger btn-small';
    btnExcluir.textContent = 'Excluir';
    btnExcluir.onclick = function() {
      excluirItem(usuario.id);
    };
    li.appendChild(divInfo);
    li.appendChild(btnExcluir);
    listaUsuarios.appendChild(li);
  });
}

formCadastro.addEventListener('submit', function(event) {
  event.preventDefault();
  const nomeValue = inputNome.value.trim();
  const emailValue = inputEmail.value.trim();
  if (nomeValue !== '' && emailValue !== '') {
    const usuarios = obterUsuarios();
    const novoUsuario = {
      id: Date.now(),
      nome: nomeValue,
      email: emailValue,
      dataEnvio: obterDataAtual()
    };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    inputNome.value = '';
    inputEmail.value = '';
    inputNome.focus();
    renderizarLista();
    inputBusca.value = '';
  }
});

btnLimpar.addEventListener('click', function() {
  inputNome.value = '';
  inputEmail.value = '';
  inputNome.focus();
});

function excluirItem(id) {
  const confirmacao = confirm('Deseja realmente excluir este usuário?');
  if (confirmacao) {
    const usuarios = obterUsuarios();
    const usuariosFiltrados = [];
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].id !== id) {
        usuariosFiltrados.push(usuarios[i]);
      }
    }
    salvarUsuarios(usuariosFiltrados);
    pesquisarUsuarios();
  }
}

btnExcluirTodos.addEventListener('click', function() {
  const usuarios = obterUsuarios();
  if (usuarios.length === 0) {
    alert('A lista já está vazia.');
    return;
  }
  const confirmacao = confirm('Tem certeza que deseja excluir TODOS os usuários? Esta ação não pode ser desfeita.');
  if (confirmacao) {
    salvarUsuarios([]);
    renderizarLista();
  }
});

function pesquisarUsuarios() {
  const termoBusca = inputBusca.value.trim().toLowerCase();
  const usuarios = obterUsuarios();
  if (termoBusca === '') {
    renderizarLista(usuarios);
  } else {
    const usuariosFiltrados = [];
    for (let i = 0; i < usuarios.length; i++) {
      const nomeLower = usuarios[i].nome.toLowerCase();
      const emailLower = usuarios[i].email.toLowerCase();
      if (nomeLower.includes(termoBusca) || emailLower.includes(termoBusca)) {
        usuariosFiltrados.push(usuarios[i]);
      }
    }
    renderizarLista(usuariosFiltrados);
  }
}

btnPesquisar.addEventListener('click', pesquisarUsuarios);

inputBusca.addEventListener('keyup', pesquisarUsuarios);

renderizarLista();
