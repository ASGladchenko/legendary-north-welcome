"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import {
  defaultOpenAIModel,
  isOpenAIModel,
  openAIModels,
  type OpenAIModel,
} from "@/app/config/openai-models";
import { AdminRequestError, adminRequest } from "./admin-api";

type OpenAIStatus = {
  configured: boolean;
  model: string | null;
  apiKeyPreview: string | null;
};

type SettingsResponse = {
  openAI: OpenAIStatus;
  pipelineStartRequested?: boolean;
};

export function AdminPanel({ notice }: { notice?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [model, setModel] = useState<OpenAIModel | null>(null);
  const settingsQuery = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminRequest<SettingsResponse>("/api/admin/settings"),
  });
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: FormDataEntryValue | null; password: FormDataEntryValue | null }) => {
      await adminRequest("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      return adminRequest<SettingsResponse>("/api/admin/settings");
    },
  });
  const saveMutation = useMutation({
    mutationFn: (settings: { apiKey: FormDataEntryValue | null; model: OpenAIModel }) =>
      adminRequest<SettingsResponse>("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      }),
  });

  useEffect(() => {
    if (
      settingsQuery.error instanceof AdminRequestError &&
      settingsQuery.error.status === 401
    ) {
      router.refresh();
    }
  }, [router, settingsQuery.error]);

  const settings = settingsQuery.data?.openAI ?? null;
  const selectedModel =
    model ??
    (settings?.model && isOpenAIModel(settings.model)
      ? settings.model
      : defaultOpenAIModel);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await loginMutation.mutateAsync({
        username: form.get("username"),
        password: form.get("password"),
      });

      queryClient.setQueryData(["admin", "settings"], response);
      setModel(
        response.openAI.model && isOpenAIModel(response.openAI.model)
          ? response.openAI.model
          : defaultOpenAIModel,
      );
      router.replace("/admin");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign in failed");
    }
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    setError("");
    setMessage("");

    const form = new FormData(formElement);

    try {
      const response = await saveMutation.mutateAsync({
        apiKey: form.get("apiKey"),
        model: selectedModel,
      });

      queryClient.setQueryData(["admin", "settings"], response);
      setModel(
        response.openAI.model && isOpenAIModel(response.openAI.model)
          ? response.openAI.model
          : defaultOpenAIModel,
      );
      formElement.reset();
      setMessage(
        response.pipelineStartRequested
          ? "Settings saved. Oracle pipeline start requested."
          : "Settings saved.",
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Save failed");
    }
  };

  return (
    <>
      {settingsQuery.isPending ? (
          <div className="admin-loading" role="status">
            Checking access…
          </div>
        ) : settings ? (
          <div className="admin-grid">
            <aside className="admin-status">
              <span className="admin-kicker">Connection</span>
              <div className="admin-status-line">
                <i className={settings.configured ? "is-ready" : ""} />
                <strong>{settings.configured ? "Configured" : "Not configured"}</strong>
              </div>
              <dl>
                <div>
                  <dt>Model</dt>
                  <dd>{settings.model ?? "—"}</dd>
                </div>
                <div>
                  <dt>API key</dt>
                  <dd>{settings.apiKeyPreview ?? "—"}</dd>
                </div>
              </dl>
              <p>The saved key is encrypted by the backend and never returned in full.</p>
            </aside>

            <form className="admin-form" onSubmit={save}>
              <div className="admin-form-heading">
                <span className="admin-kicker">OpenAI</span>
                <h2>{settings.configured ? "Update configuration" : "Connect API"}</h2>
                <p>Saving requests generation of the Oracle pipeline.</p>
              </div>

              <label>
                <span>API key</span>
                <input
                  name="apiKey"
                  type="password"
                  autoComplete="new-password"
                  placeholder="sk-…"
                  minLength={16}
                  required
                />
              </label>
              <label>
                <span>Model</span>
                <div className="admin-select">
                  <select
                    name="model"
                    value={selectedModel}
                    onChange={(event) => {
                      if (isOpenAIModel(event.target.value)) {
                        setModel(event.target.value);
                      }
                    }}
                    required
                  >
                    {openAIModels.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              {error && <p className="admin-message is-error">{error}</p>}
              {message && <p className="admin-message is-success">{message}</p>}

              <button
                className="admin-primary"
                type="submit"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? "Saving…" : "Save configuration"}
              </button>
            </form>
          </div>
        ) : (
          <form className="admin-form admin-login" onSubmit={login}>
            <div className="admin-form-heading">
              <span className="admin-kicker">Restricted area</span>
              <h2>Administrator sign in</h2>
              <p>Use the credentials configured on the Legendary North API.</p>
            </div>

            <label>
              <span>Username</span>
              <input name="username" autoComplete="username" required autoFocus />
            </label>
            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>

            {error && <p className="admin-message is-error">{error}</p>}
            {!error &&
              settingsQuery.error &&
              (!(settingsQuery.error instanceof AdminRequestError) ||
                settingsQuery.error.status !== 401) && (
                <p className="admin-message is-error">
                  {settingsQuery.error instanceof Error
                    ? settingsQuery.error.message
                    : "Settings request failed"}
                </p>
              )}
            {notice && <p className="admin-message is-success">{notice}</p>}

            <button
              className="admin-primary"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
      )}
    </>
  );
}
