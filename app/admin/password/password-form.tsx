"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AdminRequestError, adminRequest } from "../admin-api";

export function PasswordForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const mutation = useMutation({
    mutationFn: (passwords: {
      currentPassword: string;
      newPassword: string;
      confirmation: string;
    }) =>
      adminRequest("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      }),
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const currentPassword = String(form.get("currentPassword") ?? "");
    const newPassword = String(form.get("newPassword") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    setError("");

    if (newPassword.length < 12) {
      setError("New password must contain at least 12 characters.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from the current password.");
      return;
    }
    if (newPassword !== confirmation) {
      setError("Password confirmation does not match.");
      return;
    }

    try {
      await mutation.mutateAsync({
        currentPassword,
        newPassword,
        confirmation,
      });
      formElement.reset();
      queryClient.clear();
      router.replace("/admin?passwordChanged=1");
      router.refresh();
    } catch (reason) {
      if (reason instanceof AdminRequestError && reason.status === 401) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      setError(reason instanceof Error ? reason.message : "Password change failed");
    }
  };

  return (
    <form className="admin-form admin-password" onSubmit={submit}>
      <div className="admin-form-heading">
        <span className="admin-kicker">Security</span>
        <h2>Change password</h2>
        <p>All active admin sessions will be signed out after this change.</p>
      </div>

      <label>
        <span>Current password</span>
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          maxLength={1024}
          required
          autoFocus
        />
      </label>
      <label>
        <span>New password</span>
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={1024}
          aria-describedby="password-requirements"
          required
        />
      </label>
      <label>
        <span>Confirm new password</span>
        <input
          name="confirmation"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={1024}
          required
        />
      </label>

      <p className="admin-password-requirements" id="password-requirements">
        Use at least 12 characters. The new password must differ from the current
        password.
      </p>
      {error && <p className="admin-message is-error">{error}</p>}

      <button className="admin-primary" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Changing password…" : "Change password"}
      </button>
    </form>
  );
}
