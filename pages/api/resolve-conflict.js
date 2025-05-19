import axios from "axios";

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Lidar com requisições OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Verificar método HTTP
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} não permitido. Use POST.`
    });
  }

  // Verificar se a chave API está definida
  if (!process.env.V0_API_KEY) {
    console.error("Erro: V0_API_KEY não está definida nas variáveis de ambiente.");
    return res.status(500).json({
      success: false,
      message: "Erro de configuração do servidor. Verifique as variáveis de ambiente."
    });
  }

  try {
    const { code, strategy } = req.body;

    // Log para debug
    console.log("Recebido:", { strategy, codeLength: code?.length });

    // Validar os dados recebidos
    if (!code || !strategy) {
      return res.status(400).json({
        success: false,
        message: "O código com conflito e a estratégia são obrigatórios."
      });
    }

    // Log para debug
    console.log("Enviando requisição para a API v0...");
    console.log("API Key primeiros 5 caracteres:", process.env.V0_API_KEY.substring(0, 5) + "...");

    try {
      // Fazendo a requisição para a API do v0 (formato correto)
      const response = await axios.post(
        "https://api.v0.dev/generate",
        {
          prompt: `Resolva o seguinte código conflitado utilizando a estratégia ${strategy}:\n\n${code}`,
          temperature: 0.3,
          system: "Você é um assistente de desenvolvimento responsável por resolver conflitos de merge em códigos. Receba trechos de código conflitado e retorne apenas o código resolvido de acordo com a estratégia especificada: preferir HEAD, preferir Incoming ou combinar."
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.V0_API_KEY}`
          },
          timeout: 30000 // 30 segundos de timeout
        }
      );

      // Log para debug
      console.log("Resposta recebida da API v0:", {
        status: response.status,
        hasData: !!response.data
      });

      // Verificando a resposta
      if (response.data && response.data.response) {
        // Limpar qualquer possível formatação markdown
        let resolvedCode = response.data.response;
        resolvedCode = resolvedCode.replace(/```[\s\S]*?```/g, match => match.replace(/```[\w]*\n|```$/g, ""));

        // Enviar resposta
        return res.status(200).json({
          success: true,
          resolvedCode,
          source: "v0-api"
        });
      } else {
        throw new Error("A resposta da API não contém os dados esperados");
      }
    } catch (apiError) {
      console.error("Erro na chamada à API v0:", apiError.message);

      // Verificar se temos detalhes do erro da API
      if (apiError.response) {
        console.error("Detalhes do erro:", {
          status: apiError.response.status,
          data: apiError.response.data
        });
      }

      // Implementar resolução local como fallback
      console.log("Usando resolução local como fallback");
      const resolvedCode = resolveConflictLocally(code, strategy);

      return res.status(200).json({
        success: true,
        resolvedCode,
        source: "fallback"
      });
    }
  } catch (error) {
    console.error("Erro geral:", error.message);

    // Enviar resposta de erro adequada
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || error.message || "Erro ao processar a requisição"
    });
  }
}

// Função para resolver conflitos localmente (implementação simples para fallback)
function resolveConflictLocally(conflictCode, strategy) {
  // Expressão regular para encontrar blocos de conflito
  const conflictRegex = /(<<<<<<< HEAD\n)([\s\S]*?)(=======\n)([\s\S]*?)(>>>>>>>.*\n)/g;

  // Resolver com base na estratégia
  let resolvedCode = conflictCode;

  if (strategy === "preferir HEAD") {
    // Manter apenas o código do HEAD
    resolvedCode = conflictCode.replace(conflictRegex, (match, head, headContent, separator, incomingContent, end) => {
      return headContent;
    });
  } else if (strategy === "preferir Incoming") {
    // Manter apenas o código do Incoming
    resolvedCode = conflictCode.replace(conflictRegex, (match, head, headContent, separator, incomingContent, end) => {
      return incomingContent;
    });
  } else if (strategy === "combinar") {
    // Tentativa simples de combinar (na prática, isso seria mais sofisticado)
    resolvedCode = conflictCode.replace(conflictRegex, (match, head, headContent, separator, incomingContent, end) => {
      // Remover duplicatas se houver linhas idênticas
      const headLines = headContent.split("\n");
      const incomingLines = incomingContent.split("\n");
      const combinedLines = [...new Set([...headLines, ...incomingLines])];
      return combinedLines.join("\n");
    });
  }

  return resolvedCode;
}