use('padaria')
db.produtos.insertOne({
    "COD": "1",
    "descricao" : "Pão Frances",
    "preco" : 8.10,
    "unidade": "KG",
    "datavalidade": new Date('2024-10-22'),
    "estoque": 20,
    "fornecedor": "Fabricação Própria",
    "ingredientes": ["Farinha de trigo","Fermento","Manteiga","Agua","Açucar","Sal"], 
    "categoria": ["Salgado", "Muito Perecivel"]
})
//Criando um índice para evitar registros duplicados
use('padaria')
db.produtos.createIndex({COD:1},{unique:true})

use('padaria')
db.produtos.insertOne({
    "COD" : "2",
    "descricao" : "Pão de Leite",
    "preco" : 9.98,
    "unidade": "KG",
    "datavalidade": new Date('2024-10-22'),
    "estoque": 100,
    "fornecedor": "Fabricação Própria",
    "ingredientes": ["Farinha de trigo","Fermento","Manteiga","Leite","Ovo","Açucar","Sal"],
    "categoria": ["Doce", "Muito Perecivel"]
})

use('padaria')
db.produtos.insertOne({
    "COD" : "3",
    "descricao" : "Biscoito Agua e Sal",
    "preco" : 4.99,
    "unidade": "UND",
    "datavalidade": new Date('2024-10-22'),
    "estoque": 25,
    "fornecedor": "Piraque",
    "ingredientes": ["N/A"],
    "categoria": ["Salgado", "Pouco Perecivel"]
})        


//produtos no estoque (que ainda não estão vencidos)
use('padaria') 
 db.produtos.find({$and: [  
                    {"estoque": {$gt: 0}},
                    {"datavalidade": {$gte:new Date('2024-10-15')}}
                         ]},
                    {descricao:1, estoque:1})
//produtos vencidos no estoque
use('padaria') 
 db.produtos.find({$and: [  
                    {"estoque": {$gt: 0}},
                    {"datavalidade": {$lte:new Date('2024-10-15')}}
                         ]},
                    {descricao:1, estoque:1})
