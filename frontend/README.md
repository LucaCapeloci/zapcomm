Todos os direitos reservados à https://baasic.com.br

--
# Tutorial de Instalação e Execução do Frontend
--

## Requisitos

- Antes de iniciar, certifique-se de que você possui o Backend instalado, configurado e em execução em sua máquina. [Tutorial de instalação e execução do backend](https://github.com/0110101001110000/zapcomm/tree/main/backend#readme)
  
## Instalação do Frontend

No terminal, navegue até o diretório ```zapcomm``` (criado anteriormente na instalação do Backend).
No diretório do projeto, navegue até a pasta ```frontend```. 

### Instalação das dependências

No terminal, execute o seguinte comando para que sejam instaladas as dependências (listadas no arquivo ```package.json```) do projeto:

```bash
npm  install
```
  
Quando você executa esse comando, o NPM (Node Package Manager) baixa todos os pacotes de bibliotecas necessários para o projeto rodar, colocando-os na pasta node_modules. 

## Configuração do Frontend

### Configuração das variáveis de ambiente

No terminal, ainda na pasta ```frontend```, execute o seguinte comando para copiar o arquivo existente ```.env.example``` e colar como ```.env```:

```bash
copy .env.example .env
```

Em seguida, abra o arquivo .env, você encontrar-se-á uma linha com o seguinte código:

```bash
REACT_APP_BACKEND_URL=https://url front
```

Altere-a para que fique da seguinte maneira:

```bash
REACT_APP_BACKEND_URL="http://localhost:8080"
```

Lembrando que ```"http://localhost:8080"``` é a url do Backend.

## Execução do Frontend

Com a instalação e configuração do Frontend em sua máquina, basta executar o seguinte comando para abrir o servidor Frontend:

```bash
npm start
```

Com a execução desse comando, o Frontend será iniciado e estará disponível no endereço ```http://localhost:3000``` (ou outra porta configurada).

Caso necessário, utilize as seguintes credenciais para login:

- E-mail: ```admin@admin.com```
- Senha: ```123456```
