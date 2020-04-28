### Back-end do projeto GoFinances construído durante Bootcampo da RocketSeat 🚀

GoFinances é um projeto ainda em construção, à cada etapa do Bootcamp estamos acrescentando funcionalidades ao projeto e está ficando muito legal.
Até o momento já é possível adicionar registros de entradas e saídas além também do suporte à importação de arquivos CSV.

### Executando a aplicação:
``` 
#para instalar as dependências do projeto <br />
yarn

#para criar o banco de dados <br />
yarn typeorm migration:run

#para executar os testes projeto e garantir sua integridade <br />
yarn test

#para executar o projeto <br />
yarn start
```

### API
## Transactions

POST /transactions/import #adicionando o arquivo CSV
Resposta:
```json
[
  {
    "id": "c9493ccf-4831-446b-afb1-4973e17889a4",
    "title": "Salário",
    "value": "5000",
    "type": "income",
    "category": "pagamento",
  },
  {
    "id": "f1a6ede3-f725-4351-b018-a3ed3384c708",
    "title": "iPhone XR 64GB",
    "value": "3149",
    "type": "outcome",
    "category": "crazyness",
  },
  {
    "income": "5000",
    "outcome": "3000",
    "total": "1851",
  }
]
```

POST /transactions
```json
{
  "title": "iPhone XR 64GB",
  "value": "3149",
  "type": "outcome",
  "category": "crazyness",
}
```
Resposta:
```json
{
  "id": "f1a6ede3-f725-4351-b018-a3ed3384c708",
  "title": "iPhone XR 64GB",
  "value": "3149",
  "type": "outcome",
  "category": "crazyness",
}
```

GET /transactions
```json
[
  {
    "id": "f1a6ede3-f725-4351-b018-a3ed3384c708",
    "title": "iPhone XR 64GB",
    "value": "3149",
    "type": "outcome",
    "category": "crazyness",
  },
  {
    "income": "10000",
    "outcome": "3000",
    "total": "7000",
  }
]
```
DELETE /transactions/{transaction_id}
