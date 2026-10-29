
/* ==========================================
   AFONSO FUMÊ
   JavaScript principal do site
========================================== */


/* ==========================================
   1. CATÁLOGO DE PRODUTOS
========================================== */

// Edite esta lista quando receber os produtos reais.
//
// preco: null significa que o valor será
// consultado pelo WhatsApp.
//
// Não publique produtos fictícios como
// ofertas reais.

const produtos = [
    {
        id: 1,
        nome: 'Tapetes automotivos',
        categoria: 'Interior',
        emoji: '🚘',
        preco: null
    },

    {
        id: 2,
        nome: 'Suporte para celular',
        categoria: 'Interior',
        emoji: '📱',
        preco: null
    },

    {
        id: 3,
        nome: 'Palhetas de limpador',
        categoria: 'Exterior',
        emoji: '🌧️',
        preco: null
    },

    {
        id: 4,
        nome: 'Organizador de porta-malas',
        categoria: 'Utilidades',
        emoji: '🧰',
        preco: null
    }
];


/* ==========================================
   2. CONFIGURAÇÕES GERAIS
========================================== */

// WhatsApp da loja

const WHATSAPP = '5583988407190';

// Lista de produtos adicionados ao carrinho

let carrinho = [];

// Facilita a seleção de elementos HTML

const $ = (seletor) => document.querySelector(seletor);

// Formatação de valores em reais

const moeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};


/* ==========================================
   3. EXIBIR PRODUTOS NO CATÁLOGO
========================================== */

function renderProdutos(filtro = 'Todos') {

    // Filtra os produtos pela categoria

    const produtosFiltrados = produtos.filter((produto) => {
        return filtro === 'Todos' ||
               produto.categoria === filtro;
    });

    // Cria os cartões dos produtos

    $('#produtos').innerHTML = produtosFiltrados.map((produto) => {

        const preco = produto.preco === null
            ? 'Preço a consultar'
            : moeda(produto.preco);

        return `
            <article class="produto">

                <div class="emoji" aria-hidden="true">
                    ${produto.emoji}
                </div>

                <h3>${produto.nome}</h3>

                <p>
                    ${produto.categoria} • Item demonstrativo
                </p>

                <p class="preco">
                    ${preco}
                </p>

                <button data-add="${produto.id}">
                    Adicionar ao carrinho
                </button>

            </article>
        `;

    }).join('');

}


/* ==========================================
   4. ATUALIZAR CARRINHO
========================================== */

function atualizarCarrinho() {

    // Conta a quantidade total de produtos

    const quantidadeTotal = carrinho.reduce((soma, item) => {
        return soma + item.quantidade;
    }, 0);

    $('#contagem').textContent = quantidadeTotal;


    // Exibe os produtos adicionados

    if (carrinho.length > 0) {

        $('#itens-carrinho').innerHTML = carrinho.map((item) => {

            const preco = item.preco === null
                ? 'A consultar'
                : moeda(item.preco);

            return `
                <div class="item-carrinho">

                    <div>

                        <strong>${item.nome}</strong>

                        <br>

                        <small>
                            ${item.quantidade} un. • ${preco}
                        </small>

                    </div>

                    <div>

                        <button
                            data-menos="${item.id}"
                            aria-label="Diminuir ${item.nome}"
                        >
                            −
                        </button>

                        <button
                            data-mais="${item.id}"
                            aria-label="Aumentar ${item.nome}"
                        >
                            +
                        </button>

                    </div>

                </div>
            `;

        }).join('');

    } else {

        $('#itens-carrinho').innerHTML =
            '<p>Seu carrinho está vazio.</p>';

    }


    // Verifica se algum produto está sem preço

    const semPreco = carrinho.some((item) => {
        return item.preco === null;
    });


    // Calcula o valor total

    const total = carrinho.reduce((soma, item) => {
        return soma + (item.preco ?? 0) * item.quantidade;
    }, 0);


    // Exibe o total ou a mensagem de consulta

    $('#total').textContent = semPreco
        ? 'A consultar'
        : moeda(total);


    // Desativa o botão se o carrinho estiver vazio

    $('#finalizar').disabled = carrinho.length === 0;

}


/* ==========================================
   5. ABRIR E FECHAR CARRINHO
========================================== */

function abrirCarrinho(aberto) {

    const painel = $('#painel-carrinho');
    const overlay = $('#overlay');

    painel.classList.toggle('aberto', aberto);

    painel.setAttribute(
        'aria-hidden',
        String(!aberto)
    );

    overlay.hidden = !aberto;

}


