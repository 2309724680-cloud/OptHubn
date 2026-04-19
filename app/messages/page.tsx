"use client";

import { useState } from "react";
import { conversations, type Conversation } from "@/lib/mock-data";

export default function MessagesPage() {
  const [query, setQuery] = useState("");

  const filtered = conversations.filter((c) =>
    query === "" || c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="pt-4">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
            Messages
          </h2>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-primary font-label">
            3 New
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 font-body text-on-surface placeholder:text-outline/60 outline-none focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all"
            placeholder="Search conversations..."
            type="text"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          if (item.type === "system") {
            return <SystemCard key={item.id} item={item} />;
          }
          return <ContactCard key={item.id} item={item} />;
        })}
      </div>

      {/* Archive Button */}
      <div className="flex justify-center pb-4">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/15 text-on-surface-variant text-sm font-semibold hover:bg-surface transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-lg">archive</span>
          View Archived
        </button>
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 z-40 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl shadow-lg flex items-center justify-center active:scale-90 transition-transform duration-200">
        <span className="material-symbols-outlined">edit</span>
      </button>
    </>
  );
}

function ContactCard({ item }: { item: Extract<Conversation, { type: "contact" }> }) {
  return (
    <div
      className={`p-5 rounded-xl cursor-pointer transition-all hover:bg-surface-container ${
        item.isUnread
          ? "bg-surface-container-lowest shadow-[0_8px_24px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10"
          : "bg-surface-container-low"
      }`}
    >
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          {item.avatarUrl ? (
            <img
              src={item.avatarUrl}
              alt={item.name}
              className={`w-14 h-14 rounded-xl object-cover ${item.isGrayscale ? "grayscale opacity-80" : ""}`}
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container font-black text-xl">
              {item.initials}
            </div>
          )}
          {item.isUnread && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold text-on-surface truncate">{item.name}</h3>
            <span className={`text-[11px] font-medium ${item.isUnread ? "text-primary" : "text-outline"}`}>
              {item.time}
            </span>
          </div>
          <p className={`text-sm line-clamp-1 ${item.isUnread ? "font-semibold text-on-surface-variant" : "text-on-surface-variant"}`}>
            {item.lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

function SystemCard({ item }: { item: Extract<Conversation, { type: "system" }> }) {
  return (
    <div className="bg-surface p-5 rounded-xl border border-dashed border-outline-variant/30 flex gap-4 items-start">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-[0.6875rem] font-bold uppercase tracking-widest text-primary font-label">
            {item.name}
          </h3>
          <span className="text-[11px] font-medium text-outline">{item.time}</span>
        </div>
        <p className="text-sm text-on-surface-variant">{item.lastMessage}</p>
      </div>
    </div>
  );
}
