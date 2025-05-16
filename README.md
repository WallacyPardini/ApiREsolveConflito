# Resolvedor de Conflitos de Merge

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fseu-usuario%2Fresolucao-conflitos-merge&env=V0_API_KEY&envDescription=Chave%20de%20API%20para%20o%20servi%C3%A7o%20v0)

Uma aplicação web para resolver conflitos de merge em código-fonte de forma rápida e eficiente, utilizando a API do v0 para processamento inteligente dos conflitos.

## Funcionalidades

- Resolução de conflitos de merge em código-fonte
- Suporte a diferentes estratégias de resolução (preferir HEAD, preferir Incoming, combinar)
- Interface amigável e responsiva
- Visualização do código resolvido
- Opção para copiar ou baixar o código resolvido

## Tecnologias Utilizadas

- Next.js - Framework React para renderização do frontend e API routes
- Bootstrap 5 - Framework CSS para estilização responsiva
- Axios - Cliente HTTP para comunicação com a API do v0

## Pré-requisitos

- Node.js 14.x ou superior
- Uma chave de API válida para o serviço v0

## Instalação e Execução Local

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/seu-usuario/resolucao-conflitos-merge.git
   cd resolucao-conflitos-merge
   \`\`\`

2. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`

3. Crie um arquivo `.env.local` na raiz do projeto:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

4. Edite o arquivo `.env.local` e adicione sua chave de API do v0:
   \`\`\`
   V0_API_KEY=sua_chave_api_aqui
   \`\`\`

5. Inicie o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## Implantação na Vercel

### Método 1: Usando o Botão "Deploy"

1. Clique no botão "Deploy with Vercel" no topo deste README
2. Siga as instruções para conectar ao seu repositório GitHub
3. Adicione sua chave de API do v0 nas variáveis de ambiente
4. Clique em "Deploy"

### Método 2: Usando a CLI da Vercel

1. Instale a CLI da Vercel:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. No diretório do projeto, execute:
   \`\`\`bash
   vercel
   \`\`\`

3. Siga as instruções para fazer login e configurar o projeto
4. Adicione a variável de ambiente `V0_API_KEY` quando solicitado

### Método 3: Implantação Manual

1. Faça push do código para um repositório Git (GitHub, GitLab, Bitbucket)
2. Acesse [vercel.com/new](https://vercel.com/new)
3. Importe o repositório
4. Adicione a variável de ambiente `V0_API_KEY`
5. Clique em "Deploy"

## Variáveis de Ambiente

| Nome | Descrição | Obrigatório |
|------|-----------|-------------|
| `V0_API_KEY` | Chave de API para o serviço v0 | Sim |

## Como Usar

1. Acesse a aplicação pelo navegador
2. Digite o nome do arquivo com conflito
3. Cole o código conflitado no campo de texto (com os marcadores `<<<<<<< HEAD`, `=======`, `>>>>>>>`)
4. Selecione a estratégia de resolução
5. Clique em "Resolver Conflito"
6. O código resolvido será exibido abaixo, onde você pode copiá-lo ou baixá-lo

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
