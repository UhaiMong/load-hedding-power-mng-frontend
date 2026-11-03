"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Textarea } from "@/components/ui/input";
import { email } from "@/lib/constants";

// No contact endpoint on the backend: opens the user's mail app instead
export function ContactForm() {
  const [form, setForm] = useState({ name: "", subject: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg p-5 ring-1 ring-foreground/10">
      <FormField label="Your name">
        <Input required value={form.name} onChange={set("name")} />
      </FormField>
      <FormField label="Subject">
        <Input required value={form.subject} onChange={set("subject")} />
      </FormField>
      <FormField label="Message">
        <Textarea required rows={5} value={form.message} onChange={set("message")} />
      </FormField>
      <Button type="submit" size="lg">Send message</Button>
    </form>
  );
}
