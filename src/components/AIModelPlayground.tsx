import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { api } from "../config/api";
import {
  Brain,
  Send,
  Loader2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AIModelPlayground: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [maxTokens, setMaxTokens] = useState(500);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setResponse(null);
      
      const response = await fetch(`${api.API_URL}/api/external/openai`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model,
          maxTokens,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la génération de texte");
      }
      
      const data = await response.json();
      setResponse(data.choices[0].message.content);
      
      // Récompenser l'utilisateur pour l'utilisation de l'API
      await rewardAction("use_ai_model");
    } catch (error) {
      console.error("Error generating text:", error);
      setError("Impossible de générer une réponse. Veuillez réessayer plus tard.");
      toast.error("Erreur lors de la génération de texte");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setResponse(null);
    setError(null);
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Texte copié dans le presse-papier");
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
        <Brain className="w-5 h-5 text-purple-400 mr-2" />
        IA Générative
      </h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Votre prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Entrez votre prompt ici..."
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
              Modèle
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-300 mb-2">
              Longueur maximale (tokens)
            </label>
            <input
              type="number"
              id="maxTokens"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              min={50}
              max={2000}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Générer
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Effacer
          </button>
        </div>
      </form>
      
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      )}
      
      {response && (
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-200">Réponse</h3>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Copier la réponse"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          <div className="whites