const msg = document.querySelector('#msg');
let allProducts = [];
let product = {};
let id = 0;
let idSel = 0;
let newProduct = true;

function validateData(name, description, price) {
  if (name === ''){
    throw new Error(`Falha no cadastro do produto: Nome inválido!`);
  }
  if (description === ''){
    throw new Error(`Falha no cadastro do produto: Descrição inválida!`);
  }
  if (isNaN(price) || price <= 0){
    throw new Error(`Falha no cadastro do produto: Valor (${price}) inválido!`);
  }

  let i = 0;
  while (i < allProducts.length) {
    if (allProducts[i].name.toLowerCase() === name.toLowerCase() && (newProduct|| allProducts[i].id != idSel)) {
      throw new Error(`Outro produto está cadastrado com este nome!`);
      //break;
    };
    i += 1;
  }
}

function SaveProduct() {
  let name = document.querySelector("#name").value.trim();
  let description = document.querySelector("#description").value.trim();
  let price = parseFloat(document.querySelector('#price').value.replace(",", "."));

  try {
    validateData(name, description, price);
  } catch (err) {
    msg.textContent = err;
    return false;
  }

  try {
    if (newProduct) {
      document.querySelector('#details-ctn').style.display = 'none';
      id++;
      product = {
        id: id,
        name: name,
        description: description,
        price: price,
        createdAt: Date.now(),
      };
      allProducts.push(product);
      msg.textContent = `Produto ${product.name} incluído com sucesso`;
    } else {
      let i = 0;
      while (i < allProducts.length) {
        if (allProducts[i].id === idSel) {
          allProducts[i].name = name;
          allProducts[i].description = description;
          allProducts[i].price = price;
          msg.textContent = `Produto ${allProducts[i].name} editado com sucesso`;
          if (document.querySelector('#details-ctn').style.display === 'flex') {
            ShowProduct(i);
          }
          break;
        };
        i += 1;
      }
      ListProducts();
    }
    //localStorage.setItem('allProducts', allProducts);
  } catch (error) {
    msg.textContent = error;
    return false;
  }
}

function ListProducts() {
  //let productsList  = localStorage.getItem('allProducts');
  if (allProducts.length === 0) {
    document.querySelector('#products-ctn').style.display = 'none';
    msg.innerHTML = `Não há produtos cadastrados`;
  } else {
    const table = document.querySelector('#products-table');
    table.innerHTML = `<tr> 
                        <th>Produto</th> 
                        <th>Valor</th>
                        <th>Editar</th>
                        <th>Apagar</th>
                      </tr>`
    let i = 0;
    while (i < allProducts.length) {
      table.innerHTML += `<tr> 
                            <td class="show-product" onclick="ShowProduct(${i})">${allProducts[i].name}</td> 
                            <td class="show-product" onclick="ShowProduct(${i})">${allProducts[i].price.toFixed(2)}</td>
                            <td class="edit-icon" onclick="EditProduct(${i})"><i class="material-icons">edit</i></td>
                            <td class="del-icon" onclick="DeleteProduct(${i})"><i class="material-icons">delete</i></td>
                          </tr>`
      i += 1;
    }
    document.querySelector('#products-ctn').style.display = 'flex';
  }
}

function EditProduct(Id) {
  msg.innerHTML = `&nbsp`;
  newProduct = false;
  idSel = allProducts[Id].id;
  document.querySelector("#save").textContent = 'Salvar produto';
  document.querySelector('#name').value = allProducts[Id].name;
  document.querySelector('#description').value = allProducts[Id].description;
  document.querySelector('#price').value = allProducts[Id].price;

  if (document.querySelector('#details-ctn').style.display === 'flex') {
    ShowProduct(Id);
  }
}

function DeleteProduct(Id) {
  let allProductsTmp = [];
  i = 0;
  while (i < allProducts.length) {
    if (i != Id) {
      allProductsTmp.push(allProducts[i]);
    }
    i += 1;
  }
  allProducts = allProductsTmp;
  Cancel();
  ListProducts();
}

function ShowProduct(Id) {
  const productDetails = document.querySelector('#details-table');
  const date = new Date(allProducts[Id].createdAt);

  productDetails.innerHTML = `<tr> 
                        <th colspan="2">Informações do Produto</th> 
                      </tr>
                      <tr> 
                        <th>Id</th>
                        <td>${allProducts[Id].id}</td> 
                      </tr>
                      <tr>  
                        <th>Nome</th>
                        <td>${allProducts[Id].name}</td> 
                      </tr>
                      <tr>  
                         <th>Descrição</th>
                         <td>${allProducts[Id].description}</td>  
                      </tr>
                      <tr>  
                         <th>Valor</th>
                         <td>${allProducts[Id].price.toFixed(2)}</td>
                      </tr>
                      <tr>  
                        <th>Incluído Em</th>
                        <td>${date.toLocaleDateString()} - ${date.toLocaleTimeString()}</td>
                      </tr>`

  document.querySelector('#details-ctn').style.display = 'flex';
}

function Cancel() {
  newProduct = true;
  msg.innerHTML = `&nbsp`;
  document.querySelector("#name").value = '';
  document.querySelector("#description").value = '';
  document.querySelector('#price').value = '';
  document.querySelector("#save").textContent = 'Incluir produto';
  document.querySelector('#products-ctn').style.display = 'none';
  document.querySelector('#details-ctn').style.display = 'none';

}

document.getElementById('save').addEventListener('click', SaveProduct);
document.getElementById('list').addEventListener('click', ListProducts);
document.getElementById('cancel').addEventListener('click', Cancel);