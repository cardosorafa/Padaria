const apiUrl = "http://localhost:4000/api/produtos";


function carregarProdutos() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const produtoTable = document
        .getElementById("produtosTable")
        .getElementsByTagName("tbody")[0];
      produtoTable.innerHTML = ""; //limpa a tabela
      data.forEach((produto) => {
        const linha = produtoTable.insertRow();
        linha.innerHTML = `
            <td> 
            <button class="delete" onclick="excluirProduto('${produto.COD}')">🗑️ Excluir</button>

            <button onclick="editarLivro('${produto.COD}')">📝 Editar </button>
            </td>
            <td>${produto.COD}</td>
            <td>${produto.descricao}</td>
            <td>${produto.preco}</td>
            <td>${produto.unidade}</td>
            <td>${produto.datavalidade}</td>
            <td>${produto.estoque}</td>
            <td>${produto.fornecedor}</td>
            <td>${produto.categoria}</td>
            <td>${produto.ingredientes}</td>            
            `
      }) /* fecha o forEach */
    }) /* fecha o then */
    .catch((error) => console.error(error.message));
} /* fecha a function */

//Carregar os livros ao carregar a página
window.onload = carregarProdutos()

function excluirProduto(COD) {
  // Primeiro mostra o diálogo de confirmação
  Swal.fire({
    title: 'Tem certeza?',
    text: "Você não poderá reverter esta ação!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Se o usuário confirmou, faz a exclusão
      fetch(`${apiUrl}/${COD}`, { method: 'DELETE' })
        .then(() => {
          Swal.fire(
            'Excluído!',
            'O Produto foi excluído com sucesso.',
            'success'
          )
          carregarProdutos() // Atualiza a tabela
        })
        .catch((error) => {
          console.error("Error:", error)
							  
								
          Swal.fire("Erro!", "Não foi possível excluir o Produto.", "error")
							   
					 
        })
    }
  })
}

// Modificar o event listener do formulário para suportar tanto criação quanto edição
document
  .getElementById("produtoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault()

    const isEditMode = this.dataset.mode === "edit"

    const produto = {
      COD: document.getElementById("COD").value,
      descricao: document.getElementById("descricao").value,
      preco: document.getElementById("preco").value,
      unidade: document.getElementById("unidade").value,
      datavalidade: document.getElementById("datavalidade").value,
      estoque: document.getElementById("estoque").value,
      fornecedor: document.getElementById("fornecedor").value,
      categoria: document
        .getElementById("categoria")
        .value.split(",")
        .filter((g) => g.trim() !== ""),
      ingredientes: document
        .getElementById("ingredientes")
        .value.split(",")
        .filter((a) => a.trim() !== ""),
    }

    const method = isEditMode ? "PUT" : "POST"
    const url = isEditMode ? `${apiUrl}/${this.dataset.CODOriginal}` : apiUrl

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            throw {
              status: response.status,
              errors: errData.errors,
            }
          })
        }
        return response.json()
      })
      .then((data) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: isEditMode
            ? 'Produto atualizado com sucesso!'
            : 'Produto inserido com sucesso!',
          showConfirmButton: false,
          timer: 1500,
        });
        carregarProdutos()

        // Resetar o formulário e voltar ao modo de criação
        this.reset();
        this.dataset.mode = 'create';
        delete this.dataset.CODOriginal;

        // Reabilita o campo ISBN e restaura o texto do botão
        document.getElementById('COD').disabled = false;
        this.querySelector('button[type="submit"]').textContent =
          '💾 Salvar Produto';
      })
      .catch(error => {
        if (error.status === 400 && error.errors) {
          const primeiroErro = error.errors[0];
          Swal.fire({
            icon: 'error',
            title: 'Erro de validação',
            text: primeiroErro.msg,
          })
        } else {
          console.error('Erro ao salvar:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao salvar o Produto',
          })
        }
      })
  })
function editarLivro(COD) {
  // Busca os dados do livro específico
  fetch(`${apiUrl}/id/${COD}`)
    .then(response => response.json())
    .then(data => {
      // Pega o primeiro produto do array
      const produto = data[0] // Esta é a mudança principal!
			
						 
														
			 

      if (!produto) {
        throw new Error('Produto não encontrado');
																		
																			
																		  
																				
																												  
																		  
																												  
			
														  
								  
																													
									 
												 
				 
      }

      // Preenche o formulário com os dados atuais do livro
      document.getElementById("COD").value = produto.COD || '';
      document.getElementById("descricao").value = produto.descricao || "";
      document.getElementById("preco").value = produto.preco || "";
      document.getElementById("unidade").value = produto.unidade || "";
      document.getElementById("datavalidade").value =
        produto.datavalidade || "";
      document.getElementById("estoque").value = produto.estoque || "";
      document.getElementById("fornecedor").value = produto.fornecedor || "";

      document.getElementById("categoria").value = Array.isArray(
        produto.categoria
      )
        ? produto.categoria.join(",")
        : "";

      document.getElementById("ingredientes").value = Array.isArray(
        produto.ingredientes
      )
        ? produto.ingredientes.join(",")
        : "";

      // Modifica o formulário para modo de edição
      const form = document.getElementById("produtoForm");
      form.dataset.mode = "edit";
      form.dataset.CODOriginal = COD;

      // Altera o texto do botão de submit
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = "📝 Atualizar Produto";
      }

      // Desabilita o campo ISBN durante edição
      document.getElementById("COD").disabled = true;
      // Posiciona no primeiro campo editável
      document.getElementById("descricao").focus();
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do Produto:", error);
      alert(
        "❌ Erro ao carregar dados do Produto. Por favor, tente novamente."
      );
    });
}
