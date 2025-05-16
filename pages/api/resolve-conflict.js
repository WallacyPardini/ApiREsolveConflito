import axios from "axios"

export default async function handler(req, res) {
  // Verificar método HTTP
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método não permitido" })
  }

  // Verificar se a chave API está definida
  if (!process.env.V0_API_KEY) {
    console.error("Erro: V0_API_KEY não está definida nas variáveis de ambiente.")
    return res.status(500).json({
      success: false,
      message: "Erro de configuração do servidor. Verifique as variáveis de ambiente.",
    })
  }

  try {
    const { code, strategy } = req.body

    // Validar os dados recebidos
    if (!code || !strategy) {
      return res.status(400).json({
        success: false,
        message: "O código com conflito e a estratégia são obrigatórios.",
      })
    }

    // Criando o prompt para a API v0
    const messages = [
      {
        role: "system",
        content:
          "Você é um assistente de desenvolvimento responsável por resolver conflitos de merge em códigos. Receba trechos de código conflitado e retorne apenas o código resolvido de acordo com a estratégia especificada: preferir HEAD, preferir Incoming ou combinar.",
      },
      {
        role: "user",
        content: `Resolva o seguinte código conflitado utilizando a estratégia ${strategy}.\nRetorne APENAS o código resolvido sem comentários adicionais, explicações ou formatação markdown:\n\n${code}`,
      },
    ]

    // Fazendo a requisição para a API do v0
    const response = await axios.post(
      "https://api.v0.dev/api/v1/generate",
      {
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.V0_API_KEY}`,
        },
      },
    )

    // Verificando a resposta
    if (response.data && response.data.response) {
      // Limpar qualquer possível formatação markdown
      let resolvedCode = response.data.response
      resolvedCode = resolvedCode.replace(/```[\s\S]*?```/g, (match) => match.replace(/```[\w]*\n|```$/g, ""))

      // Enviar resposta
      return res.json({
        success: true,
        resolvedCode,
      })
    } else {
      throw new Error("A resposta da API não contém os dados esperados")
    }
  } catch (error) {
    console.error("Erro ao chamar a API v0:", error)

    // Enviar resposta de erro adequada
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || error.message || "Erro ao processar a requisição",
    })
  }
}
