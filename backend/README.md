Todos os direitos reservados à https://baasic.com.br

  

--
# Tutorial de Instalação e Execução do Backend
--

  

## Requisitos

  

Antes de iniciar, certifique-se de que você possui as seguintes ferramentas instaladas:

  

- Node.js (versão 16 ou superior) | [COMO INSTALAR NODE JS NO WINDOWS?](https://www.youtube.com/watch?v=-jft_9PlffQ)

- NPM (Npm vem junto com a instalação do node)

- PostgreSQL (versão 12 ou superior) | [COMO INSTALAR O POSTGRESQL NO WINDOWS - PARA DEVS](https://www.youtube.com/watch?v=UbX-2Xud1JA)

- Git (para clonar o projeto)

- pgAdmin (opcional, para gerenciar o banco de dados PostgreSQL)

- Redis server | [Link para download do instalador](https://github.com/microsoftarchive/redis/releases)

  

## Instalação do Backend

  

### 1. Clonar projeto localmente

No terminal, use o comando ```cd``` para navegar até o diretório onde você deseja clonar o repositório, por exeplo:

  

```bash
cd  /caminho/para/seu/diretorio
```

  

No terminal, execute o seguinte comando para clonar o projeto:

  

```bash
git  clone  https://github.com/0110101001110000/zapcomm.git
```

  

### 2. Acessar o Diretório do Projeto

Após a clonagem, navegue até o diretório do projeto:

  

```bash
cd  zapcomm
```

  

## Configuração do Backend

  

### 1. Instalar Dependências do Backend

  

No terminal, navegue até a pasta ```backend``` e execute o comando:

  

```bash
npm  install
```

  

Quando você executa esse comando, o NPM (Node Package Manager) baixa todos os pacotes de bibliotecas necessários para o projeto rodar, colocando-os na pasta node_modules. Essas dependências podem incluir bibliotecas como o express, sequelize, dotenv, entre outras.

  

### 2. Configuração do Banco de Dados

  

#### Crie Banco de Dados via terminal ou PgAdmin 4

  

Para criar o banco de dados via terminal, siga as seguintes instruções:

  

No terminal, para se conectar ao servidor PostgreSQL como o usuário padrão "postgres", execute o comando abaixo. Você será solicitado a digitar a senha.

  

```bash
psql  -U  postgres
```

  

Uma vez conectado, você estará no prompt do PostgreSQL.

No prompt do PostgreSQL, digite o comando abaixo para criar um novo banco de dados. Substitua "nome_do_banco" pelo nome que você deseja dar ao seu banco de dados.

  

```bash
CREATE  DATABASE  nome_do_banco;
```

  

#### Configure as variáveis de ambiente

  

No terminal, ainda na pasta ```backend```, execute o seguinte comando para copiar o arquivo existente ```.env.example``` e colar como ```.env```:

  

```bash
copy .env.example .env
```

  

#### Em seguida, edite o arquivo .env com os dados corretos para a conexão com o PostgreSQL

  

Antes de iniciar o projeto, é necessário configurar as credenciais de acesso ao banco de dados PostgreSQL no arquivo ```.env```.

  

Edite o arquivo ```.env``` e insira as informações corretas de acordo com seu ambiente de desenvolvimento:

  

```bash
DB_DIALECT=postgres

DB_HOST=localhost

DB_PORT=5432

DB_USER=seu_usuario_postgres

DB_PASS=sua_senha_postgres

DB_NAME=nome_do_banco_de_dados
```

  

Substitua os valores ```seu_usuario_postgres```, ```sua_senha``` e ```nome_do_banco``` pelas credenciais corretas para o seu ambiente.

  

### 3. Rodar Migrações e Seeds

  

Com o banco de dados configurado, você precisará rodar as migrações e seeds para popular o banco de dados com as tabelas e dados iniciais.

  

#### Realize o primeiro build no projeto

  

Para que seja possível executar corretamente os scripts de migração e seeds, é necessário realizar o primeiro build no projeto caso não o tenha feito.

  

No terminal, execute o seguinte comando para realizar o primeiro build:

  

```bash
npm  run  build
```

  

#### Execute o script de migrações

  

O seguinte comando cria as tabelas necessárias no banco de dados.

  

```bash
npm  run  db:migrate
```

  

#### Execute o script de seeds

  

O seguinte comando popula o banco com dados iniciais.

  

```bash
npm  run  db:seed
```

  

Isso vai inserir dados padrões no banco, como usuários ou empresas.

  

## Rodar o Servidor Backend localmente

  

No terminal, ainda na pasta ```backend```, execute o seguinte comando para subir o servidor Backend localmente:

  

```bash
npm  run  dev:server
```

  

O backend será iniciado e estará disponível no endereço ```http://localhost:8080``` (ou outra porta configurada).
