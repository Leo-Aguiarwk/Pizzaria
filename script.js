let qt = 1;
let currentSize ='3';
let currentPrice = 0;
let modalKey = 0;
let cart= [];

let subtotal =0;
let desconto =0;
let total =0;


///  MANIPULANDO A JSON DAS PIZZAS PARA ADICONAS OS ELEMENTOS NA TELA
pizzaJson.map((item, index)=> {
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    
    document.querySelector('.pizza-area').append( pizzaItem );
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = item.price.toFixed(2);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

///  ABRINDO JANELA DE COMPRA E ATUALIZANDO INFORMACOES 
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        currentSize = '3';
        qt=1;
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;

        document.querySelector('.cart').style = 'display: none';

        let pizzaWindow = document.querySelector('.models .pizzaWindowArea').cloneNode(true);
        document.querySelector('.area-window').append(pizzaWindow);

        pizzaWindow.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        pizzaWindow.querySelector('.pizza-big img').src = pizzaJson[key].img;
        pizzaWindow.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        pizzaWindow.querySelector('.pizzaInfo-price').innerHTML = pizzaJson[key].size[0][860].toFixed(2);
        pizzaWindow.querySelector('.pizzaQt').innerHTML = qt;

///  SELETORES DE TAMANHOS E VALORES POR TAMANHO
        pizzaWindow.querySelectorAll('.pizzaInfo-size').forEach(i =>{

            i.addEventListener('click', ()=>{
                let sizeActive = pizzaWindow.querySelector('.pizzaInfo-size');
                pizzaWindow.querySelectorAll('.pizzaInfo-size').forEach(el =>{
                    el.classList.remove('active');
                });

                currentSize = i.getAttribute('data-key');
                if (currentSize === '1' ){
                    pizzaWindow.querySelector('.pizzaInfo-price').innerHTML = item.size[0][100].toFixed(2);
                }else if (currentSize === '2') {
                    pizzaWindow.querySelector('.pizzaInfo-price').innerHTML = item.size[0][530].toFixed(2);
                   
                }else {
                    pizzaWindow.querySelector('.pizzaInfo-price').innerHTML = item.size[0][860].toFixed(2);
                }
                i.classList.add('active');
                
            });
        });

///  BOTOES QUANTIDADES MAIS/MENOS  NO MODAL
        pizzaWindow.querySelector('.pizzaInfo-qtMais').addEventListener('click', ()=>{
            qt++;
            currentPrice = pizzaWindow.querySelector('.pizzaInfo-price').innerHTML;
            pizzaWindow.querySelector('.pizzaQt').innerHTML = qt;
        });
        pizzaWindow.querySelector('.pizzaInfo-qtMenos').addEventListener('click', ()=>{
            if(qt > 1){
                qt--;
                pizzaWindow.querySelector('.pizzaQt').innerHTML = qt;
            }
        });
///  BOTAO DE CANCELAR
        pizzaWindow.querySelector('.pizzaInfo-cancButton').addEventListener('click', ()=>{
            document.querySelector('.area-window').innerHTML = '';
            qt = 0;
        });




/// BOTAO DE ADICIONAR ITEM NO CARRINHO
        pizzaWindow.querySelector('.pizzaInfo-addButton').addEventListener('click', ()=>{
            
            subtotal=0;
            let indentifier = pizzaJson[modalKey].id+'@'+currentSize;

            let KeyIndentifier = cart.findIndex((item)=>{
                return item.indentifier == indentifier
            });
            
            if (KeyIndentifier > -1) {
                cart[KeyIndentifier].cartQt += qt;
            }else {
                cart.push({
                    indentifier,
                    id:pizzaJson[modalKey].id,
                    size:currentSize,
                    cartQt:qt,
                    price: 0
                });
            }
            upDateCart(item);
            

            
        });
    });

    document.querySelectorAll('.menu a').forEach((i)=>{
        i.addEventListener('click', ()=>{
            upDateCart(item);
        });        
    });
});



document.querySelector('.cart-fechar').addEventListener('click', ()=>{
    document.querySelector('.area-window').innerHTML = '';
    document.querySelector('.cart').style = 'display: none';
});



// FUNCTIONS 
function upDateCart(item) {
    document.querySelector('.area-window').innerHTML = '';
    document.querySelector('.cart').style = 'display: block';

    document.querySelector('.pizza-item--cart--body').innerHTML =''

    subtotal=0;
    desconto=0;
    total=0;
    for (let i in cart){
        let pizza = pizzaJson.find((item)=>{
            return item.id == cart[i].id;
        });
        
        if (currentSize === '1' ){
            subtotal += item.size[0][100] * cart[i].cartQt;
            cart[i].price = subtotal;
            
        }else if (currentSize === '2') {
            subtotal += item.size[0][530] * cart[i].cartQt;
            cart[i].price = subtotal;
        }else {
            subtotal += item.size[0][860] * cart[i].cartQt;
            cart[i].price = subtotal;
        }

        let cartItem = document.querySelector('.models .pizza-item--cartArea').cloneNode(true);
        document.querySelector('.pizza-item--cart--body').append(cartItem);

        let pizzaSizeName;
        switch(cart[i].size){
            case '1':
                pizzaSizeName = 'P';
                break;
            case '2':
                pizzaSizeName = 'M';
                break;
            case '3':
                pizzaSizeName = 'G';
                break;
        }
        cartItem.querySelector('.pizza-item--sabor').innerHTML = `${pizza.name} (${pizzaSizeName})`;
        cartItem.querySelector('.pizzaCartQt').innerHTML = cart[i].cartQt; 


        cartItem.querySelector('.pizza-cart-qtMenos').addEventListener('click', ()=>{
            if(cart[i].cartQt > 1){
                cart[i].cartQt--;
                cartItem.querySelector('.pizzaCartQt').innerHTML = cart[i].cartQt;
                upDateCart(item);
            } else {
                cart.splice(i , 1);
                document.querySelectorAll('.pizza-item--cart--body').forEach(item=>{
                    for(l in item){
                        if (item.getAttribute('data-id') === i){
                            document.querySelector('.pizza-item--cart--body').remove(item[l]);   
                        }    
                    }
                    document.querySelector('.cart').style = 'display: none';
                });
            }
        });


        cartItem.querySelector('.pizza-cart-qtMais').addEventListener('click', ()=>{
            cart[i].cartQt++;
            cartItem.querySelector('.pizzaCartQt').innerHTML = cart[i].cartQt;

            upDateCart(item);
        });




        cartItem.setAttribute('data-id', i);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;
    document.querySelector('.sub-value').innerHTML = `R$ ${subtotal}`;
    document.querySelector('.desconto-value').innerHTML = `R$ ${desconto}`;
    document.querySelector('.total-value').innerHTML = `R$ ${total}`;
}