/* ==========================================
   6. EVENTOS DOS PRODUTOS
========================================== */

document.addEventListener('click', (evento) => {

    const add = evento.target.closest('[data-add]');

    const mais = evento.target.closest('[data-mais]');

    const menos = evento.target.closest('[data-menos]');


    // ADICIONAR PRODUTO AO CARRINHO

    if (add) {

        const produto = produtos.find((produto) => {
            return produto.id === Number(add.dataset.add);
        });

        if (!produto) return;

        const item = carrinho.find((item) => {
            return item.id === produto.id;
        });

        if (item) {

            item.quantidade++;

        } else {

            carrinho.push({
                ...produto,
                quantidade: 1
            });

        }

        atualizarCarrinho();
        abrirCarrinho(true);

    }


    // AUMENTAR QUANTIDADE

    if (mais) {

        const item = carrinho.find((item) => {
            return item.id === Number(mais.dataset.mais);
        });

        if (item) {
            item.quantidade++;
            atualizarCarrinho();
        }

    }


    // DIMINUIR QUANTIDADE

    if (menos) {

        const item = carrinho.find((item) => {
            return item.id === Number(menos.dataset.menos);
        });

        if (item) {

            item.quantidade--;

            // Remove produtos com quantidade zero

            carrinho = carrinho.filter((produto) => {
                return produto.quantidade > 0;
            });

            atualizarCarrinho();

        }

    }


    /* ======================================
       7. FILTROS DO CATÁLOGO
    ====================================== */

    const filtro = evento.target.closest('[data-filtro]');

    if (filtro) {

        // Remove a classe ativo dos outros filtros

        document.querySelectorAll('.filtro').forEach((botao) => {
            botao.classList.remove('ativo');
        });

        // Ativa o filtro selecionado

        filtro.classList.add('ativo');

        // Atualiza os produtos exibidos

        renderProdutos(filtro.dataset.filtro);

    }

});


/* ==========================================
   8. BOTÕES DO CARRINHO
========================================== */

// Abrir carrinho

$('#abrir-carrinho').onclick = () => {
    abrirCarrinho(true);
};

// Fechar carrinho

$('#fechar-carrinho').onclick = () => {
    abrirCarrinho(false);
};

// Fechar ao clicar fora

$('#overlay').onclick = () => {
    abrirCarrinho(false);
};


/* ==========================================
   9. FINALIZAR PEDIDO PELO WHATSAPP
========================================== */

$('#finalizar').onclick = () => {

    // Não permite finalizar carrinho vazio

    if (carrinho.length === 0) {
        return;
    }


    // Organiza os produtos da mensagem

    const linhas = carrinho.map((item) => {

        const preco = item.preco === null
            ? 'preço a consultar'
            : moeda(item.preco);

        return `• ${item.nome} — ${item.quantidade} un. (${preco})`;

    }).join('\n');


    // Mensagem enviada para a loja

    const mensagem = `
Olá, AFONSO FUMÊ!

Gostaria de consultar a disponibilidade e os valores destes itens:

${linhas}

Os itens do site são demonstrativos.
Aguardo confirmação de estoque e preços.
    `.trim();


    // Abre o WhatsApp com a mensagem

    const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

    window.open(link, '_blank', 'noopener');

};


/* ==========================================
   10. MENU RESPONSIVO
========================================== */

// Abrir e fechar menu no celular

$('.menu-toggle').onclick = () => {

    const aberto = $('#menu').classList.toggle('aberto');

    $('.menu-toggle').setAttribute(
        'aria-expanded',
        String(aberto)
    );

};


// Fechar menu ao selecionar uma seção

document.querySelectorAll('nav a').forEach((link) => {

    link.onclick = () => {

        $('#menu').classList.remove('aberto');

        $('.menu-toggle').setAttribute(
            'aria-expanded',
            'false'
        );

    };

});


/* ==========================================
   11. TECLA ESCAPE
========================================== */

// Fecha o carrinho ao pressionar ESC

document.addEventListener('keydown', (evento) => {

    if (evento.key === 'Escape') {
        abrirCarrinho(false);
    }

});


/* ==========================================
   12. ANO AUTOMÁTICO DO RODAPÉ
========================================== */

$('#ano').textContent = new Date().getFullYear();


/* ==========================================
   13. INICIALIZAÇÃO DO SITE
========================================== */

// Carrega os produtos no catálogo

renderProdutos();

// Atualiza o carrinho inicialmente

atualizarCarrinho();
