# Resolvedor de Conflitos de Merge com v0

Este projeto consiste em um aplicativo web para resolução de conflitos de merge em código-fonte, utilizando a API do v0 para processamento inteligente dos conflitos.

## Estrutura do Projeto

- `server.js` - Servidor Node.js com Express
- `public/` - Arquivos do frontend
- `.env` - Arquivo de variáveis de ambiente (não comitado no repositório)
- `.env.example` - Exemplo de variáveis de ambiente necessárias

## Requisitos

- Node.js 14+
- Uma chave de API válida para o serviço v0

## Instalação

1. Clone o repositório:
   \`\`\`
   git clone https://github.com/seu-usuario/v0-conflict-resolver.git
   cd v0-conflict-resolver
   \`\`\`

2. Instale as dependências:
   \`\`\`
   npm install
   \`\`\`

3. Crie um arquivo .env na raiz do projeto:
   \`\`\`
   cp .env.example .env
   \`\`\`

4. Edite o arquivo .env e adicione sua chave de API do v0:
   \`\`\`
   V0_API_KEY=sua_chave_api_aqui
   \`\`\`

## Executando o Servidor

1. Inicie o servidor:
   \`\`\`
   npm start
   \`\`\`

2. Para desenvolvimento com recarga automática:
   \`\`\`
   npm run dev
   \`\`\`

3. Acesse a aplicação em: http://localhost:3000

## Como Usar

1. Acesse a aplicação pelo navegador
2. Digite o nome do arquivo com conflito
3. Cole o código conflitado no campo de texto
4. Selecione a estratégia de resolução
5. Clique em "Resolver Conflito"
6. O código resolvido será exibido abaixo, onde você pode copiá-lo ou baixá-lo

## Segurança

- A chave de API é armazenada apenas no servidor no arquivo .env (não comitado)
- A aplicação utiliza HTTPS quando implantada em produção
- Todas as requisições são validadas antes de serem processadas

## Implantação

Para implantar em produção, recomendamos:

1. Um serviço como Vercel, Heroku ou Railway
2. Configurar as variáveis de ambiente necessárias no painel de controle do serviço
3. Conectar ao repositório Git e implantar

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.
