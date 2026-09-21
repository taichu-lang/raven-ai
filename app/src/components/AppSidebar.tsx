"use client";

import { Sidebar } from "hero-next/layout";

export function AppSidebar() {
  return (
    <Sidebar>
      <Sidebar.Header>Raven AI</Sidebar.Header>
      <Sidebar.Body>
        <Sidebar.Item href="/">Home</Sidebar.Item>
        <Sidebar.Item href="/showcase">Showcase</Sidebar.Item>
      </Sidebar.Body>
    </Sidebar>
  );
}
