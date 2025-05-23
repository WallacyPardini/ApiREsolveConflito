"use client"

import Head from "next/head"
import { useState } from "react"
import styles from "../styles/Home.module.css"

export default function Home() {
  const [fileName, setFileName] = useState("")
  const [conflictCode, setConflictCode] = useState("")
  const [strategy, setStrategy] = useState("preferir HEAD")
  const [resolvedCode, setResolvedCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setShowResult(false)

    try {
      console.log("Enviando requisição...")
      console.log("Dados:", { strategy, codeLength: conflictCode.length })

      const response = await fetch("/api/resolve-conflict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: conflictCode,
          strategy,
        }),
      })

      console.log("Resposta recebida:", response.status)
      const data = await response.json()
      console.log("Dados recebidos:", data)

      if (!response.ok) {
        throw new Error(data.message || "Erro ao processar a requisição")
      }

      if (data.success && data.resolvedCode) {
        setResolvedCode(data.resolvedCode)
        setShowResult(true)

        // Scroll para o resultado após um pequeno delay para garantir que o elemento existe
        setTimeout(() => {
          const resultElement = document.getElementById("resultContainer")
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: "smooth" })
          }
        }, 100)
      } else {
        throw new Error("A resposta não contém os dados esperados")
      }
    } catch (err) {
      console.error("Erro:", err)
      setError(err.message)

      // Scroll para o erro
      setTimeout(() => {
        const errorElement = document.getElementById("errorAlert")
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resolvedCode).then(
      () => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      },
      () => {
        console.error("Erro ao copiar texto")
      },
    )
  }

  const loadExample = () => {
    setFileName("Program.cs")
    setConflictCode(`using System;

namespace ConflictExample
{
    class Program
    {
<<<<<<< HEAD
        static void Main(string[] args)
        {
            Console.WriteLine("Versão do desenvolvedor A");
            ProcessData(10);
        }
        
        static void ProcessData(int value)
        {
            Console.WriteLine($"Processando: {value}");
=======
        static void Main(string[] args)
        {
            Console.WriteLine("Versão do desenvolvedor B");
            ProcessData(20);
            GenerateReport();
        }
        
        static void ProcessData(int value)
        {
            Console.WriteLine($"Processando valor: {value * 2}");
        }
        
        static void GenerateReport()
        {
            Console.WriteLine("Gerando relatório...");
>>>>>>> feature-branch
        }
    }
}`)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Resolvedor de Conflitos de Merge</title>
        <meta name="description" content="Resolva conflitos de merge em código-fonte" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" />
      </Head>

      <main className={styles.main}>
        <div className="container py-4">
          <div className="bg-primary bg-opacity-10 border-start border-5 border-primary rounded-end p-3 mb-4">
            <h1 className="mb-2">Resolvedor de Conflitos de Merge</h1>
            <p className="lead mb-0">Resolva conflitos de merge em código-fonte de forma rápida e eficiente.</p>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="fileName" className="form-label">
                        Nome do Arquivo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="exemplo.cs"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="conflictCode" className="form-label">
                        Código com Conflito
                      </label>
                      <textarea
                        className="form-control font-monospace"
                        id="conflictCode"
                        rows="10"
                        value={conflictCode}
                        onChange={(e) => setConflictCode(e.target.value)}
                        placeholder="Cole aqui o código com os marcadores <<<<<<< HEAD, =======, >>>>>>>"
                        required
                      ></textarea>
                      <div className="form-text">Inclua o código com os marcadores de conflito.</div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="strategy" className="form-label">
                        Estratégia de Resolução
                      </label>
                      <select
                        className="form-select"
                        id="strategy"
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                        required
                      >
                        <option value="preferir HEAD">Preferir HEAD</option>
                        <option value="preferir Incoming">Preferir Incoming</option>
                        <option value="combinar">Combinar</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processando...
                        </>
                      ) : (
                        "Resolver Conflito"
                      )}
                    </button>

                    <button type="button" className="btn btn-outline-secondary ms-2" onClick={loadExample}>
                      <i className="bi bi-code-slash"></i> Carregar Exemplo
                    </button>
                  </form>
                </div>
              </div>

              {showResult && (
                <div id="resultContainer" className="card shadow-sm">
                  <div className="card-header d-flex justify-content-between align-items-center bg-light">
                    <h5 className="mb-0">Resultado</h5>
                    <button className="btn btn-sm btn-outline-secondary" onClick={copyToClipboard}>
                      <i className={`bi ${copySuccess ? "bi-check" : "bi-clipboard"}`}></i>
                      {copySuccess ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="mb-2 fw-bold">{fileName}</div>
                    <pre className="bg-light p-3 rounded font-monospace mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {resolvedCode}
                    </pre>
                  </div>
                </div>
              )}

              {error && (
                <div id="errorAlert" className="alert alert-danger mt-3">
                  <strong>Erro:</strong> {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className="text-center text-muted">
          <small>© {new Date().getFullYear()} - Resolvedor de Conflitos de Merge</small>
        </div>
      </footer>
    </div>
  )
}
